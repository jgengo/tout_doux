import { Task, TaskCreateHandler, TaskDeleteHandler, TaskUpdateHandler } from "@/types/task";

export interface DayViewProps {
  dayNumber: string;
  dayName: string;
  date: Date;
  isToday: boolean;
  index: number;
  tasks: Task[];
  onTaskDelete: TaskDeleteHandler;
  onTaskUpdate: TaskUpdateHandler;
  onTaskCreate?: TaskCreateHandler;
  isMobile?: boolean;
}

export interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  onEdit: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, value: string) => void;
  onDelete: () => void;
  onCheckedChange: TaskUpdateHandler;
} 