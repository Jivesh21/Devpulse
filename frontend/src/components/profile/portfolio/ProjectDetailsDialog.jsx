import {
  ExternalLink,
  FolderGit2,
  Star,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

function ProjectDetailsDialog({
  open,
  onOpenChange,
  project,
}) {
  if (!project) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-h-[88vh]
          overflow-y-auto
          rounded-2xl
          sm:max-w-xl
        "
      >
        {/* ================================= */}
        {/* Cover */}
        {/* ================================= */}

        {project.coverImage && (
          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-border/60
            "
          >
            <img
              src={project.coverImage}
              alt={project.title}
              className="
                h-44
                w-full
                object-cover
              "
            />
          </div>
        )}

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <DialogHeader className="pt-1">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl">
              {project.title}
            </DialogTitle>

            {project.featured && (
              <Star
                className="
                  h-4
                  w-4
                  fill-yellow-400
                  text-yellow-400
                "
              />
            )}
          </div>
        </DialogHeader>

        {/* ================================= */}
        {/* Description */}
        {/* ================================= */}

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">
            About this project
          </h3>

          <p
            className="
              whitespace-pre-line
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            {project.description}
          </p>
        </div>

        {/* ================================= */}
        {/* Technologies */}
        {/* ================================= */}

        {project.techStack?.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">
              Technologies
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map(
                (tech) => (
                  <span
                    key={tech}
                    className="
                      rounded-md
                      bg-primary/10
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-primary
                    "
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* ================================= */}
        {/* Project Links */}
        {/* ================================= */}

        {(project.githubUrl ||
          project.liveUrl) && (
          <div
            className="
              flex
              items-center
              gap-3
              pt-2
            "
          >
            {/* GitHub */}

            {project.githubUrl && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="
                  h-9
                  w-[120px]
                  justify-center
                  rounded-lg
                "
              >
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FolderGit2 className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}

            {/* Live Demo */}

            {project.liveUrl && (
              <Button
                asChild
                size="sm"
                className="
                  h-9
                  w-[120px]
                  justify-center
                  rounded-lg
                "
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProjectDetailsDialog;