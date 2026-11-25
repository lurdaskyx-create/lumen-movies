import { GridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="page-x pb-6 pt-28 sm:pt-32" aria-busy="true">
      <div className="skeleton mb-3 h-9 w-64 rounded-lg" />
      <div className="skeleton mb-10 h-4 w-80 max-w-full rounded" />
      <GridSkeleton count={12} />
    </div>
  );
}
