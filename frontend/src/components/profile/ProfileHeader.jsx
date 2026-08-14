import { useState } from "react";
import {
  Camera,
  Edit3,
  Globe,
  Calendar,
  ExternalLink,
  GitBranch,
  Link as LinkIcon,
  Download,
  MessageCircle,
  Loader2,
  Trash2,
  ImagePlus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

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

import { createOrGetConversation } from "@/services/conversation.service";

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
  onAvatarRemove,
  onCoverRemove,
  onEditClick,
  onDownloadResume,
}) {
  const navigate = useNavigate();

  const [startingChat, setStartingChat] =
    useState(false);

  const [openImageMenu, setOpenImageMenu] =
    useState(null);

  const { data: followStatusData } =
    useFollowStatus(profile._id);

  const toggleFollowMutation =
    useToggleFollow(profile._id);

  const isFollowing =
    followStatusData?.data?.isFollowing ||
    false;

  // ====================================
  // GitHub Integration
  // ====================================

  const githubUsername =
    profile.githubIntegration?.connected &&
    profile.githubIntegration?.username
      ? profile.githubIntegration.username
      : null;

  const githubUrl = githubUsername
    ? `https://github.com/${githubUsername}`
    : profile.github || "";

  // ====================================
  // Social Links
  // ====================================

  const hasSocialLinks =
    profile.website ||
    githubUrl ||
    profile.linkedin;

  // ====================================
  // Start Chat
  // ====================================

  const handleStartChat = async () => {
    if (startingChat || !profile?._id) {
      return;
    }

    try {
      setStartingChat(true);

      const response =
        await createOrGetConversation(
          profile._id
        );

      console.log(
        "💬 Conversation response:",
        response
      );

      const conversationId =
        response?.data?.conversation?._id;

      if (!conversationId) {
        console.error(
          "❌ Conversation ID not found:",
          response
        );

        return;
      }

      navigate("/messages", {
        state: {
          conversationId,
        },
      });
    } catch (error) {
      console.error(
        "❌ Failed to start conversation:",
        error
      );
    } finally {
      setStartingChat(false);
    }
  };

  // ====================================
  // Close Image Menu
  // ====================================

  const closeImageMenu = () => {
    setOpenImageMenu(null);
  };

  // ====================================
  // Handle Change
  // ====================================

  const handleAvatarChange = () => {
    closeImageMenu();

    if (onAvatarClick) {
      onAvatarClick();
    }
  };

  const handleCoverChange = () => {
    closeImageMenu();

    if (onCoverClick) {
      onCoverClick();
    }
  };

  // ====================================
  // Handle Remove
  // ====================================

  const handleAvatarRemove = () => {
    closeImageMenu();

    if (onAvatarRemove) {
      onAvatarRemove();
    }
  };

  const handleCoverRemove = () => {
    closeImageMenu();

    if (onCoverRemove) {
      onCoverRemove();
    }
  };

  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        border
        border-border/60
        bg-background
        shadow-sm
      "
    >
      {/* ================================= */}
      {/* Cover */}
      {/* ================================= */}

      <div
        className="
          relative
          h-28
          overflow-hidden
          bg-gradient-to-br
          from-primary
          via-primary/80
          to-primary/40
          sm:h-44
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
              object-center
            "
          />
        ) : (
          <>
            <div
              className="
                absolute
                inset-0
                opacity-20
                [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
                [background-size:24px_24px]
              "
            />

            <div
              className="
                absolute
                -right-24
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
                left-1/3
                h-72
                w-72
                rounded-full
                bg-white/10
                blur-3xl
              "
            />
          </>
        )}

        {/* ================================= */}
        {/* Cover Image Menu */}
        {/* ================================= */}

        {isOwner && (
          <div className="absolute right-4 top-4">
            <Button
              size="icon"
              variant="secondary"
              onClick={() =>
                setOpenImageMenu(
                  openImageMenu === "cover"
                    ? null
                    : "cover"
                )
              }
              className="
                h-9
                w-9
                rounded-xl
                border
                border-white/20
                bg-black/25
                text-white
                shadow-md
                backdrop-blur-md
                hover:bg-black/40
              "
              aria-label="Cover image options"
            >
              <Camera className="h-4 w-4" />
            </Button>

            {openImageMenu === "cover" && (
              <ImageActionMenu
                hasImage={Boolean(
                  profile.coverImage
                )}
                onChange={
                  handleCoverChange
                }
                onRemove={
                  handleCoverRemove
                }
              />
            )}
          </div>
        )}
      </div>

      {/* ================================= */}
      {/* Main Content */}
      {/* ================================= */}

      <div className="px-4 pb-5 sm:px-7 sm:pb-6">

        {/* ================================= */}
        {/* Avatar */}
        {/* ================================= */}

        <div className="relative -mt-12 w-fit sm:-mt-16">
          <Avatar
            className="
              h-24
              w-24
              border-4
              border-background
              bg-background
              shadow-lg
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

          {/* ================================= */}
          {/* Avatar Image Menu */}
          {/* ================================= */}

          {isOwner && (
            <div className="absolute bottom-0 right-0">
              <Button
                size="icon"
                onClick={() =>
                  setOpenImageMenu(
                    openImageMenu === "avatar"
                      ? null
                      : "avatar"
                  )
                }
                className="
                  h-9
                  w-9
                  rounded-full
                  border-2
                  border-background
                  shadow-md
                "
                aria-label="Profile picture options"
              >
                <Camera className="h-4 w-4" />
              </Button>

              {openImageMenu === "avatar" && (
                <ImageActionMenu
                  hasImage={Boolean(
                    profile.avatar
                  )}
                  onChange={
                    handleAvatarChange
                  }
                  onRemove={
                    handleAvatarRemove
                  }
                  align="right"
                />
              )}
            </div>
          )}
        </div>

        {/* ================================= */}
        {/* Identity + Actions */}
        {/* ================================= */}

        <div
          className="
            mt-4
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          {/* ================================= */}
          {/* Identity */}
          {/* ================================= */}

          <div className="min-w-0">

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

            {profile.bio && (
              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-foreground/80
                "
              >
                {profile.bio}
              </p>
            )}

            {/* ================================= */}
            {/* Social Links */}
            {/* ================================= */}

            {hasSocialLinks && (
              <div className="mt-3 flex flex-wrap gap-2">

                {profile.website && (
                  <ProfileLink
                    href={profile.website}
                    icon={
                      <Globe className="h-3.5 w-3.5" />
                    }
                    label="Website"
                  />
                )}

                {githubUrl && (
                  <ProfileLink
                    href={githubUrl}
                    icon={
                      <GitBranch className="h-3.5 w-3.5" />
                    }
                    label={
                      githubUsername
                        ? `GitHub @${githubUsername}`
                        : "GitHub"
                    }
                  />
                )}

                {profile.linkedin && (
                  <ProfileLink
                    href={profile.linkedin}
                    icon={
                      <LinkIcon className="h-3.5 w-3.5" />
                    }
                    label="LinkedIn"
                  />
                )}

              </div>
            )}

            {/* ================================= */}
            {/* Joined */}
            {/* ================================= */}

            {profile.createdAt && (
              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-1.5
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
          {/* Actions */}
          {/* ================================= */}

          <div
            className="
              flex
              shrink-0
              flex-wrap
              gap-2
            "
          >
            {isOwner ? (
              <Button
                onClick={onEditClick}
                variant="outline"
                className="
                  h-10
                  gap-2
                  rounded-xl
                  px-4
                "
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                {/* ================================= */}
                {/* Follow */}
                {/* ================================= */}

                <Button
                  type="button"
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
                    h-10
                    min-w-28
                    rounded-xl
                  "
                >
                  {toggleFollowMutation.isPending ? (
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

                {/* ================================= */}
                {/* Start a Chat */}
                {/* ================================= */}

                <Button
                  type="button"
                  onClick={handleStartChat}
                  disabled={startingChat}
                  variant="outline"
                  className="
                    h-10
                    gap-2
                    rounded-xl
                    border-primary/20
                    bg-primary/5
                    px-4
                    text-primary
                    transition-all
                    duration-200
                    hover:border-primary/40
                    hover:bg-primary/10
                    hover:text-primary
                    active:scale-[0.98]
                  "
                >
                  {startingChat ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" />
                      Start a chat
                    </>
                  )}
                </Button>
              </>
            )}

            {/* ================================= */}
            {/* Resume */}
            {/* ================================= */}

            <Button
              type="button"
              onClick={onDownloadResume}
              variant="outline"
              className="
                h-10
                gap-2
                rounded-xl
                px-4
              "
            >
              <Download className="h-4 w-4" />
              Resume
            </Button>
          </div>
        </div>

        {/* ================================= */}
        {/* Stats */}
        {/* ================================= */}

        <div
          className="
            mt-6
            grid
            grid-cols-3
            overflow-hidden
            rounded-2xl
            border
            border-border/60
            bg-muted/20
          "
        >
          <Stat
            value={postsCount}
            label="Posts"
          />

          <Stat
            value={followers}
            label="Followers"
            onClick={onFollowersClick}
          />

          <Stat
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
   Image Action Menu
==================================== */

function ImageActionMenu({
  hasImage,
  onChange,
  onRemove,
  align = "left",
}) {
  return (
    <div
      className={`
        absolute
        top-11
        z-50
        w-44
        overflow-hidden
        rounded-xl
        border
        border-border/60
        bg-background
        p-1.5
        shadow-xl
        backdrop-blur-xl

        ${
          align === "right"
            ? "right-0"
            : "right-0"
        }
      `}
    >
      {/* ====================================
          Change Image
      ==================================== */}

      <button
        type="button"
        onClick={onChange}
        className="
          flex
          w-full
          items-center
          gap-2.5
          rounded-lg
          px-3
          py-2.5
          text-left
          text-sm
          font-medium
          transition-colors
          hover:bg-primary/10
          hover:text-primary
        "
      >
        <ImagePlus className="h-4 w-4" />

        <span>
          {hasImage
            ? "Change photo"
            : "Add photo"}
        </span>
      </button>

      {/* ====================================
          Remove Image
      ==================================== */}

      {hasImage && (
        <button
          type="button"
          onClick={onRemove}
          className="
            flex
            w-full
            items-center
            gap-2.5
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-red-500
            transition-colors
            hover:bg-red-500/10
          "
        >
          <Trash2 className="h-4 w-4" />

          <span>
            Remove photo
          </span>
        </button>
      )}
    </div>
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
        inline-flex
        items-center
        gap-1.5
        rounded-lg
        border
        border-border/60
        bg-muted/30
        px-2.5
        py-1.5
        text-xs
        font-medium
        text-muted-foreground
        transition-colors
        hover:border-primary/30
        hover:bg-primary/5
        hover:text-primary
      "
    >
      {icon}

      {label}

      <ExternalLink className="h-3 w-3 opacity-50" />
    </a>
  );
}

/* ====================================
   Stat
==================================== */

function Stat({
  value,
  label,
  onClick,
}) {
  const content = (
    <>
      <p className="text-xl font-bold sm:text-2xl">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
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
          flex
          min-h-[72px]
          flex-col
          items-center
          justify-center
          border-r
          border-border/60
          transition-colors
          last:border-r-0
          hover:bg-primary/5
        "
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className="
        flex
        min-h-[72px]
        flex-col
        items-center
        justify-center
        border-r
        border-border/60
        last:border-r-0
      "
    >
      {content}
    </div>
  );
}

export default ProfileHeader;