import { useSyncExternalStore } from "react";
import {
  Sun,
  Moon,
  Laptop,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";

import { useAccentTheme } from "@/context/ThemeContext";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const accentColors = [
  {
    name: "Violet",
    value: "violet",
    className: "bg-violet-500",
  },
  {
    name: "Blue",
    value: "blue",
    className: "bg-blue-500",
  },
  {
    name: "Emerald",
    value: "emerald",
    className: "bg-emerald-500",
  },
  {
    name: "Rose",
    value: "rose",
    className: "bg-rose-500",
  },
  {
    name: "Orange",
    value: "orange",
    className: "bg-orange-500",
  },
];

function AppearanceMenu() {
  const { theme, setTheme } = useTheme();
  const { accent, setAccent } = useAccentTheme();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const currentTheme =
    mounted ? theme : "system";

  const ThemeIcon =
    currentTheme === "dark"
      ? Moon
      : currentTheme === "light"
        ? Sun
        : Laptop;

  return (
    <DropdownMenu>
      {/* IMPORTANT:
          No asChild here.
          Base UI owns the trigger button.
      */}
      <DropdownMenuTrigger
        type="button"
        aria-label="Appearance settings"
        className="
          inline-flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-transparent
          bg-transparent
          text-sm
          transition-colors
          outline-none
          hover:bg-muted
          hover:text-foreground
          focus-visible:border-ring
          focus-visible:ring-3
          focus-visible:ring-ring/50
        "
      >
        <ThemeIcon className="h-5 w-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72"
      >
        {/* Theme */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Appearance
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Theme
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => setTheme("light")}
          >
            <Sun className="mr-2 h-4 w-4" />

            <span>Light</span>

            {currentTheme === "light" && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setTheme("dark")}
          >
            <Moon className="mr-2 h-4 w-4" />

            <span>Dark</span>

            {currentTheme === "dark" && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setTheme("system")}
          >
            <Laptop className="mr-2 h-4 w-4" />

            <span>System</span>

            {currentTheme === "system" && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Accent */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Accent Color
          </DropdownMenuLabel>

          <div className="grid grid-cols-5 gap-3 p-2">
            {accentColors.map((item) => (
              <button
                key={item.value}
                type="button"
                title={item.name}
                aria-label={`Use ${item.name} accent`}
                onClick={() =>
                  setAccent(item.value)
                }
                className={`
                  h-8
                  w-8
                  rounded-full
                  ${item.className}
                  transition-transform
                  hover:scale-110
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  ${
                    accent === item.value
                      ? "ring-2 ring-ring ring-offset-2"
                      : ""
                  }
                `}
              />
            ))}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AppearanceMenu;