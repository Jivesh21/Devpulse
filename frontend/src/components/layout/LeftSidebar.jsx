import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  User,
  Users,
  Bookmark,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  {
    icon: Home,
    label: "Feed",
    active: true,
  },
  {
    icon: User,
    label: "Profile",
  },
  {
    icon: Users,
    label: "Network",
  },
  {
    icon: Bookmark,
    label: "Bookmarks",
  },
  {
    icon: Bell,
    label: "Notifications",
  },
  {
    icon: Settings,
    label: "Settings",
  },
];

function LeftSidebar() {
  return (
    <div className="flex h-full flex-col justify-between">
      {/* Navigation */}
      <nav className="space-y-2">
        {NAV_ITEMS.map(
          ({ icon: Icon, label, active }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              className={`flex h-11 w-full items-center justify-center gap-3 rounded-xl transition-all xl:justify-start xl:px-4 ${
                active
                  ? "bg-violet-500/10 text-violet-600 hover:bg-violet-500/15 hover:text-violet-600"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon
                className="h-5 w-5 shrink-0"
                strokeWidth={active ? 2.5 : 2}
              />

              <span className="hidden xl:block">
                {label}
              </span>
            </Button>
          )
        )}
      </nav>

      {/* Profile Completion */}
      <div className="hidden xl:block">
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-violet-500/10 via-background to-cyan-500/10 p-5 shadow-sm">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Complete Profile
              </h3>

              <p className="text-xs text-muted-foreground">
                Stand out to developers.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span>Progress</span>
              <span className="font-semibold">
                70%
              </span>
            </div>

            <Progress value={70} />
          </div>

          <Button className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500">
            Finish Setup
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;