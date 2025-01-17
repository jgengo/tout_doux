import { addDays } from "date-fns";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type NavigationControlsProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
};

type NavigationButton = {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
};

const NavigationControls = ({
  currentDate,
  onDateChange,
}: NavigationControlsProps) => {
  const handleDateChange = (daysToAdd: number) => () => {
    onDateChange(addDays(currentDate, daysToAdd));
  };

  const navigationButtons: NavigationButton[] = [
    {
      label: "Previous week",
      icon: <ChevronsLeft className="h-4 w-4" strokeWidth={3} />,
      onClick: handleDateChange(-7),
    },
    {
      label: "Previous day",
      icon: <ChevronLeft className="h-4 w-4" strokeWidth={3} />,
      onClick: handleDateChange(-1),
    },
    {
      label: "Next day",
      icon: <ChevronRight className="h-4 w-4" strokeWidth={3} />,
      onClick: handleDateChange(1),
    },
    {
      label: "Next week",
      icon: <ChevronsRight className="h-4 w-4" strokeWidth={3} />,
      onClick: handleDateChange(7),
    },
    {
      label: "Go to today",
      icon: <Calendar className="h-4 w-4" strokeWidth={3} />,
      onClick: () => onDateChange(new Date()),
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {navigationButtons.map(({ label, icon, onClick }) => (
        <Button
          key={label}
          onClick={onClick}
          aria-label={label}
          size="icon"
          variant="ghost"
          className="text-neutral-500 hover:bg-transparent hover:text-foreground"
        >
          {icon}
        </Button>
      ))}
    </div>
  );
};

export { NavigationControls };
