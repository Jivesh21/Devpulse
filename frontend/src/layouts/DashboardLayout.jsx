import Navbar from "@/components/layout/Navbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <Navbar />
      </header>

      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Left Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-20 shrink-0 border-r lg:block xl:w-64">
          <div className="h-full overflow-y-auto p-3 xl:p-5">
            <LeftSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)] flex-1">
          <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-80 shrink-0 border-l xl:block">
          <div className="h-full overflow-y-auto p-5">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DashboardLayout;