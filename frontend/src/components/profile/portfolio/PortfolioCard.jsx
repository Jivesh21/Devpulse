import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  FolderGit2,
  Star,
  Trash2,
  Pencil,
} from "lucide-react";

import EditProjectDialog from "./EditProjectDialog";

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
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] =
    useState(false);

  const deleteProject =
    useDeletePortfolio();

  function handleDelete() {
    deleteProject.mutate(project._id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        whileHover={{
          y: -8,
          transition: {
            duration: 0.2,
          },
        }}
      >
        <Card className="overflow-hidden rounded-2xl">
          {/* Cover Image */}
          <div className="aspect-video overflow-hidden bg-muted">
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 text-muted-foreground">
                <FolderGit2 className="mb-3 h-12 w-12 text-primary" />

                <p className="font-medium">
                  No Preview Available
                </p>

                <span className="mt-1 text-xs">
                  Upload a cover image
                  for this project.
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {project.title}
              </h3>

              {project.featured && (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>

            {project.techStack?.length >
              0 && (
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(
                  (tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {project.githubUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                >
                  <a
                    href={
                      project.githubUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center"
                  >
                    <FolderGit2 className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              )}

              {project.liveUrl && (
                <Button
                  asChild
                  className="flex-1"
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>

            {isOwner && (
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditOpen(true)
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setOpen(true)
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <EditProjectDialog
        open={editOpen}
        onOpenChange={
          setEditOpen
        }
        project={project}
      />

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete Project
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want
            to delete this project?
            This action cannot be
            undone.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={
                handleDelete
              }
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
