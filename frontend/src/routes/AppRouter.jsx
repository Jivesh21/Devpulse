import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import NotificationsPage from "../pages/NotificationsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import FeedPage from "../pages/feed/FeedPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/settings/SettingsPage";
import BookmarksPage from "../pages/BookmarksPage";
import NetworkPage from "../pages/NetworkPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import VerifyEmailPage from "@/pages/VerifyEmailPage";

function PlaceholderPage({ title }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-12 text-center shadow-sm">
        <h2 className="mb-2 text-2xl font-bold">
          {title} Page
        </h2>

        <p className="text-muted-foreground">
          This feature is currently under construction.
          Stay tuned!
        </p>
      </div>
    </DashboardLayout>
  );
}

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
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;