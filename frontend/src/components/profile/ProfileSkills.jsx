import {
  Code2,
  Sparkles,
} from "lucide-react";

function ProfileSkills({
  skills = [],
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
      <div className="mb-5 flex items-center gap-3">
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
          <Code2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold">
            Skills & Technologies
          </h2>

          <p className="text-xs text-muted-foreground">
            Technologies this developer works with.
          </p>
        </div>
      </div>

      {skills.length === 0 ? (
        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-dashed
            border-border
            bg-muted/20
            p-4
          "
        >
          <Sparkles className="h-5 w-5 text-muted-foreground" />

          <p className="text-sm text-muted-foreground">
            No skills added yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="
                rounded-lg
                border
                border-border/60
                bg-muted/40
                px-3
                py-1.5
                text-sm
                font-medium
                text-foreground
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-primary/30
                hover:bg-primary/5
                hover:text-primary
              "
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProfileSkills;