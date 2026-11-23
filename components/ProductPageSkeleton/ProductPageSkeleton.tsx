// components/ProductPageSkeleton/ProductPageSkeleton.tsx
const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent";

export default function ProductPageSkeleton() {
  return (
    <div className="pt-20">
      {/* Mobile Skeleton */}
      <div className="block lg:hidden">
        <div className={`${shimmer} w-full h-[70vh] bg-[#F9F9F9]`} />
        <div className="px-6 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div className={`${shimmer} h-6 bg-[#EAEAEA] w-3/4`} />
            <div className={`${shimmer} h-6 bg-[#EAEAEA] w-8`} />
          </div>
          <div className="flex flex-col gap-2 mb-8">
            <div className={`${shimmer} h-3 bg-[#EAEAEA] w-full`} />
            <div className={`${shimmer} h-3 bg-[#EAEAEA] w-5/6`} />
            <div className={`${shimmer} h-3 bg-[#EAEAEA] w-4/6`} />
          </div>
          <div className="flex justify-between items-center mb-12">
            <div className={`${shimmer} h-6 bg-[#EAEAEA] w-24`} />
            <div className={`${shimmer} h-12 bg-[#EAEAEA] w-[160px]`} />
          </div>
          <div className="mb-10">
            <div className={`${shimmer} h-3 bg-[#EAEAEA] w-24 mb-4`} />
            <div className="flex gap-3 flex-wrap">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`${shimmer} h-10 w-16 border border-[#EAEAEA] bg-[#F9F9F9]`} />
              ))}
            </div>
          </div>
          <div>
            <div className={`${shimmer} h-4 bg-[#EAEAEA] w-32 mb-4`} />
            <div className="flex flex-col gap-2">
              <div className={`${shimmer} h-3 bg-[#EAEAEA] w-full`} />
              <div className={`${shimmer} h-3 bg-[#EAEAEA] w-5/6`} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            <div className="w-full">
              <div className={`${shimmer} w-full h-[75vh] min-h-[600px] bg-[#F9F9F9]`} />
            </div>
            <div className="flex flex-col py-8">
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <div className={`${shimmer} h-8 bg-[#EAEAEA] w-2/3`} />
              </div>
              <div className={`${shimmer} h-5 bg-[#EAEAEA] w-24 mb-8`} />
              <div className="flex flex-col gap-3 mb-10">
                <div className={`${shimmer} h-3 bg-[#EAEAEA] w-full`} />
                <div className={`${shimmer} h-3 bg-[#EAEAEA] w-11/12`} />
                <div className={`${shimmer} h-3 bg-[#EAEAEA] w-10/12`} />
                <div className={`${shimmer} h-3 bg-[#EAEAEA] w-9/12`} />
              </div>
              <div className="flex justify-between items-center mb-16">
                 <div className={`${shimmer} h-8 bg-[#EAEAEA] w-32`} />
                 <div className={`${shimmer} h-12 bg-[#EAEAEA] w-[180px]`} />
              </div>
              <div className="mb-12">
                <div className={`${shimmer} h-4 bg-[#EAEAEA] w-28 mb-4`} />
                <div className="flex gap-4 flex-wrap">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`${shimmer} h-12 w-20 border border-[#EAEAEA] bg-[#F9F9F9]`} />
                  ))}
                </div>
              </div>
              
              <div className="mt-auto">
                <div className={`${shimmer} h-5 bg-[#EAEAEA] w-36 mb-4`} />
                <div className="flex flex-col gap-2">
                  <div className={`${shimmer} h-3 bg-[#EAEAEA] w-full`} />
                  <div className={`${shimmer} h-3 bg-[#EAEAEA] w-11/12`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
