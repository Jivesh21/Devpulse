import { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderGit2,
  Star,
  Trash2,
  Pencil,
} from "lucide-react";

import EditProjectDialog from "./EditProjectDialog";
import ProjectDetailsDialog from "./ProjectDetailsDialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useDeletePortfolio } from "@/hooks/usePortfolio";

function PortfolioCard({
  project,
  isOwner,
}) {
  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const deleteProject =
    useDeletePortfolio();

  function handleDelete() {
    deleteProject.mutate(project._id, {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    });
  }

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        whileHover={{
          y: -3,
        }}
        transition={{
          duration: 0.2,
        }}
        className="w-full"
      >
        <Card
          onClick={() =>
            setDetailsOpen(true)
          }
          className="
            group
            cursor-pointer
            overflow-hidden
            rounded-xl
            border-border/60
            bg-card
            shadow-sm
            transition-all
            duration-200
            hover:border-primary/30
            hover:shadow-md
          "
        >
          {/* ================================= */}
          {/* Compact Preview */}
          {/* ================================= */}

          {project.coverImage ? (
            <div className="h-24 overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.title}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />
            </div>
          ) : (
            <div
              className="
                flex
                h-24
                items-center
                justify-center
                bg-muted/30
              "
            >
              <FolderGit2
                className="
                  h-6
                  w-6
                  text-muted-foreground/60
                "
              />
            </div>
          )}

          {/* ================================= */}
          {/* Content */}
          {/* ================================= */}

          <div className="p-3.5">
            {/* Title */}

            <div className="flex items-center gap-2">
              <h3
                className="
                  min-w-0
                  flex-1
                  truncate
                  text-sm
                  font-semibold
                "
              >
                {project.title}
              </h3>

              {project.featured && (
                <Star
                  className="
                    h-3.5
                    w-3.5
                    shrink-0
                    fill-yellow-400
                    text-yellow-400
                  "
                />
              )}
            </div>

            {/* Short description */}

            <p
              className="
                mt-1
                line-clamp-2
                text-xs
                leading-4
                text-muted-foreground
              "
            >
              {project.description}
            </p>

            {/* Tech stack */}

            {project.techStack?.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {project.techStack
                  .slice(0, 3)
                  .map((tech) => (
                    <span
                      key={tech}
                      className="
                        rounded-md
                        bg-primary/10
                        px-1.5
                        py-0.5
                        text-[9px]
                        font-medium
                        text-primary
                      "
                    >
                      {tech}
                    </span>
                  ))}

                {project.techStack.length > 3 && (
                  <span
                    className="
                      rounded-md
                      bg-muted
                      px-1.5
                      py-0.5
                      text-[9px]
                      text-muted-foreground
                    "
                  >
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* ================================= */}
            {/* Footer */}
            {/* ================================= */}

            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                border-t
                border-border/50
                pt-2.5
              "
            >
              <button
                type="button"
                className="
                  text-[11px]
                  font-medium
                  text-primary
                  transition-opacity
                  hover:opacity-70
                "
                onClick={(event) => {
                  event.stopPropagation();
                  setDetailsOpen(true);
                }}
              >
                View project →
              </button>

              {isOwner && (
                <div
                  className="flex items-center gap-0.5"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      setEditOpen(true)
                    }
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="
                      h-6
                      w-6
                      text-destructive
                      hover:text-destructive
                    "
                    onClick={() =>
                      setDeleteOpen(true)
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ================================= */}
      {/* Project Details */}
      {/* ================================= */}

      <ProjectDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        project={project}
      />

      {/* ================================= */}
      {/* Edit */}
      {/* ================================= */}

      <EditProjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project}
      />

      {/* ================================= */}
      {/* Delete */}
      {/* ================================= */}

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete Project
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete
            this project? This action cannot
            be undone.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={
                deleteProject.isPending
              }
            >
              {deleteProject.isPending
                ? "Deleting..."
                : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PortfolioCard;