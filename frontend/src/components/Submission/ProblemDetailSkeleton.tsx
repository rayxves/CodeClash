const ProblemDetailSkeleton = () => (
  <div className="bg-card rounded-xl border border-border p-4 mb-6 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-muted h-7 w-20 rounded-full"></div>
      <div className="bg-muted h-7 w-28 rounded-full"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="bg-muted h-4 w-full rounded"></div>
      <div className="bg-muted h-4 w-full rounded"></div>
      <div className="bg-muted h-4 w-4/5 rounded"></div>
    </div>
    <div className="bg-muted h-5 w-32 mb-2 rounded"></div>
    <div className="space-y-2">
      <div className="bg-muted h-16 w-full rounded-lg"></div>
      <div className="bg-muted h-16 w-full rounded-lg"></div>
    </div>
  </div>
);

export default ProblemDetailSkeleton;
