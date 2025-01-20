import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Brand = () => {
  return (
    <div>
      <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <h1 className="w-full font-[family-name:var(--font-ibm-plex-sans)] text-lg font-bold uppercase tracking-tighter text-primary">
                  ToutDoux
                </h1>
              </TooltipTrigger>
              <TooltipContent className="translate-x-10 bg-primary/80 text-xs">
                <div>/tu du/ adjective — (French) very soft.</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
    );
};

export { Brand };