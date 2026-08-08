import {
  Bell,
  CheckCheck,
  Loader2,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";

import { Button } from "@/components/ui/button";

import NotificationList from "@/components/notifications/NotificationList";

import {
  useNotifications,
  useMarkAllAsRead,
} from "@/hooks/useNotification";

function NotificationsPage() {
  const {
    data,
    isLoading,
  } = useNotifications();

  const markAllMutation =
    useMarkAllAsRead();

  const notifications =
    data?.data?.notifications || [];

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  const handleMarkAllAsRead = () => {
    if (
      unreadCount === 0 ||
      markAllMutation.isPending
    ) {
      return;
    }

    markAllMutation.mutate();
  };

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
          {/* Decorative glow */}
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
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* Title */}
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                  text-primary
                "
              >
                <Bell className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className="
                      text-2xl
                      font-bold
                      tracking-tight
                      sm:text-3xl
                    "
                  >
                    Notifications
                  </h1>

                  {unreadCount > 0 && (
                    <span
                      className="
                        rounded-full
                        bg-primary
                        px-2
                        py-0.5
                        text-[10px]
                        font-bold
                        text-primary-foreground
                      "
                    >
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}{" "}
                      new
                    </span>
                  )}
                </div>

                <p
                  className="
                    mt-1
                    text-sm
                    text-muted-foreground
                  "
                >
                  Stay updated with activity
                  from your developer network.
                </p>
              </div>
            </div>

            {/* Mark all */}
            <Button
              variant="outline"
              disabled={
                unreadCount === 0 ||
                markAllMutation.isPending
              }
              onClick={
                handleMarkAllAsRead
              }
              className="
                interactive
                gap-2
                rounded-xl
                border-border/60
                bg-background/40
                backdrop-blur-sm
              "
            >
              {markAllMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </>
              )}
            </Button>
          </div>
        </section>

        {/* ================================= */}
        {/* Notifications */}
        {/* ================================= */}

        <section
          className="
            glass-card
            overflow-hidden
            rounded-3xl
          "
        >
          {isLoading ? (
            <NotificationSkeletonList />
          ) : notifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <NotificationList
              notifications={notifications}
            />
          )}
        </section>
      </main>
    </DashboardLayout>
  );
}

/* ====================================
   Loading Skeleton
==================================== */

function NotificationSkeletonList() {
  return (
    <div className="divide-y divide-border/50">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="
              flex
              animate-pulse
              items-center
              gap-4
              p-5
            "
          >
            <div
              className="
                h-11
                w-11
                shrink-0
                rounded-full
                bg-muted
              "
            />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-3/5 rounded-full bg-muted" />
              <div className="h-2.5 w-2/5 rounded-full bg-muted" />
            </div>

            <div className="h-2.5 w-14 rounded-full bg-muted" />
          </div>
        )
      )}
    </div>
  );
}

/* ====================================
   Empty State
==================================== */

function EmptyNotifications() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        px-6
        py-16
        text-center
      "
    >
      <div
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-primary/10
          text-primary
        "
      >
        <Sparkles className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-xl font-bold">
        You're all caught up
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
        No notifications yet. When
        someone interacts with your
        posts or profile, you'll see it
        here.
      </p>
    </div>
  );
}

export default NotificationsPage;