"use client";

import { Button } from "@/components/ui/button";

import SignOut from "@/components/sign-out";

interface StatusBarProps {
  viewDays: number;
  onViewChange: React.Dispatch<React.SetStateAction<number>>;
}

const StatusBar = ({ viewDays, onViewChange }: StatusBarProps) => {
  const viewOptions = [1, 3, 5, 7];

  return (
    <div className="sticky bottom-0 flex h-10 items-center justify-between border-t border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-2">
        {viewOptions.map((option) => (
          <Button
            key={option}
            variant={viewDays === option ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8"
            aria-label={`View ${option} days`}
            onClick={() => onViewChange(option)}
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
