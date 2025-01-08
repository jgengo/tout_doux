import { NavigationControls } from "./navigation-controls";

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
        <h1 className="w-full font-[family-name:var(--font-ibm-plex-sans)] font-bold uppercase tracking-tighter text-primary">
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
