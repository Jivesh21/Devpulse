import { Link, useNavigate } from "react-router-dom";
import { useUnreadCount } from "@/hooks/useNotification";

import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search/SearchBar";
import AppearanceMenu from "@/components/Theme/AppearanceMenu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Activity,
  Search,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuthContext } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";

function Navbar() {
  const { user } = useAuthContext();

  const logoutMutation = useLogout();

  const navigate = useNavigate();

  const { data: unreadData } =
    useUnreadCount();

  const unreadCount =
    unreadData?.data?.unreadCount || 0;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    } finally {
      navigate("/login", {
        replace: true,
      });
    }
  };

  return (
    <header
      className="
        glass
        sticky
        top-0
        z-50
        w-full
        rounded-none
        border-x-0
        border-t-0
        px-4
        py-3
        md:px-6
      "
    >
      <div
        className="
          mx-auto
          flex
          h-12
          max-w-7xl
          items-center
          gap-4
        "
      >
        {/* ================================= */}
        {/* Left Section */}
        {/* ================================= */}

        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="
              rounded-xl
              transition-all
              duration-200
              hover:bg-primary/10
              hover:text-primary
              active:scale-95
              lg:hidden
            "
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link
            to="/feed"
            className="
              group
              flex
              items-center
              gap-2.5
              outline-none
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-primary
                shadow-lg
                shadow-primary/25
                transition-all
                duration-300
                group-hover:scale-105
                group-hover:shadow-primary/40
              "
            >
              <Activity
                className="
                  h-5
                  w-5
                  text-primary-foreground
                "
                strokeWidth={2.5}
              />
            </div>

            <span
              className="
                hidden
                text-lg
                font-bold
                tracking-tight
                sm:block
              "
            >
              Dev
              <span className="text-primary">
                Pulse
              </span>
            </span>
          </Link>
        </div>

        {/* ================================= */}
        {/* Center Search */}
        {/* ================================= */}

        <div
          className="
            hidden
            flex-1
            justify-center
            px-6
            md:flex
          "
        >
          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>

        {/* ================================= */}
        {/* Right Section */}
        {/* ================================= */}

        <div
          className="
            ml-auto
            flex
            items-center
            gap-1.5
            sm:gap-2
          "
        >
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="
              rounded-xl
              transition-all
              duration-200
              hover:bg-primary/10
              hover:text-primary
              active:scale-95
              md:hidden
            "
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="
              relative
              rounded-xl
              transition-all
              duration-200
              hover:bg-primary/10
              hover:text-primary
              active:scale-95
            "
            onClick={() =>
              navigate("/notifications")
            }
          >
            <Bell className="h-5 w-5" />

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  right-0.5
                  top-0.5
                  flex
                  h-4
                  min-w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-primary
                  px-1
                  text-[9px]
                  font-bold
                  text-primary-foreground
                  shadow-sm
                  ring-2
                  ring-background
                "
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </Button>

          {/* Theme */}
          <AppearanceMenu />

          {/* ================================= */}
          {/* User Dropdown */}
          {/* ================================= */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="
                  rounded-full
                  p-0.5
                  transition-all
                  duration-200
                  hover:bg-primary/10
                  active:scale-95
                "
              >
                <Avatar
                  className="
                    h-9
                    w-9
                    border
                    border-primary/20
                    shadow-sm
                  "
                >
                  <AvatarImage
                    src={user?.avatar}
                    alt={
                      user?.fullName ||
                      "User"
                    }
                  />

                  <AvatarFallback
                    className="
                      bg-primary
                      text-primary-foreground
                    "
                  >
                    {user?.fullName
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="
                glass
                w-60
                rounded-2xl
                p-2
              "
            >
              {/* IMPORTANT:
                  Base UI requires MenuGroupLabel
                  to be inside Menu.Group.
              */}
              <DropdownMenuGroup>
                <DropdownMenuLabel
                  className="
                    px-3
                    py-2
                  "
                >
                  <p className="font-semibold">
                    {user?.fullName ||
                      "Developer"}
                  </p>

                  <p
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    @{user?.username ||
                      "username"}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    navigate(
                      `/profile/${user?.username}`
                    )
                  }
                  className="
                    cursor-pointer
                    rounded-xl
                  "
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    navigate("/settings")
                  }
                  className="
                    cursor-pointer
                    rounded-xl
                  "
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={
                    logoutMutation.isPending
                  }
                  className="
                    cursor-pointer
                    rounded-xl
                    text-red-500
                    focus:text-red-500
                  "
                >
                  <LogOut className="mr-2 h-4 w-4" />

                  {logoutMutation.isPending
                    ? "Logging out..."
                    : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;