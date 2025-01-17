import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import AddItem from "@/components/add-item";

import { DayViewProps, TaskItemProps } from "@/types/day-view";

// Task Item Component
const TaskItem = ({
  task,
  isEditing,
  onEdit,
  onBlur,
  onKeyDown,
  onDelete,
  onCheckedChange,
}: TaskItemProps) => {
  const [inputValue, setInputValue] = useState(task.text);
  const [isEscapePressed, setIsEscapePressed] = useState(false);

  return (
    <div
      className="group relative flex items-center rounded-md border-b py-1"
      role="listitem"
    >
      <div className="absolute -left-5 flex opacity-0 transition-opacity group-hover:opacity-100">
        <Checkbox
          id={`task-${task._id}`}
          checked={task.isCompleted}
          onCheckedChange={() =>
            onCheckedChange(task._id, { isCompleted: !task.isCompleted })
          }
          aria-label={`Mark "${task.text}" as complete`}
        />
      </div>
      {isEditing ? (
        <input
          type="text"
          defaultValue={task.text}
          className="w-full bg-transparent text-[0.88rem] focus:outline-none"
          onBlur={() => {
            if (!isEscapePressed && inputValue !== task.text) {
              onKeyDown(
                {
                  key: "Enter",
                  preventDefault: () => {},
                } as React.KeyboardEvent,
                inputValue
              );
            }
            onBlur();
            setIsEscapePressed(false);
          }}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsEscapePressed(true);
              onBlur();
            } else if (e.key === "Enter") {
              onKeyDown(e, inputValue);
            }
          }}
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
          <span
            className={`block truncate group-hover:whitespace-normal group-hover:break-words ${
              task.isCompleted ? "text-gray-500 line-through" : ""
            }`}
          >
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
};

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
      if (newText.trim() === "") {
        onTaskDelete(taskId);
        return;
      }
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
          .sort((a, b) => {
            // First sort by completion status
            if (a.isCompleted !== b.isCompleted) {
              return a.isCompleted ? 1 : -1;
            }
            // Then sort by position
            return a.position - b.position;
          })
          .map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              isEditing={editingTasks.has(task._id)}
              onEdit={() => handleTaskEdit(task._id)}
              onBlur={() => handleTaskBlur(task._id)}
              onKeyDown={(e, value) => handleTaskKeyDown(e, task._id, value)}
              onDelete={() => onTaskDelete(task._id)}
              onCheckedChange={onTaskUpdate}
            />
          ))}
        {Array.from({ length: Math.max(0, 10 - tasks.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="rounded-md border-b">
            <AddItem type="task" date={date} onSuccess={onTaskCreate} />
          </div>
        ))}
        <div className="rounded-md border-b">
          <AddItem type="task" date={date} onSuccess={onTaskCreate} />
        </div>
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
