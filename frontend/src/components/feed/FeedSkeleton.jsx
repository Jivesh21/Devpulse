function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border bg-card p-6"
        >
          <div className="mb-4 h-10 w-10 rounded-full bg-muted" />

          <div className="mb-3 h-4 w-40 rounded bg-muted" />

          <div className="mb-2 h-3 rounded bg-muted" />

          <div className="mb-2 h-3 w-5/6 rounded bg-muted" />

          <div className="h-3 w-3/4 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default FeedSkeleton;