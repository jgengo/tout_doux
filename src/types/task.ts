export interface Task {
  _id: number
  text: string
  isEditing: boolean
  position: number
  isCompleted?: boolean
  createdAt?: Date
}

export type TaskUpdateFields = Pick<Task, "text" | "isCompleted">;


export type TaskCreateHandler = React.Dispatch<React.SetStateAction<Task>>;
export type TaskUpdateHandler = (taskId: number, updates: Partial<TaskUpdateFields>) => Promise<void>;
export type TaskDeleteHandler = React.Dispatch<React.SetStateAction<number>>;