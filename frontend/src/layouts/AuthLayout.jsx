import LeftHero from "../components/auth/LeftHero";

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* ================================= */}
      {/* Left Hero */}
      {/* ================================= */}

      <LeftHero />

      {/* ================================= */}
      {/* Auth Content */}
      {/* ================================= */}

      <main
        className="
          flex
          min-h-screen
          w-full
          items-start
          justify-center
          px-5
          pt-10
          pb-8
          sm:px-6
          sm:pt-12
          lg:w-1/2
          lg:items-center
          lg:py-12
        "
      >
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;