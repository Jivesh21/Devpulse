import Navbar from "@/components/layout/Navbar";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";

function DashboardLayout({
  children,
  wide = false,
  hideRightSidebar = false,
}) {
  return (
    <div className="min-h-screen bg-background">

      {/* ================================= */}
      {/* Navbar */}
      {/* ================================= */}

      <Navbar />

      {/* ================================= */}
      {/* Dashboard */}
      {/* ================================= */}

      <div
        className="
          flex
          min-h-[calc(100vh-4rem)]
        "
      >

        {/* ================================= */}
        {/* Left Sidebar */}
        {/* ================================= */}

        <aside
          className="
            sticky
            top-16
            hidden
            h-[calc(100vh-4rem)]
            w-20
            shrink-0
            overflow-y-auto
            border-r
            border-border/50
            bg-background/70
            backdrop-blur-xl
            lg:block
            xl:w-60
          "
        >
          <div
            className="
              p-3
              xl:p-4
            "
          >
            <LeftSidebar />
          </div>
        </aside>

        {/* ================================= */}
        {/* Main Content */}
        {/* ================================= */}

        <main
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className={`
              mx-auto
              w-full
              px-4
              py-6
              sm:px-6
              lg:px-8
              ${
                wide
                  ? "max-w-6xl"
                  : "max-w-3xl"
              }
            `}
          >
            {children}
          </div>
        </main>

        {/* ================================= */}
        {/* Right Sidebar */}
        {/* ================================= */}

        {!hideRightSidebar && (
          <aside
            className="
              sticky
              top-16
              hidden
              h-[calc(100vh-4rem)]
              w-72
              shrink-0
              overflow-y-auto
              border-l
              border-border/50
              bg-background/50
              backdrop-blur-xl
              xl:block
            "
          >
            <div className="p-4">
              <RightSidebar />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default DashboardLayout;