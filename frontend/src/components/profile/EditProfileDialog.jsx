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
import RichTextEditor from "@/components/ui/RichTextEditor";

import {
  Plus,
  Trash2,
} from "lucide-react";

import { useUpdateProfile } from "@/hooks/useProfile";

// ====================================
// Helpers
// ====================================

function getProfileFormState(profile) {
  return {
    fullName: profile.fullName || "",
    bio: profile.bio || "",
    github: profile.github || "",
    linkedin: profile.linkedin || "",
    website: profile.website || "",
    skills:
      profile.skills?.join(", ") || "",

    experience:
      profile.experience?.map(
        (item) => ({
          company: item.company || "",
          position: item.position || "",
          startDate:
            item.startDate
              ?.slice(0, 10) || "",
          endDate:
            item.endDate
              ?.slice(0, 10) || "",
          currentlyWorking:
            item.currentlyWorking || false,
          location:
            item.location || "",
          description:
            item.description || "",
        })
      ) || [],

    education:
      profile.education?.map(
        (item) => ({
          institution:
            item.institution || "",
          degree:
            item.degree || "",
          fieldOfStudy:
            item.fieldOfStudy || "",
          startDate:
            item.startDate
              ?.slice(0, 10) || "",
          endDate:
            item.endDate
              ?.slice(0, 10) || "",
          grade:
            item.grade || "",
          description:
            item.description || "",
        })
      ) || [],

    certificates:
      profile.certificates?.map(
        (item) => ({
          title:
            item.title || "",
          issuer:
            item.issuer || "",
          issueDate:
            item.issueDate
              ?.slice(0, 10) || "",
          credentialUrl:
            item.credentialUrl || "",
        })
      ) || [],
  };
}

// ====================================
// Empty Experience
// ====================================

function createEmptyExperience() {
  return {
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    location: "",
    description: "",
  };
}

// ====================================
// Empty Education
// ====================================

function createEmptyEducation() {
  return {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
  };
}

// ====================================
// Empty Certificate
// ====================================

function createEmptyCertificate() {
  return {
    title: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
  };
}

// ====================================
// Edit Profile Form
// ====================================

