import {
  Award,
  BriefcaseBusiness,
  GraduationCap,
  ExternalLink,
  CalendarDays,
} from "lucide-react";

function Year({ value }) {
  return value
    ? new Date(value).getFullYear()
    : null;
}

function DateRange({
  startDate,
  endDate,
  currentlyWorking = false,
}) {
  if (!startDate && !endDate) {
    return null;
  }

  return (
    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
      <CalendarDays className="h-3.5 w-3.5" />

      <span>
        {startDate && <Year value={startDate} />}

        {startDate && " – "}

        {currentlyWorking
          ? "Present"
          : endDate
            ? <Year value={endDate} />
            : ""}
      </span>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}) {
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
      <div className="mb-6 flex items-center gap-3">
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
          <Icon className="h-5 w-5" />
        </div>

        <h2 className="font-semibold">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function TimelineItem({
  children,
  isLast = false,
}) {
  return (
    <div className="relative flex gap-4">
      <div className="flex w-3 shrink-0 justify-center">
        <div
          className="
            relative
            mt-1.5
            h-2.5
            w-2.5
            shrink-0
            rounded-full
            bg-primary
            ring-4
            ring-primary/10
          "
        />

        {!isLast && (
          <div
            className="
              absolute
              left-1/2
              top-4
              h-[calc(100%+1rem)]
              w-px
              -translate-x-1/2
              bg-border
            "
          />
        )}
      </div>

      <div
        className={`
          min-w-0
          flex-1
          ${isLast ? "pb-0" : "pb-8"}
        `}
      >
        {children}
      </div>
    </div>
  );
}

export default function ProfileCareer({
  profile,
}) {
  const experience =
    profile?.experience || [];

  const education =
    profile?.education || [];

  const certificates =
    profile?.certificates || [];

  if (
    !experience.length &&
    !education.length &&
    !certificates.length
  ) {
    return null;
  }

  return (
    <div className="space-y-5">

      {experience.length > 0 && (
        <Section
          icon={BriefcaseBusiness}
          title="Experience"
        >
          <div>
            {experience.map(
              (item, index) => (
                <TimelineItem
                  key={`${item.company}-${item.position}-${index}`}
                  isLast={
                    index ===
                    experience.length - 1
                  }
                >
                  <h3 className="font-semibold">
                    {item.position ||
                      item.company}
                  </h3>

                  {item.company &&
                    item.position && (
                      <p className="mt-1 text-sm font-medium text-primary">
                        {item.company}
                      </p>
                    )}

                  <DateRange
                    startDate={item.startDate}
                    endDate={item.endDate}
                    currentlyWorking={
                      item.currentlyWorking
                    }
                  />

                  {item.location && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.location}
                    </p>
                  )}

                  {item.employmentType && (
                    <span
                      className="
                        mt-3
                        inline-flex
                        rounded-lg
                        border
                        border-border/60
                        bg-muted/40
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-muted-foreground
                      "
                    >
                      {item.employmentType}
                    </span>
                  )}

                  {item.description && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </TimelineItem>
              )
            )}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section
          icon={GraduationCap}
          title="Education"
        >
          <div>
            {education.map(
              (item, index) => (
                <TimelineItem
                  key={`${item.institution}-${item.degree}-${index}`}
                  isLast={
                    index ===
                    education.length - 1
                  }
                >
                  <h3 className="font-semibold">
                    {item.degree ||
                      item.institution}
                  </h3>

                  {item.institution &&
                    item.degree && (
                      <p className="mt-1 text-sm font-medium text-primary">
                        {item.institution}
                      </p>
                    )}

                  {item.fieldOfStudy && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.fieldOfStudy}
                    </p>
                  )}

                  <DateRange
                    startDate={item.startDate}
                    endDate={item.endDate}
                  />

                  {item.grade && (
                    <span
                      className="
                        mt-3
                        inline-flex
                        rounded-lg
                        border
                        border-border/60
                        bg-muted/40
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-muted-foreground
                      "
                    >
                      Grade: {item.grade}
                    </span>
                  )}

                  {item.description && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </TimelineItem>
              )
            )}
          </div>
        </Section>
      )}

      {certificates.length > 0 && (
        <Section
          icon={Award}
          title="Certifications & Achievements"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {certificates.map(
              (item, index) => (
                <div
                  key={`${item.title}-${item.issuer}-${index}`}
                  className="
                    rounded-xl
                    border
                    border-border/60
                    bg-muted/20
                    p-4
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-primary/20
                    hover:bg-primary/5
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary/10
                        text-primary
                      "
                    >
                      <Award className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold">
                        {item.title}
                      </h3>

                      {item.issuer && (
                        <p className="mt-1 text-sm text-primary">
                          {item.issuer}
                        </p>
                      )}

                      {item.issueDate && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          <Year value={item.issueDate} />
                        </p>
                      )}

                      {item.credentialUrl && (
                        <a
                          href={item.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            mt-3
                            inline-flex
                            items-center
                            gap-1.5
                            text-xs
                            font-medium
                            text-primary
                            hover:underline
                          "
                        >
                          View credential
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </Section>
      )}
    </div>
  );
}