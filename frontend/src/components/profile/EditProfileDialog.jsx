import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateProfile } from "@/hooks/useProfile";

function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}) {
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    github: "",
    linkedin: "",
    website: "",
    skills: "",
  });

  useEffect(() => {
    if (!profile) return;

    setForm({
      fullName: profile.fullName || "",
      bio: profile.bio || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      website: profile.website || "",
      skills: profile.skills?.join(", ") || "",
    });
  }, [profile]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit() {
    updateProfile.mutate(
      {
        ...form,
        skills: form.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />

          <Textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
          />

          <Input
            name="github"
            placeholder="GitHub URL"
            value={form.github}
            onChange={handleChange}
          />

          <Input
            name="linkedin"
            placeholder="LinkedIn URL"
            value={form.linkedin}
            onChange={handleChange}
          />

          <Input
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={handleChange}
          />

          <Input
            name="skills"
            placeholder="React, Node.js, MongoDB"
            value={form.skills}
            onChange={handleChange}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;