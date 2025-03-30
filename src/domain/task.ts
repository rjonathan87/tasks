import { v4 as uuidv4 } from "uuid";

export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: Date;
}

export const createTask = (title: string, description?: string): Task => ({
  id: uuidv4(),
  title,
  description,
  created_at: new Date(),
  is_completed: false,
});
