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

import RichTextEditor from "@/components/ui/RichTextEditor";

import { useCreatePortfolio } from "@/hooks/usePortfolio";

function AddProjectDialog({
  open,
  onOpenChange,
}) {
  const createProject =
    useCreatePortfolio();

  const imageInputRef =
    useRef(null);

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

  // ====================================
  // Input Change
  // ====================================

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // ====================================
  // Description Change
  // ====================================

  function handleDescriptionChange(
    value
  ) {
    setFormData({
      ...formData,
      description: value,
    });
  }

  // ====================================
  // Image Change
  // ====================================

  function handleImageChange(e) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setCoverImage(file);
  }

  // ====================================
  // Submit
  // ====================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    if (
      !formData.description ||
      formData.description === "<p><br></p>"
    ) {
      return;
    }

    const data =
      new FormData();

    data.append(
      "title",
      formData.title.trim()
    );

    data.append(
      "description",
      formData.description
    );

    formData.techStack
      .split(",")
      .map((item) =>
        item.trim()
      )
      .filter(Boolean)
      .forEach((tech) => {
        data.append(
          "techStack",
          tech
        );
      });

    data.append(
      "githubUrl",
      formData.githubUrl.trim()
    );

    data.append(
      "liveUrl",
      formData.liveUrl.trim()
    );

    if (coverImage) {
      data.append(
        "coverImage",
        coverImage
      );
    }

    try {
      await createProject.mutateAsync(
        data
      );

      // Close dialog

      onOpenChange(false);

      // Reset form

      setFormData({
        title: "",
        description: "",
        techStack: "",
        githubUrl: "",
        liveUrl: "",
      });

      setCoverImage(null);

      if (imageInputRef.current) {
        imageInputRef.current.value =
          "";
      }
    } catch (error) {
      console.error(
        "Failed to create project:",
        error
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          sm:max-w-xl
        "
      >
        <DialogHeader>
          <DialogTitle>
            Add Project
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* ================================= */}
          {/* Project Title */}
          {/* ================================= */}

          <Input
            placeholder="Project Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* ================================= */}
          {/* Project Description */}
          {/* ================================= */}

          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
              "
            >
              Project Description
            </label>

            <RichTextEditor
              value={
                formData.description
              }
              onChange={
                handleDescriptionChange
              }
              placeholder="Describe what you built, the problem it solves, and your role..."
            />
          </div>

          {/* ================================= */}
          {/* Tech Stack */}
          {/* ================================= */}

          <Input
            placeholder="React, Node.js, MongoDB"
            name="techStack"
            value={
              formData.techStack
            }
            onChange={handleChange}
          />

          {/* ================================= */}
          {/* Cover Image */}
          {/* ================================= */}

          <div className="space-y-3">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={
                handleImageChange
              }
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
              <div className="overflow-hidden rounded-xl border">
                <img
                  src={URL.createObjectURL(
                    coverImage
                  )}
                  alt="Project preview"
                  className="
                    h-48
                    w-full
                    object-cover
                  "
                />
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* GitHub */}
          {/* ================================= */}

          <Input
            placeholder="GitHub URL"
            name="githubUrl"
            type="url"
            value={
              formData.githubUrl
            }
            onChange={handleChange}
          />

          {/* ================================= */}
          {/* Live Demo */}
          {/* ================================= */}

          <Input
            placeholder="Live Demo URL"
            name="liveUrl"
            type="url"
            value={
              formData.liveUrl
            }
            onChange={handleChange}
          />

          {/* ================================= */}
          {/* Footer */}
          {/* ================================= */}

          <DialogFooter>
            <Button
              type="submit"
              disabled={
                createProject.isPending
              }
              className="rounded-xl"
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