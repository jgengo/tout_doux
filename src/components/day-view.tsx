import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import AddItem from "./add-item";
import { useState } from "react";

type Task = {
  _id: number;
  text: string;
  isEditing: boolean;
  position: number;
};

interface DayViewProps {
  dayNumber: string;
  dayName: string;
  date: Date;
  isToday: boolean;
  index: number;
  tasks: Task[];
  onTaskDelete: (taskId: number) => Promise<void>;
  onTaskUpdate: (taskId: number, updates: Partial<Task>) => Promise<void>;
  isMobile?: boolean;
  onTaskCreate?: (task: Task) => void;
}

export const DayView = ({
  dayNumber,
  dayName,
  date,
  isToday,
  index,
  tasks,
  onTaskDelete,
  onTaskUpdate,
  isMobile = false,
  onTaskCreate,
}: DayViewProps) => {
  const [editingTasks, setEditingTasks] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleTaskClick = (taskId: number) => {
    setEditingTasks((prev) => ({ ...prev, [taskId]: true }));
  };

  const handleTaskBlur = (taskId: number) => {
    setEditingTasks((prev) => ({ ...prev, [taskId]: false }));
  };

  const handleTaskKeyDown = (
    e: React.KeyboardEvent,
    taskId: number,
    newText: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onTaskUpdate(taskId, { text: newText });
      setEditingTasks((prev) => ({ ...prev, [taskId]: false }));
    }
    if (e.key === "Escape") {
      setEditingTasks((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const handleTaskCreate = (newTask: Task) => {
    onTaskCreate?.(newTask);
  };

  const content = (
    <div className="flex flex-col">
      <div className="text-xs font-bold tracking-tight text-gray-500/80">
        {dayNumber}
      </div>
      <div className={`text-xl font-bold ${isToday ? "text-primary" : ""}`}>
        {dayName}
      </div>
      <div className="mt-4 space-y-1">
        {[...tasks]
          .sort((a, b) => a.position - b.position)
          .map((task) => (
            <div
              key={task._id}
              className="group relative flex items-center rounded-md border-b py-1"
            >
              <div className="absolute -left-5 flex opacity-0 transition-opacity group-hover:opacity-100">
                <Checkbox id={`task-${task._id}`} aria-label="Complete task" />
              </div>
              {editingTasks[task._id] ? (
                <input
                  type="text"
                  defaultValue={task.text}
                  className="w-full bg-transparent text-[0.88rem] focus:outline-none"
                  onBlur={() => handleTaskBlur(task._id)}
                  onKeyDown={(e) =>
                    handleTaskKeyDown(e, task._id, e.currentTarget.value)
                  }
                  autoFocus
                />
              ) : (
                <div
                  className="w-full cursor-pointer text-[0.88rem]"
                  onClick={() => handleTaskClick(task._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleTaskClick(task._id);
                    }
                  }}
                >
                  <span className="block truncate group-hover:whitespace-normal group-hover:break-words">
                    {task.text}
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-5 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onTaskDelete(task._id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        <div className="rounded-md border-b">
          <AddItem type="task" date={date} onSuccess={handleTaskCreate} />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return content;
  }

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
