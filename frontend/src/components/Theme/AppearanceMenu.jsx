import { Sun, Moon, Laptop } from "lucide-react";
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
    color: "bg-violet-500",
  },
  {
    name: "Blue",
    value: "blue",
    color: "bg-blue-500",
  },
  {
    name: "Emerald",
    value: "emerald",
    color: "bg-emerald-500",
  },
  {
    name: "Rose",
    value: "rose",
    color: "bg-rose-500",
  },
  {
    name: "Orange",
    value: "orange",
    color: "bg-orange-500",
  },
];

export default function AppearanceMenu() {
  const { resolvedTheme, setTheme } = useTheme();
  const { accent, setAccent } = useAccentTheme();

  function renderThemeIcon() {
    switch (resolvedTheme) {
      case "dark":
        return <Moon className="h-5 w-5" />;

      default:
        return <Sun className="h-5 w-5" />;
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change appearance"
        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted"
      >
        {renderThemeIcon()}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Appearance
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Theme
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => setTheme("light")}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setTheme("dark")}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setTheme("system")}
          >
            <Laptop className="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Accent Color
          </DropdownMenuLabel>

          <div className="grid grid-cols-5 gap-2 p-2">
            {accentColors.map((item) => (
              <button
                key={item.value}
                type="button"
                title={item.name}
                onClick={() => setAccent(item.value)}
                className={`h-8 w-8 rounded-full transition-all ${
                  item.color
                } ${
                  accent === item.value
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
              />
            ))}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
