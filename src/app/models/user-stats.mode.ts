export interface UserLevelStats {
  totalUsers: number;
  levelCounts: LevelCount[];
}

export interface LevelCount {
  levelId: number;
  levelName: string;
  userCount: number;
}
