import LeftHero from "../components/auth/LeftHero";

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <LeftHero />

      <main className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;