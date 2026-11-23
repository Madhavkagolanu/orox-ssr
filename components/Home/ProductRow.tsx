"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';
import ProductCard from "../Card/Card";
import ProductCardSkeleton from "../Card/ProductCardSkeleton";

interface ProductRowProps {
  title: string;
  subtitle?: string;
  search: string;
  limit?: number;
}

export default function ProductRow({
  title,
  subtitle = "Our exclusive product collection",
  search,
  limit = 4,
}: ProductRowProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const viewAllUrl = `/search?q=${encodeURIComponent(search)}&page=1`;

  const fetchProducts = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("products")
      .select("id, name, brand, images, price, offerprice, stock_qty")
      .or(
        `name.ilike.%${search}%, description.ilike.%${search}%, brand.ilike.%${search}%, tags_text.ilike.%${search}%`
      )
      .gt("stock_qty", 0)
      .limit(limit);

    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="px-4 mt-10">
      <div className="mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-center">
          {title}
        </h2>

        <div className="relative mt-1">
          <p className="text-sm text-gray-500 text-center">{subtitle}</p>

          <Link
            href={viewAllUrl}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium text-pink-500 border-b border-pink-400 pb-0.5 hover:text-pink-600 hover:border-pink-500 transition"
          >
            See all →
          </Link>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: limit }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                id: item.id,
                name: item.name,
                description: item.brand,
                price: `₹${item.price}`,
                offerPrice: item.offerprice ? `₹${item.offerprice}` : undefined,
                image: item.images?.[0] || "/placeholder.png",
                stockQty: item.stock_qty || 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
