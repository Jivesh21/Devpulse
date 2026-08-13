import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/socket/socket";

function NotificationSocketListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNewNotification = (
      notification
    ) => {
      console.log(
        "🔔 Updating notification cache:",
        notification
      );

      // ====================================
      // Add notification to notifications cache
      // ====================================

      queryClient.setQueryData(
        ["notifications"],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          const existingNotifications =
            oldData?.data?.notifications || [];

          // Prevent duplicate notifications
          const alreadyExists =
            existingNotifications.some(
              (item) =>
                item._id === notification._id
            );

          if (alreadyExists) {
            return oldData;
          }

          return {
            ...oldData,

            data: {
              ...oldData.data,

              notifications: [
                notification,
                ...existingNotifications,
              ],

              totalNotifications:
                (oldData.data
                  ?.totalNotifications || 0) + 1,
            },
          };
        }
      );

      // ====================================
      // Update unread count
      // ====================================

      queryClient.setQueryData(
        ["notifications-unread"],
        (oldData) => {
          const currentUnread =
            oldData?.data?.unreadCount || 0;

          return {
            ...oldData,

            data: {
              ...oldData?.data,

              unreadCount:
                currentUnread + 1,
            },
          };
        }
      );
    };

    // ====================================
    // Subscribe
    // ====================================

    socket.on(
      "new_notification",
      handleNewNotification
    );

    // ====================================
    // Cleanup
    // ====================================

    return () => {
      socket.off(
        "new_notification",
        handleNewNotification
      );
    };
  }, [queryClient]);

  return null;
}

export default NotificationSocketListener;