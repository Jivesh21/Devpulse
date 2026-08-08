import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/context/AuthContext";

import {
  Home,
  User,
  Users,
  Bookmark,
  Bell,
  Settings,
  Sparkles,
  ChevronRight,
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
      path: user
        ? `/profile/${user.username}`
        : "/feed",
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

  const completedFields =
    profileFields.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedFields /
      profileFields.length) *
      100
  );

  return (
    <aside
      className="
        glass
        sticky
        top-24
        hidden
        h-[calc(100vh-7rem)]
        w-20
        shrink-0
        flex-col
        overflow-hidden
        rounded-2xl
        p-2
        lg:flex
        xl:w-64
        xl:p-3
      "
    >
      {/* ================================= */}
      {/* Navigation */}
      {/* ================================= */}

      <nav className="space-y-1">
        {NAV_ITEMS.map(
          ({
            icon: Icon,
            label,
            path,
          }) => {
            const isActive =
              location.pathname === path;

            return (
              <Link
                key={path}
                to={path}
                className="block"
              >
                <Button
                  type="button"
                  variant="ghost"
                  className={`
                    group
                    relative
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    transition-all
                    duration-200
                    xl:justify-start
                    xl:px-4

                    ${
                      isActive
                        ? `
                          bg-primary/10
                          text-primary
                          shadow-sm
                          hover:bg-primary/15
                          hover:text-primary
                        `
                        : `
                          text-muted-foreground
                          hover:bg-muted/70
                          hover:text-foreground
                        `
                    }
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <span
                      className="
                        absolute
                        left-0
                        h-6
                        w-1
                        rounded-r-full
                        bg-primary
                        shadow-sm
                        shadow-primary/40
                      "
                    />
                  )}

                  <Icon
                    className={`
                      h-5
                      w-5
                      shrink-0
                      transition-transform
                      duration-200
                      group-hover:scale-105

                      ${
                        isActive
                          ? "text-primary"
                          : ""
                      }
                    `}
                    strokeWidth={
                      isActive ? 2.5 : 2
                    }
                  />

                  <span className="hidden flex-1 text-left xl:block">
                    {label}
                  </span>

                  {/* Desktop Arrow */}
                  <ChevronRight
                    className={`
                      hidden
                      h-4
                      w-4
                      opacity-0
                      transition-all
                      duration-200
                      group-hover:translate-x-0.5
                      group-hover:opacity-60
                      xl:block

                      ${
                        isActive
                          ? "text-primary opacity-70"
                          : ""
                      }
                    `}
                  />
                </Button>
              </Link>
            );
          }
        )}
      </nav>

      {/* ================================= */}
      {/* Divider */}
      {/* ================================= */}

      <div className="my-4 h-px bg-border/60" />

      {/* ================================= */}
      {/* Profile Completion */}
      {/* ================================= */}

      <div className="hidden xl:block">
        <div
          className="
            glass-card
            relative
            overflow-hidden
            rounded-2xl
            p-4
          "
        >
          {/* Ambient Glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-8
              -top-8
              h-28
              w-28
              rounded-full
              bg-primary/15
              blur-3xl
            "
          />

          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary
                  shadow-lg
                  shadow-primary/20
                "
              >
                <Sparkles
                  className="h-4 w-4 text-primary-foreground"
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold">
                  Complete Profile
                </h3>

                <p className="truncate text-xs text-muted-foreground">
                  Stand out to developers.
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Profile strength
                </span>

                <span className="font-semibold text-primary">
                  {profileCompletion}%
                </span>
              </div>

              <Progress
                value={profileCompletion}
                className="h-1.5"
              />
            </div>

            {/* CTA */}
            <Button
              onClick={() =>
                navigate(
                  `/profile/${user?.username}`
                )
              }
              disabled={!user?.username}
              className="
                interactive
                mt-5
                h-10
                w-full
                rounded-xl
                bg-primary
                text-primary-foreground
                shadow-md
                shadow-primary/15
                hover:bg-primary/90
              "
            >
              Finish Setup

              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* Mobile / Collapsed Profile Hint */}
      {/* ================================= */}

      <div className="mt-auto hidden justify-center xl:hidden">
        <div
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-primary/10
          "
          title={`Profile ${profileCompletion}% complete`}
        >
          <Progress
            value={profileCompletion}
            className="
              absolute
              h-1
              w-6
              rotate-[-90deg]
            "
          />

          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;