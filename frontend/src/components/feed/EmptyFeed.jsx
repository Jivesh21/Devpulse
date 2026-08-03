function EmptyFeed() {
  return (
    <div className="rounded-2xl border bg-card p-12 text-center shadow-sm">
      <h2 className="text-2xl font-semibold">
        No posts yet 🚀
      </h2>

      <p className="mt-2 text-muted-foreground">
        Be the first developer to share something.
      </p>
    </div>
  );
}

export default EmptyFeed;