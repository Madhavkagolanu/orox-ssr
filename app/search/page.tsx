"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/Card/Card";
import NoResults from "@/components/NoResults";
import ProductCardSkeleton from "@/components/Card/ProductCardSkeleton";
import { logEvent } from "@/utils/analytics";

function SearchContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);
  const limit = 16;

  const fetchProducts = async () => {
    if (!query.trim()) {
      setProducts([]);
      setTotal(0);
      return;
    }

    logEvent("Search", "Query", query);

    setLoading(true);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let data: any[] = [];
    let count = 0;

    const { count: ftCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .textSearch("search_vector", query, { type: "websearch" });

    const { data: ftData, error: ftError } = await supabase
      .from("products")
      .select("id, name, brand, images, price, offerprice, stock_qty, category")
      .textSearch("search_vector", query, { type: "websearch" })
      .order("id", { ascending: false })
      .range(from, to);

    if (!ftError && (ftCount ?? 0) > limit) {
      data = ftData ?? [];
      count = ftCount || (ftData?.length ?? 0);
    } else {
      const words = query.trim().split(/\s+/);
      const conditions = words.flatMap((w) => [
        `name.ilike.%${w}%`,
        `description.ilike.%${w}%`,
        `brand.ilike.%${w}%`,
        `tags_text.ilike.%${w}%`,
      ]);

      const {
        data: fbData,
        error: fbError,
        count: fbCount,
      } = await supabase
        .from("products")
        .select("id, name, brand, images, price, offerprice, stock_qty, category", {
          count: "exact",
        })
        .or(conditions.join(","))
        .order("id", { ascending: false })
        .range(from, to);

      if (!fbError && fbData) {
        data = fbData;
        count = fbCount || fbData.length;
      } else {
        console.error("Search error:", fbError);
      }
    }

    const normalized = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.brand || p.category,
      price: p.price ? `₹${Number(p.price).toLocaleString()}` : undefined,
      offerPrice: p.offerprice
        ? `₹${Number(p.offerprice).toLocaleString()}`
        : undefined,
      image: p.images?.[0] || "/placeholder.png",
      stockQty: p.stock_qty || 0,
    }));

    setProducts(normalized);
    setTotal(count);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [query, page]);

  const totalPages = Math.ceil(total / limit);
  const goToPage = (p: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${p}`);
  };

  return (
    <div className="flex gap-4 px-3 py-6 pt-20">
      <div className="flex-1 mt-2">
        {products.length > 0 && (
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-black mb-10 text-center sm:text-left mt-4">
            Search results for &quot;{query}&quot;
          </h2>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-8 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-10 h-10 flex items-center justify-center text-xs font-semibold tracking-widest transition-colors duration-300 ${
                        p === page
                          ? "bg-black text-white border border-black"
                          : "bg-white text-black border border-black/20 hover:border-black"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <NoResults query={query} />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-20 px-4">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
