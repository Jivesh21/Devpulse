import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import {
  useMarkAsRead,
  useDeleteNotification,
} from "@/hooks/useNotification";

function NotificationItem({ notification }) {
  const markAsReadMutation = useMarkAsRead();

  const deleteMutation = useDeleteNotification();

  const sender = notification.sender;

  function getMessage() {
    switch (notification.type) {
      case "follow":
        return "started following you";

      case "like":
        return "liked your post";

      case "comment":
        return "commented on your post";

      default:
        return "sent you a notification";
    }
  }

  return (
    <div
      className={`flex items-start justify-between rounded-xl border p-4 transition ${
        notification.isRead
          ? "bg-background"
          : "bg-violet-50 dark:bg-violet-950/20"
      }`}
    >
      <div
        className="flex flex-1 cursor-pointer gap-3"
        onClick={() => {
          if (!notification.isRead) {
            markAsReadMutation.mutate(notification._id);
          }
        }}
      >
        <Avatar>
          <AvatarImage src={sender?.avatar} />

          <AvatarFallback>
            {sender?.fullName?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="text-sm leading-6">
            <span className="font-semibold">
              {sender?.fullName}
            </span>{" "}
            {getMessage()}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(
              notification.createdAt
            ).toLocaleString()}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          deleteMutation.mutate(notification._id)
        }
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}

export default NotificationItem;