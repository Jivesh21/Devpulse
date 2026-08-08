import { Link } from "react-router-dom";
import {
  Compass,
  Loader2,
  Users,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { useSuggestedDevelopers } from "@/hooks/useSuggestedDevelopers";

import {
  useFollowStatus,
  useToggleFollow,
} from "@/hooks/useFollow";

function DeveloperCard({ user }) {
  const {
    data: statusData,
  } = useFollowStatus(user._id);

  const toggleFollow =
    useToggleFollow(user._id);

  const isFollowing =
    statusData?.data?.isFollowing ||
    false;

  const initials =
    user.fullName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <Link
      to={`/profile/${user.username}`}
      className="
        glass-card
        glass-hover
        group
        block
        rounded-2xl
        p-5
        outline-none
        transition-all
        duration-300
        focus-visible:ring-2
        focus-visible:ring-primary
      "
    >
      {/* ================================= */}
      {/* Developer */}
      {/* ================================= */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            className="
              h-12
              w-12
              shrink-0
              border
              border-primary/15
              shadow-sm
              transition-transform
              duration-300
              group-hover:scale-105
            "
          >
            <AvatarImage
              src={user.avatar}
              alt={user.fullName}
            />

            <AvatarFallback
              className="
                bg-primary/10
                font-semibold
                text-primary
              "
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h3
              className="
                truncate
                font-semibold
                transition-colors
                group-hover:text-primary
              "
            >
              {user.fullName}
            </h3>

            <p className="truncate text-sm text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </div>

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-primary/10
            text-primary
            opacity-80
            transition-all
            duration-200
            group-hover:opacity-100
          "
        >
          <UserPlus className="h-4 w-4" />
        </div>
      </div>

      {/* ================================= */}
      {/* Bio */}
      {/* ================================= */}

      {user.bio && (
        <p
          className="
            mt-4
            line-clamp-2
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          {user.bio}
        </p>
      )}

      {/* ================================= */}
      {/* Skills */}
      {/* ================================= */}

      {user.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {user.skills
            .slice(0, 4)
            .map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="
                  rounded-full
                  border
                  border-primary/10
                  bg-primary/5
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-primary
                "
              >
                {skill}
              </span>
            ))}

          {user.skills.length > 4 && (
            <span
              className="
                rounded-full
                bg-muted
                px-2.5
                py-1
                text-[11px]
                font-medium
                text-muted-foreground
              "
            >
              +{user.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* ================================= */}
      {/* Follow */}
      {/* ================================= */}

      <Button
        type="button"
        className="
          interactive
          mt-5
          h-10
          w-full
          rounded-xl
        "
        variant={
          isFollowing
            ? "secondary"
            : "default"
        }
        disabled={
          toggleFollow.isPending
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          toggleFollow.mutate();
        }}
      >
        {toggleFollow.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )}
      </Button>
    </Link>
  );
}

export default function NetworkPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useSuggestedDevelopers();

  const developers =
    data?.data || [];

  return (
    <DashboardLayout>
      <main className="page-enter space-y-6">

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <section
          className="
            glass-card
            glass-hover
            relative
            overflow-hidden
            rounded-3xl
            p-6
            sm:p-8
          "
        >
          {/* Background decoration */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-64
              w-64
              rounded-full
              bg-primary/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                text-primary
                shadow-sm
              "
            >
              <Compass className="h-7 w-7" />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  sm:text-3xl
                "
              >
                Discover developers
              </h1>

              <p
                className="
                  mt-1
                  max-w-xl
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                Find developers to follow,
                discover new skills, and grow
                your professional network.
              </p>
            </div>
          </div>
        </section>

        {/* ================================= */}
        {/* Section Header */}
        {/* ================================= */}

        {!isLoading &&
          !isError &&
          developers.length > 0 && (
            <div className="flex items-center gap-3 px-1">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                "
              >
                <Users className="h-4 w-4" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Developers you may know
                </h2>

                <p className="text-xs text-muted-foreground">
                  {developers.length}{" "}
                  {developers.length === 1
                    ? "developer"
                    : "developers"}{" "}
                  to discover
                </p>
              </div>
            </div>
          )}

        {/* ================================= */}
        {/* Loading */}
        {/* ================================= */}

        {isLoading && (
          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            <DeveloperSkeleton />
            <DeveloperSkeleton />
            <DeveloperSkeleton />
            <DeveloperSkeleton />
            <DeveloperSkeleton />
            <DeveloperSkeleton />
          </div>
        )}

        {/* ================================= */}
        {/* Error */}
        {/* ================================= */}

        {isError && (
          <div
            className="
              glass-card
              flex
              flex-col
              items-center
              justify-center
              rounded-2xl
              p-10
              text-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-destructive/10
                text-destructive
              "
            >
              <Users className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              Couldn't load developers
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Something went wrong while
              loading the developer network.
            </p>

            <Button
              variant="outline"
              className="
                interactive
                mt-5
                gap-2
                rounded-xl
              "
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        )}

        {/* ================================= */}
        {/* Empty */}
        {/* ================================= */}

        {!isLoading &&
          !isError &&
          developers.length === 0 && (
            <div
              className="
                glass-card
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                p-10
                text-center
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                  text-primary
                "
              >
                <Users className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No other developers yet
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Invite people to join DevPulse
                and start building your developer
                network.
              </p>
            </div>
          )}

        {/* ================================= */}
        {/* Developers */}
        {/* ================================= */}

        {!isLoading &&
          !isError &&
          developers.length > 0 && (
            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
                xl:grid-cols-3
              "
            >
              {developers.map(
                (user, index) => (
                  <div
                    key={user._id}
                    className="page-enter"
                    style={{
                      animationDelay: `${Math.min(
                        index * 60,
                        300
                      )}ms`,
                    }}
                  >
                    <DeveloperCard
                      user={user}
                    />
                  </div>
                )
              )}
            </div>
          )}
      </main>
    </DashboardLayout>
  );
}

/* ====================================
   Developer Skeleton
==================================== */

function DeveloperSkeleton() {
  return (
    <div
      className="
        animate-pulse
        rounded-2xl
        border
        border-border/50
        bg-muted/20
        p-5
      "
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-muted" />

        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 rounded-full bg-muted" />
          <div className="h-2.5 w-20 rounded-full bg-muted" />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded-full bg-muted" />
        <div className="h-3 w-4/5 rounded-full bg-muted" />
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted" />
        <div className="h-6 w-20 rounded-full bg-muted" />
        <div className="h-6 w-14 rounded-full bg-muted" />
      </div>

      <div className="mt-5 h-10 rounded-xl bg-muted" />
    </div>
  );
}