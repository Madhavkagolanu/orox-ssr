"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: string;
  offerPrice?: string;
  image: string;
  stockQty?: number;
}

const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  const isOutOfStock = product.stockQty === 0;

  const parsePrice = (priceStr: string) =>
    Number(priceStr.replace(/[^0-9.-]+/g, ""));

  const price = parsePrice(product.price);
  const offerPrice = product.offerPrice ? parsePrice(product.offerPrice) : null;

  const handleClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white group overflow-hidden flex flex-col ${isOutOfStock ? "cursor-not-allowed" : "cursor-pointer"
        }`}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F9F9F9]">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? "brightness-[0.6] contrast-[1.1] saturate-[0.8]" : ""
            }`}
        />
        {isOutOfStock && (
          <div className="absolute top-0 right-0 bg-black text-white px-3 py-1.5 z-10 border-b border-l border-[#222]">
            <span className="text-[9px] uppercase tracking-[0.3em] font-semibold">
              UNAVAILABLE
            </span>
          </div>
        )}
      </div>

      <div className="py-4 flex flex-col items-center text-center">
        <h3
          className={`text-[10px] sm:text-xs uppercase tracking-[0.15em] font-semibold line-clamp-1 ${isOutOfStock ? "text-gray-500" : "text-[#111]"
            }`}
        >
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-center gap-2">
          {offerPrice && !isOutOfStock ? (
            <>
              <span className="text-xs sm:text-sm font-bold" style={{ color: '#93722B' }}>
                {product.offerPrice}
              </span>
              <span className="line-through text-[10px] sm:text-xs font-semibold opacity-60" style={{ color: '#93722B' }}>
                {product.price}
              </span>
            </>
          ) : (
            <span
              className={`text-xs sm:text-sm font-bold ${isOutOfStock ? "text-gray-400" : ""
                }`}
              style={!isOutOfStock ? { color: '#93722B' } : {}}
            >
              {product.price}
            </span>
          )}

          {isOutOfStock && offerPrice && (
            <span className="line-through text-gray-400 text-xs text-center block mt-1">
              {product.offerPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
