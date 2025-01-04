import { format, addDays } from "date-fns";

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-x-16 bg-white p-6">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col">
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
              {/* Placeholder for todo items */}
              <div className="rounded-md border-b py-2">
                <input
                  type="text"
                  placeholder="Click text to edit"
                  className="w-full bg-transparent p-1 text-sm focus:outline-none"
                  aria-label={`Add todo for ${day.dayName}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
