import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Users,
  Bookmark,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";

function LeftSidebar() {
  const { user } = useAuthContext();
  const location = useLocation();
const navigate = useNavigate();
  const NAV_ITEMS = [
    {
      icon: Home,
      label: "Feed",
      path: "/feed",
    },
    {
      icon: User,
      label: "Profile",
      path: user ? `/profile/${user.username}` : "/feed",
    },
    {
      icon: Users,
      label: "Network",
      path: "/network",
    },
    {
      icon: Bookmark,
      label: "Bookmarks",
      path: "/bookmarks",
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];
const profileFields = [
  user?.avatar,
  user?.coverImage,
  user?.bio,
  user?.github,
  user?.linkedin,
  user?.website,
  user?.skills?.length > 0,
];

const completedFields = profileFields.filter(Boolean).length;

const profileCompletion = Math.round(
  (completedFields / profileFields.length) * 100
);
  return (
    <div className="flex h-full flex-col justify-between">
      {/* Navigation */}
      <nav className="space-y-2">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={label} to={path} className="block w-full">
              <Button
                type="button"
                variant="ghost"
                className={`flex h-11 w-full items-center justify-center gap-3 rounded-xl transition-all xl:justify-start xl:px-4 ${
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={isActive ? 2.5 : 2}
                />

                <span className="hidden xl:block">{label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Profile Completion */}
      <div className="hidden xl:block">
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-5 shadow-sm">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
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
             {profileCompletion}%
              </span>
            </div>

           <Progress value={profileCompletion} />
          </div>

        <Button
  className="mt-5 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
  onClick={() =>
    navigate(`/profile/${user.username}`)
  }
>
  Finish Setup
</Button>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
