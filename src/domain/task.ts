import { v4 as uuidv4 } from "uuid";

export interface Task {
  id: string;
  description: string;
  createdAt: Date;
  status: boolean;
}

export const createTask = (description: string): Task => ({
  id: uuidv4(),
  description,
  createdAt: new Date(),
  status: false,
});
