"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';

interface FeaturedProductGridProps {
  title: string;
  subtitle?: string;
  search: string;
}

export default function FeaturedProductGrid({
  title,
  subtitle = "Featured picks",
  search,
}: FeaturedProductGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const viewAllUrl = `/search?q=${encodeURIComponent(search)}&page=1`;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("products")
        .select("id, images")
        .or(
          `name.ilike.%${search}%, description.ilike.%${search}%, brand.ilike.%${search}%, tags_text.ilike.%${search}%`
        )
        .limit(6);

      if (data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [search]);

  if (loading || products.length < 6) return null;

  return (
    <div className="px-4 mt-14">
      {/* Header (same UX as ProductRow) */}
      <div className="mb-4 relative text-center">
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

      {/* FIXED GRID */}
      <div
        className="
          grid grid-cols-3 grid-rows-3 gap-3
          max-w-5xl mx-auto
        "
      >
        {/* BIG */}
        <ImageCard
          product={products[0]}
          className="col-span-2 row-span-2 h-[420px]"
        />

        {/* RIGHT */}
        <ImageCard product={products[1]} className="h-[200px]" />
        <ImageCard product={products[2]} className="h-[200px]" />

        {/* BOTTOM */}
        <ImageCard product={products[3]} className="h-[180px]" />
        <ImageCard product={products[4]} className="h-[180px]" />
        <ImageCard product={products[5]} className="h-[180px]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* IMAGE CARD */
/* ------------------------------------------------ */

function ImageCard({
  product,
  className = "",
}: {
  product: any;
  className?: string;
}) {
  return (
    <Link
      href={`/product/${product.id}`}
      className={`relative group overflow-hidden rounded-lg ${className}`}
    >
      {/* Image */}
      <img
        src={product.images?.[0] || "/placeholder.png"}
        alt=""
        className="
          w-full h-full object-cover
          brightness-90
          group-hover:brightness-100
          group-hover:scale-105
          transition duration-300
        "
      />


    </Link>
  );
}
