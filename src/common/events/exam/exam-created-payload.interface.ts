export interface ExamCreatedPayload {
  batchId: string;
  studentId: string;
  scores: {
    exams: number;
  };
}