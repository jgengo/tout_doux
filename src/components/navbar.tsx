import { NavigationControls } from "./navigation-controls";

type NavbarProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
};

const Navbar = ({ currentDate, onDateChange }: NavbarProps) => {
  return (
    <header
      role="banner"
      className="border-primary sticky top-0 z-50 border-t-2 bg-white px-3.5"
    >
      <div className="grid min-h-10 grid-cols-[auto_1fr_auto] items-center gap-2">
        <div className="min-w-36 text-xs">Search placeholder</div>
        <div className="text-primary w-full text-center font-[family-name:var(--font-ibm-plex-sans)] font-bold uppercase tracking-tighter">
          ToutDoux
        </div>
        <NavigationControls
          currentDate={currentDate}
          onDateChange={onDateChange}
        />
      </div>
    </header>
  );
};

export { Navbar };
