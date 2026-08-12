import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Compass,
  Loader2,
  Users,
  RefreshCw,
  UserPlus,
  ChevronDown,
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

// ====================================
// Developer Card
// ====================================

function DeveloperCard({
  user,
  expanded,
  onToggle,
}) {
  const {
    data: statusData,
  } = useFollowStatus(user._id);

  const toggleFollow =
    useToggleFollow(user._id);

  const isFollowing =
    statusData?.data?.isFollowing || false;

  const initials =
    user.fullName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // ====================================
  // Card Click
  // ====================================

  const handleCardClick = () => {
    onToggle(user._id);
  };

  // ====================================
  // Prevent Card Expansion
  // ====================================

  const handleInteractiveClick = (
    event
  ) => {
    event.stopPropagation();
  };

  return (
    <article
      onClick={handleCardClick}
      className={`
        glass-card
        glass-hover
        group
        w-full
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        border-border/50
        p-4
        transition-all
        duration-300

        ${
          expanded
            ? "ring-1 ring-primary/25"
            : ""
        }
      `}
    >
      {/* ================================= */}
      {/* Developer Header */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        {/* Avatar */}

        <Link
          to={`/profile/${user.username}`}
          onClick={handleInteractiveClick}
          className="
            shrink-0
            rounded-full
            outline-none
            focus-visible:ring-2
            focus-visible:ring-primary
          "
        >
          <Avatar
            className="
              h-11
              w-11
              shrink-0
              border
              border-primary/15
              shadow-sm
              transition-transform
              duration-200
              hover:scale-105
            "
          >
            <AvatarImage
              src={user.avatar}
              alt={user.fullName}
            />

            <AvatarFallback
              className="
                bg-primary/10
                text-sm
                font-semibold
                text-primary
              "
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Developer Info */}

        <Link
          to={`/profile/${user.username}`}
          onClick={handleInteractiveClick}
          className="
            min-w-0
            flex-1
            rounded-lg
            outline-none
            focus-visible:ring-2
            focus-visible:ring-primary
          "
        >
          <h3
            className="
              truncate
              text-sm
              font-semibold
              leading-5
              transition-colors
              hover:text-primary
            "
            title={user.fullName}
          >
            {user.fullName}
          </h3>

          <p
            className="
              truncate
              text-xs
              leading-4
              text-muted-foreground
            "
          >
            @{user.username}
          </p>
        </Link>

        {/* Follow Button */}

        <Button
          type="button"
          size="sm"
          variant={
            isFollowing
              ? "secondary"
              : "default"
          }
          disabled={
            toggleFollow.isPending
          }
          onClick={(event) => {
            handleInteractiveClick(
              event
            );

            toggleFollow.mutate();
          }}
          className="
            interactive
            h-9
            shrink-0
            rounded-full
            px-3.5
            text-xs
            font-medium
          "
        >
          {toggleFollow.isPending ? (
            <Loader2
              className="
                h-3.5
                w-3.5
                animate-spin
              "
            />
          ) : isFollowing ? (
            "Following"
          ) : (
            <>
              <UserPlus
                className="
                  mr-1.5
                  h-3.5
                  w-3.5
                "
              />

              Follow
            </>
          )}
        </Button>
      </div>

      {/* ================================= */}
      {/* Bio */}
      {/* ================================= */}

      <div
        className={`
          overflow-hidden
          transition-all
          duration-300

          ${
            expanded
              ? "mt-4 max-h-96 opacity-100"
              : "mt-3 max-h-5 opacity-90"
          }
        `}
      >
        <p
          className={`
            text-xs
            leading-5
            text-muted-foreground

            ${
              expanded
                ? ""
                : "line-clamp-1"
            }
          `}
        >
          {user.bio ||
            "Developer on DevPulse"}
        </p>
      </div>

      {/* ================================= */}
      {/* Skills */}
      {/* ================================= */}

      <div
        className={`
          overflow-hidden
          transition-all
          duration-300

          ${
            expanded
              ? "mt-3 max-h-48 opacity-100"
              : "mt-2 max-h-6 opacity-90"
          }
        `}
      >
        {user.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {user.skills
              .slice(
                0,
                expanded
                  ? user.skills.length
                  : 3
              )
              .map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="
                      rounded-full
                      border
                      border-primary/10
                      bg-primary/5
                      px-2
                      py-0.5
                      text-[10px]
                      font-medium
                      leading-4
                      text-primary
                    "
                  >
                    {skill}
                  </span>
                )
              )}

            {!expanded &&
              user.skills.length > 3 && (
                <span
                  className="
                    rounded-full
                    bg-muted
                    px-2
                    py-0.5
                    text-[10px]
                    font-medium
                    leading-4
                    text-muted-foreground
                  "
                >
                  +{user.skills.length - 3}
                </span>
              )}
          </div>
        ) : (
          <span
            className="
              text-[10px]
              text-muted-foreground/40
            "
          >
            No skills added
          </span>
        )}
      </div>

      {/* ================================= */}
      {/* Expand Indicator */}
      {/* ================================= */}

      <div
        className={`
          flex
          items-center
          justify-center

          ${
            expanded
              ? "mt-3 border-t border-border/40 pt-2.5"
              : "mt-2"
          }
        `}
      >
        <span
          className="
            flex
            items-center
            gap-1
            text-[10px]
            font-medium
            text-muted-foreground
          "
        >
          {expanded
            ? "Show less"
            : "View more"}

          <ChevronDown
            className={`
              h-3
              w-3
              transition-transform
              duration-300

              ${
                expanded
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </span>
      </div>
    </article>
  );
}

// ====================================
// Network Page
// ====================================

export default function NetworkPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useSuggestedDevelopers();

  const developers =
    data?.data || [];

  const [expandedId, setExpandedId] =
    useState(null);

  // ====================================
  // Toggle Card
  // ====================================

  const handleToggleCard = (
    userId
  ) => {
    setExpandedId(
      (previousId) =>
        previousId === userId
          ? null
          : userId
    );
  };

  return (
    <DashboardLayout wide>
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
              items-center
              gap-4
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

            <div className="min-w-0">
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
            <div
              className="
                flex
                items-center
                gap-3
                px-1
              "
            >
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
                "
              >
                <Users className="h-4 w-4" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Developers you may know
                </h2>

                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
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
              md:grid-cols-2
              2xl:grid-cols-3
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

            <h2
              className="
                mt-5
                text-lg
                font-semibold
              "
            >
              Couldn't load developers
            </h2>

            <p
              className="
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-muted-foreground
              "
            >
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

              <h2
                className="
                  mt-5
                  text-xl
                  font-bold
                "
              >
                No other developers yet
              </h2>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                Invite people to join DevPulse
                and start building your developer
                network.
              </p>
            </div>
          )}

        {/* ================================= */}
        {/* Developer Grid */}
        {/* ================================= */}

        {!isLoading &&
          !isError &&
          developers.length > 0 && (
            <div
              className="
                grid
                items-start
                gap-5
                md:grid-cols-2
                2xl:grid-cols-3
              "
            >
              {developers.map(
                (user, index) => (
                  <div
                    key={user._id}
                    className="
                      page-enter
                      min-w-0
                    "
                    style={{
                      animationDelay: `${Math.min(
                        index * 60,
                        300
                      )}ms`,
                    }}
                  >
                    <DeveloperCard
                      user={user}
                      expanded={
                        expandedId ===
                        user._id
                      }
                      onToggle={
                        handleToggleCard
                      }
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

// ====================================
// Developer Skeleton
// ====================================

function DeveloperSkeleton() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-border/50
        bg-muted/20
        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            h-11
            w-11
            shrink-0
            animate-pulse
            rounded-full
            bg-muted
          "
        />

        <div
          className="
            min-w-0
            flex-1
            space-y-1.5
          "
        >
          <div
            className="
              h-3
              w-32
              animate-pulse
              rounded-full
              bg-muted
            "
          />

          <div
            className="
              h-2.5
              w-24
              animate-pulse
              rounded-full
              bg-muted
            "
          />
        </div>

        <div
          className="
            h-9
            w-20
            shrink-0
            animate-pulse
            rounded-full
            bg-muted
          "
        />
      </div>

      <div
        className="
          mt-4
          h-2.5
          w-4/5
          animate-pulse
          rounded-full
          bg-muted
        "
      />

      <div
        className="
          mt-3
          flex
          gap-1.5
        "
      >
        <div
          className="
            h-5
            w-14
            animate-pulse
            rounded-full
            bg-muted
          "
        />

        <div
          className="
            h-5
            w-16
            animate-pulse
            rounded-full
            bg-muted
          "
        />
      </div>
    </div>
  );
}