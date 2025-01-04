import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sun } from "lucide-react";

export default function Demo() {
  const variants = [
    "default",
    "outline",
    "secondary",
    "destructive",
    "ghost",
    "link",
  ] as const;
  const sizes = ["sm", "default", "lg", "icon"] as const;

  return (
    <div className="px-4 py-4">
      <h2 className="mb-5 text-2xl font-bold">Buttons</h2>
      <div className="space-y-2">
        {sizes.map((size) => (
          <div key={size} className="flex items-center gap-5">
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-sm">
              {size}
            </p>
            {variants.map((variant) => (
              <Button
                key={`${variant}-${size}`}
                variant={variant}
                size={size === "default" ? undefined : size}
              >
                {size === "icon" ? <Sun /> : "Click me"}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <h2 className="mb-5 mt-10 text-2xl font-bold">Checkboxes</h2>
      <div className="items-top flex space-x-2">
        <Checkbox id="terms1" />
      </div>
    </div>
  );
}
