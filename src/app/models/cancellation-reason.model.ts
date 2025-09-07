export interface CancellationReason {
  id: number;
  reason: string;
}

export interface CreateCancellationReasonRequest {
  reason: string;
}

export interface UpdateCancellationReasonRequest {
  reason: string;
}