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
  Plus,
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
      console.error("Logout failed:", error);
    } finally {
      navigate("/login", { replace: true });
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30">
            <Activity
              className="h-5 w-5 text-white"
              strokeWidth={2.5}
            />
          </div>

          <span className="hidden text-lg font-semibold tracking-tight sm:block">
            Dev
            <span className="text-primary">
              Pulse
            </span>
          </span>
        </Link>
      </div>

      {/* Center Search */}
      <div className="hidden flex-1 justify-center md:flex">
  <SearchBar />
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
      <Button
  onClick={() => navigate("/feed")}
  className="hidden h-10 gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90 sm:flex"
>
  <Plus className="h-4 w-4" />
  Create Post
</Button>

       <Button
  onClick={() => navigate("/feed")}
  size="icon"
  className="rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90 sm:hidden"
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
<AppearanceMenu />

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

                <AvatarFallback className="bg-primary text-primary-foreground">
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
