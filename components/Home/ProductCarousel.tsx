"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';
import ProductCard from "../Card/Card";
import ProductCardSkeleton from "../Card/ProductCardSkeleton";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  search: string;
  limit?: number;
}

export default function ProductCarousel({
  title,
  subtitle = "Our exclusive product collection",
  search,
  limit = 10,
}: ProductCarouselProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const viewAllUrl = `/search?q=${encodeURIComponent(search)}&page=1`;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("products")
        .select("id, name, brand, images, price, offerprice, stock_qty")
        .or(
          `name.ilike.%${search}%, description.ilike.%${search}%, brand.ilike.%${search}%, tags_text.ilike.%${search}%`
        )
        .gt("stock_qty", 0) // ✅ skip out-of-stock
        .limit(limit);

      if (data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [search, limit]);

  return (
    <div className="px-4 mt-10">
      {/* Header (same as ProductRow) */}
      <div className="mb-3 relative text-center">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>

        <Link
          href={viewAllUrl}
          className="
            absolute right-0 top-1/2 -translate-y-1/2
            text-xs sm:text-sm
            font-medium
            text-pink-500
            border-b border-pink-400
            pb-0.5
            hover:text-pink-600
            hover:border-pink-500
            transition
          "
        >
          See all →
        </Link>
      </div>

      {/* Carousel */}
      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[160px] sm:min-w-[200px]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
            flex gap-3
            overflow-x-auto
            pb-2
            scroll-smooth
            no-scrollbar
          "
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="min-w-[160px] sm:min-w-[180px] lg:min-w-[220px]"
            >
              <ProductCard
                product={{
                  id: item.id,
                  name: item.name,
                  description: item.brand,
                  price: `₹${item.price}`,
                  offerPrice: item.offerprice
                    ? `₹${item.offerprice}`
                    : undefined,
                  image: item.images?.[0] || "/placeholder.png",
                  stockQty: item.stock_qty || 0,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
