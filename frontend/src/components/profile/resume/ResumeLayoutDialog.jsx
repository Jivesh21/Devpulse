import {
  FileText,
  LayoutTemplate,
  Sparkles,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useUserPortfolio } from "@/hooks/usePortfolio";

import { generateModernResume } from "@/utils/resume/modernResume";

import {
  generateProfessionalResume,
} from "@/utils/resume/professionalResume";

import {
  generateMinimalResume,
} from "@/utils/resume/minimalResume";

function ResumeLayoutDialog({
  open,
  onOpenChange,
  profile,
}) {
  const {
    data: portfolioData,
    isLoading: portfolioLoading,
  } = useUserPortfolio(
    profile?._id
  );

  const projects =
    portfolioData?.data || [];

  const layouts = [
    {
      id: "modern",
      title: "Modern",
      description:
        "Clean developer-focused resume with a modern two-column design.",
      icon: Sparkles,
    },
    {
      id: "professional",
      title: "Professional",
      description:
        "Traditional resume layout designed for internships and job applications.",
      icon: FileText,
    },
    {
      id: "minimal",
      title: "Minimal",
      description:
        "Simple, clean and ATS-friendly resume layout.",
      icon: LayoutTemplate,
    },
  ];

  function handleSelect(layoutId) {
    // ====================================
    // Modern Resume
    // ====================================

    if (layoutId === "modern") {
      generateModernResume(
        profile,
        projects
      );

      onOpenChange(false);

      return;
    }

    // ====================================
    // Professional Resume
    // ====================================

    if (
      layoutId === "professional"
    ) {
      generateProfessionalResume(
        profile,
        projects
      );

      onOpenChange(false);

      return;
    }

    // ====================================
    // Minimal Resume
    // ====================================

    if (layoutId === "minimal") {
      generateMinimalResume(
        profile,
        projects
      );

      onOpenChange(false);

      return;
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          sm:max-w-3xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            Choose Resume Layout
          </DialogTitle>

          <DialogDescription>
            Select a design for{" "}
            {profile?.fullName}'s resume.
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            mt-3
            grid
            gap-4
            sm:grid-cols-3
          "
        >
          {layouts.map(
            (layout) => {
              const Icon =
                layout.icon;

              return (
                <button
                  key={layout.id}
                  type="button"
                  disabled={
                    portfolioLoading
                  }
                  onClick={() =>
                    handleSelect(
                      layout.id
                    )
                  }
                  className="
                    group
                    rounded-2xl
                    border
                    border-border/70
                    bg-muted/10
                    p-4
                    text-left
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:border-primary/40
                    hover:bg-primary/5
                    hover:shadow-lg
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {/* ================================= */}
                  {/* Resume Preview */}
                  {/* ================================= */}

                  <div
                    className="
                      relative
                      flex
                      h-40
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-xl
                      border
                      border-border/60
                      bg-background
                    "
                  >
                    {/* ================================= */}
                    {/* Modern Preview */}
                    {/* ================================= */}

                    {layout.id ===
                      "modern" && (
                      <div
                        className="
                          flex
                          h-[125px]
                          w-[85px]
                          overflow-hidden
                          rounded-sm
                          border
                          bg-white
                          shadow-sm
                        "
                      >
                        {/* Sidebar */}

                        <div
                          className="
                            w-[28%]
                            bg-slate-900
                            p-1.5
                          "
                        >
                          <div
                            className="
                              mx-auto
                              mb-2
                              h-5
                              w-5
                              rounded-full
                              bg-violet-500
                            "
                          />

                          <div className="mb-1 h-1 w-full rounded bg-slate-500" />

                          <div className="mb-1 h-1 w-4/5 rounded bg-slate-500" />

                          <div className="h-1 w-full rounded bg-slate-500" />
                        </div>

                        {/* Main */}

                        <div className="flex-1 p-2">
                          <div className="mb-2 h-2 w-3/4 rounded bg-slate-800" />

                          <div className="mb-1 h-1 w-full rounded bg-slate-300" />

                          <div className="mb-3 h-1 w-4/5 rounded bg-slate-300" />

                          <div className="mb-1 h-1.5 w-1/2 rounded bg-violet-400" />

                          <div className="mb-1 h-1 w-full rounded bg-slate-200" />

                          <div className="mb-1 h-1 w-full rounded bg-slate-200" />

                          <div className="h-1 w-3/4 rounded bg-slate-200" />
                        </div>
                      </div>
                    )}

                    {/* ================================= */}
                    {/* Professional Preview */}
                    {/* ================================= */}

                    {layout.id ===
                      "professional" && (
                      <div
                        className="
                          h-[125px]
                          w-[85px]
                          overflow-hidden
                          rounded-sm
                          border
                          bg-white
                          p-2
                          shadow-sm
                        "
                      >
                        <div
                          className="
                            mx-auto
                            mb-2
                            h-2
                            w-1/2
                            rounded
                            bg-slate-800
                          "
                        />

                        <div
                          className="
                            mx-auto
                            mb-3
                            h-1
                            w-3/4
                            rounded
                            bg-slate-300
                          "
                        />

                        <div
                          className="
                            mb-2
                            h-1.5
                            w-1/3
                            rounded
                            bg-slate-700
                          "
                        />

                        <div className="mb-1 h-1 w-full rounded bg-slate-200" />

                        <div className="mb-1 h-1 w-full rounded bg-slate-200" />

                        <div className="mb-3 h-1 w-4/5 rounded bg-slate-200" />

                        <div
                          className="
                            mb-2
                            h-1.5
                            w-1/3
                            rounded
                            bg-slate-700
                          "
                        />

                        <div className="mb-1 h-1 w-full rounded bg-slate-200" />

                        <div className="mb-1 h-1 w-full rounded bg-slate-200" />

                        <div className="h-1 w-3/4 rounded bg-slate-200" />
                      </div>
                    )}

                    {/* ================================= */}
                    {/* Minimal Preview */}
                    {/* ================================= */}

                    {layout.id ===
                      "minimal" && (
                      <div
                        className="
                          h-[125px]
                          w-[85px]
                          overflow-hidden
                          rounded-sm
                          border
                          bg-white
                          p-3
                          shadow-sm
                        "
                      >
                        <div
                          className="
                            mb-2
                            h-2
                            w-1/2
                            rounded
                            bg-slate-800
                          "
                        />

                        <div
                          className="
                            mb-4
                            h-px
                            w-full
                            bg-slate-300
                          "
                        />

                        <div
                          className="
                            mb-2
                            h-1.5
                            w-1/3
                            rounded
                            bg-slate-700
                          "
                        />

                        <div className="mb-1 h-1 w-full rounded bg-slate-200" />

                        <div className="mb-1 h-1 w-full rounded bg-slate-200" />

                        <div className="mb-4 h-1 w-4/5 rounded bg-slate-200" />

                        <div
                          className="
                            mb-2
                            h-1.5
                            w-1/3
                            rounded
                            bg-slate-700
                          "
                        />

                        <div className="mb-1 h-1 w-full rounded bg-slate-200" />

                        <div className="h-1 w-3/4 rounded bg-slate-200" />
                      </div>
                    )}

                    {/* ================================= */}
                    {/* Ready Badge */}
                    {/* ================================= */}

                    <div
                      className="
                        absolute
                        right-2
                        top-2
                        rounded-full
                        bg-primary/10
                        px-2
                        py-1
                        text-[9px]
                        font-semibold
                        text-primary
                      "
                    >
                      Ready
                    </div>
                  </div>

                  {/* ================================= */}
                  {/* Layout Info */}
                  {/* ================================= */}

                  <div className="mt-4 flex items-center gap-2">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary/10
                        text-primary
                      "
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <h3 className="text-sm font-semibold">
                      {layout.title}
                    </h3>
                  </div>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-5
                      text-muted-foreground
                    "
                  >
                    {layout.description}
                  </p>

                  {/* ================================= */}
                  {/* Action */}
                  {/* ================================= */}

                  <div className="mt-4">
                    <span
                      className="
                        text-xs
                        font-semibold
                        text-primary
                      "
                    >
                      Download →
                    </span>
                  </div>
                </button>
              );
            }
          )}
        </div>

        <p
          className="
            mt-2
            text-center
            text-xs
            text-muted-foreground
          "
        >
          Your resume is generated from
          your DevPulse profile and portfolio.
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default ResumeLayoutDialog;