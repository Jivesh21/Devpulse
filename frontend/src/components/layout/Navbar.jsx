import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useUnreadCount } from "@/hooks/useNotification";

import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search/SearchBar";
import AppearanceMenu from "@/components/Theme/AppearanceMenu";

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
  Plus,
  User,
  Settings,
  LogOut,
  Home,
  Users,
  Bookmark,
  X,
  ChevronRight,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useAuthContext } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";

function Navbar() {
  const { user } = useAuthContext();
  const logoutMutation = useLogout();

  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const { data: unreadData } = useUnreadCount();

  const unreadCount =
    unreadData?.data?.unreadCount || 0;

  // ====================================
  // Mobile menu body scroll lock
  // ====================================

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // ====================================
  // Navigation Items
  // ====================================

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

  // ====================================
  // Logout
  // ====================================

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsMobileMenuOpen(false);

      navigate("/login", {
        replace: true,
      });
    }
  };

  // ====================================
  // Profile
  // ====================================

  const handleProfile = () => {
    if (user?.username) {
      navigate(`/profile/${user.username}`);
    }
  };

  // ====================================
  // Settings
  // ====================================

  const handleSettings = () => {
    navigate("/settings");
  };

  // ====================================
  // Mobile Navigation
  // ====================================

  const handleMobileNavigation = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* ================================= */}
      {/* Navbar */}
      {/* ================================= */}

      <header
        className="
          glass
          sticky
          top-0
          z-50
          w-full
          min-w-0
          overflow-visible
          rounded-none
          border-x-0
          border-t-0
          px-2
          py-2
          sm:px-4
          sm:py-3
          md:px-6
        "
      >
        <div
          className="
            mx-auto
            flex
            h-12
            w-full
            min-w-0
            max-w-7xl
            items-center
            gap-1
            sm:gap-3
            md:gap-4
          "
        >
          {/* ================================= */}
          {/* Left Section */}
          {/* ================================= */}

          <div
            className="
              flex
              min-w-0
              shrink-0
              items-center
              gap-1
              sm:gap-3
            "
          >
            {/* Mobile Menu */}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setIsMobileMenuOpen(true)
              }
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="
                h-9
                w-9
                shrink-0
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
                shrink-0
                items-center
                gap-2
                outline-none
              "
            >
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
              min-w-0
              flex-1
              justify-center
              px-4
              md:flex
              lg:px-6
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
              shrink-0
              items-center
              gap-0.5
              sm:gap-1.5
              md:gap-2
            "
          >
            {/* Mobile Search */}

            <Button
              variant="ghost"
              size="icon"
              className="
                hidden
                h-9
                w-9
                shrink-0
                rounded-xl
                transition-all
                duration-200
                hover:bg-primary/10
                hover:text-primary
                active:scale-95
                min-[400px]:inline-flex
                md:hidden
              "
              onClick={() => navigate("/search")}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Create Post */}

            <Button
              onClick={() => navigate("/feed")}
              className="
                hidden
                h-10
                shrink-0
                gap-2
                rounded-full
                bg-primary
                px-5
                text-primary-foreground
                shadow-md
                shadow-primary/25
                transition-all
                hover:bg-primary/90
                hover:shadow-lg
                hover:shadow-primary/30
                active:scale-95
                sm:flex
              "
            >
              <Plus className="h-4 w-4" />
              Create Post
            </Button>

            {/* Mobile Create Post */}

            <Button
              onClick={() => navigate("/feed")}
              size="icon"
              className="
                h-9
                w-9
                shrink-0
                rounded-full
                bg-primary
                text-primary-foreground
                shadow-md
                shadow-primary/25
                transition-all
                hover:bg-primary/90
                active:scale-95
                sm:hidden
              "
            >
              <Plus className="h-5 w-5" />
            </Button>

            {/* ================================= */}
            {/* Notifications */}
            {/* ================================= */}

            <Button
              variant="ghost"
              size="icon"
              className="
                relative
                h-9
                w-9
                shrink-0
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

            {/* ================================= */}
            {/* Appearance */}
            {/* ================================= */}

            <div className="shrink-0">
              <AppearanceMenu />
            </div>

            {/* ================================= */}
            {/* Profile Dropdown */}
            {/* ================================= */}

            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                aria-label="Open profile menu"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border-0
                  bg-transparent
                  p-0
                  outline-none
                  transition-all
                  duration-200
                  hover:bg-primary/10
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  active:scale-95
                  sm:h-10
                  sm:w-10
                "
              >
                <Avatar
                  className="
                    h-8
                    w-8
                    border
                    border-primary/20
                    shadow-sm
                    sm:h-9
                    sm:w-9
                  "
                >
                  <AvatarImage
                    src={user?.avatar}
                    alt={
                      user?.fullName || "User"
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
                      ?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-foreground">
                        {user?.fullName ||
                          "User"}
                      </span>

                      <span className="text-xs font-normal text-muted-foreground">
                        @{user?.username ||
                          "username"}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleProfile}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleSettings}
                  className="cursor-pointer"
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
                    text-red-500
                    focus:text-red-500
                  "
                >
                  <LogOut className="mr-2 h-4 w-4" />

                  {logoutMutation.isPending
                    ? "Logging out..."
                    : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ================================= */}
      {/* Mobile Navigation Drawer */}
      {/* ================================= */}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Overlay */}

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() =>
              setIsMobileMenuOpen(false)
            }
            className="
              absolute
              inset-0
              bg-black/40
              backdrop-blur-sm
            "
          />

          {/* Drawer */}

          <aside
            className="
              absolute
              left-0
              top-0
              flex
              h-full
              w-[280px]
              max-w-[85vw]
              flex-col
              border-r
              border-border/60
              bg-background
              shadow-2xl
            "
          >
            {/* Drawer Header */}

            <div
              className="
                flex
                h-20
                shrink-0
                items-center
                justify-between
                border-b
                border-border/60
                px-5
              "
            >
              <Link
                to="/feed"
                onClick={() =>
                  setIsMobileMenuOpen(false)
                }
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary
                    shadow-lg
                    shadow-primary/20
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

                <span className="text-lg font-bold tracking-tight">
                  Dev
                  <span className="text-primary">
                    Pulse
                  </span>
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setIsMobileMenuOpen(false)
                }
                aria-label="Close navigation menu"
                className="
                  rounded-xl
                  hover:bg-primary/10
                  hover:text-primary
                "
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* User Info */}

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-border/60
                px-5
                py-5
              "
            >
              <Avatar
                className="
                  h-11
                  w-11
                  border
                  border-primary/20
                "
              >
                <AvatarImage
                  src={user?.avatar}
                  alt={
                    user?.fullName || "User"
                  }
                />

                <AvatarFallback
                  className="
                    bg-primary/10
                    font-semibold
                    text-primary
                  "
                >
                  {user?.fullName
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.fullName || "User"}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  @{user?.username || "username"}
                </p>
              </div>
            </div>

            {/* Navigation */}

            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {NAV_ITEMS.map(
                  ({
                    icon: Icon,
                    label,
                    path,
                  }) => {
                    const isActive =
                      location.pathname === path;

                    return (
                      <button
                        key={path}
                        type="button"
                        onClick={() =>
                          handleMobileNavigation(
                            path
                          )
                        }
                        className={`
                          group
                          relative
                          flex
                          h-12
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-4
                          text-left
                          transition-all
                          duration-200

                          ${
                            isActive
                              ? `
                                bg-primary/10
                                text-primary
                              `
                              : `
                                text-muted-foreground
                                hover:bg-muted/70
                                hover:text-foreground
                              `
                          }
                        `}
                      >
                        {isActive && (
                          <span
                            className="
                              absolute
                              left-0
                              h-6
                              w-1
                              rounded-r-full
                              bg-primary
                            "
                          />
                        )}

                        <Icon
                          className={`
                            h-5
                            w-5
                            shrink-0

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

                        <span className="flex-1 text-sm font-medium">
                          {label}
                        </span>

                        <ChevronRight
                          className={`
                            h-4
                            w-4
                            transition-transform
                            duration-200
                            group-hover:translate-x-0.5

                            ${
                              isActive
                                ? "text-primary"
                                : "opacity-40"
                            }
                          `}
                        />

                        {label ===
                          "Notifications" &&
                          unreadCount > 0 && (
                            <span
                              className="
                                mr-1
                                flex
                                h-5
                                min-w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-primary
                                px-1.5
                                text-[10px]
                                font-bold
                                text-primary-foreground
                              "
                            >
                              {unreadCount > 99
                                ? "99+"
                                : unreadCount}
                            </span>
                          )}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Divider */}

              <div className="my-5 h-px bg-border/60" />

              {/* Profile */}

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleProfile();
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-muted-foreground
                  transition-colors
                  hover:bg-muted/70
                  hover:text-foreground
                "
              >
                <User className="h-5 w-5" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    My Profile
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    View your developer profile
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 opacity-40" />
              </button>
            </nav>

            {/* Drawer Footer */}

            <div
              className="
                shrink-0
                border-t
                border-border/60
                p-4
              "
            >
              <button
                type="button"
                onClick={handleLogout}
                disabled={
                  logoutMutation.isPending
                }
                className="
                  flex
                  h-11
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  text-sm
                  font-medium
                  text-red-500
                  transition-colors
                  hover:bg-red-500/10
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <LogOut className="h-5 w-5" />

                {logoutMutation.isPending
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Navbar;