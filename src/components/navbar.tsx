import { Search } from "lucide-react";
import { NavigationControls } from "./navigation-controls";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const Navbar = ({ currentDate, onDateChange }: NavbarProps): JSX.Element => {
  const handleSearchClick = () => {
    // TODO: Implement search functionality
    return;
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSearchClick();
    }
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-t-2 border-primary bg-white px-5"
      aria-label="Main navigation"
    >
      <nav className="grid min-h-10 grid-cols-[auto_1fr_auto] items-center gap-2">
        <Button
          variant="ghost"
          className="flex min-w-10 items-center gap-2 font-bold text-gray-700/80 hover:bg-transparent"
          onClick={handleSearchClick}
          onKeyDown={handleSearchKeyDown}
          aria-label="Open search"
        >
          <Search className="h-4 w-4" strokeWidth={2} />
          <span className="text-xs">Search</span>
        </Button>

        <h1 className="w-full text-center font-[family-name:var(--font-ibm-plex-sans)] font-bold uppercase tracking-tighter text-primary">
          ToutDoux
        </h1>

        <NavigationControls
          currentDate={currentDate}
          onDateChange={onDateChange}
        />
      </nav>
    </header>
  );
};

export { Navbar };
