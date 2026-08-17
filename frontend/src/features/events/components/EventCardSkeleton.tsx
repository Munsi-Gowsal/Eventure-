

export const EventCardSkeleton = () => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl overflow-hidden flex flex-col border border-[var(--color-border-subtle)] animate-pulse h-[350px]">
      <div className="h-48 bg-gray-800"></div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="mt-auto space-y-2">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
      <div className="bg-gray-800 px-4 py-3 flex justify-between items-center h-[52px]">
        <div className="h-5 bg-gray-700 rounded w-12"></div>
        <div className="h-5 bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  );
};
