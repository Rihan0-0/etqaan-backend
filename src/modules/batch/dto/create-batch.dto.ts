import { IsNotEmpty, MaxLength, IsOptional, ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';
import { IsValidRankingWeights } from '../decorators/is-valid-ranking-weights.decorator';

export class CreateBatchDto {
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsOptional()
    @MaxLength(255)
    description?: string;

    @IsNotEmpty()
    @IsValidRankingWeights({ message: 'Ranking weights are invalid' })
    rankingWeights: {
        attendance: number;
        memorization: number;
        revision: number;
        exams: number;
    };

    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    teachersIds: string[];

    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    studentsIds: string[];
}
