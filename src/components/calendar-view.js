import { format, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { DayView } from "@/components/day-view";

export const CalendarView = ({ startDate }) => {
  const today = new Date();

  // Generate 5 days starting from startDate
  const days = Array.from({ length: 5 }, (_, index) => {
    const date = addDays(startDate, index);
    return {
      date,
      dayName: format(date, "EEEE").toUpperCase(),
      dayNumber: format(date, "MMM d, yyyy").toUpperCase(),
    };
  });

  const isToday = (date) => {
    return format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  };

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

  return (
    <div className="mt-10 space-y-4">
      {/* Mobile View */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={days[0].dayNumber}
            className="bg-white p-6"
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <DayView
              dayNumber={days[0].dayNumber}
              dayName={days[0].dayName}
              isToday={isToday(days[0].date)}
              index={0}
              isMobile={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-x-16 bg-white p-6">
          {days.map((day, index) => (
            <DayView
              key={day.dayNumber}
              dayNumber={day.dayNumber}
              dayName={day.dayName}
              isToday={isToday(day.date)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
