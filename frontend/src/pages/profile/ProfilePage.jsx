import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PortfolioSection from "@/components/profile/portfolio/PortfolioSection";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSkills from "@/components/profile/ProfileSkills";
import ProfilePosts from "@/components/profile/ProfilePosts";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import FollowListDialog from "@/components/profile/FollowListDialog";

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

  const { user: currentUser } = useAuthContext();

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [editOpen, setEditOpen] = useState(false);
  const [followersOpen, setFollowersOpen] =
    useState(false);
  const [followingOpen, setFollowingOpen] =
    useState(false);

  const {
    data: profileData,
    isLoading: profileLoading,
  } = useProfile(username);

  const {
    data: postsData,
    isLoading: postsLoading,
  } = useUserPosts(username);

  const profile = profileData?.data;
  const posts = postsData?.data || [];

  const { data: followersData } =
    useFollowersCount(profile?._id);

  const { data: followingData } =
    useFollowingCount(profile?._id);

  const followers =
    followersData?.data?.followersCount || 0;

  const following =
    followingData?.data?.followingCount || 0;

  const updateAvatar =
    useUpdateAvatar(username);

  const updateCover =
    useUpdateCoverImage(username);

  const isOwner =
    currentUser?._id === profile?._id;

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("avatar", file);

    updateAvatar.mutate(formData);
  }

  function handleCoverChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("coverImage", file);

    updateCover.mutate(formData);
  }

  if (profileLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border bg-card p-12 text-center">
          Profile not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

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
            avatarInputRef.current.click()
          }
          onCoverClick={() =>
            coverInputRef.current.click()
          }
          onEditClick={() =>
            setEditOpen(true)
          }
        />

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

        <ProfileSkills
          skills={profile.skills}
        />
<ProfileSkills skills={profile.skills} />

<PortfolioSection userId={profile._id} />

<ProfilePosts
  posts={posts}
  isLoading={postsLoading}
/>
        <ProfilePosts
          posts={posts}
          isLoading={postsLoading}
        />

      </div>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
      />

      <FollowListDialog
        open={followersOpen}
        onOpenChange={setFollowersOpen}
        userId={profile._id}
        type="followers"
      />

      <FollowListDialog
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        userId={profile._id}
        type="following"
      />

    </DashboardLayout>
  );
}

export default ProfilePage;