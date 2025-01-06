"use client";

import { ChevronLeft, RefreshCw, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

import SignOut from "@/components/sign-out";

interface StatusBarProps {
  currentPage?: number;
  totalPages?: number;
}

const StatusBar = ({ currentPage = 1, totalPages = 7 }: StatusBarProps) => {
  return (
    <div className="sticky bottom-0 flex h-10 items-center justify-between border-t border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8"
            aria-label={`Page ${i + 1}`}
          >
            {i + 1}
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
