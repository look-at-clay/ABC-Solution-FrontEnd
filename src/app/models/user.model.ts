import { Level } from "./level.model";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    level: Level;
  }