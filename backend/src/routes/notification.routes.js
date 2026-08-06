import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();

// ====================================
// Get Notifications
// ====================================
router.get("/", verifyJWT, getNotifications);

// ====================================
// Get Unread Notifications Count
// ====================================
router.get(
  "/unread-count",
  verifyJWT,
  getUnreadNotificationsCount
);

// ====================================
// Create Notification
// ====================================
router.post("/", verifyJWT, createNotification);

// ====================================
// Mark All Notifications as Read
// ====================================
router.patch(
  "/read-all",
  verifyJWT,
  markAllNotificationsAsRead
);

// ====================================
// Mark Notification as Read
// ====================================
router.patch(
  "/:notificationId/read",
  verifyJWT,
  markNotificationAsRead
);

// ====================================
// Delete Notification
// ====================================
router.delete(
  "/:notificationId",
  verifyJWT,
  deleteNotification
);

export default router;