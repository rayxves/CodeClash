const ProblemCardSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border shadow-card p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="bg-muted h-5 w-16 rounded-md"></div>
      <div className="bg-muted h-5 w-20 rounded-full"></div>
    </div>
    <div className="bg-muted h-6 w-3/4 mb-3 rounded-md"></div>
    <div className="space-y-2 mb-4">
      <div className="bg-muted h-4 w-full rounded-md"></div>
      <div className="bg-muted h-4 w-full rounded-md"></div>
      <div className="bg-muted h-4 w-2/3 rounded-md"></div>
    </div>
    <div className="flex items-center justify-between mt-6">
      <div className="bg-muted h-6 w-24 rounded-full"></div>
      <div className="bg-primary/50 h-10 w-28 rounded-lg"></div>
    </div>
  </div>
);

export default ProblemCardSkeleton;
