import { NavigationControls } from "./navigation-controls";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavbarProps {
  currentDate: Date;
  onDateChange: React.Dispatch<React.SetStateAction<Date>>;
}

const Navbar = ({ currentDate, onDateChange }: NavbarProps): JSX.Element => {
  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-t-2 border-primary bg-white px-5"
      aria-label="Main navigation"
    >
      <nav className="grid min-h-10 grid-cols-[1fr_auto] items-center gap-2">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <h1 className="w-full font-[family-name:var(--font-ibm-plex-sans)] text-lg font-bold uppercase tracking-tighter text-primary">
                  ToutDoux
                </h1>
              </TooltipTrigger>
              <TooltipContent className="translate-x-10 bg-primary/80 text-xs">
                <p>/tu du/ adjective — (French) very soft.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <NavigationControls
          currentDate={currentDate}
          onDateChange={onDateChange}
        />
      </nav>
    </header>
  );
};

export { Navbar };