function EditProfileForm({
  profile,
  onOpenChange,
}) {
  const updateProfile =
    useUpdateProfile();

  const [form, setForm] =
    useState(() =>
      getProfileFormState(profile)
    );

  // ====================================
  // Basic Input Change
  // ====================================

  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ====================================
  // Experience Change
  // ====================================

  function handleExperienceChange(
    index,
    field,
    value
  ) {
    setForm((prev) => {
      const experience = [
        ...prev.experience,
      ];

      experience[index] = {
        ...experience[index],
        [field]: value,
      };

      return {
        ...prev,
        experience,
      };
    });
  }

  // ====================================
  // Add Experience
  // ====================================

  function addExperience() {
    setForm((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        createEmptyExperience(),
      ],
    }));
  }

  // ====================================
  // Remove Experience
  // ====================================

  function removeExperience(index) {
    setForm((prev) => ({
      ...prev,
      experience:
        prev.experience.filter(
          (_, i) => i !== index
        ),
    }));
  }

  // ====================================
  // Education Change
  // ====================================

  function handleEducationChange(
    index,
    field,
    value
  ) {
    setForm((prev) => {
      const education = [
        ...prev.education,
      ];

      education[index] = {
        ...education[index],
        [field]: value,
      };

      return {
        ...prev,
        education,
      };
    });
  }

  // ====================================
  // Add Education
  // ====================================

  function addEducation() {
    setForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        createEmptyEducation(),
      ],
    }));
  }

  // ====================================
  // Remove Education
  // ====================================

  function removeEducation(index) {
    setForm((prev) => ({
      ...prev,
      education:
        prev.education.filter(
          (_, i) => i !== index
        ),
    }));
  }

  // ====================================
  // Certificate Change
  // ====================================

  function handleCertificateChange(
    index,
    field,
    value
  ) {
    setForm((prev) => {
      const certificates = [
        ...prev.certificates,
      ];

      certificates[index] = {
        ...certificates[index],
        [field]: value,
      };

      return {
        ...prev,
        certificates,
      };
    });
  }

  // ====================================
  // Add Certificate
  // ====================================

  function addCertificate() {
    setForm((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        createEmptyCertificate(),
      ],
    }));
  }

  // ====================================
  // Remove Certificate
  // ====================================

  function removeCertificate(index) {
    setForm((prev) => ({
      ...prev,
      certificates:
        prev.certificates.filter(
          (_, i) => i !== index
        ),
    }));
  }

  // ====================================
  // Submit
  // ====================================

  function handleSubmit(e) {
    e.preventDefault();

    updateProfile.mutate(
      {
        fullName: form.fullName,
        bio: form.bio,

        github: form.github,
        linkedin: form.linkedin,
        website: form.website,

        skills: form.skills
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean),

        // ============================
        // Experience
        // ============================

        experience:
          form.experience.map(
            (item) => ({
              company:
                item.company.trim(),

              position:
                item.position.trim(),

              startDate:
                item.startDate ||
                undefined,

              endDate:
                item.currentlyWorking
                  ? undefined
                  : item.endDate ||
                    undefined,

              currentlyWorking:
                item.currentlyWorking,

              location:
                item.location.trim(),

              description:
                item.description,
            })
          ),

        // ============================
        // Education
        // ============================

        education:
          form.education.map(
            (item) => ({
              institution:
                item.institution.trim(),

              degree:
                item.degree.trim(),

              fieldOfStudy:
                item.fieldOfStudy.trim(),

              startDate:
                item.startDate ||
                undefined,

              endDate:
                item.endDate ||
                undefined,

              grade:
                item.grade.trim(),

              description:
                item.description.trim(),
            })
          ),

        // ============================
        // Certificates
        // ============================

        certificates:
          form.certificates.map(
            (item) => ({
              title:
                item.title.trim(),

              issuer:
                item.issuer.trim(),

              issueDate:
                item.issueDate ||
                undefined,

              credentialUrl:
                item.credentialUrl.trim(),
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
    <form
      onSubmit={handleSubmit}
      className="
        max-h-[75vh]
        space-y-6
        overflow-y-auto
        pr-2
      "
    >
      {/* ================================= */}
      {/* Basic Information */}
      {/* ================================= */}

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">
            Basic Information
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Keep your developer profile clear
            and professional.
          </p>
        </div>

        <Input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Tell developers about yourself..."
          value={form.bio}
          onChange={handleChange}
          rows={4}
          className="
            flex
            w-full
            rounded-xl
            border
            border-input
            bg-background
            px-3
            py-2
            text-sm
            outline-none
            placeholder:text-muted-foreground
            focus:border-primary
            focus:ring-2
            focus:ring-primary/10
          "
        />

        <Input
          name="skills"
          placeholder="React, Node.js, MongoDB"
          value={form.skills}
          onChange={handleChange}
        />
      </section>

      {/* ================================= */}
      {/* Experience */}
      {/* ================================= */}

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">
              Experience
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Add your work experience and
              describe your responsibilities.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExperience}
            className="shrink-0 rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        {form.experience.length === 0 && (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-border
              px-4
              py-8
              text-center
              text-sm
              text-muted-foreground
            "
          >
            No experience added yet.
          </div>
        )}

        {form.experience.map(
          (experience, index) => (
            <div
              key={index}
              className="
                space-y-4
                rounded-2xl
                border
                border-border
                bg-muted/10
                p-4
              "
            >
              {/* Experience Header */}

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  Experience {index + 1}
                </h4>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeExperience(
                      index
                    )
                  }
                  className="
                    text-destructive
                    hover:bg-destructive/10
                    hover:text-destructive
                  "
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Company */}

              <Input
                placeholder="Company"
                value={
                  experience.company
                }
                onChange={(e) =>
                  handleExperienceChange(
                    index,
                    "company",
                    e.target.value
                  )
                }
              />

              {/* Position */}

              <Input
                placeholder="Position / Role"
                value={
                  experience.position
                }
                onChange={(e) =>
                  handleExperienceChange(
                    index,
                    "position",
                    e.target.value
                  )
                }
              />

              {/* Dates */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Start Date
                  </label>

                  <Input
                    type="date"
                    value={
                      experience.startDate
                    }
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "startDate",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    End Date
                  </label>

                  <Input
                    type="date"
                    disabled={
                      experience.currentlyWorking
                    }
                    value={
                      experience.endDate
                    }
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "endDate",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* Currently Working */}

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  text-sm
                "
              >
                <input
                  type="checkbox"
                  checked={
                    experience.currentlyWorking
                  }
                  onChange={(e) =>
                    handleExperienceChange(
                      index,
                      "currentlyWorking",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 accent-primary"
                />

                <span>
                  I currently work here
                </span>
              </label>

              {/* Location */}

              <Input
                placeholder="Location (e.g. Remote, Ambala, India)"
                value={
                  experience.location
                }
                onChange={(e) =>
                  handleExperienceChange(
                    index,
                    "location",
                    e.target.value
                  )
                }
              />

              {/* Rich Description */}

              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">
                    Responsibilities &
                    Achievements
                  </label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Use bullets, bold text or
                    headings to make your
                    experience resume-ready.
                  </p>
                </div>

                <RichTextEditor
                  value={
                    experience.description
                  }
                  onChange={(value) =>
                    handleExperienceChange(
                      index,
                      "description",
                      value
                    )
                  }
                  placeholder="Describe your responsibilities, achievements and impact..."
                />
              </div>
            </div>
          )
        )}
      </section>

      {/* ================================= */}
      {/* Education */}
      {/* ================================= */}

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">
              Education
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Add your academic background.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEducation}
            className="shrink-0 rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        {form.education.map(
          (education, index) => (
            <div
              key={index}
              className="
                space-y-4
                rounded-2xl
                border
                border-border
                bg-muted/10
                p-4
              "
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  Education {index + 1}
                </h4>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeEducation(
                      index
                    )
                  }
                  className="
                    text-destructive
                    hover:bg-destructive/10
                    hover:text-destructive
                  "
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Input
                placeholder="Institution"
                value={
                  education.institution
                }
                onChange={(e) =>
                  handleEducationChange(
                    index,
                    "institution",
                    e.target.value
                  )
                }
              />

              <Input
                placeholder="Degree"
                value={
                  education.degree
                }
                onChange={(e) =>
                  handleEducationChange(
                    index,
                    "degree",
                    e.target.value
                  )
                }
              />

              <Input
                placeholder="Field of Study"
                value={
                  education.fieldOfStudy
                }
                onChange={(e) =>
                  handleEducationChange(
                    index,
                    "fieldOfStudy",
                    e.target.value
                  )
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="date"
                  value={
                    education.startDate
                  }
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "startDate",
                      e.target.value
                    )
                  }
                />

                <Input
                  type="date"
                  value={
                    education.endDate
                  }
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "endDate",
                      e.target.value
                    )
                  }
                />
              </div>

              <Input
                placeholder="Grade / CGPA"
                value={
                  education.grade
                }
                onChange={(e) =>
                  handleEducationChange(
                    index,
                    "grade",
                    e.target.value
                  )
                }
              />
            </div>
          )
        )}
      </section>

      {/* ================================= */}
      {/* Certificates */}
      {/* ================================= */}

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">
              Certificates
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Showcase certifications and
              achievements.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={
              addCertificate
            }
            className="shrink-0 rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        {form.certificates.map(
          (certificate, index) => (
            <div
              key={index}
              className="
                space-y-4
                rounded-2xl
                border
                border-border
                bg-muted/10
                p-4
              "
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  Certificate{" "}
                  {index + 1}
                </h4>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeCertificate(
                      index
                    )
                  }
                  className="
                    text-destructive
                    hover:bg-destructive/10
                    hover:text-destructive
                  "
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Input
                placeholder="Certificate Title"
                value={
                  certificate.title
                }
                onChange={(e) =>
                  handleCertificateChange(
                    index,
                    "title",
                    e.target.value
                  )
                }
              />

              <Input
                placeholder="Issuer"
                value={
                  certificate.issuer
                }
                onChange={(e) =>
                  handleCertificateChange(
                    index,
                    "issuer",
                    e.target.value
                  )
                }
              />

              <Input
                type="date"
                value={
                  certificate.issueDate
                }
                onChange={(e) =>
                  handleCertificateChange(
                    index,
                    "issueDate",
                    e.target.value
                  )
                }
              />

              <Input
                type="url"
                placeholder="Credential URL"
                value={
                  certificate.credentialUrl
                }
                onChange={(e) =>
                  handleCertificateChange(
                    index,
                    "credentialUrl",
                    e.target.value
                  )
                }
              />
            </div>
          )
        )}
      </section>

      {/* ================================= */}
      {/* Social Links */}
      {/* ================================= */}

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">
            Links
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Add links recruiters can use to
            find your work.
          </p>
        </div>

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
          placeholder="Personal Website URL"
          value={form.website}
          onChange={handleChange}
        />
      </section>

      {/* ================================= */}
      {/* Save */}
      {/* ================================= */}

      <DialogFooter>
        <Button
          type="submit"
          disabled={
            updateProfile.isPending
          }
          className="rounded-xl"
        >
          {updateProfile.isPending
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ====================================
// Dialog
// ====================================

function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}) {
  if (!profile) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-h-[90vh]
          overflow-hidden
          rounded-2xl
          sm:max-w-3xl
        "
      >
        <DialogHeader>
          <DialogTitle>
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <EditProfileForm
          profile={profile}
          onOpenChange={
            onOpenChange
          }
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;