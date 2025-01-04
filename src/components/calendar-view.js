import { format, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export const CalendarView = ({ startDate, onDateChange }) => {
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
    <div className="space-y-4">
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
            <div className="flex flex-col">
              <div className="text-xxs font-bold text-gray-500/80">
                {days[0].dayNumber}
              </div>
              <div
                className={`text-lg font-bold tracking-tight ${
                  isToday(days[0].date) && "text-primary"
                }`}
              >
                {days[0].dayName}
              </div>
              <div className="mt-4 space-y-2">
                <div className="rounded-md border-b py-2">
                  <input
                    type="text"
                    placeholder="Click text to edit"
                    className="w-full bg-transparent p-1 text-sm focus:outline-none"
                    aria-label={`Add todo for ${days[0].dayName}`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-x-16 bg-white p-6">
          {days.map((day, index) => (
            <motion.div
              key={day.dayNumber}
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="text-xxs font-bold text-gray-500/80">
                {day.dayNumber}
              </div>
              <div
                className={`text-lg font-bold tracking-tight ${
                  isToday(day.date) && "text-primary"
                }`}
              >
                {day.dayName}
              </div>
              <div className="mt-4 space-y-2">
                <div className="rounded-md border-b py-2">
                  <input
                    type="text"
                    placeholder="Click text to edit"
                    className="w-full bg-transparent p-1 text-sm focus:outline-none"
                    aria-label={`Add todo for ${day.dayName}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
