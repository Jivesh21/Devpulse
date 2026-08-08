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
    <section
      className="
        glass-card
        glass-hover
        overflow-hidden
        rounded-3xl
      "
    >
      {/* ================================= */}
      {/* Cover Image */}
      {/* ================================= */}

      <div
        className="
          relative
          h-48
          overflow-hidden
          bg-gradient-to-br
          from-primary
          via-primary/80
          to-primary/50
          sm:h-56
          md:h-64
        "
      >
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt={`${profile.fullName}'s cover`}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              hover:scale-[1.01]
            "
          />
        ) : (
          <>
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-primary
                via-primary/80
                to-primary/40
              "
            />

            <div
              className="
                absolute
                -right-20
                -top-24
                h-72
                w-72
                rounded-full
                bg-white/10
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-32
                -left-20
                h-72
                w-72
                rounded-full
                bg-white/10
                blur-3xl
              "
            />
          </>
        )}

        {/* Cover Overlay */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/20
            via-transparent
            to-transparent
          "
        />

        {/* Change Cover */}
        {isOwner && (
          <Button
            size="icon"
            variant="secondary"
            onClick={onCoverClick}
            className="
              absolute
              right-4
              top-4
              h-9
              w-9
              rounded-xl
              border
              border-white/20
              bg-black/30
              text-white
              shadow-lg
              backdrop-blur-md
              transition-all
              duration-200
              hover:scale-105
              hover:bg-black/45
              active:scale-95
            "
            aria-label="Change cover image"
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* ================================= */}
      {/* Profile Information */}
      {/* ================================= */}

      <div
        className="
          relative
          px-5
          pb-6
          sm:px-7
          md:px-8
        "
      >
        {/* ================================= */}
        {/* Avatar */}
        {/* ================================= */}

        <div
          className="
            relative
            -mt-14
            w-fit
            sm:-mt-16
          "
        >
          <Avatar
            className="
              h-28
              w-28
              border-4
              border-background
              bg-background
              shadow-xl
              sm:h-32
              sm:w-32
            "
          >
            <AvatarImage
              src={profile.avatar}
              alt={profile.fullName}
            />

            <AvatarFallback
              className="
                bg-primary/10
                text-3xl
                font-bold
                text-primary
              "
            >
              {profile.fullName
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Change Avatar */}
          {isOwner && (
            <Button
              size="icon"
              variant="secondary"
              onClick={onAvatarClick}
              className="
                absolute
                bottom-1
                right-1
                h-9
                w-9
                rounded-full
                border-2
                border-background
                bg-primary
                text-primary-foreground
                shadow-lg
                transition-all
                duration-200
                hover:scale-105
                hover:bg-primary/90
                active:scale-95
              "
              aria-label="Change profile picture"
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* ================================= */}
        {/* Main Profile Row */}
        {/* ================================= */}

        <div
          className="
            mt-5
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          {/* Profile Info */}
          <div className="min-w-0 flex-1">
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                sm:text-3xl
              "
            >
              {profile.fullName}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              @{profile.username}
            </p>

            {/* Bio */}
            {profile.bio && (
              <p
                className="
                  mt-4
                  max-w-2xl
                  whitespace-pre-wrap
                  text-[15px]
                  leading-7
                  text-foreground/90
                "
              >
                {profile.bio}
              </p>
            )}

            {/* ================================= */}
            {/* Social / External Links */}
            {/* ================================= */}

            {(profile.website ||
              profile.github ||
              profile.linkedin) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.website && (
                  <ProfileLink
                    href={profile.website}
                    icon={
                      <Globe className="h-3.5 w-3.5" />
                    }
                    label="Website"
                  />
                )}

                {profile.github && (
                  <ProfileLink
                    href={profile.github}
                    icon={
                      <ExternalLink className="h-3.5 w-3.5" />
                    }
                    label="GitHub"
                  />
                )}

                {profile.linkedin && (
                  <ProfileLink
                    href={profile.linkedin}
                    icon={
                      <ExternalLink className="h-3.5 w-3.5" />
                    }
                    label="LinkedIn"
                  />
                )}
              </div>
            )}

            {/* Joined Date */}
            {profile.createdAt && (
              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-muted-foreground
                "
              >
                <Calendar className="h-3.5 w-3.5" />

                <span>
                  Joined{" "}
                  {new Date(
                    profile.createdAt
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* Action Button */}
          {/* ================================= */}

          <div className="shrink-0">
            {isOwner ? (
              <Button
                onClick={onEditClick}
                className="
                  interactive
                  h-10
                  gap-2
                  rounded-xl
                  px-5
                  shadow-md
                  shadow-primary/15
                "
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
                variant={
                  isFollowing
                    ? "secondary"
                    : "default"
                }
                className="
                  interactive
                  h-10
                  min-w-28
                  rounded-xl
                  px-5
                "
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

        {/* ================================= */}
        {/* Stats */}
        {/* ================================= */}

        <div
          className="
            mt-7
            grid
            grid-cols-3
            divide-x
            overflow-hidden
            rounded-2xl
            border
            border-border/60
            bg-muted/20
          "
        >
          <StatButton
            value={postsCount}
            label="Posts"
          />

          <StatButton
            value={followers}
            label="Followers"
            onClick={onFollowersClick}
          />

          <StatButton
            value={following}
            label="Following"
            onClick={onFollowingClick}
          />
        </div>
      </div>
    </section>
  );
}

/* ====================================
   Profile Link
==================================== */

function ProfileLink({
  href,
  icon,
  label,
}) {
  const normalizedHref =
    href.startsWith("http://") ||
    href.startsWith("https://")
      ? href
      : `https://${href}`;

  return (
    <a
      href={normalizedHref}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-border/60
        bg-background/40
        px-3
        py-1.5
        text-xs
        font-medium
        text-muted-foreground
        backdrop-blur-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-primary/30
        hover:bg-primary/10
        hover:text-primary
      "
    >
      {icon}

      <span>{label}</span>

      <ExternalLink
        className="
          h-3
          w-3
          opacity-50
          transition-transform
          duration-200
          group-hover:translate-x-0.5
          group-hover:-translate-y-0.5
        "
      />
    </a>
  );
}

/* ====================================
   Stats
==================================== */

function StatButton({
  value,
  label,
  onClick,
}) {
  const content = (
    <>
      <p
        className="
          text-xl
          font-bold
          tracking-tight
          transition-colors
          duration-200
          group-hover:text-primary
          sm:text-2xl
        "
      >
        {value}
      </p>

      <p
        className="
          mt-0.5
          text-xs
          text-muted-foreground
          transition-colors
          duration-200
          group-hover:text-primary
          sm:text-sm
        "
      >
        {label}
      </p>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          group
          flex
          min-h-20
          flex-col
          items-center
          justify-center
          px-3
          transition-colors
          duration-200
          hover:bg-primary/5
          focus-visible:bg-primary/5
          focus-visible:outline-none
        "
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className="
        group
        flex
        min-h-20
        flex-col
        items-center
        justify-center
        px-3
      "
    >
      {content}
    </div>
  );
}

export default ProfileHeader;