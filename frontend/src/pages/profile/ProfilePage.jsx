import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Loader2,
  UserRound,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSkills from "@/components/profile/ProfileSkills";
import ProfileCareer from "@/components/profile/ProfileCareer";
import ProfilePosts from "@/components/profile/ProfilePosts";

import PortfolioSection from "@/components/profile/portfolio/PortfolioSection";

import EditProfileDialog from "@/components/profile/EditProfileDialog";
import FollowListDialog from "@/components/profile/FollowListDialog";
import AddProjectDialog from "@/components/profile/portfolio/AddProjectDialog";

import { useAuthContext } from "@/context/AuthContext";

import {
  useProfile,
  useUserPosts,
  useUpdateAvatar,
  useUpdateCoverImage,
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

  const [editOpen, setEditOpen] =
    useState(false);

  const [followersOpen, setFollowersOpen] =
    useState(false);

  const [followingOpen, setFollowingOpen] =
    useState(false);

  const [projectDialogOpen, setProjectDialogOpen] =
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
    followersData?.data
      ?.followersCount || 0;

  const following =
    followingData?.data
      ?.followingCount || 0;

  // ====================================
  // Profile Updates
  // ====================================

  const updateAvatar =
    useUpdateAvatar(username);

  const updateCover =
    useUpdateCoverImage(username);

  const isOwner =
    currentUser?._id === profile?._id;

  // ====================================
  // Avatar Upload
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

    // Allow selecting the same
    // file again later.
    e.target.value = "";
  }

  // ====================================
  // Cover Upload
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
  // Loading
  // ====================================

  if (profileLoading) {
    return (
      <DashboardLayout>
        <div
          className="
            flex
            min-h-[60vh]
            items-center
            justify-center
          "
        >
          <div
            className="
              glass-card
              flex
              flex-col
              items-center
              gap-3
              rounded-2xl
              px-8
              py-10
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                text-primary
              "
            >
              <Loader2
                className="
                  h-6
                  w-6
                  animate-spin
                "
              />
            </div>

            <div className="text-center">
              <p className="font-semibold">
                Loading profile
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Getting everything ready...
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ====================================
  // Profile Not Found
  // ====================================

  if (!profile) {
    return (
      <DashboardLayout>
        <div
          className="
            flex
            min-h-[60vh]
            items-center
            justify-center
          "
        >
          <div
            className="
              glass-card
              flex
              max-w-md
              flex-col
              items-center
              rounded-2xl
              p-10
              text-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-muted
                text-muted-foreground
              "
            >
              <UserRound className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Profile not found
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We couldn't find a developer
              with this username.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="page-enter space-y-6">

        {/* ================================= */}
        {/* Profile Header */}
        {/* ================================= */}

        <section
          className="
            overflow-hidden
            rounded-3xl
          "
        >
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
            onCoverClick={() =>
              coverInputRef.current?.click()
            }
            onEditClick={() =>
              setEditOpen(true)
            }
          />
        </section>

        {/* ================================= */}
        {/* Hidden Upload Inputs */}
        {/* ================================= */}

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

        {/* ================================= */}
        {/* Profile Information */}
        {/* ================================= */}

        <div className="space-y-5">

          {/* Skills */}
          <section
            className="
              glass-card
              glass-hover
              overflow-hidden
            "
          >
            <ProfileSkills
              skills={
                profile.skills || []
              }
            />
          </section>

          {/* Career */}
          <section
            className="
              glass-card
              glass-hover
              overflow-hidden
            "
          >
            <ProfileCareer
              profile={profile}
            />
          </section>

          {/* Portfolio */}
          <section
            className="
              glass-card
              glass-hover
              overflow-hidden
            "
          >
            <PortfolioSection
              userId={profile._id}
              onAddProject={() =>
                setProjectDialogOpen(
                  true
                )
              }
            />
          </section>

          {/* Posts */}
          <section
            className="
              glass-card
              glass-hover
              overflow-hidden
            "
          >
            <ProfilePosts
              posts={posts}
              isLoading={postsLoading}
            />
          </section>

        </div>
      </main>

      {/* ================================= */}
      {/* Edit Profile */}
      {/* ================================= */}

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
      />

      {/* ================================= */}
      {/* Followers */}
      {/* ================================= */}

      <FollowListDialog
        open={followersOpen}
        onOpenChange={setFollowersOpen}
        userId={profile._id}
        type="followers"
      />

      {/* ================================= */}
      {/* Following */}
      {/* ================================= */}

      <FollowListDialog
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        userId={profile._id}
        type="following"
      />

      {/* ================================= */}
      {/* Add Project */}
      {/* ================================= */}

      <AddProjectDialog
        open={projectDialogOpen}
        onOpenChange={
          setProjectDialogOpen
        }
        userId={profile._id}
      />
    </DashboardLayout>
  );
}

export default ProfilePage;