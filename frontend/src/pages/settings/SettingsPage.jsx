import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Check,
  Code2,
  ExternalLink,
  Globe,
  Info,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  Palette,
  Save,
  ShieldCheck,
  UserCog,
  UserRound,
} from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useAuthContext } from "@/context/AuthContext";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useLogout } from "@/hooks/useAuth";

import AppearanceMenu from "@/components/Theme/AppearanceMenu";

const settingsFormSchema = z.object({
  bio: z
    .string()
    .max(250, "Bio cannot exceed 250 characters")
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

const SETTINGS_ITEMS = [
  {
    id: "profile",
    label: "Profile",
    description: "Public identity",
    icon: UserRound,
  },
  {
    id: "account",
    label: "Account",
    description: "Account information",
    icon: UserCog,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme preferences",
    icon: Palette,
  },
  {
    id: "security",
    label: "Security",
    description: "Password & security",
    icon: ShieldCheck,
  },
];

function SettingsPage() {
  const { user } = useAuthContext();

  const navigate = useNavigate();

  const updateProfileMutation =
    useUpdateProfile();

  const logoutMutation =
    useLogout();

  const [activeSection, setActiveSection] =
    useState("account");

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
    resolver: zodResolver(settingsFormSchema),

    defaultValues: {
      bio: "",
      skills: "",
      website: "",
      github: "",
      linkedin: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      bio: user.bio || "",

      skills: user.skills
        ? user.skills.join(", ")
        : "",

      website: user.website || "",

      github: user.github || "",

      linkedin: user.linkedin || "",
    });
  }, [user, reset]);

  const bioValue = watch("bio") || "";

  const onSubmit = async (data) => {
    try {
      const skillsArray = data.skills
        ? data.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [];

      await updateProfileMutation.mutateAsync({
        bio: data.bio,
        skills: skillsArray,
        website: data.website,
        github: data.github,
        linkedin: data.linkedin,
      });

      toast.success("Profile updated successfully");

      reset({
        ...data,
        skills: skillsArray.join(", "),
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/login", {
        replace: true,
      });
    }
  };

  return (
    <DashboardLayout>
      <main className="page-enter mx-auto w-full max-w-6xl space-y-5">

        {/* ================================= */}
        {/* Compact Header */}
        {/* ================================= */}

        <header
          className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-border/60
            bg-background/70
            px-5
            py-4
            shadow-sm
            backdrop-blur-xl
            sm:px-6
          "
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="
                h-9
                w-9
                rounded-xl
                text-muted-foreground
                hover:bg-muted
              "
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  Settings
                </h1>

                <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:inline-flex">
                  Account
                </span>
              </div>

              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </header>

        {/* ================================= */}
        {/* Main Settings */}
        {/* ================================= */}

        <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">

          {/* ================================= */}
          {/* Navigation */}
          {/* ================================= */}

          <aside>
            <nav
              className="
                rounded-2xl
                border
                border-border/60
                bg-background/70
                p-2
                shadow-sm
                backdrop-blur-xl
                lg:sticky
                lg:top-24
              "
            >
              <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Settings
              </p>

              <div className="space-y-0.5">
                {SETTINGS_ITEMS.map((item) => {
                  const Icon = item.icon;

                  const active =
                    activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setActiveSection(item.id)
                      }
                      className={`
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        transition-all
                        duration-200
                        ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-colors
                          ${
                            active
                              ? "bg-primary/10"
                              : "bg-muted/50 group-hover:bg-background"
                          }
                        `}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {item.label}
                        </p>

                        <p className="truncate text-[10px] text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* ================================= */}
          {/* Content */}
          {/* ================================= */}

          <div className="min-w-0">
            {activeSection === "profile" && (
              <ProfileSettings
                register={register}
                errors={errors}
                bioValue={bioValue}
                isDirty={isDirty}
                isSaving={
                  updateProfileMutation.isPending
                }
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
              />
            )}

            {activeSection === "account" && (
              <AccountSettings
                user={user}
                onLogout={handleLogout}
                isLoggingOut={
                  logoutMutation.isPending
                }
              />
            )}

            {activeSection === "appearance" && (
              <AppearanceSettings />
            )}

            {activeSection === "security" && (
              <SecuritySettings user={user} />
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

/* ====================================
   Profile
==================================== */

function ProfileSettings({
  register,
  errors,
  bioValue,
  isDirty,
  isSaving,
  handleSubmit,
  onSubmit,
}) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <SettingsCard
        icon={UserRound}
        title="Profile"
        description="Information displayed on your public developer profile."
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bio">Bio</Label>

            <span className="text-xs text-muted-foreground">
              {bioValue.length}/250
            </span>
          </div>

          <Textarea
            id="bio"
            rows={5}
            placeholder="Tell other developers about yourself..."
            className="resize-none rounded-xl bg-background/50"
            {...register("bio")}
          />

          {errors.bio && (
            <ErrorText>
              {errors.bio.message}
            </ErrorText>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />

            <Label htmlFor="skills">
              Skills
            </Label>
          </div>

          <Input
            id="skills"
            placeholder="React, Node.js, MongoDB, Express"
            className="h-11 rounded-xl bg-background/50"
            {...register("skills")}
          />

          <p className="text-xs text-muted-foreground">
            Separate skills using commas.
          </p>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={ExternalLink}
        title="Links"
        description="Connect your professional developer profiles."
      >
        <LinkField
          id="website"
          label="Personal Website"
          icon={Globe}
          placeholder="https://yourwebsite.dev"
          register={register}
          error={errors.website}
        />

        <LinkField
          id="github"
          label="GitHub"
          icon={ExternalLink}
          placeholder="https://github.com/username"
          register={register}
          error={errors.github}
        />

        <LinkField
          id="linkedin"
          label="LinkedIn"
          icon={ExternalLink}
          placeholder="https://linkedin.com/in/username"
          register={register}
          error={errors.linkedin}
        />
      </SettingsCard>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving || !isDirty}
          className="h-10 gap-2 rounded-xl px-5"
        >
          {isSaving ? (
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
  );
}

/* ====================================
   Account
==================================== */

function AccountSettings({
  user,
  onLogout,
  isLoggingOut,
}) {
  return (
    <div className="space-y-5">
      <SettingsCard
        icon={UserCog}
        title="Account"
        description="Basic information associated with your DevPulse account."
      >
        <InfoRow
          label="Full Name"
          value={
            user?.fullName || "—"
          }
        />

        <InfoRow
          label="Username"
          value={
            user?.username
              ? `@${user.username}`
              : "—"
          }
        />

        <InfoRow
          label="Email"
          value={
            user?.email || "—"
          }
          icon={Mail}
        />

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-border/60
            bg-muted/20
            px-4
            py-3.5
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Check className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Email verification
              </p>

              <p className="text-[11px] text-muted-foreground">
                Account email status
              </p>
            </div>
          </div>

          <span
            className={`
              rounded-full
              px-2.5
              py-1
              text-[11px]
              font-semibold
              ${
                user?.emailVerified
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-yellow-500/10 text-yellow-600"
              }
            `}
          >
            {user?.emailVerified
              ? "Verified"
              : "Not verified"}
          </span>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={LogOut}
        title="Session"
        description="Manage the session currently signed in to DevPulse."
      >
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
          <div>
            <p className="text-sm font-medium">
              Current session
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Sign out from this device.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="gap-2 rounded-xl"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}

            {isLoggingOut
              ? "Logging out..."
              : "Logout"}
          </Button>
        </div>
      </SettingsCard>
    </div>
  );
}

/* ====================================
   Appearance
==================================== */

function AppearanceSettings() {
  return (
    <SettingsCard
      icon={Palette}
      title="Appearance"
      description="Customize how DevPulse looks on your device."
    >
      <div className="flex items-center justify-between gap-5 rounded-xl border border-border/60 bg-muted/20 p-4">
        <div>
          <p className="text-sm font-medium">
            Theme
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Choose between light, dark, or system appearance.
          </p>
        </div>

        <AppearanceMenu />
      </div>

      <div className="flex gap-3 rounded-xl bg-primary/5 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

        <p className="text-xs leading-5 text-muted-foreground">
          Your appearance preference is
          stored locally and applied across
          DevPulse.
        </p>
      </div>
    </SettingsCard>
  );
}

/* ====================================
   Security
==================================== */

function SecuritySettings({ user }) {
  const navigate = useNavigate();

  return (
    <SettingsCard
      icon={ShieldCheck}
      title="Security"
      description="Keep your DevPulse account protected."
    >
      <div className="flex items-center justify-between gap-5 rounded-xl border border-border/60 bg-muted/20 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KeyRound className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-medium">
              Password
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Reset your account password.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/forgot-password")
          }
          className="gap-2 rounded-xl"
        >
          <KeyRound className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <InfoRow
        label="Account email"
        value={
          user?.email || "—"
        }
        icon={Mail}
      />
    </SettingsCard>
  );
}

/* ====================================
   Shared
==================================== */

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border/60
        bg-background/75
        shadow-sm
        backdrop-blur-xl
      "
    >
      <div className="border-b border-border/50 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">
              {title}
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}

        <span className="text-sm font-medium">
          {label}
        </span>
      </div>

      <span className="truncate text-sm text-muted-foreground">
        {value}
      </span>
    </div>
  );
}

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
        className="h-11 rounded-xl bg-background/50"
        {...register(id)}
      />

      {error && (
        <ErrorText>
          {error.message}
        </ErrorText>
      )}
    </div>
  );
}

function ErrorText({ children }) {
  return (
    <p className="text-sm text-destructive">
      {children}
    </p>
  );
}

export default SettingsPage;