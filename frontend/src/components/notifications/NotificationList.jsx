import NotificationItem from "./NotificationItem";

function NotificationList({
  notifications = [],
}) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-border/50">
      {notifications.map(
        (notification, index) => (
          <div
            key={notification._id}
            className="
              page-enter
              transition-colors
              duration-200
              hover:bg-muted/20
            "
            style={{
              animationDelay: `${Math.min(
                index * 50,
                300
              )}ms`,
            }}
          >
            <NotificationItem
              notification={notification}
            />
          </div>
        )
      )}
    </div>
  );
}

export default NotificationList;