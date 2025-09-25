import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BatchScore } from "../schemas/batch-score.schema";
import { Model } from "mongoose";
import { SessionCreatedPayload } from "src/common/events/session/session-created-payload.interface";
import { OnEvent } from "@nestjs/event-emitter";
import { scoreEvents } from "src/common/events/event-constants";
import { BatchService } from "./batch.service";
import { SessionStatus } from "src/modules/session/enums/session-status.enum";

@Injectable()
export class BatchScoresService {
    private readonly logger = new Logger(BatchScoresService.name);
    constructor(
        private readonly batchService: BatchService,
        @InjectModel(BatchScore.name) private batchScoreModel: Model<BatchScore>
    ) { }

    @OnEvent(scoreEvents.session.sessionCreated)
    async handleSessionCreated(event: SessionCreatedPayload) {
        await this.updateScore(event.batchId, event.studentId, event.scores, event.status);
    }

    async updateScore(batchId: string, studentId: string, scores: Record<string, number>, status: SessionStatus): Promise<void> {
        if (!scores || Object.keys(scores).length === 0) {
            this.logger.warn(`No scores provided for student ${studentId} in batch ${batchId}`);
            return;
        }

        const batch = await this.batchService.getBatchById(batchId);
        if (!batch) {
            this.logger.warn(`Batch with id ${batchId} not found`);
            return;
        }

        const scoreDoc = await this.batchScoreModel.findOne({ batchId, studentId });
        const { score, breakdown } = this.calculateNewScoreDetails(scores, batch.rankingWeights, status);

        if (!scoreDoc) {
            await this.batchScoreModel.create({
                batchId,
                studentId,
                score,
                breakdown, 
            });
            return;
        }

        const mergedBreakdown = { ...scoreDoc.breakdown };
        // TODO: Improve Averaging logic
        for (const [key, newValue] of Object.entries(breakdown)) {
            const existingValue = mergedBreakdown[key];
            if (existingValue !== undefined) {
                mergedBreakdown[key] = (existingValue + newValue) / 2;
            } else {
                mergedBreakdown[key] = newValue;
            }
        }

        const newScore = (scoreDoc.score + score) / 2;

        await this.batchScoreModel.updateOne(
            { batchId, studentId },
            { $set: { breakdown: mergedBreakdown, score: newScore, updatedAt: new Date() } }
        );
    }

    private calculateNewScoreDetails(
        incomingScore: Record<string, number>, 
        weights: Record<string, number>, 
        status: SessionStatus
    ): { score: number; breakdown: Record<string, number> } {
        let totalScore = 0;
        let totalWeight = 0;
        const breakdown: Record<string, number> = {};

        const scores = { ...incomingScore };
        scores['attendance'] = this.handleAttendanceScore(status);

        for (const [key, value] of Object.entries(scores)) {
            if (typeof value !== 'number' || isNaN(value) || value < 0) {
                this.logger.warn(`Invalid score value for ${key}: ${value}. Skipping.`);
                continue;
            }

            const weight = weights[key] || 0;
            if (weight > 0) {
                totalScore += value * weight;
                totalWeight += weight;
                breakdown[key] = value * weight;
            } else {
                this.logger.debug(`No weight found for metric: ${key}`);
            }
        }

        return {
            score: totalWeight > 0 ? totalScore / totalWeight : 0,
            breakdown
        };
    }

    private handleAttendanceScore(status: SessionStatus): number {
        switch (status) {
            case SessionStatus.PRESENT:
                return 100;
            case SessionStatus.LATE:
                return 50;
            case SessionStatus.ABSENT:
                return 0;
            default:
                this.logger.warn(`Unknown session status: ${status}`);
                return 0;
        }
    }

}
