import { FolderGit2 } from "lucide-react";

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

  const projects = data?.data || [];

  const { user } = useAuthContext();

  const isOwner = user?._id === userId;

  if (isLoading) {
    return (
      <section className="rounded-2xl border p-8">
        Loading Portfolio...
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border p-6">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          🚀 Portfolio
        </h2>

        {isOwner && (
          <Button onClick={onAddProject}>
            + Add Project
          </Button>
        )}
      </div>

      {!projects.length ? (
        <div className="py-12 text-center">
          <FolderGit2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

          <h2 className="text-xl font-semibold">
            No Projects Yet
          </h2>

          <p className="mt-2 text-muted-foreground">
            {isOwner
              ? "Showcase your best projects. Click 'Add Project' to get started."
              : "This developer hasn't added any portfolio projects yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
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