import DashboardLayout from "@/layouts/DashboardLayout";

import { Button } from "@/components/ui/button";

import NotificationList from "@/components/notifications/NotificationList";

import {
  useNotifications,
  useMarkAllAsRead,
} from "@/hooks/useNotification";

function NotificationsPage() {
  const { data, isLoading } =
    useNotifications();

  const markAllMutation =
    useMarkAllAsRead();

  const notifications =
    data?.data?.notifications || [];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <Button
            onClick={() =>
              markAllMutation.mutate()
            }
          >
            Mark all as read
          </Button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <NotificationList
            notifications={notifications}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default NotificationsPage;