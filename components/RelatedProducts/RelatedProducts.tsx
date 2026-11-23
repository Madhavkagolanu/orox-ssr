"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/Card/Card";
import ProductCardSkeleton from "@/components/Card/ProductCardSkeleton";

type Product = {
  id: string;
  name: string;
  price: number;
  offerprice?: number;
  images: string[];
};

interface Props {
  currentProductId: string;
  limit?: number;
}

export default function RelatedProducts({
  currentProductId,
  limit = 6,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, offerprice, images")
        .neq("id", currentProductId)
        .limit(limit);

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchRelated();
  }, [currentProductId, limit]);

  if (!loading && !products.length) return null;

  return (
    <div className="pt-12 pb-24">
      <div className="w-full flex flex-col items-center justify-center mb-12">
        <h2 className="text-2xl font-playfair tracking-widest text-zinc-900 uppercase text-center">
          Curated Elegance
        </h2>
        <div className="h-px w-16 bg-zinc-300 mt-6"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-6">
        {loading
          ? Array.from({ length: limit }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  price: `₹${p.price.toLocaleString()}`,
                  offerPrice: p.offerprice
                    ? `₹${p.offerprice.toLocaleString()}`
                    : undefined,
                  image: p.images?.[0] || "/placeholder.png",
                }}
              />
            ))}
      </div>
    </div>
  );
}
