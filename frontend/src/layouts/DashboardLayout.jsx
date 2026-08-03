import Navbar from "@/components/layout/Navbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";

function DashboardLayout({ children }) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b bg-background/90 backdrop-blur-xl">
        <Navbar />
      </header>

      {/* Dashboard */}
      <div className="flex h-screen pt-16">
        {/* Left Sidebar */}
        <aside className="hidden w-20 shrink-0 border-r lg:block xl:w-64">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
            <LeftSidebar />
          </div>
        </aside>

        {/* Feed */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-6">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden w-80 shrink-0 border-l xl:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DashboardLayout;