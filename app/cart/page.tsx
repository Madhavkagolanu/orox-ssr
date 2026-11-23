"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { logEvent } from "@/utils/analytics";
import { getSizeAddon } from "@/utils/sizes";

interface ProductData {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  image: string;
  returnpolicy: string;
  stock_qty: number;
  sizes?: any;
}

interface Coupon {
  code: string;
  discount_percent?: number;
  discount_amount?: number;
  free_delivery?: boolean;
  expiry_date: string;
}

const ShoppingBagIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M5 8h14v13H5z" />
    <path d="M8 8V5a4 4 0 0 1 8 0v3" />
  </svg>
);

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState<Record<string, ProductData>>({});
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponBoxOpen, setCouponBoxOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<{
    uid: string;
    size: string;
  } | null>(null);

  const router = useRouter();
  const { user } = useAuth();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEvent("Cart", "View", "");
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const uniqueIds = Array.from(new Set(cart.map((i) => i.uid)));
      const map: Record<string, ProductData> = { ...products };

      for (const id of uniqueIds) {
        if (map[id]) continue;

        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, offerprice, images, returnpolicy, stock_qty, sizes")
          .eq("id", id)
          .maybeSingle();

        if (!error && data) {
          map[id] = {
            id: data.id,
            name: data.name,
            price: Number(data.price),
            offerPrice: data.offerprice ? Number(data.offerprice) : undefined,
            image: data.images?.[0] || "",
            returnpolicy: data.returnpolicy || "",
            stock_qty: data.stock_qty || 0,
            sizes: data.sizes,
          };
        }
      }

      setProducts(map);
    };

    if (cart.length > 0) fetchProducts();
  }, [cart]);

  const availableItems = cart.filter((item) => {
    const product = products[item.uid];
    return product && product.stock_qty > 0;
  });

  const outOfStockItems = cart.filter((item) => {
    const product = products[item.uid];
    return product && product.stock_qty === 0;
  });

  const handleRemove = async (uid: string, size: string) => {
    await removeFromCart(uid, size);
  };

  const handleQuantity = async (uid: string, size: string, q: number) => {
    if (q <= 0) return setConfirmRemove({ uid, size });

    const product = products[uid];
    if (product && q > product.stock_qty) {
      toast.error(`Only ${product.stock_qty} items available in stock`);
      return;
    }

    await updateQuantity(uid, size, q);
  };

  const applyCoupon = async () => {
    setCouponError("");
    setAppliedCoupon(null);

    if (!couponCode.trim()) {
      setCouponError("Please enter a privilege code.");
      return;
    }

    const { data, error } = await supabase
      .from("coupons")
      .select("code, discount_percent, discount_amount, free_delivery, expiry_date")
      .eq("code", couponCode.trim().toUpperCase())
      .maybeSingle();

    if (error || !data) {
      setCouponError("Invalid privilege code.");
      return;
    }

    const expiry = new Date(data.expiry_date);
    if (expiry < new Date()) {
      setCouponError("This code has expired.");
      return;
    }

    setAppliedCoupon(data);
    toast.success(`Privilege applied: ${data.code}`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast("Privilege code removed", { icon: "✖️" });
  };

  const getItemPrices = (item: { uid: string; size: string }) => {
    const p = products[item.uid];
    if (!p) return { price: 0, offerPrice: undefined, addon: 0 };
    const addon = getSizeAddon(p.sizes, item.size);
    return {
      price: p.price + addon,
      offerPrice: p.offerPrice ? p.offerPrice + addon : undefined,
      addon,
    };
  };

  const subtotal = availableItems.reduce((acc, item) => {
    const { price } = getItemPrices(item);
    return acc + price * item.quantity;
  }, 0);

  const savings = availableItems.reduce((acc, item) => {
    const { price, offerPrice } = getItemPrices(item);
    return offerPrice ? acc + (price - offerPrice) * item.quantity : acc;
  }, 0);

  const discountedSubtotal = subtotal - savings;

  let couponSavings = 0;

  if (appliedCoupon) {
    if (appliedCoupon.discount_percent) {
      couponSavings += discountedSubtotal * (appliedCoupon.discount_percent / 100);
    }
    if (appliedCoupon.discount_amount) {
      couponSavings += appliedCoupon.discount_amount;
    }
  }

  const total = Math.max(0, discountedSubtotal - couponSavings);

  const outOfStockSubtotal = outOfStockItems.reduce((acc, item) => {
    const p = products[item.uid];
    return p ? acc + (p.offerPrice ?? p.price) * item.quantity : acc;
  }, 0);

  const handleProceedToOrder = () => {
    if (!user) {
      toast.error("Please login to continue.");
      return router.push("/login");
    }

    if (availableItems.length === 0 && outOfStockItems.length > 0) {
      toast.error("Cannot proceed. All items in your cart are out of stock.");
      return;
    }

    router.push("/order-confirmation");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "orderData",
        JSON.stringify({
          cart: availableItems,
          products,
          subtotal,
          total,
          coupon: appliedCoupon,
          hasOutOfStockItems: outOfStockItems.length > 0,
        })
      );
    }
  };

  const removeOutOfStockItems = () => {
    outOfStockItems.forEach((item) => {
      removeFromCart(item.uid, item.size);
    });
    toast.success(`Removed ${outOfStockItems.length} out-of-stock items from cart`);
  };

  const SummaryBreakdown = () => (
    <div className="space-y-3 font-sans" style={{ letterSpacing: "0.05em", fontSize: "0.85rem", color: "#111" }}>
      {availableItems.length > 0 && (
        <>
          <div className="flex justify-between items-center pb-2 border-b border-[#EAEAEA]">
            <span className="uppercase text-[#555]">Subtotal ({availableItems.length} pieces)</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between items-center pb-2 border-b border-[#EAEAEA]">
              <span className="uppercase text-[#555]">Benefit</span>
              <span className="font-semibold">-₹{savings.toFixed(2)}</span>
            </div>
          )}

          {appliedCoupon && couponSavings > 0 && (
            <div className="flex justify-between items-center pb-2 border-b border-[#EAEAEA]">
              <span className="uppercase text-[#555]">Privilege Benefit</span>
              <span className="font-semibold">-₹{couponSavings.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pb-2 border-b border-[#EAEAEA]">
            <span className="uppercase text-[#555]">Complimentary Delivery</span>
            <span className="font-bold">INCLUDED</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="pt-24 flex flex-col min-h-screen bg-white">
      {/* Confirm Remove Dialog */}
      <AnimatePresence>
        {confirmRemove && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 max-w-sm w-full border border-black shadow-2xl rounded-none">
              <p className="text-black font-semibold text-center uppercase tracking-widest text-sm mb-6">
                Remove from Shopping Bag?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmRemove(null)}
                  className="flex-1 border border-black py-3 text-xs tracking-widest uppercase hover:bg-[#F9F9F9] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleRemove(confirmRemove.uid, confirmRemove.size);
                    setConfirmRemove(null);
                  }}
                  className="flex-1 bg-black text-white py-3 text-xs tracking-widest uppercase hover:bg-[#222] transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center pb-20">
          <div className="mb-6">
            <ShoppingBagIcon />
          </div>
          <h2 className="text-xl uppercase tracking-[0.2em] font-light text-black mb-2">Shopping Bag is Empty</h2>
          <p className="text-sm tracking-widest text-[#555] mt-2 uppercase font-light">
            Discover our latest collections
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-8 px-8 py-3 border border-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="mb-8 max-w-[1400px] mx-auto w-full px-4 lg:px-10">
          <div className="mt-4 mb-8">
            <h1 className="text-2xl font-light uppercase tracking-[0.15em] text-black">
              Shopping Bag
            </h1>

            {outOfStockItems.length > 0 && (
              <div className="mt-4 p-4 border border-black bg-[#F9F9F9]">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tracking-widest uppercase text-black">
                      {outOfStockItems.length} Piece(s) Unavailable
                    </span>
                  </div>
                  <button
                    onClick={removeOutOfStockItems}
                    className="text-xs px-4 py-2 bg-black text-white uppercase tracking-widest hover:bg-[#333]"
                  >
                    Remove Unavailable
                  </button>
                </div>
              </div>
            )}
            <div className="w-full h-[1px] bg-black mt-6"></div>
          </div>

          <div className="lg:flex lg:gap-12">
            {/* Left side: Items */}
            <div className="lg:flex-1">
              <div ref={scrollRef} className="pb-32 lg:pb-8">
                {availableItems.length > 0 && (
                  <div className="mb-8">
                    {availableItems.map((item) => {
                      const p = products[item.uid];
                      if (!p) return null;

                      return (
                        <div
                          key={`${item.uid}-${item.size}`}
                          className="flex py-6 border-b border-[#EAEAEA] group gap-6"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-32 h-40 object-cover border border-[#EAEAEA] lg:w-40 lg:h-52"
                          />

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <h2 className="text-lg font-light uppercase tracking-widest text-[#111]">
                                  {p.name}
                                </h2>
                                <button
                                  onClick={() =>
                                    setConfirmRemove({ uid: item.uid, size: item.size })
                                  }
                                  className="text-[#999] hover:text-black transition-colors"
                                >
                                  <X size={20} strokeWidth={1} />
                                </button>
                              </div>

                              {Boolean(p.returnpolicy && p.returnpolicy.trim()) && (
                                <p className="text-xs uppercase tracking-widest text-[#777] mt-2">
                                  {p.returnpolicy}
                                </p>
                              )}

                              <div className="mt-4 flex items-baseline gap-3">
                                <span className="text-lg font-medium" style={{ color: '#93722B' }}>
                                  ₹{getItemPrices(item).offerPrice ?? getItemPrices(item).price}
                                </span>
                                {!!getItemPrices(item).offerPrice && (
                                  <>
                                    <span className="line-through text-xs tracking-widest opacity-60" style={{ color: '#93722B' }}>
                                      ₹{getItemPrices(item).price}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-end justify-between mt-6">
                              {item.size && (
                                <span className="text-xs uppercase tracking-widest text-[#555]">
                                  Variant: <span className="font-semibold text-black">{item.size}</span>
                                </span>
                              )}

                              <div className="flex items-center mt-1">
                                <span className="text-xs font-semibold text-[#111] uppercase tracking-[0.1em]">
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {outOfStockItems.length > 0 && (
                  <div className="mb-12 mt-12 border-t border-black pt-12">
                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#111] mb-8 font-semibold">
                      Unavailable Pieces
                    </h3>

                    {outOfStockItems.map((item) => {
                      const p = products[item.uid];
                      if (!p) return null;

                      return (
                        <div
                          key={`${item.uid}-${item.size}`}
                          className="flex py-8 border-b border-[#EAEAEA] gap-6 opacity-50"
                        >
                          <div className="w-24 border border-[#EAEAEA] relative">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover grayscale"
                              style={{ aspectRatio: "4/5" }}
                            />
                            <div className="absolute inset-0 bg-black/5" />
                          </div>

                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                              <div>
                                <h2 className="text-xs uppercase tracking-[0.15em] text-[#111] font-medium leading-loose">
                                  {p.name}
                                </h2>
                                {item.size && (
                                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#555] block mt-2">
                                    Variant: <span className="text-[#111] font-semibold">{item.size}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mt-6 flex flex-col items-start gap-1">
                              <span className="px-3 py-1 bg-black text-white text-[9px] tracking-[0.3em] font-semibold uppercase">
                                Unavailable
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Privilege Area */}
                <div className="mt-8 mb-12">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between border border-black bg-[#F9F9F9] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-[0.1em] font-medium text-black">
                          Privilege Activated: {appliedCoupon.code}
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[#999] hover:text-black transition-colors"
                      >
                        <X size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  ) : (
                    <motion.div layout className="border border-[#EAEAEA] rounded-none">
                      <button
                        onClick={() => setCouponBoxOpen(!couponBoxOpen)}
                        className={`flex items-center justify-between w-full px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${couponBoxOpen ? "bg-[#111] text-white" : "bg-white text-black hover:bg-[#F9F9F9]"
                          }`}
                      >
                        Have a Privilege Code?
                        {couponBoxOpen ? (
                          <ChevronUp size={18} strokeWidth={1.5} />
                        ) : (
                          <ChevronDown size={18} strokeWidth={1.5} />
                        )}
                      </button>

                      <AnimatePresence>
                        {couponBoxOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-[#F9F9F9]"
                          >
                            <div className="p-5">
                              <div className="flex">
                                <input
                                  type="text"
                                  value={couponCode.toUpperCase()}
                                  onChange={(e) => {
                                    setCouponCode(e.target.value.toUpperCase());
                                    setCouponError("");
                                  }}
                                  placeholder="ENTER SECRETS"
                                  className="flex-1 border border-r-0 border-black px-4 py-3 text-sm outline-none bg-transparent uppercase tracking-[0.1em] placeholder-[#999]"
                                />
                                <button
                                  onClick={applyCoupon}
                                  className="px-6 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-[#222] transition-colors border border-black"
                                >
                                  Apply
                                </button>
                              </div>

                              {couponError && (
                                <p className="text-xs font-medium tracking-widest uppercase text-black mt-3">
                                  {couponError}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Sidebar Summary */}
            <div className="hidden lg:block lg:w-96 xl:w-[400px]">
              <div className="bg-[#F9F9F9] border border-[#EAEAEA] p-8 sticky top-32">
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-black mb-1">
                  Order Summary
                </h3>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-6">
                  Magnetic Backplate Only · Phone Not Included
                </span>

                {availableItems.length === 0 && outOfStockItems.length > 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm tracking-widest uppercase text-[#555] mb-4">
                      Pieces Unavailable
                    </p>
                    <button
                      onClick={removeOutOfStockItems}
                      className="w-full bg-black text-white py-3 text-xs uppercase tracking-[0.15em] hover:bg-[#222]"
                    >
                      Clear Bag
                    </button>
                  </div>
                ) : (
                  <>
                    <SummaryBreakdown />
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-black">
                      <span className="uppercase text-sm tracking-widest text-[#111] font-semibold">Total Payable</span>
                      <span className="text-lg tracking-wider font-semibold" style={{ color: '#93722B' }}>₹{total.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleProceedToOrder}
                      disabled={availableItems.length === 0}
                      className={`w-full mt-8 py-4 text-xs font-medium uppercase tracking-[0.2em] transition-colors border ${availableItems.length === 0
                        ? "bg-transparent border-[#CCC] text-[#999] cursor-not-allowed"
                        : "bg-black border-black text-white hover:bg-transparent hover:text-black"
                        }`}
                    >
                      SECURE CHECKOUT
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Bottom Fixed Summary */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black p-4 z-40">
            {availableItems.length === 0 && outOfStockItems.length > 0 ? (
              <button
                onClick={removeOutOfStockItems}
                className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.15em]"
              >
                Clear Unavailable
              </button>
            ) : (
              <>
                <button
                  onClick={() => setSummaryExpanded(!summaryExpanded)}
                  className="flex items-center justify-between w-full mb-4"
                  disabled={availableItems.length === 0}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tracking-widest uppercase text-black">
                      Total Payable: <span style={{ color: '#93722B' }}>₹{total.toFixed(2)}</span>
                    </span>
                  </div>
                  {summaryExpanded ? (
                    <ChevronDown size={20} strokeWidth={1} />
                  ) : (
                    <ChevronUp size={20} strokeWidth={1} />
                  )}
                </button>

                <AnimatePresence>
                  {summaryExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <SummaryBreakdown />
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleProceedToOrder}
                  disabled={availableItems.length === 0}
                  className={`w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors border ${availableItems.length === 0
                    ? "bg-[#F9F9F9] border-[#CCC] text-[#999] cursor-not-allowed"
                    : "bg-black border-black text-white"
                    }`}
                >
                  SECURE CHECKOUT
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
