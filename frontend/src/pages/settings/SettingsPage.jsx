import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Save } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { useUpdateProfile } from "@/hooks/useProfile";

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

function SettingsPage() {
  const { user } = useAuthContext();
  const updateProfileMutation = useUpdateProfile();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      bio: user?.bio || "",
      skills: user?.skills ? user.skills.join(", ") : "",
      website: user?.website || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const skillsArray = data.skills
        ? data.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "")
        : [];

      const payload = {
        ...data,
        skills: skillsArray,
      };

      await updateProfileMutation.mutateAsync(payload);
      toast.success("Profile updated successfully!");
      
      if (user?.username) {
        navigate(`/profile/${user.username}`);
      } else {
        navigate("/feed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile settings"
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header link */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">
              Customize your developer identity on DevPulse.
            </p>
          </div>
        </div>

        {/* Settings Card */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              This information will be displayed publicly on your portfolio page.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell other developers about yourself, what you are building, or what tech you love..."
                  className="resize-none"
                  {...register("bio")}
                />
                <p className="text-xs text-muted-foreground text-right">
                  Maximum 250 characters.
                </p>
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  placeholder="React, Node.js, Express, TypeScript, Python"
                  {...register("skills")}
                />
                <p className="text-xs text-muted-foreground">
                  Separate your tech stack skills with commas.
                </p>
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills.message}</p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Personal Website / Portfolio</Label>
                <Input
                  id="website"
                  placeholder="https://johndoe.dev"
                  {...register("website")}
                />
                {errors.website && (
                  <p className="text-sm text-red-500">{errors.website.message}</p>
                )}
              </div>

              {/* GitHub */}
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Profile / Username</Label>
                <Input
                  id="github"
                  placeholder="johndoe"
                  {...register("github")}
                />
                {errors.github && (
                  <p className="text-sm text-red-500">{errors.github.message}</p>
                )}
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile / Username</Label>
                <Input
                  id="linkedin"
                  placeholder="johndoe-dev"
                  {...register("linkedin")}
                />
                {errors.linkedin && (
                  <p className="text-sm text-red-500">{errors.linkedin.message}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="rounded-xl gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white"
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;
