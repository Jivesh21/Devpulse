import { Link, useNavigate } from "react-router-dom";
import { useUnreadCount } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus,
  Bell,
  Sun,
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
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex h-full items-center gap-4 px-4 sm:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        {/* Mobile Menu */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link
          to="/feed"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-md shadow-violet-500/30">
            <Activity
              className="h-5 w-5 text-white"
              strokeWidth={2.5}
            />
          </div>

          <span className="hidden text-lg font-semibold tracking-tight sm:block">
            Dev
            <span className="text-violet-500">
              Pulse
            </span>
          </span>
        </Link>
      </div>

      {/* Center Search */}
      <div className="hidden flex-1 justify-center md:flex">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search developers, posts..."
            className="h-10 rounded-full bg-muted/50 pl-10 focus-visible:bg-background"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-2">
        {/* Mobile Search */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Create Post */}
        <Button className="hidden h-10 gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-white shadow-md shadow-violet-500/30 hover:from-violet-500 hover:to-indigo-500 sm:flex">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>

        <Button
          size="icon"
          className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30 hover:from-violet-500 hover:to-indigo-500 sm:hidden"
        >
          <Plus className="h-4 w-4" />
        </Button>

        {/* Notifications */}
       <Button
  variant="ghost"
  size="icon"
  className="relative"
  onClick={() =>
    navigate("/notifications")
  }
>
  <Bell className="h-5 w-5" />

  {unreadCount > 0 && (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
      {unreadCount > 99
        ? "99+"
        : unreadCount}
    </span>
  )}
</Button>

        {/* Theme */}
        <Button
          variant="ghost"
          size="icon"
        >
          <Sun className="h-5 w-5" />
        </Button>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />

                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
                  {user?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
  align="end"
  className="w-56"
>
  <DropdownMenuGroup>
    <DropdownMenuLabel>
      <p className="font-medium">
        {user?.fullName || "Developer"}
      </p>

      <p className="text-xs text-muted-foreground">
        @{user?.username || "username"}
      </p>
    </DropdownMenuLabel>
  </DropdownMenuGroup>

  <DropdownMenuSeparator />

  <DropdownMenuItem asChild>
    <Link to={`/profile/${user?.username}`}>
      <User className="mr-2 h-4 w-4" />
      Profile
    </Link>
  </DropdownMenuItem>

  <DropdownMenuItem>
    <Settings className="mr-2 h-4 w-4" />
    Settings
  </DropdownMenuItem>

  <DropdownMenuSeparator />

  <DropdownMenuItem
    onClick={handleLogout}
    disabled={logoutMutation.isPending}
    className="cursor-pointer text-red-500 focus:text-red-500"
  >
    <LogOut className="mr-2 h-4 w-4" />
    {logoutMutation.isPending
      ? "Logging out..."
      : "Logout"}
  </DropdownMenuItem>
</DropdownMenuContent>
           </DropdownMenu>
      </div>
    </nav>
  );
}

export default Navbar;