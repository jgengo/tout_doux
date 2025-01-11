import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import AddItem from "./add-item";
import { useState } from "react";

// Types
interface Task {
  _id: number;
  text: string;
  isEditing: boolean;
  position: number;
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type TaskUpdateHandler = (
  taskId: number,
  updates: Partial<Task>
) => Promise<void>;
type TaskDeleteHandler = (taskId: number) => Promise<void>;
type TaskCreateHandler = (task: Task) => void;

interface DayViewProps {
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

// Task Item Component
const TaskItem = ({
  task,
  isEditing,
  onEdit,
  onBlur,
  onKeyDown,
  onDelete,
}: {
  task: Task;
  isEditing: boolean;
  onEdit: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, value: string) => void;
  onDelete: () => void;
}) => (
  <div
    className="group relative flex items-center rounded-md border-b py-1"
    role="listitem"
  >
    <div className="absolute -left-5 flex opacity-0 transition-opacity group-hover:opacity-100">
      <Checkbox
        id={`task-${task._id}`}
        aria-label={`Mark "${task.text}" as complete`}
      />
    </div>
    {isEditing ? (
      <input
        type="text"
        defaultValue={task.text}
        className="w-full bg-transparent text-[0.88rem] focus:outline-none"
        onBlur={onBlur}
        onKeyDown={(e) => onKeyDown(e, e.currentTarget.value)}
        aria-label="Edit task"
        autoFocus
      />
    ) : (
      <div
        className="w-full cursor-pointer text-[0.88rem]"
        onClick={onEdit}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onEdit();
          }
        }}
        aria-label={`Edit task: ${task.text}`}
      >
        <span className="block truncate group-hover:whitespace-normal group-hover:break-words">
          {task.text}
        </span>
      </div>
    )}
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-0 h-5 w-5 bg-accent transition-colors duration-300 hover:bg-destructive hover:text-white md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
      onClick={onDelete}
      aria-label={`Delete task: ${task.text}`}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

// Main Component
export const DayView = ({
  dayNumber,
  dayName,
  date,
  isToday,
  index,
  tasks,
  onTaskDelete,
  onTaskUpdate,
  onTaskCreate,
  isMobile = false,
}: DayViewProps) => {
  const [editingTasks, setEditingTasks] = useState<Set<number>>(new Set());

  const handleTaskEdit = (taskId: number) => {
    setEditingTasks(new Set([taskId]));
  };

  const handleTaskBlur = (taskId: number) => {
    setEditingTasks((prev) => {
      const next = new Set(prev);
      next.delete(taskId);
      return next;
    });
  };

  const handleTaskKeyDown = (
    e: React.KeyboardEvent,
    taskId: number,
    newText: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onTaskUpdate(taskId, { text: newText });
      handleTaskBlur(taskId);
    }
    if (e.key === "Escape") {
      handleTaskBlur(taskId);
    }
  };

  const content = (
    <div className="flex flex-col">
      <div className="text-xs font-bold tracking-tight text-gray-500/80">
        {dayNumber}
      </div>
      <div
        className={`text-xl font-bold ${isToday ? "text-primary" : ""}`}
        aria-label={isToday ? "Today" : undefined}
      >
        {dayName}
      </div>
      <div className="mt-4 space-y-1" role="list">
        {[...tasks]
          .sort((a, b) => a.position - b.position)
          .map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              isEditing={editingTasks.has(task._id)}
              onEdit={() => handleTaskEdit(task._id)}
              onBlur={() => handleTaskBlur(task._id)}
              onKeyDown={(e, value) => handleTaskKeyDown(e, task._id, value)}
              onDelete={() => onTaskDelete(task._id)}
            />
          ))}
        {Array.from({ length: Math.max(0, 10 - tasks.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="rounded-md border-b">
            <AddItem type="task" date={date} onSuccess={onTaskCreate} />
          </div>
        ))}
      </div>
    </div>
  );

  if (isMobile) return content;

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {content}
    </motion.div>
  );
};
