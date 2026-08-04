import NotificationItem from "./NotificationItem";

function NotificationList({
  notifications = [],
}) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
        />
      ))}
    </div>
  );
}

export default NotificationList;