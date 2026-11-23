"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  open: boolean;
  onClose: () => void;
}

const liteText = "#333333";
const softBlack = "#111111";

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  useEffect(() => {
    if (!query.trim()) return setResults([]);

    const timer = setTimeout(async () => {
      setLoading(true);

      let { data, error } = await supabase
        .from("products")
        .select("id, name, brand, images, price, offerprice")
        .textSearch("search_vector", query, { type: "websearch" })
        .limit(8);

      if (!data?.length) {
        ({ data, error } = await supabase
          .from("products")
          .select("id, name, brand, images, price, offerprice")
          .or(
            `name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%,tags_text.ilike.%${query}%`
          )
          .limit(8));
      }

      if (!error) setResults(data || []);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&page=1`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "#FFFFFF" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 px-4 py-3 mx-3 mt-3"
            style={{ borderBottom: "1px solid #EAEAEA" }}
          >
            <button type="button" onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}>
              <ArrowLeft className="h-6 w-6" style={{ color: softBlack, strokeWidth: 1.5 }} />
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-base focus:outline-none bg-transparent"
              style={{
                 color: softBlack,
                 fontFamily: "'Inter', sans-serif",
                 fontWeight: 300,
                 letterSpacing: "0.05em"
              }}
              autoFocus
            />
            <button type="submit" style={{ border: "none", background: "none", cursor: "pointer" }}>
              <SearchIcon className="h-6 w-6" style={{ color: softBlack, strokeWidth: 1.5 }} />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto mt-2">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-[10px] uppercase tracking-[0.2em]" style={{ color: softBlack }}>
                CURATING...
              </div>
            ) : results.length ? (
              results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(`/product/${item.id}`);
                    onClose();
                  }}
                  className="flex items-center gap-4 px-4 py-4 w-full text-left"
                  style={{ borderBottom: "1px solid #EAEAEA", background: "transparent", cursor: "pointer" }}
                >
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="w-14 h-20 object-cover"
                    style={{ borderRadius: 0, border: "1px solid #EAEAEA" }}
                  />
                  <div className="flex flex-col flex-1 min-w-0 gap-2">
                    <span className="truncate uppercase" style={{ color: softBlack, fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em" }}>
                      {item.name}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#93722B', fontSize: "14px", fontWeight: 700 }}>
                        ₹{item.offerprice || item.price}
                      </span>
                      {item.offerprice && (
                        <span style={{ color: '#93722B', fontSize: "10px", fontWeight: 600, opacity: 0.6, textDecoration: "line-through" }}>
                          ₹{item.price}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : query ? (
              <div className="flex items-center justify-center py-10 text-[10px] uppercase tracking-[0.2em]" style={{ color: softBlack }}>
                NO RESULTS FOUND
              </div>
            ) : (
              <div className="flex items-center justify-center py-10 text-[10px] uppercase tracking-[0.2em]" style={{ color: softBlack }}>
                START EXPERIENCING OROX
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
