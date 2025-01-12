export interface Task {
  _id: number
  text: string
  isEditing: boolean
  position: number
  isCompleted?: boolean
  createdAt?: Date
}

export type TaskCreateHandler = (task: Task) => void
export type TaskUpdateHandler = (taskId: number, updates: Partial<Task>) => Promise<void>
export type TaskDeleteHandler = (taskId: number) => Promise<void> 