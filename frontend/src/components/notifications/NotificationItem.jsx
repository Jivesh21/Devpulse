import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Bell,
  Check,
  Heart,
  MessageCircle,
  Trash2,
  UserPlus,
} from "lucide-react";

import {
  useMarkAsRead,
  useDeleteNotification,
} from "@/hooks/useNotification";

function NotificationItem({
  notification,
}) {
  const markAsReadMutation =
    useMarkAsRead();

  const deleteMutation =
    useDeleteNotification();

  const sender = notification.sender;

  const getNotificationInfo = () => {
    switch (notification.type) {
      case "follow":
        return {
          message: "started following you",
          icon: UserPlus,
        };

      case "like":
        return {
          message: "liked your post",
          icon: Heart,
        };

      case "comment":
        return {
          message: "commented on your post",
          icon: MessageCircle,
        };

      default:
        return {
          message: "sent you a notification",
          icon: Bell,
        };
    }
  };

  const {
    message,
    icon: Icon,
  } = getNotificationInfo();

  const handleMarkAsRead = () => {
    if (
      notification.isRead ||
      markAsReadMutation.isPending
    ) {
      return;
    }

    markAsReadMutation.mutate(
      notification._id
    );
  };

  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();

    deleteMutation.mutate(
      notification._id
    );
  };

  const senderInitial =
    sender?.fullName
      ?.charAt(0)
      ?.toUpperCase() || "U";

  return (
    <div
      className={`
        group
        relative
        flex
        items-start
        gap-4
        px-5
        py-4
        transition-all
        duration-200
        sm:px-6
        ${
          notification.isRead
            ? "bg-background/20"
            : "bg-primary/[0.06]"
        }
        hover:bg-muted/30
      `}
    >
      {/* Unread Indicator */}
      {!notification.isRead && (
        <span
          className="
            absolute
            left-2
            top-1/2
            h-8
            w-1
            -translate-y-1/2
            rounded-full
            bg-primary
          "
        />
      )}

      {/* ================================= */}
      {/* Clickable Notification */}
      {/* ================================= */}

      <button
        type="button"
        onClick={handleMarkAsRead}
        disabled={
          markAsReadMutation.isPending
        }
        className="
          flex
          min-w-0
          flex-1
          items-start
          gap-3
          text-left
          outline-none
          disabled:cursor-default
        "
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar
            className="
              h-11
              w-11
              border
              border-border/60
              shadow-sm
              transition-transform
              duration-200
              group-hover:scale-105
            "
          >
            <AvatarImage
              src={sender?.avatar}
              alt={sender?.fullName}
            />

            <AvatarFallback
              className="
                bg-primary/10
                font-semibold
                text-primary
              "
            >
              {senderInitial}
            </AvatarFallback>
          </Avatar>

          {/* Notification Type */}
          <span
            className="
              absolute
              -bottom-1
              -right-1
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              border-2
              border-background
              bg-primary
              text-primary-foreground
            "
          >
            <Icon className="h-2.5 w-2.5" />
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p
            className={`
              text-sm
              leading-6
              ${
                notification.isRead
                  ? "text-muted-foreground"
                  : "text-foreground"
              }
            `}
          >
            <span className="font-semibold text-foreground">
              {sender?.fullName ||
                "Someone"}
            </span>{" "}
            {message}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-muted-foreground
            "
          >
            {formatNotificationDate(
              notification.createdAt
            )}
          </p>

          {!notification.isRead && (
            <div
              className="
                mt-2
                inline-flex
                items-center
                gap-1.5
                text-[11px]
                font-medium
                text-primary
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Unread
            </div>
          )}
        </div>
      </button>

      {/* ================================= */}
      {/* Actions */}
      {/* ================================= */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-1
          opacity-70
          transition-opacity
          duration-200
          group-hover:opacity-100
        "
      >
        {/* Mark as read */}
        {!notification.isRead && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={
              markAsReadMutation.isPending
            }
            onClick={handleMarkAsRead}
            className="
              h-8
              w-8
              rounded-lg
              text-muted-foreground
              hover:bg-primary/10
              hover:text-primary
            "
            aria-label="Mark notification as read"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}

        {/* Delete */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={
            deleteMutation.isPending
          }
          onClick={handleDelete}
          className="
            h-8
            w-8
            rounded-lg
            text-muted-foreground
            hover:bg-destructive/10
            hover:text-destructive
          "
          aria-label="Delete notification"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ====================================
   Date Formatting
==================================== */

function formatNotificationDate(date) {
  if (!date) {
    return "";
  }

  const notificationDate =
    new Date(date);

  const now = new Date();

  const diff =
    now.getTime() -
    notificationDate.getTime();

  const minute =
    1000 * 60;

  const hour =
    minute * 60;

  const day =
    hour * 24;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(
      diff / minute
    );

    return `${minutes}m ago`;
  }

  if (diff < day) {
    const hours = Math.floor(
      diff / hour
    );

    return `${hours}h ago`;
  }

  if (diff < day * 7) {
    const days = Math.floor(
      diff / day
    );

    return `${days}d ago`;
  }

  return notificationDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year:
        notificationDate.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    }
  );
}

export default NotificationItem;