import { useState } from "react";

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

function getProfileFormState(profile) {
  return {
    fullName: profile.fullName || "",
    bio: profile.bio || "",
    github: profile.github || "",
    linkedin: profile.linkedin || "",
    website: profile.website || "",
    skills: profile.skills?.join(", ") || "",
    experience:
      profile.experience
        ?.map((item) =>
          [
            item.company,
            item.position,
            item.startDate?.slice(0, 4),
            item.endDate?.slice(0, 4),
            item.description,
          ]
            .filter(Boolean)
            .join(" | ")
        )
        .join("\n") || "",
    education:
      profile.education
        ?.map((item) =>
          [
            item.institution,
            item.degree,
            item.fieldOfStudy,
            item.startDate?.slice(0, 4),
            item.endDate?.slice(0, 4),
          ]
            .filter(Boolean)
            .join(" | ")
        )
        .join("\n") || "",
    certificates:
      profile.certificates
        ?.map((item) =>
          [
            item.title,
            item.issuer,
            item.issueDate?.slice(0, 4),
            item.credentialUrl,
          ]
            .filter(Boolean)
            .join(" | ")
        )
        .join("\n") || "",
  };
}

function EditProfileForm({
  profile,
  onOpenChange,
}) {
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState(() =>
    getProfileFormState(profile)
  );

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit() {
    const rows = (value) =>
      value
        .split("\n")
        .map((line) =>
          line.split("|").map((part) => part.trim())
        )
        .filter((parts) => parts.some(Boolean));

    updateProfile.mutate(
      {
        ...form,
        skills: form.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        experience: rows(form.experience).map(
          ([
            company,
            position,
            startDate,
            endDate,
            description,
          ]) => ({
            company,
            position,
            startDate: startDate
              ? `${startDate}-01-01`
              : undefined,
            endDate: endDate
              ? `${endDate}-01-01`
              : undefined,
            description,
          })
        ),
        education: rows(form.education).map(
          ([
            institution,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
          ]) => ({
            institution,
            degree,
            fieldOfStudy,
            startDate: startDate
              ? `${startDate}-01-01`
              : undefined,
            endDate: endDate
              ? `${endDate}-01-01`
              : undefined,
          })
        ),
        certificates: rows(
          form.certificates
        ).map(
          ([
            title,
            issuer,
            issueDate,
            credentialUrl,
          ]) => ({
            title,
            issuer,
            issueDate: issueDate
              ? `${issueDate}-01-01`
              : undefined,
            credentialUrl,
          })
        ),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <>
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
          name="experience"
          placeholder="Experience — one per line: Company | Role | Start year | End year | Description"
          value={form.experience}
          onChange={handleChange}
        />

        <Textarea
          name="education"
          placeholder="Education — one per line: Institution | Degree | Field of study | Start year | End year"
          value={form.education}
          onChange={handleChange}
        />

        <Textarea
          name="certificates"
          placeholder="Certification/Achievement — one per line: Title | Issuer | Issue year | Credential URL"
          value={form.certificates}
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
    </>
  );
}

function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}) {
  const profileId =
    profile?._id || profile?.id;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        {open && profile ? (
          <EditProfileForm
            key={profileId}
            profile={profile}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;
