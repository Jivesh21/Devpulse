import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Github,
  Globe,
  Info,
  Linkedin,
  Loader2,
  Save,
  UserRound,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useAuthContext } from "@/context/AuthContext";
import { useUpdateProfile } from "@/hooks/useProfile";

const settingsFormSchema = z.object({
  bio: z
    .string()
    .max(
      250,
      "Bio cannot exceed 250 characters"
    )
    .optional()
    .or(z.literal("")),

  skills: z
    .string()
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .optional()
    .or(z.literal("")),

  github: z
    .string()
    .optional()
    .or(z.literal("")),

  linkedin: z
    .string()
    .optional()
    .or(z.literal("")),
});

function SettingsPage() {
  const {
    user,
  } = useAuthContext();

  const updateProfileMutation =
    useUpdateProfile();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isDirty,
    },
  } = useForm({
    resolver:
      zodResolver(
        settingsFormSchema
      ),

    defaultValues: {
      bio: "",
      skills: "",
      website: "",
      github: "",
      linkedin: "",
    },
  });

  /*
   * User information may arrive after the
   * first render. Reset the form when it does.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      bio: user.bio || "",

      skills: user.skills
        ? user.skills.join(", ")
        : "",

      website:
        user.website || "",

      github:
        user.github || "",

      linkedin:
        user.linkedin || "",
    });
  }, [user, reset]);

  const bioValue =
    watch("bio") || "";

  const onSubmit = async (data) => {
    try {
      const skillsArray = data.skills
        ? data.skills
            .split(",")
            .map((skill) =>
              skill.trim()
            )
            .filter(
              (skill) =>
                skill !== ""
            )
        : [];

      const payload = {
        bio: data.bio,
        skills: skillsArray,
        website: data.website,
        github: data.github,
        linkedin: data.linkedin,
      };

      await updateProfileMutation.mutateAsync(
        payload
      );

      toast.success(
        "Profile updated successfully!"
      );

      if (user?.username) {
        navigate(
          `/profile/${user.username}`
        );
      } else {
        navigate("/feed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile settings"
      );
    }
  };

  const handleCancel = () => {
    if (user) {
      reset({
        bio: user.bio || "",

        skills: user.skills
          ? user.skills.join(", ")
          : "",

        website:
          user.website || "",

        github:
          user.github || "",

        linkedin:
          user.linkedin || "",
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <DashboardLayout>
      <main className="page-enter space-y-6">

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <section
          className="
            glass-card
            glass-hover
            relative
            overflow-hidden
            rounded-3xl
            p-6
            sm:p-8
          "
        >
          {/* Decorative glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-64
              w-64
              rounded-full
              bg-primary/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              items-center
              gap-4
            "
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(-1)
              }
              className="
                h-10
                w-10
                shrink-0
                rounded-xl
                transition-all
                duration-200
                hover:bg-primary/10
                hover:text-primary
              "
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                text-primary
              "
            >
              <UserRound className="h-6 w-6" />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  sm:text-3xl
                "
              >
                Profile Settings
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Customize your developer
                identity on DevPulse.
              </p>
            </div>
          </div>
        </section>

        {/* ================================= */}
        {/* Form */}
        {/* ================================= */}

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-6"
        >
          {/* ================================= */}
          {/* Profile Details */}
          {/* ================================= */}

          <section
            className="
              glass-card
              overflow-hidden
              rounded-3xl
            "
          >
            <div
              className="
                border-b
                border-border/50
                p-6
                sm:p-7
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Info className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Profile Details
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    This information will be
                    visible on your public
                    developer profile.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-7">

              {/* Bio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio">
                    Bio
                  </Label>

                  <span
                    className={`
                      text-xs
                      ${
                        bioValue.length >
                        225
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    {bioValue.length}/250
                  </span>
                </div>

                <Textarea
                  id="bio"
                  rows={5}
                  placeholder="Tell other developers about yourself, what you are building, or what tech you love..."
                  className="
                    resize-none
                    rounded-xl
                    bg-background/40
                    transition-all
                    duration-200
                    focus-visible:ring-primary/30
                  "
                  {...register("bio")}
                />

                {errors.bio && (
                  <p className="text-sm text-destructive">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />

                  <Label htmlFor="skills">
                    Skills
                  </Label>
                </div>

                <Input
                  id="skills"
                  placeholder="React, Node.js, Express, TypeScript, Python"
                  className="
                    h-11
                    rounded-xl
                    bg-background/40
                  "
                  {...register("skills")}
                />

                <p className="text-xs text-muted-foreground">
                  Separate technologies with
                  commas.
                </p>

                {errors.skills && (
                  <p className="text-sm text-destructive">
                    {errors.skills.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ================================= */}
          {/* Social Links */}
          {/* ================================= */}

          <section
            className="
              glass-card
              overflow-hidden
              rounded-3xl
            "
          >
            <div
              className="
                border-b
                border-border/50
                p-6
                sm:p-7
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <ExternalLink className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Social & Professional Links
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Help other developers find
                    your work online.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6 sm:p-7">

              {/* Website */}
              <LinkField
                id="website"
                label="Personal Website"
                icon={Globe}
                placeholder="https://johndoe.dev"
                register={register}
                error={errors.website}
              />

              {/* GitHub */}
              <LinkField
                id="github"
                label="GitHub Profile"
                icon={Github}
                placeholder="https://github.com/johndoe"
                register={register}
                error={errors.github}
              />

              {/* LinkedIn */}
              <LinkField
                id="linkedin"
                label="LinkedIn Profile"
                icon={Linkedin}
                placeholder="https://linkedin.com/in/johndoe"
                register={register}
                error={errors.linkedin}
              />
            </div>
          </section>

          {/* ================================= */}
          {/* Actions */}
          {/* ================================= */}

          <div
            className="
              glass-card
              flex
              flex-col-reverse
              gap-3
              rounded-2xl
              p-4
              sm:flex-row
              sm:justify-end
            "
          >
            <Button
              type="button"
              variant="outline"
              className="
                interactive
                h-11
                rounded-xl
              "
              onClick={handleCancel}
              disabled={
                updateProfileMutation.isPending
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                updateProfileMutation.isPending ||
                !isDirty
              }
              className="
                interactive
                h-11
                gap-2
                rounded-xl
                px-6
                shadow-md
                shadow-primary/15
              "
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </DashboardLayout>
  );
}

/* ====================================
   Link Field
==================================== */

function LinkField({
  id,
  label,
  icon: Icon,
  placeholder,
  register,
  error,
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="flex items-center gap-2"
      >
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </Label>

      <Input
        id={id}
        placeholder={placeholder}
        className="
          h-11
          rounded-xl
          bg-background/40
          transition-all
          duration-200
          focus-visible:ring-primary/30
        "
        {...register(id)}
      />

      {error && (
        <p className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default SettingsPage;