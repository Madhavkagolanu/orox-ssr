"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

type Order = {
  id: string;
  total_amount: number;
  discount: number;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: number;
  order_id: string;
  product_id: string;
  size: string | null;
  quantity: number;
  price: number;
  product?: {
    name: string;
  };
};

const ShoppingBagIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M5 8h14v13H5z" />
    <path d="M8 8V5a4 4 0 0 1 8 0v3" />
  </svg>
);

const OrdersPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchOrdersAndItems = async () => {
      setLoading(true);

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_amount, discount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error(ordersError);
        toast.error("Failed to fetch orders.");
        setLoading(false);
        return;
      }

      setOrders(ordersData || []);
      if (!ordersData?.length) {
        setLoading(false);
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("id, order_id, product_id, size, quantity, price, products(name)")
        .in(
          "order_id",
          ordersData.map((o) => o.id)
        );

      if (itemsError) {
        console.error(itemsError);
        toast.error("Failed to fetch order items.");
        setLoading(false);
        return;
      }

      const grouped: Record<string, OrderItem[]> = {};
      (itemsData || []).forEach((item: any) => {
        const cleanItem: OrderItem = {
          ...item,
          product: { name: item.products?.name || "Unknown Product" },
        };
        if (!grouped[item.order_id]) grouped[item.order_id] = [];
        grouped[item.order_id].push(cleanItem);
      });

      setItems(grouped);
      setLoading(false);
    };

    fetchOrdersAndItems();
  }, [user]);

  if (authLoading) {
    return (
      <div className="pt-24 flex justify-center items-center min-h-screen">
        <span className="text-xs uppercase tracking-[0.2em] text-[#555]">Authenticating...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-24 flex justify-center items-center min-h-screen">
        <span className="text-xs uppercase tracking-[0.2em] text-[#555]">Retrieving records...</span>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 lg:px-10 max-w-4xl mx-auto min-h-screen bg-white">
      <div className="mb-10">
        <h1 className="text-2xl font-light uppercase tracking-[0.15em] text-black">
          Order History
        </h1>
        <div className="w-full h-[1px] bg-black mt-6"></div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center pb-20 mt-10">
          <div className="mb-6">
            <ShoppingBagIcon />
          </div>
          <h2 className="text-xl uppercase tracking-[0.2em] font-light text-black mb-2">
            No Orders Found
          </h2>
          <p className="text-sm tracking-widest text-[#555] mt-2 uppercase font-light">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-8 px-8 py-3 border border-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="space-y-6 pb-20">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-[#EAEAEA] bg-white rounded-none hover:border-black transition-colors"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-[#EAEAEA] pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#555]">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <p className="mt-1 font-semibold text-black text-sm uppercase tracking-widest">
                      Order <span className="font-mono font-medium tracking-normal text-[#555]">#{order.id.slice(0, 8)}</span>
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-4 py-2 uppercase tracking-widest ${order.status === "PLACED"
                      ? "bg-[#F9F9F9] text-black border border-[#EAEAEA]"
                      : order.status === "SHIPPED"
                        ? "bg-black text-white"
                        : order.status === "DELIVERED"
                          ? "bg-black text-white"
                          : "bg-[#F9F9F9] text-black border border-[#EAEAEA]"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div>
                    <p className="text-lg font-medium text-black">
                      ₹{order.total_amount.toFixed(2)}
                    </p>
                    {order.discount > 0 && (
                      <p className="text-xs uppercase tracking-widest text-[#555] mt-1">
                        Benefits applied: ₹{order.discount.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setExpanded(expanded === order.id ? null : order.id)
                    }
                    className="text-[10px] uppercase tracking-[0.1em] text-black font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity"
                  >
                    {expanded === order.id ? (
                      <>
                        Close <ChevronUp size={14} strokeWidth={1} />
                      </>
                    ) : (
                      <>
                        Details <ChevronDown size={14} strokeWidth={1} />
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {expanded === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-[#EAEAEA] space-y-4">
                        <span className="text-[10px] uppercase tracking-widest text-[#999] mb-4 block">
                          Included Pieces
                        </span>
                        {items[order.id]?.length ? (
                          items[order.id].map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-start text-sm"
                            >
                              <div className="flex-1 pr-4">
                                <p className="font-medium uppercase tracking-widest text-[#111]">
                                  {item.product?.name}
                                </p>
                                <div className="mt-1 flex gap-4 text-xs uppercase tracking-widest text-[#555]">
                                  {item.size && <span>Variant: {item.size}</span>}
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <div className="text-right whitespace-nowrap">
                                <p className="font-semibold text-black tracking-wider">
                                  ₹{(item.quantity * item.price).toFixed(2)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-[10px] uppercase tracking-widest text-[#999] mt-1">
                                    ₹{item.price} each
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#555] text-xs uppercase tracking-widest">
                            No items recovered.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
