import api from "@/api/axios";

// ===============================
// Get Notifications
// ===============================
export const getNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data;
};

// ===============================
// Get Unread Count
// ===============================
export const getUnreadCount = async () => {
  const { data } = await api.get(
    "/notifications/unread-count"
  );

  return data;
};

// ===============================
// Mark Notification as Read
// ===============================
export const markAsRead = async (
  notificationId
) => {
  const { data } = await api.patch(
    `/notifications/${notificationId}/read`
  );

  return data;
};

// ===============================
// Mark All as Read
// ===============================
export const markAllAsRead = async () => {
  const { data } = await api.patch(
    "/notifications/read-all"
  );

  return data;
};

// ===============================
// Delete Notification
// ===============================
export const deleteNotification = async (
  notificationId
) => {
  const { data } = await api.delete(
    `/notifications/${notificationId}`
  );

  return data;
};