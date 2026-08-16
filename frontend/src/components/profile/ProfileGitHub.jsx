import {
  ExternalLink,
  GitBranch,
  Code2,
  Star,
  GitFork,
  Users,
} from "lucide-react";

import {
  usePublicGithubProfile,
  useGithubContributions,
} from "@/hooks/useGithub";

function ProfileGitHub({ username }) {
  // ====================================
  // Public GitHub Profile
  // ====================================

  const {
    data,
    isLoading,
    isError,
  } = usePublicGithubProfile(username);

  // ====================================
  // GitHub Contributions
  // ====================================

  const {
    data: contributionData,
    isLoading: isContributionLoading,
  } = useGithubContributions(username);

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

  // ====================================
  // GitHub Data
  // ====================================

  const githubData = data.data;

  const profile = githubData.profile;

  const repositories =
    githubData.repositories || [];

  const contributionCalendar =
    contributionData?.data || null;

  // ====================================
  // Safety Check
  // ====================================

  if (!profile) {
    return null;
  }

  // ====================================
  // Contribution Stats
  // ====================================

  const contributionStats =
    getContributionStats(
      contributionCalendar
    );

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
              alt={
                profile.login ||
                "GitHub user"
              }
              className="
                h-14
                w-14
                rounded-full
                border
                border-border/60
              "
            />
          ) : (
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-border/60
                bg-muted
              "
            >
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
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-border/60
              px-4
              py-2
              text-sm
              font-medium
              transition-colors
              hover:bg-muted
            "
          >
            View GitHub

            <ExternalLink className="h-4 w-4" />
          </a>
        )}

      </div>

      {/* ================================= */}
      {/* GitHub Stats */}
      {/* ================================= */}

      <div
        className="
          grid
          grid-cols-3
          border-y
          border-border/60
          bg-muted/20
        "
      >

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

            {repositories.map(
              (repo) => (
                <RepositoryCard
                  key={repo.id}
                  repository={repo}
                />
              )
            )}

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* GitHub Contribution Activity */}
      {/* ================================= */}

      {contributionCalendar && (
        <div
          className="
            border-t
            border-border/60
            p-5
            sm:p-6
          "
        >

          {/* ================================= */}
          {/* Activity Header */}
          {/* ================================= */}

          <div
            className="
              mb-5
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <h3 className="font-semibold">
                GitHub activity
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                {formatNumber(
                  contributionStats.year
                )}{" "}
                contributions in the last year
              </p>

            </div>

            {/* ================================= */}
            {/* Activity Summary */}
            {/* ================================= */}

            <div
              className="
                grid
                grid-cols-3
                gap-2
                sm:min-w-[330px]
              "
            >

              <ActivityStat
                label="Today"
                value={
                  contributionStats.today
                }
              />

              <ActivityStat
                label="This week"
                value={
                  contributionStats.week
                }
              />

              <ActivityStat
                label="Last year"
                value={
                  contributionStats.year
                }
              />

            </div>

          </div>

          {/* ================================= */}
          {/* Contribution Graph */}
          {/* ================================= */}

          <ContributionGraph
            calendar={
              contributionCalendar
            }
          />

        </div>
      )}

      {/* ================================= */}
      {/* Contribution Loading */}
      {/* ================================= */}

      {isContributionLoading &&
        !contributionCalendar && (
          <div
            className="
              border-t
              border-border/60
              p-5
              sm:p-6
            "
          >
            <p className="text-sm text-muted-foreground">
              Loading GitHub activity...
            </p>
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
    <div
      className="
        flex
        min-h-[80px]
        flex-col
        items-center
        justify-center
        gap-1
        border-r
        border-border/60
        last:border-r-0
      "
    >

      <div
        className="
          flex
          items-center
          gap-1.5
          text-muted-foreground
        "
      >
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
// Activity Stat
// ====================================

function ActivityStat({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-border/60
        bg-muted/20
        px-3
        py-2
        text-center
      "
    >

      <p className="text-sm font-bold">
        {formatNumber(value)}
      </p>

      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {label}
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
      className="
        group
        rounded-2xl
        border
        border-border/60
        bg-muted/20
        p-4
        transition-all
        hover:border-primary/30
        hover:bg-primary/5
      "
    >

      {/* Repository Name */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <h4 className="truncate font-semibold group-hover:text-primary">
          {repository.name}
        </h4>

        <ExternalLink
          className="
            h-4
            w-4
            shrink-0
            text-muted-foreground
          "
        />

      </div>

      {/* Description */}

      {repository.description && (
        <p
          className="
            mt-2
            line-clamp-2
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          {repository.description}
        </p>
      )}

      {/* Repository Stats */}

      <div
        className="
          mt-4
          flex
          flex-wrap
          items-center
          gap-3
          text-xs
          text-muted-foreground
        "
      >

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

// ====================================
// Contribution Graph
// ====================================

function ContributionGraph({
  calendar,
}) {
  if (
    !calendar ||
    !Array.isArray(calendar.weeks) ||
    calendar.weeks.length === 0
  ) {
    return null;
  }

  return (
    <div className="w-full overflow-visible">

      <div className="w-full">

        {/* ====================================
            Contribution Grid
        ==================================== */}

        <div
          className="
            grid
            w-full
            gap-[2px]
            sm:gap-1
          "
          style={{
            gridTemplateColumns:
              `repeat(${calendar.weeks.length}, minmax(0, 1fr))`,
          }}
        >

          {calendar.weeks.map(
            (
              week,
              weekIndex
            ) => (
              <div
                key={
                  week.firstDay ||
                  weekIndex
                }
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-[2px]
                  sm:gap-1
                "
              >

                {(
                  week.contributionDays ||
                  []
                ).map((day) => (
                  <ContributionDay
                    key={day.date}
                    day={day}
                  />
                ))}

              </div>
            )
          )}

        </div>

        {/* ====================================
            Legend
        ==================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
          "
        >

          <span className="text-xs text-muted-foreground">
            Less
          </span>

          <div className="flex items-center gap-1">

            {[
              "NONE",
              "FIRST_QUARTILE",
              "SECOND_QUARTILE",
              "THIRD_QUARTILE",
              "FOURTH_QUARTILE",
            ].map(
              (level) => (
                <div
                  key={level}
                  className={`
                    h-3
                    w-3
                    rounded-[3px]
                    border
                    border-border/30
                    ${getContributionLevelClass(
                      level
                    )}
                  `}
                />
              )
            )}

          </div>

          <span className="text-xs text-muted-foreground">
            More
          </span>

        </div>

      </div>

    </div>
  );
}

// ====================================
// Contribution Day
// ====================================

function ContributionDay({
  day,
}) {
  const count =
    day.contributionCount ?? 0;

  return (
    <div className="group relative">

      {/* ====================================
          Contribution Square
      ==================================== */}

      <div
        className={`
          aspect-square
          w-full
          cursor-pointer
          rounded-[2px]
          border
          border-border/30
          transition-all
          duration-150
          group-hover:scale-125
          group-hover:border-primary/60
          ${getContributionLevelClass(
            day.contributionLevel
          )}
        `}
      />

      {/* ====================================
          GitHub-style Tooltip
      ==================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-full
          left-1/2
          z-[100]
          mb-2
          hidden
          -translate-x-1/2
          whitespace-nowrap
          rounded-lg
          border
          border-border
          bg-popover
          px-3
          py-2
          text-xs
          shadow-xl
          group-hover:block
        "
      >

        <p className="font-medium text-popover-foreground">
          {getContributionTooltipText(
            count,
            day.date
          )}
        </p>

      </div>

    </div>
  );
}

// ====================================
// Contribution Tooltip Text
// ====================================

function getContributionTooltipText(
  count,
  dateString
) {
  const date =
    formatContributionDate(
      dateString
    );

  if (count === 0) {
    return `No contributions on ${date}.`;
  }

  if (count === 1) {
    return `1 contribution on ${date}.`;
  }

  return `${count} contributions on ${date}.`;
}

// ====================================
// Contribution Stats
// ====================================

function getContributionStats(calendar) {
  if (
    !calendar ||
    !Array.isArray(calendar.weeks)
  ) {
    return {
      today: 0,
      week: 0,
      year:
        calendar?.totalContributions ||
        0,
    };
  }

  const allDays =
    calendar.weeks.flatMap(
      (week) =>
        week.contributionDays || []
    );

  const today =
    getTodayDateString();

  // ====================================
  // Today's Contributions
  // ====================================

  const todayContributions =
    allDays.find(
      (day) =>
        day.date === today
    )?.contributionCount || 0;

  // ====================================
  // Current Week
  // ====================================
  // GitHub contribution weeks start
  // on Sunday.

  const todayDate =
    new Date(
      `${today}T00:00:00`
    );

  const dayOfWeek =
    todayDate.getDay();

  const startOfWeek =
    new Date(todayDate);

  startOfWeek.setDate(
    todayDate.getDate() -
      dayOfWeek
  );

  // ====================================
  // This Week's Contributions
  // ====================================

  const weekContributions =
    allDays.reduce(
      (total, day) => {
        const contributionDate =
          new Date(
            `${day.date}T00:00:00`
          );

        if (
          contributionDate >=
            startOfWeek &&
          contributionDate <=
            todayDate
        ) {
          return (
            total +
            (day.contributionCount || 0)
          );
        }

        return total;
      },
      0
    );

  // ====================================
  // Last Year
  // ====================================

  const yearContributions =
    calendar.totalContributions ||
    allDays.reduce(
      (total, day) =>
        total +
        (day.contributionCount || 0),
      0
    );

  // ====================================
  // Return Stats
  // ====================================

  return {
    today:
      todayContributions,

    week:
      weekContributions,

    year:
      yearContributions,
  };
}

// ====================================
// Today's Date
// ====================================

function getTodayDateString() {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ====================================
// Contribution Date Formatting
// ====================================

function formatContributionDate(
  dateString
) {
  if (!dateString) {
    return "";
  }

  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  const month =
    date.toLocaleDateString(
      undefined,
      {
        month: "long",
      }
    );

  const day =
    date.getDate();

  return `${month} ${getOrdinal(
    day
  )}`;
}

// ====================================
// Ordinal Day
// ====================================

function getOrdinal(day) {
  if (
    day >= 11 &&
    day <= 13
  ) {
    return `${day}th`;
  }

  switch (day % 10) {
    case 1:
      return `${day}st`;

    case 2:
      return `${day}nd`;

    case 3:
      return `${day}rd`;

    default:
      return `${day}th`;
  }
}

// ====================================
// Contribution Level Styling
// ====================================

function getContributionLevelClass(
  level
) {
  switch (level) {
    case "FIRST_QUARTILE":
      return "bg-primary/20";

    case "SECOND_QUARTILE":
      return "bg-primary/40";

    case "THIRD_QUARTILE":
      return "bg-primary/60";

    case "FOURTH_QUARTILE":
      return "bg-primary/90";

    case "NONE":
    default:
      return "bg-muted";
  }
}

// ====================================
// Number Formatting
// ====================================

function formatNumber(value) {
  return new Intl.NumberFormat(
    "en-IN"
  ).format(value || 0);
}

export default ProfileGitHub;