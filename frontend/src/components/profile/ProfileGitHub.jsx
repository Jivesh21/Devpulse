import {
  ExternalLink,
  GitBranch,
  Code2,
  Star,
  GitFork,
  Users,
} from "lucide-react";

import { usePublicGithubProfile } from "@/hooks/useGithub";

function ProfileGitHub({ username }) {
  const {
    data,
    isLoading,
    isError,
  } = usePublicGithubProfile(username);

  // ====================================
  // GitHub Not Connected
  // ====================================

  if (!username) {
    return null;
  }

  // ====================================
  // Loading
  // ====================================

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-border/60 bg-background p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Loading GitHub...
        </p>
      </section>
    );
  }

  // ====================================
  // Error
  // ====================================

  if (isError || !data?.data) {
    return null;
  }

  const githubData = data.data;

  const profile = githubData.profile;

  const repositories =
    githubData.repositories || [];

  // ====================================
  // Safety Check
  // ====================================

  if (!profile) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm">

      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

        <div className="flex items-center gap-4">

          {/* GitHub Avatar */}

          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.login || "GitHub user"}
              className="h-14 w-14 rounded-full border border-border/60"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-muted">
              <Code2 className="h-7 w-7" />
            </div>
          )}

          {/* GitHub Identity */}

          <div>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />

              <h2 className="text-lg font-bold">
                GitHub
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              @{profile.login}
            </p>
          </div>
        </div>

        {/* View GitHub */}

        {profile.html_url && (
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            View GitHub

            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* ================================= */}
      {/* GitHub Stats */}
      {/* ================================= */}

      <div className="grid grid-cols-3 border-y border-border/60 bg-muted/20">

        <GithubStat
          icon={
            <GitBranch className="h-4 w-4" />
          }
          value={profile.public_repos}
          label="Repositories"
        />

        <GithubStat
          icon={
            <Users className="h-4 w-4" />
          }
          value={profile.followers}
          label="Followers"
        />

        <GithubStat
          icon={
            <Users className="h-4 w-4" />
          }
          value={profile.following}
          label="Following"
        />

      </div>

      {/* ================================= */}
      {/* Repositories */}
      {/* ================================= */}

      {repositories.length > 0 && (
        <div className="p-5 sm:p-6">

          <div className="mb-4 flex items-center gap-2">

            <GitBranch className="h-4 w-4" />

            <h3 className="font-semibold">
              Recent repositories
            </h3>

          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            {repositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
              />
            ))}

          </div>
        </div>
      )}

    </section>
  );
}

// ====================================
// GitHub Stat
// ====================================

function GithubStat({
  icon,
  value,
  label,
}) {
  return (
    <div className="flex min-h-[80px] flex-col items-center justify-center gap-1 border-r border-border/60 last:border-r-0">

      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="text-xl font-bold">
        {value ?? 0}
      </p>

    </div>
  );
}

// ====================================
// Repository Card
// ====================================

function RepositoryCard({
  repository,
}) {
  if (!repository) {
    return null;
  }

  return (
    <a
      href={repository.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-2xl border border-border/60 bg-muted/20 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
    >

      {/* Repository Name */}

      <div className="flex items-start justify-between gap-3">

        <h4 className="truncate font-semibold group-hover:text-primary">
          {repository.name}
        </h4>

        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />

      </div>

      {/* Description */}

      {repository.description && (
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {repository.description}
        </p>
      )}

      {/* Repository Stats */}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">

        {repository.language && (
          <span>
            {repository.language}
          </span>
        )}

        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          {repository.stars ?? 0}
        </span>

        <span className="inline-flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" />
          {repository.forks ?? 0}
        </span>

      </div>

    </a>
  );
}

export default ProfileGitHub;