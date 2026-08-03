import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createNotificationService,
  getNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  getUnreadNotificationsCountService,
  deleteNotificationService,
} from "../services/notification.service.js";

// ====================================
// Create Notification
// ====================================
export const createNotification = asyncHandler(async (req, res) => {
  const notification = await createNotificationService({
    recipient: req.body.recipient,
    sender: req.user._id,
    type: req.body.type,
    post: req.body.post,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      notification,
      "Notification created successfully"
    )
  );
});

// ====================================
// Get Notifications
// ====================================
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const notifications = await getNotificationsService(
    req.user._id,
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      notifications,
      "Notifications fetched successfully"
    )
  );
});

// ====================================
// Mark Notification as Read
// ====================================
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsReadService(
    req.params.notificationId,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      notification,
      "Notification marked as read"
    )
  );
});

// ====================================
// Mark All Notifications as Read
// ====================================
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const result = await markAllNotificationsAsReadService(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "All notifications marked as read"
    )
  );
});

// ====================================
// Get Unread Notifications Count
// ====================================
export const getUnreadNotificationsCount = asyncHandler(async (req, res) => {
  const result = await getUnreadNotificationsCountService(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Unread notifications count fetched successfully"
    )
  );
});

// ====================================
// Delete Notification
// ====================================
export const deleteNotification = asyncHandler(async (req, res) => {
  const result = await deleteNotificationService(
    req.params.notificationId,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Notification deleted successfully"
    )
  );
});