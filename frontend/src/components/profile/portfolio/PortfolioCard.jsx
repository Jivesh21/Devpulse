import { motion } from "framer-motion";
import { ExternalLink, Star, FolderGit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function PortfolioCard({ project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        transition: {
          duration: 0.2,
        },
      }}
    >
      <Card className="overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-xl">

        <div className="aspect-video overflow-hidden bg-muted">

          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

        </div>

        <div className="space-y-4 p-5">

          <div className="flex items-center justify-between">

            <h3 className="text-xl font-bold">
              {project.title}
            </h3>

           {project.featured && (
  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
    ⭐ Featured
  </span>
)}

          </div>

          <p className="text-sm text-muted-foreground">
            {project.description}
          </p>

   <div className="flex flex-wrap gap-2">
  {project.techStack?.map((tech) => (
    <span
      key={tech}
      className="rounded-full bg-gray-200 px-3 py-1 text-xs"
    >
      {tech}
    </span>
  ))}
</div>

          <div className="flex gap-3 pt-2">

            {project.githubUrl && (
              <Button
                asChild
                variant="outline"
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

            {project.liveUrl && (
              <Button asChild>

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

        </div>

      </Card>
    </motion.div>
  );
}

export default PortfolioCard;