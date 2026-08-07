import { useRef, useState } from "react";

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

import { useCreatePortfolio } from "@/hooks/usePortfolio";

function AddProjectDialog({
  open,
  onOpenChange,
}) {
  const createProject = useCreatePortfolio();

  const imageInputRef = useRef(null);

  const [coverImage, setCoverImage] =
    useState(null);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      techStack: "",
      githubUrl: "",
      liveUrl: "",
    });

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

    const data = new FormData();

    data.append("title", formData.title);
    data.append(
      "description",
      formData.description
    );

    formData.techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((tech) => {
        data.append("techStack", tech);
      });

    data.append(
      "githubUrl",
      formData.githubUrl
    );

    data.append(
      "liveUrl",
      formData.liveUrl
    );

    if (coverImage) {
      data.append(
        "coverImage",
        coverImage
      );
    }

    await createProject.mutateAsync(data);

    onOpenChange(false);

    setFormData({
      title: "",
      description: "",
      techStack: "",
      githubUrl: "",
      liveUrl: "",
    });

    setCoverImage(null);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Add Project
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            placeholder="Project Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <Textarea
            rows={4}
            placeholder="Project Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <Input
            placeholder="React, Node, MongoDB"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
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
            placeholder="GitHub URL"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
          />

          <Input
            placeholder="Live Demo URL"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={
                createProject.isPending
              }
            >
              {createProject.isPending
                ? "Saving..."
                : "Save Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProjectDialog;