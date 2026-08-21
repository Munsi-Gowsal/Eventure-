export const EventCardSkeleton = () => {
  return (
    <div className="neo-card flex flex-col h-full bg-white animate-pulse min-h-[400px]">
      <div className="h-56 relative border-b-[3px] border-black bg-gray-200"></div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-6 bg-gray-300 rounded-none w-3/4 mb-6"></div>
        <div className="h-6 bg-gray-300 rounded-none w-1/2 mb-6"></div>
        
        <div className="mt-auto space-y-3">
          <div className="h-4 bg-gray-200 rounded-none w-full"></div>
          <div className="h-4 bg-gray-200 rounded-none w-2/3"></div>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <div className="h-12 bg-gray-300 w-full border-[3px] border-gray-400"></div>
      </div>
    </div>
  );
};
