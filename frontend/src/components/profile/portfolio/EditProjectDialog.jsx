import { useEffect, useRef, useState } from "react";

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

import { useUpdatePortfolio } from "@/hooks/usePortfolio";

function EditProjectDialog({
  open,
  onOpenChange,
  project,
}) {
  const updateProject = useUpdatePortfolio();

  const imageInputRef = useRef(null);

  const [coverImage, setCoverImage] =
    useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
  });

  useEffect(() => {
    if (!project) return;

    setFormData({
      title: project.title || "",
      description: project.description || "",
      techStack:
        project.techStack?.join(", ") || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
    });

    setCoverImage(null);
  }, [project]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const projectData = new FormData();

    projectData.append("title", formData.title);
    projectData.append(
      "description",
      formData.description
    );
    projectData.append(
      "techStack",
      formData.techStack
    );
    projectData.append(
      "githubUrl",
      formData.githubUrl
    );
    projectData.append(
      "liveUrl",
      formData.liveUrl
    );

    if (coverImage) {
      projectData.append(
        "coverImage",
        coverImage
      );
    }

    await updateProject.mutateAsync({
      portfolioId: project._id,
      projectData,
    });

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Project Title"
          />

          <Textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <Input
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="React, Node, MongoDB"
          />

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              imageInputRef.current?.click()
            }
          >
            Choose Cover Image
          </Button>

          {coverImage && (
            <img
              src={URL.createObjectURL(
                coverImage
              )}
              alt="Preview"
              className="h-48 w-full rounded-xl object-cover"
            />
          )}

          <Input
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="GitHub URL"
          />

          <Input
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            placeholder="Live Demo URL"
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={
                updateProject.isPending
              }
            >
              {updateProject.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProjectDialog;