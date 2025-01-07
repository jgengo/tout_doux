import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import AddTask from "@/components/add-task";

type Task = {
  id: number;
  text: string;
  isEditing: boolean;
  position: number;
};

type DayViewProps = {
  dayNumber: string;
  dayName: string;
  date: Date;
  isToday: boolean;
  index: number;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isMobile?: boolean;
};

export const DayView = ({
  dayNumber,
  dayName,
  date,
  isToday,
  index,
  tasks,
  setTasks,
  isMobile = false,
}: DayViewProps) => {
  console.log(tasks);
  const handleTaskClick = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isEditing: true } : task
      )
    );
  };

  const handleTaskBlur = (taskId: number, newText: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, text: newText, isEditing: false } : task
      )
    );
  };

  const handleTaskKeyDown = (
    e: React.KeyboardEvent,
    taskId: number,
    newText: string
  ) => {
    if (e.key === "Enter") {
      handleTaskBlur(taskId, newText);
    }
  };

  const content = (
    <div className="flex flex-col">
      <div className="text-xxs font-bold text-gray-500/80">{dayNumber}</div>
      <div
        className={`text-lg font-bold tracking-tight ${isToday ? "text-primary" : ""}`}
      >
        {dayName}
      </div>
      <div className="mt-4 space-y-1">
        {[...tasks]
          .sort((a, b) => a.position - b.position)
          .map((task) => (
            <div
              key={task.id}
              className="group relative flex items-center rounded-md border-b py-1"
            >
              <div className="absolute -left-5 flex opacity-0 transition-opacity group-hover:opacity-100">
                <Checkbox
                  id={`task-${index}-${task.id}`}
                  aria-label="Complete task"
                />
              </div>
              {task.isEditing ? (
                <input
                  type="text"
                  defaultValue={task.text}
                  className="w-full bg-transparent p-1 text-[0.88rem] focus:outline-none"
                  onBlur={(e) => handleTaskBlur(task.id, e.target.value)}
                  onKeyDown={(e) =>
                    handleTaskKeyDown(e, task.id, e.currentTarget.value)
                  }
                  autoFocus
                />
              ) : (
                <div
                  className="w-full cursor-pointer text-[0.88rem]"
                  onClick={() => handleTaskClick(task.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleTaskClick(task.id);
                    }
                  }}
                >
                  <span className="block truncate group-hover:whitespace-normal group-hover:break-words">
                    {task.text}
                  </span>
                </div>
              )}
            </div>
          ))}
        <div className="rounded-md border-b py-1">
          <AddTask date={date} />
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
