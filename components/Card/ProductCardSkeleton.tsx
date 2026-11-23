const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white group overflow-hidden flex flex-col">
      <div className={`${shimmer} w-full aspect-[4/5] bg-[#F9F9F9]`} />
      <div className="py-4 flex flex-col items-center gap-3">
        {/* Title placeholder */}
        <div className={`${shimmer} h-[10px] bg-[#EAEAEA] w-3/4`} />
        {/* Price placeholder */}
        <div className="flex gap-2 justify-center w-full mt-1">
           <div className={`${shimmer} h-3 bg-[#EAEAEA] w-1/4`} />
           <div className={`${shimmer} h-[10px] bg-[#EAEAEA] w-1/5 opacity-60`} />
        </div>
      </div>
    </div>
  );
}
