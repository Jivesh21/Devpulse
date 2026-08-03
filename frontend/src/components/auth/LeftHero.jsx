import { Activity, GitBranch, Sparkles } from "lucide-react";

function DevPulseLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/30">
        <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>

      <span className="text-xl font-bold tracking-tight text-white">
        Dev<span className="text-violet-400">Pulse</span>
      </span>
    </div>
  );
}

function PulseGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Background Glow */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Main Card */}
      <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-white/70">
              Developer Activity
            </span>
          </div>

          <Sparkles className="h-4 w-4 text-white/40" />
        </div>

        <svg viewBox="0 0 300 80" className="h-24 w-full">
          <defs>
            <linearGradient id="pulseLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          <polyline
            points="0,50 30,50 45,15 60,65 75,35 95,35 115,10 130,55 150,50 180,50 195,20 210,60 225,40 245,40 265,15 300,50"
            fill="none"
            stroke="url(#pulseLine)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="mt-4 rounded-xl bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">
            Build • Share • Grow
          </p>

          <p className="mt-1 text-xs text-white/60">
            Collaborate with developers and showcase your work.
          </p>
        </div>
      </div>

      {/* Floating Card */}
      <div className="absolute -bottom-8 -left-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl shadow-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600">
          <GitBranch className="h-5 w-5 text-white" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            Share Projects
          </p>

          <p className="text-xs text-white/50">
            Learn • Collaborate • Improve
          </p>
        </div>
      </div>
    </div>
  );
}

function LeftHero() {
  return (
    <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-transparent to-cyan-950/30" />

      {/* Logo */}
      <div className="relative z-10 p-12">
        <DevPulseLogo />
      </div>

      {/* Illustration */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-12">
        <PulseGraphic />
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 space-y-4 p-12">
        <h2 className="max-w-md text-4xl font-bold leading-tight text-white">
          Build.
          <br />
          Share.
          <br />
          Grow.
        </h2>

        <p className="max-w-md text-base leading-relaxed text-white/60">
          DevPulse is a platform where developers showcase projects, connect
          with the community, exchange ideas, and grow together.
        </p>
      </div>
    </div>
  );
}

export default LeftHero;