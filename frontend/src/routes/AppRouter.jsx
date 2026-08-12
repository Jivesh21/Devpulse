import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import VerifyTwoFactorPage from "@/pages/auth/VerifyTwoFactorPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";

import NotificationsPage from "@/pages/NotificationsPage";
import FeedPage from "@/pages/feed/FeedPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import BookmarksPage from "@/pages/BookmarksPage";
import NetworkPage from "@/pages/NetworkPage";
import ChatPage from "@/pages/ChatPage";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

// ====================================
// Router
// ====================================

const router = createBrowserRouter([
  // ====================================
  // Public Routes
  // ====================================

  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },

  {
    path: "/reset-password/:token",
    element: <ResetPasswordPage />,
  },

  {
    path: "/",
    element: <LoginPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  // ====================================
  // Two-Factor Authentication
  // ====================================

  {
    path: "/verify-2fa",
    element: <VerifyTwoFactorPage />,
  },

  // ====================================
  // Email Verification
  // ====================================

  {
    path: "/verify-email/:token",
    element: <VerifyEmailPage />,
  },

  // ====================================
  // Protected Routes
  // ====================================

  {
    path: "/feed",
    element: (
      <ProtectedRoute>
        <FeedPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/profile/:username",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/network",
    element: (
      <ProtectedRoute>
        <NetworkPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/bookmarks",
    element: (
      <ProtectedRoute>
        <BookmarksPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },

  // ====================================
  // Messages
  // ====================================

  {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ChatPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
]);

// ====================================
// App Router
// ====================================

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;