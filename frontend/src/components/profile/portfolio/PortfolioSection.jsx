import { FolderGit2 } from "lucide-react";

import PortfolioCard from "./PortfolioCard";
import { useUserPortfolio } from "@/hooks/usePortfolio";

function PortfolioSection({ userId }) {
  const {
    data,
    isLoading,
  } = useUserPortfolio(userId);

  const projects = data?.data || [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border p-8">
        Loading Portfolio...
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="rounded-2xl border p-10 text-center">

        <FolderGit2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

        <h2 className="text-xl font-semibold">
          No Projects Yet
        </h2>

        <p className="mt-2 text-muted-foreground">
          This developer hasn't added any portfolio projects.
        </p>

      </div>
    );
  }

  return (
    <section className="space-y-5">

      <h2 className="text-2xl font-bold">
        🚀 Portfolio
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        {projects.map((project) => (
          <PortfolioCard
            key={project._id}
            project={project}
          />
        ))}

      </div>

    </section>
  );
}

export default PortfolioSection;