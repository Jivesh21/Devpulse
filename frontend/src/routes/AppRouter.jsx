import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import NotificationsPage from "../pages/NotificationsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import FeedPage from "../pages/feed/FeedPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/settings/SettingsPage";
import BookmarksPage from "../pages/BookmarksPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

function PlaceholderPage({ title }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-12 text-center shadow-sm">
        <h2 className="text-2xl font-bold mb-2">{title} Page</h2>
        <p className="text-muted-foreground">This feature is currently under construction. Stay tuned!</p>
      </div>
    </DashboardLayout>
  );
}

const router = createBrowserRouter([
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
        <PlaceholderPage title="Network" />
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
