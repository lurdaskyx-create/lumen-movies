export function CardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[2/3] rounded-xl" />
      <div className="skeleton mt-2 h-3.5 w-4/5 rounded" />
      <div className="skeleton mt-1.5 h-3 w-1/3 rounded" />
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="py-4" role="status" aria-label="Loading">
      <div className="page-x mb-3">
        <div className="skeleton h-6 w-48 rounded" />
      </div>
      <div className="flex gap-3 overflow-hidden px-4 sm:gap-4 sm:px-6 lg:px-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-[138px] shrink-0 sm:w-[160px] lg:w-[188px]">
            <CardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="skeleton h-[70svh] min-h-[480px] w-full" role="status" aria-label="Loading" />;
}
