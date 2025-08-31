export interface Level {
  id: number;
  name: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLevelRequest {
  name: number;
}

export interface LevelResponse {
  data: Level[];
  status: number;
}

// For direct array responses
export type LevelArrayResponse = Level[];