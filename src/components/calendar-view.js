import { useState, useEffect, useCallback } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";

import { DayView } from "@/components/day-view";
import { useToast } from "@/hooks/use-toast";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export const CalendarView = ({ startDate, onDateChange, viewDays }) => {
  const [tasks, setTasks] = useState([]);
  const [days, setDays] = useState([]);

  const { toast } = useToast();

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Update local state after successful deletion
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "An error occurred while deleting task",
      });
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      // Update local state after successful update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task
        )
      );
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "An error occurred while updating task",
      });
    }
  };

  const explodeTasks = useCallback(() => {
    const prepDays = Array.from({ length: viewDays }, (_, index) => {
      const date = addDays(startDate, index);
      return {
        date,
        dayName: format(date, "EEEE").toUpperCase(),
        dayNumber: format(date, "MMM d, yyyy").toUpperCase(),
        tasks: tasks.filter((task) => isSameDay(new Date(task.date), date)),
      };
    });

    setDays(prepDays);
  }, [tasks, startDate, viewDays]);

  const fetchTasks = useCallback(async () => {
    const firstDate = startDate;
    const lastDate = addDays(startDate, 4);

    try {
      const since = format(firstDate, "yyyy-MM-dd");
      const until = format(lastDate, "yyyy-MM-dd");

      const response = await fetch(`/api/tasks?since=${since}&until=${until}`);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "An error occurred while fetching tasks",
      });
    }
  }, [startDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    explodeTasks();
  }, [explodeTasks]);

  const isToday = useCallback((date) => {
    return isSameDay(date, new Date());
  }, []);

  const handleTaskCreate = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  if (!days.length) {
    return null;
  }

  return (
    <>
      <section
        className={`group/section mt-24 flex w-full flex-row px-6 ${days.length == 1 && "mx-auto max-w-lg"}`}
      >
        <div className="hidden flex-col gap-1 opacity-0 transition-opacity duration-300 group-hover/section:opacity-100 md:flex">
          <button
            onClick={() => onDateChange(addDays(startDate, -1))}
            className="hover:bg-accentHover flex h-8 w-8 items-center justify-center rounded-md bg-accent"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDateChange(addDays(startDate, -5))}
            className="hover:bg-accentHover flex h-8 w-8 items-center justify-center rounded-md bg-accent"
            aria-label="Previous week"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="w-full">
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={days[0].dayNumber}
                className="rounded-lg bg-background px-3"
                initial="enter"
                animate="center"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <DayView
                  dayNumber={days[0].dayNumber}
                  dayName={days[0].dayName}
                  date={days[0].date}
                  isToday={isToday(days[0].date)}
                  index={0}
                  isMobile={true}
                  tasks={days[0].tasks}
                  onTaskDelete={handleTaskDelete}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskCreate={handleTaskCreate}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div
              className={`grid gap-x-16 rounded-lg bg-background px-3 grid-cols-${viewDays} ${
                days.length == 1 && "mx-auto max-w-md"
              } }`}
            >
              {days.map((day, index) => (
                <DayView
                  key={day.dayNumber}
                  date={day.date}
                  dayNumber={day.dayNumber}
                  dayName={day.dayName}
                  isToday={isToday(day.date)}
                  index={index}
                  tasks={day.tasks}
                  onTaskDelete={handleTaskDelete}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskCreate={handleTaskCreate}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden flex-col gap-1 opacity-0 transition-opacity duration-300 group-hover/section:opacity-100 md:flex">
          <button
            onClick={() => onDateChange(addDays(startDate, 1))}
            className="hover:bg-accentHover flex h-8 w-8 items-center justify-center rounded-md bg-accent"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDateChange(addDays(startDate, 5))}
            className="hover:bg-accentHover flex h-8 w-8 items-center justify-center rounded-md bg-accent"
            aria-label="Next week"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  );
};
