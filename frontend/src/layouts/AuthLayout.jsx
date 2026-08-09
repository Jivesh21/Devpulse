import LeftHero from "../components/auth/LeftHero";
import { Activity } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* ================================= */}
      {/* Desktop Hero */}
      {/* ================================= */}

      <div
        className="
          hidden
          lg:flex
          lg:w-1/2
          lg:basis-1/2
          lg:shrink-0
        "
      >
        <LeftHero />
      </div>

      {/* ================================= */}
      {/* Auth Content */}
      {/* ================================= */}

      <main
        className="
          flex
          min-h-screen
          w-full
          flex-col
          items-center
          justify-start
          px-5
          py-8
          sm:px-6
          sm:py-10
          lg:w-1/2
          lg:basis-1/2
          lg:shrink-0
          lg:justify-center
          lg:px-8
          lg:py-12
        "
      >
        {/* ================================= */}
        {/* Mobile Branding */}
        {/* ================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            items-center
            lg:hidden
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-primary
              shadow-lg
              shadow-primary/20
            "
          >
            <Activity
              className="h-6 w-6 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>

          <h1 className="mt-3 text-xl font-bold tracking-tight">
            Dev<span className="text-primary">Pulse</span>
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            Build • Share • Grow
          </p>
        </div>

        {/* ================================= */}
        {/* Form */}
        {/* ================================= */}

        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;