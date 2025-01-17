"use client";

import { addDays } from "date-fns";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavigationControlsProps = {
  currentDate: Date;
  onDateChange: React.Dispatch<React.SetStateAction<Date>>;
};

type NavigationButton = {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  shortcut?: string;
};

const NavigationControls = ({
  currentDate,
  onDateChange,
}: NavigationControlsProps): JSX.Element => {
  const handleDateChange = (daysToAdd: number) => () => {
    onDateChange(addDays(currentDate, daysToAdd));
  };

  const handleToday = () => onDateChange(new Date());

  useHotkeys("left", handleDateChange(-1), [currentDate]);
  useHotkeys("right", handleDateChange(1), [currentDate]);
  useHotkeys("shift+left", handleDateChange(-7), [currentDate]);
  useHotkeys("shift+right", handleDateChange(7), [currentDate]);
  useHotkeys("t", handleToday, []);

  const navigationButtons: NavigationButton[] = [
    {
      label: "Previous week",
      icon: <ChevronsLeft className="h-4 w-4" strokeWidth={3} />,
      onClick: handleDateChange(-7),
      shortcut: "Shift + ←",
    },
    {
      label: "Previous day",
      icon: <ChevronLeft className="h-4 w-4" strokeWidth={3} />,
      onClick: handleDateChange(-1),
      shortcut: "←",
    },
    {
      label: "Next day",
      icon: <ChevronRight className="h-4 w-4" strokeWidth={3} />,
      onClick: handleDateChange(1),
      shortcut: "→",
    },
    {
      label: "Next week",
      icon: <ChevronsRight className="h-4 w-4" strokeWidth={3} />,
      onClick: handleDateChange(7),
      shortcut: "Shift + →",
    },
    {
      label: "Go to today",
      icon: <Calendar className="h-4 w-4" strokeWidth={3} />,
      onClick: handleToday,
      shortcut: "T",
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <TooltipProvider delayDuration={300}>
          {navigationButtons.map(({ label, icon, onClick, shortcut }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button
                  onClick={onClick}
                  aria-label={label}
                  size="icon"
                  variant="ghost"
                  className="relative text-neutral-500 transition-all duration-200 hover:bg-primary/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="flex flex-col gap-1 bg-muted text-xs"
              >
                <span className="text-muted-foreground">{label}</span>
                {shortcut && (
                  <span className="text-muted-foreground">{shortcut}</span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export { NavigationControls };
