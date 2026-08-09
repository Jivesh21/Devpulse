import {
  FolderGit2,
  Plus,
  Sparkles,
} from "lucide-react";

import PortfolioCard from "./PortfolioCard";

import { useUserPortfolio } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";

function PortfolioSection({
  userId,
  onAddProject,
}) {
  const {
    data,
    isLoading,
  } = useUserPortfolio(userId);

  const projects =
    data?.data || [];

  const { user } =
    useAuthContext();

  const isOwner =
    user?._id === userId;

  if (isLoading) {
    return (
      <section
        className="
          rounded-2xl
          border
          border-border/60
          bg-background/70
          p-5
          shadow-sm
          backdrop-blur-xl
          sm:p-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              h-10
              w-10
              animate-pulse
              rounded-xl
              bg-muted
            "
          />

          <div className="space-y-2">
            <div className="h-3 w-28 rounded-full bg-muted" />
            <div className="h-2.5 w-40 rounded-full bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        rounded-2xl
        border
        border-border/60
        bg-background/70
        p-5
        shadow-sm
        backdrop-blur-xl
        sm:p-6
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
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
            <FolderGit2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Portfolio
            </h2>

            <p className="text-xs text-muted-foreground">
              Projects and work worth showcasing.
            </p>
          </div>
        </div>

        {isOwner && (
          <Button
            onClick={onAddProject}
            size="sm"
            className="
              h-9
              gap-2
              rounded-xl
              shadow-sm
            "
          >
            <Plus className="h-4 w-4" />

            <span className="hidden sm:inline">
              Add Project
            </span>
          </Button>
        )}
      </div>

      {/* Empty */}

      {!projects.length ? (
        <div
          className="
            mt-5
            flex
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-border
            bg-muted/20
            px-6
            py-12
            text-center
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <Sparkles className="h-6 w-6" />
          </div>

          <h3 className="mt-4 font-semibold">
            No projects yet
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {isOwner
              ? "Showcase your best work and give other developers a look at what you're building."
              : "This developer hasn't added any portfolio projects yet."}
          </p>

          {isOwner && (
            <Button
              onClick={onAddProject}
              variant="outline"
              className="mt-5 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              Add your first project
            </Button>
          )}
        </div>
      ) : (
        <div
          className="
            mt-5
            grid
            gap-4
            md:grid-cols-2
          "
        >
          {projects.map((project) => (
            <PortfolioCard
              key={project._id}
              project={project}
              isOwner={isOwner}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PortfolioSection;