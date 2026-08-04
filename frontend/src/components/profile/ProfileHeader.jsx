import {
  Camera,
  Edit3,
  Globe,
  Calendar,
  ExternalLink,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  useFollowStatus,
  useToggleFollow,
} from "@/hooks/useFollow";

function ProfileHeader({
  profile,
  isOwner,
  postsCount,
  followers,
  following,
  onFollowersClick,
  onFollowingClick,
  onAvatarClick,
  onCoverClick,
  onEditClick,
}) {
  const {
    data: followStatusData,
  } = useFollowStatus(profile._id);

  const toggleFollowMutation =
    useToggleFollow(profile._id);

  const isFollowing =
    followStatusData?.data?.isFollowing ||
    false;

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

      {/* Cover */}
      <div className="relative h-52 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500">

        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        )}

        {isOwner && (
          <Button
            size="icon"
            className="absolute right-4 top-4 rounded-full"
            onClick={onCoverClick}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Profile */}
      <div className="relative px-6 pb-6">

        <Avatar className="-mt-16 h-32 w-32 border-4 border-background">
          <AvatarImage
            src={profile.avatar}
          />

          <AvatarFallback className="text-3xl">
            {profile.fullName?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {isOwner && (
          <Button
            size="icon"
            className="absolute left-28 top-16 rounded-full"
            onClick={onAvatarClick}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}

        <div className="mt-4 flex items-start justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              {profile.fullName}
            </h1>

            <p className="text-muted-foreground">
              @{profile.username}
            </p>

            {profile.bio && (
              <p className="mt-4 max-w-2xl leading-7">
                {profile.bio}
              </p>
            )}
<div className="mt-5 space-y-3">

  {profile.website && (
    <a
      href={profile.website}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-sm text-violet-600 transition hover:underline"
    >
      <Globe className="h-4 w-4" />
      {profile.website}
    </a>
  )}

  {profile.github && (
    <a
      href={profile.github}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-sm text-violet-600 transition hover:underline"
    >
      <ExternalLink className="h-4 w-4" />
      GitHub
    </a>
  )}

  {profile.linkedin && (
    <a
      href={profile.linkedin}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-sm text-violet-600 transition hover:underline"
    >
      <ExternalLink className="h-4 w-4" />
      LinkedIn
    </a>
  )}

  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Calendar className="h-4 w-4" />
    Joined{" "}
    {new Date(profile.createdAt).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    )}
  </div>

</div>
          <div className="mt-8 flex flex-wrap gap-8">

  <div>
    <p className="text-2xl font-bold">
      {postsCount}
    </p>

    <p className="text-sm text-muted-foreground">
      Posts
    </p>
  </div>

  <button
    onClick={onFollowersClick}
    className="text-left transition hover:scale-105"
  >
    <p className="text-2xl font-bold">
      {followers}
    </p>

    <p className="text-sm text-muted-foreground hover:text-violet-600">
      Followers
    </p>
  </button>

  <button
    onClick={onFollowingClick}
    className="text-left transition hover:scale-105"
  >
    <p className="text-2xl font-bold">
      {following}
    </p>

    <p className="text-sm text-muted-foreground hover:text-violet-600">
      Following
    </p>
  </button>

</div>

          </div>

          {isOwner ? (
            <Button
              className="gap-2"
              onClick={onEditClick}
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <Button
              onClick={() =>
                toggleFollowMutation.mutate()
              }
              disabled={
                toggleFollowMutation.isPending
              }
            >
              {toggleFollowMutation.isPending
                ? "Loading..."
                : isFollowing
                ? "Following"
                : "Follow"}
            </Button>
          )}

        </div>

      </div>

    </div>
  );
}

export default ProfileHeader;