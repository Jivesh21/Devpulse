import DashboardLayout from "@/layouts/DashboardLayout";

function FeedPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to DevPulse 🚀
          </h1>

          <p className="mt-3 text-muted-foreground">
            Your personalized developer feed will appear here.
          </p>
        </div>

        {/* Feed Placeholder */}
        <div className="rounded-2xl border border-dashed p-16 text-center">
          <h2 className="text-xl font-semibold">
            Feed Coming Soon
          </h2>

          <p className="mt-2 text-muted-foreground">
            Posts from developers you follow will appear here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default FeedPage;