import { format, addDays, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { DayView } from "@/components/day-view";
import { useState, useEffect, useCallback } from "react";

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

export const CalendarView = ({ startDate }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    const firstDate = startDate;
    const lastDate = addDays(startDate, 4);

    try {
      setIsLoading(true);
      setError(null);
      const since = format(firstDate, "yyyy-MM-dd");
      const until = format(lastDate, "yyyy-MM-dd");
      const url = `/api/tasks?since=${since}&until=${until}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      console.log(data);
      setTasks(data);
    } catch (err) {
      setError(err.message || "An error occurred while fetching tasks");
    } finally {
      setIsLoading(false);
    }
  }, [startDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const days = Array.from({ length: 5 }, (_, index) => {
    const date = addDays(startDate, index);
    return {
      date,
      dayName: format(date, "EEEE").toUpperCase(),
      dayNumber: format(date, "MMM d, yyyy").toUpperCase(),
    };
  });

  const isToday = useCallback((date) => {
    return isSameDay(date, new Date());
  }, []);

  if (error) {
    return (
      <div role="alert" className="mt-10 rounded-md bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <section className="mt-10 space-y-4" aria-label="Calendar View">
      {/* Mobile View */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={days[0].dayNumber}
            className="rounded-lg bg-white p-6"
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
              tasks={tasks.filter((task) =>
                isSameDay(new Date(task.date), days[0].date)
              )}
              isLoading={isLoading}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-x-16 rounded-lg bg-white p-6">
          {days.map((day, index) => (
            <DayView
              key={day.dayNumber}
              date={day.date}
              dayNumber={day.dayNumber}
              dayName={day.dayName}
              isToday={isToday(day.date)}
              index={index}
              tasks={tasks.filter((task) =>
                isSameDay(new Date(task.date), day.date)
              )}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
