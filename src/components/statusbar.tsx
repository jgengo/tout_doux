"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SignOut from "@/components/sign-out";

interface StatusBarProps {
  viewDays: number;
  onViewChange: React.Dispatch<React.SetStateAction<number>>;
}

const VIEW_DAYS_STORAGE_KEY = "toutdoux_view_days_preference";

const StatusBar = ({ viewDays, onViewChange }: StatusBarProps) => {
  const viewOptions = [1, 3, 5, 7];

  useEffect(() => {
    const savedViewDays = localStorage.getItem(VIEW_DAYS_STORAGE_KEY);
    if (savedViewDays) {
      onViewChange(Number(savedViewDays));
    }
  }, [onViewChange]);

  const handleViewChange = (option: number) => {
    localStorage.setItem(VIEW_DAYS_STORAGE_KEY, option.toString());
    onViewChange(option);
  };

  return (
    <div className="sticky bottom-0 flex h-10 items-center justify-between border-t border-neutral-200 bg-white px-4">
      <div className="invisible flex items-center gap-2 md:visible">
        {viewOptions.map((option) => (
          <Button
            key={option}
            variant={viewDays === option ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8"
            aria-label={`View ${option} days`}
            onClick={() => handleViewChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <SignOut />
      </div>
    </div>
  );
};

export { StatusBar };
