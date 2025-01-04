import { addDays } from "date-fns";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

type NavigationControlsProps = {
  onDateChange: (date: Date) => void;
  currentDate: Date;
};

const NavigationControls = ({
  onDateChange,
  currentDate,
}: NavigationControlsProps) => {
  const handlePreviousDay = () => onDateChange(addDays(currentDate, -1));
  const handleNextDay = () => onDateChange(addDays(currentDate, 1));
  const handlePreviousWeek = () => onDateChange(addDays(currentDate, -7));
  const handleNextWeek = () => onDateChange(addDays(currentDate, 7));
  const handleToday = () => onDateChange(new Date());

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePreviousWeek}
        className="rounded-md px-1 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
        aria-label="Previous week"
      >
        <ChevronsLeft className="h-4 w-4" strokeWidth={3} />
      </button>
      <button
        onClick={handlePreviousDay}
        className="rounded-md px-1 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={3} />
      </button>
      <button
        onClick={handleNextDay}
        className="rounded-md px-1 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
        aria-label="Next day"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={3} />
      </button>
      <button
        onClick={handleNextWeek}
        className="rounded-md px-1 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
        aria-label="Next week"
      >
        <ChevronsRight className="h-4 w-4" strokeWidth={3} />
      </button>
      <button
        onClick={handleToday}
        className="rounded-md px-1 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
        aria-label="Go to today"
      >
        <Calendar className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
};

export { NavigationControls };
