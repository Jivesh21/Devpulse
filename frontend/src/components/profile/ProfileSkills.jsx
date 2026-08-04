import { Card, CardContent } from "@/components/ui/card";

function ProfileSkills({ skills = [] }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Skills
        </h2>

        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No skills added yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileSkills;