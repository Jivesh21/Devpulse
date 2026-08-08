import { Link } from "react-router-dom";
import { Compass, Loader2, Users } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSuggestedDevelopers } from "@/hooks/useSuggestedDevelopers";
import { useFollowStatus, useToggleFollow } from "@/hooks/useFollow";

function DeveloperCard({ user }) {
  const { data: statusData } = useFollowStatus(user._id);
  const toggleFollow = useToggleFollow(user._id);
  const isFollowing = statusData?.data?.isFollowing || false;

  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <Link to={`/profile/${user.username}`} className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">{user.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="truncate font-semibold">{user.fullName}</h2>
          <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </Link>
      {user.bio && <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{user.bio}</p>}
      {user.skills?.length > 0 && <p className="mt-3 truncate text-xs text-primary">{user.skills.join(" · ")}</p>}
      <Button className="mt-4 w-full" variant={isFollowing ? "secondary" : "default"} disabled={toggleFollow.isPending} onClick={() => toggleFollow.mutate()}>
        {toggleFollow.isPending ? "Updating..." : isFollowing ? "Following" : "Follow"}
      </Button>
    </article>
  );
}

export default function NetworkPage() {
  const { data, isLoading, isError, refetch } = useSuggestedDevelopers();
  const developers = data?.data || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold"><Compass className="h-6 w-6 text-primary" />Discover developers</h1>
          <p className="mt-1 text-muted-foreground">Find people to follow and grow your network.</p>
        </div>
        {isLoading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : isError ? (
          <div className="rounded-2xl border bg-card p-10 text-center"><p>Could not load developers.</p><Button className="mt-4" variant="outline" onClick={() => refetch()}>Try again</Button></div>
        ) : developers.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center"><Users className="mx-auto h-8 w-8 text-primary" /><p className="mt-3 font-medium">No other developers yet.</p><p className="mt-1 text-sm text-muted-foreground">Invite people to join DevPulse.</p></div>
        ) : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{developers.map((user) => <DeveloperCard key={user._id} user={user} />)}</div>}
      </div>
    </DashboardLayout>
  );
}
