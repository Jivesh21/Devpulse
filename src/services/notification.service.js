import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

// ====================================
// Create Notification
// ====================================
export const createNotificationService = async ({
  recipient,
  sender,
  type,
  post = null,
}) => {
  const recipientUser = await User.findById(recipient);

  if (!recipientUser) {
    throw new ApiError(404, "Recipient not found");
  }

  const senderUser = await User.findById(sender);

  if (!senderUser) {
    throw new ApiError(404, "Sender not found");
  }

  // Don't notify yourself
  if (recipient.toString() === sender.toString()) {
    return null;
  }

  const notification = await Notification.create({
    recipient,
    sender,
    type,
    post,
  });

  return notification;
};

// ====================================
// Get Notifications
// ====================================
export const getNotificationsService = async (
  userId,
  page = 1,
  limit = 10
) => {
  const skip =
    (Number(page) - 1) * Number(limit);

  const notifications = await Notification.find({
    recipient: userId,
  })
    .populate(
      "sender",
      "fullName username avatar"
    )
    .populate(
      "post",
      "content image"
    )
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(Number(limit));

  const totalNotifications =
    await Notification.countDocuments({
      recipient: userId,
    });

  return {
    notifications,
    totalNotifications,
    currentPage: Number(page),
    totalPages: Math.ceil(
      totalNotifications / Number(limit)
    ),
  };
};
// ====================================
// Mark Notification as Read
// ====================================
export const markNotificationAsReadService = async (
  notificationId,
  userId
) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new ApiError(
      404,
      "Notification not found"
    );
  }

  notification.isRead = true;

  await notification.save();

  return notification;
};
// ====================================
// Mark All Notifications as Read
// ====================================
export const markAllNotificationsAsReadService = async (
  userId
) => {
  await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );

  return {
    success: true,
  };
};
// ====================================
// Get Unread Notifications Count
// ====================================
export const getUnreadNotificationsCountService = async (
  userId
) => {
  const unreadCount =
    await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

  return {
    unreadCount,
  };
};
// ====================================
// Delete Notification
// ====================================
export const deleteNotificationService = async (
  notificationId,
  userId
) => {
  const notification =
    await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

  if (!notification) {
    throw new ApiError(
      404,
      "Notification not found"
    );
  }

  return {
    deleted: true,
  };
};