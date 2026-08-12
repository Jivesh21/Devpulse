import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSkills from "@/components/profile/ProfileSkills";
import ProfileCareer from "@/components/profile/ProfileCareer";
import ProfilePosts from "@/components/profile/ProfilePosts";
import ProfileGitHub from "@/components/profile/ProfileGitHub";
import PortfolioSection from "@/components/profile/portfolio/PortfolioSection";

import EditProfileDialog from "@/components/profile/EditProfileDialog";
import FollowListDialog from "@/components/profile/FollowListDialog";
import AddProjectDialog from "@/components/profile/portfolio/AddProjectDialog";
import ResumeLayoutDialog from "@/components/profile/resume/ResumeLayoutDialog";

import { useAuthContext } from "@/context/AuthContext";

import {
  useProfile,
  useUserPosts,
  useUpdateAvatar,
  useUpdateCoverImage,
  useRemoveAvatar,
  useRemoveCoverImage,
} from "@/hooks/useProfile";

import {
  useFollowersCount,
  useFollowingCount,
} from "@/hooks/useFollow";

function ProfilePage() {
  const { username } = useParams();

  const { user: currentUser } =
    useAuthContext();

  const avatarInputRef =
    useRef(null);

  const coverInputRef =
    useRef(null);

  // ====================================
  // Dialog State
  // ====================================

  const [editOpen, setEditOpen] =
    useState(false);

  const [followersOpen, setFollowersOpen] =
    useState(false);

  const [followingOpen, setFollowingOpen] =
    useState(false);

  const [projectDialogOpen, setProjectDialogOpen] =
    useState(false);

  const [resumeOpen, setResumeOpen] =
    useState(false);

  // ====================================
  // Profile
  // ====================================

  const {
    data: profileData,
    isLoading: profileLoading,
  } = useProfile(username);

  const {
    data: postsData,
    isLoading: postsLoading,
  } = useUserPosts(username);

  const profile =
    profileData?.data;

  const posts =
    postsData?.data || [];

  // ====================================
  // Follow Counts
  // ====================================

  const {
    data: followersData,
  } = useFollowersCount(
    profile?._id
  );

  const {
    data: followingData,
  } = useFollowingCount(
    profile?._id
  );

  const followers =
    followersData?.data?.followersCount || 0;

  const following =
    followingData?.data?.followingCount || 0;

  // ====================================
  // Profile Updates
  // ====================================

  const updateAvatar =
    useUpdateAvatar(username);

  const updateCover =
    useUpdateCoverImage(username);

  const removeAvatar =
    useRemoveAvatar(username);

  const removeCover =
    useRemoveCoverImage(username);

  const isOwner =
    currentUser?._id === profile?._id;

  // ====================================
  // Avatar
  // ====================================

  function handleAvatarChange(e) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      "avatar",
      file
    );

    updateAvatar.mutate(formData);

    e.target.value = "";
  }

  // ====================================
  // Remove Avatar
  // ====================================

  function handleAvatarRemove() {
    if (
      removeAvatar.isPending
    ) {
      return;
    }

    removeAvatar.mutate();
  }

  // ====================================
  // Cover
  // ====================================

  function handleCoverChange(e) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      "coverImage",
      file
    );

    updateCover.mutate(formData);

    e.target.value = "";
  }

  // ====================================
  // Remove Cover
  // ====================================

  function handleCoverRemove() {
    if (
      removeCover.isPending
    ) {
      return;
    }

    removeCover.mutate();
  }

  // ====================================
  // Loading
  // ====================================

  if (profileLoading) {
    return (
      <DashboardLayout>
        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <p className="font-semibold">
                Loading profile
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Getting everything ready...
              </p>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  // ====================================
  // Not Found
  // ====================================

  if (!profile) {
    return (
      <DashboardLayout>
        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <h2 className="mt-5 text-xl font-bold">
                Profile not found
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We couldn't find a developer
                with this username.
              </p>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">

        {/* ====================================
            Profile Header
        ==================================== */}

        <ProfileHeader
          profile={profile}
          isOwner={isOwner}
          postsCount={posts.length}
          followers={followers}
          following={following}

          onFollowersClick={() =>
            setFollowersOpen(true)
          }

          onFollowingClick={() =>
            setFollowingOpen(true)
          }

          onAvatarClick={() =>
            avatarInputRef.current?.click()
          }

          onAvatarRemove={
            handleAvatarRemove
          }

          onCoverClick={() =>
            coverInputRef.current?.click()
          }

          onCoverRemove={
            handleCoverRemove
          }

          onEditClick={() =>
            setEditOpen(true)
          }

          onDownloadResume={() =>
            setResumeOpen(true)
          }
        />

        {/* ====================================
            Upload Inputs
        ==================================== */}

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />

        {/* ====================================
            Profile Sections
        ==================================== */}

        <div className="mt-5 space-y-5">

          <ProfileSkills
            skills={profile.skills || []}
          />

          <ProfileCareer
            profile={profile}
          />

          {/* ====================================
              Public GitHub
          ==================================== */}

          <ProfileGitHub
            username={
              profile.githubIntegration?.connected
                ? profile.githubIntegration.username
                : null
            }
          />

          <PortfolioSection
            userId={profile._id}
            onAddProject={() =>
              setProjectDialogOpen(true)
            }
          />

          <ProfilePosts
            posts={posts}
            isLoading={postsLoading}
          />

        </div>
      </main>

      {/* ====================================
          Edit Profile
      ==================================== */}

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
      />

      {/* ====================================
          Followers
      ==================================== */}

      <FollowListDialog
        open={followersOpen}
        onOpenChange={setFollowersOpen}
        userId={profile._id}
        type="followers"
      />

      {/* ====================================
          Following
      ==================================== */}

      <FollowListDialog
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        userId={profile._id}
        type="following"
      />

      {/* ====================================
          Add Project
      ==================================== */}

      <AddProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        userId={profile._id}
      />

      {/* ====================================
          Resume Layout
      ==================================== */}

      <ResumeLayoutDialog
        open={resumeOpen}
        onOpenChange={setResumeOpen}
        profile={profile}
      />

    </DashboardLayout>
  );
}

export default ProfilePage;