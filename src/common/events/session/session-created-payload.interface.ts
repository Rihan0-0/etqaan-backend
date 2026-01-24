import { SessionStatus } from "src/modules/session/enums/session-status.enum";

export interface SessionCreatedPayload {
  batchId: string;
  studentId: string;
  status: SessionStatus;
  scores: {
    memorization: number;
    revision: number;
  };
}