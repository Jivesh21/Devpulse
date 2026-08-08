import { Award, BriefcaseBusiness, GraduationCap } from "lucide-react";

function Year({ value }) {
  return value ? new Date(value).getFullYear() : null;
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function ProfileCareer({ profile }) {
  const experience = profile.experience || [];
  const education = profile.education || [];
  const certificates = profile.certificates || [];

  if (!experience.length && !education.length && !certificates.length) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {experience.length > 0 && (
        <Section icon={BriefcaseBusiness} title="Experience">
          {experience.map((item, index) => (
            <div key={`${item.company}-${item.position}-${index}`}>
              <h3 className="font-semibold">{item.position || item.company}</h3>
              {item.company && item.position && <p className="text-sm text-primary">{item.company}</p>}
              <p className="text-sm text-muted-foreground">
                <Year value={item.startDate} />{item.startDate && " – "}{item.currentlyWorking ? "Present" : <Year value={item.endDate} />}
              </p>
              {item.description && <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section icon={GraduationCap} title="Education">
          {education.map((item, index) => (
            <div key={`${item.institution}-${item.degree}-${index}`}>
              <h3 className="font-semibold">{item.degree || item.institution}</h3>
              {item.institution && item.degree && <p className="text-sm text-primary">{item.institution}</p>}
              {item.fieldOfStudy && <p className="text-sm text-muted-foreground">{item.fieldOfStudy}</p>}
              <p className="text-sm text-muted-foreground"><Year value={item.startDate} />{item.startDate && " – "}<Year value={item.endDate} /></p>
            </div>
          ))}
        </Section>
      )}

      {certificates.length > 0 && (
        <Section icon={Award} title="Certifications & Achievements">
          {certificates.map((item, index) => (
            <div key={`${item.title}-${item.issuer}-${index}`}>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-primary">{item.issuer}</p>
              <p className="text-sm text-muted-foreground"><Year value={item.issueDate} /></p>
              {item.credentialUrl && <a className="mt-1 inline-block text-sm text-primary hover:underline" href={item.credentialUrl} target="_blank" rel="noreferrer">View credential</a>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
