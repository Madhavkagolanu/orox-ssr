"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { RAZORPAY_KEY_ID } from "@/lib/razorpayClient";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { getSizeAddon } from "@/utils/sizes";

const OrderConfirmationPage: React.FC = () => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();
  const paymentSuccessRef = useRef(false);

  const [orderData, setOrderData] = useState<{
    cart: any[];
    products: Record<string, any>;
    subtotal: number;
    total: number;
    coupon: any | null;
  } | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [engravingName, setEngravingName] = useState("");
  const [loading, setLoading] = useState(false);

  // Load order data from sessionStorage (passed from cart page)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("orderData");
      if (raw) {
        try {
          setOrderData(JSON.parse(raw));
        } catch {
          router.replace("/cart");
        }
      } else {
        router.replace("/cart");
      }
    }
  }, [router]);

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to place an order.");
      router.push("/login");
      return;
    }
    if (!name || !address || !phone || !confirmPhone || !engravingName) {
      toast.error("Please fill in all required fields, including personalisation.");
      return;
    }
    if (phone !== confirmPhone) {
      toast.error("Phone numbers do not match.");
      return;
    }
    if (!orderData.cart?.length) {
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay script.");
        setLoading(false);
        return;
      }

      const amountInPaise = Math.round(orderData.total);

      const { data: order } = await axios.post(
        `${supabaseUrl}/functions/v1/create-order`,
        { amount: amountInPaise },
        {
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "OROX",
        description: "Payment for your order",
        order_id: order.id,
        prefill: {
          name,
          email: user.email,
          contact: phone,
        },

        handler: async (response: any) => {
          paymentSuccessRef.current = true;
          try {
            const verifyRes = await axios.post(
              `${supabaseUrl}/functions/v1/verify-payment`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${supabaseAnonKey}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (verifyRes.data.valid === true) {
              const orderId = `ORD-${Date.now()}-${Math.floor(
                Math.random() * 1000
              )}`;

              const finalAddress = engravingName.trim()
                ? `${address}\n\nPersonalisation: ${engravingName.trim()}`
                : address;

              const { error: orderError } = await supabase
                .from("orders")
                .insert([
                  {
                    id: orderId,
                    user_id: user.id,
                    name,
                    address: finalAddress,
                    phone,
                    alt_phone: altPhone,
                    coupon_code: orderData.coupon?.code ?? null,
                    total_amount: orderData.total,
                    discount: orderData.subtotal - orderData.total,
                    payment_method: "Razorpay",
                    status: "PAID",
                    razorpay_order_id: order.id,
                    razorpay_payment_id: response.razorpay_payment_id,
                  },
                ]);

              if (orderError) throw orderError;

              const orderItems = orderData.cart.map((item) => {
                const p = orderData.products[item.uid];
                const addon = getSizeAddon(p?.sizes, item.size);
                const unitPrice = (p ? (p.offerPrice ?? p.price) : 0) + addon;
                return {
                  order_id: orderId,
                  product_id: p.id,
                  size: item.size,
                  quantity: item.quantity,
                  price: unitPrice,
                };
              });

              const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

              if (itemsError) throw itemsError;

              clearCart();
              sessionStorage.removeItem("orderData");
              toast.success("Payment successful 🎉");
              router.push(`/order-placed/${orderId}`);
            } else {
              toast.error("Payment verification failed ❌");
            }
          } catch (err) {
            console.error(err);
            toast.error("Error verifying payment.");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            if (!paymentSuccessRef.current) {
              toast("Payment Cancelled");
              setLoading(false);
            }
          },
        },

        // You can customize the image (logo) and theme color here
        image: "https://orox.in/favicon.ico", // Replace with your actual logo URL if needed
        theme: { color: "#93722B" }, // Luxury Gold Color
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 flex flex-col min-h-screen bg-white">
      <div className="mb-8 max-w-[1400px] mx-auto w-full px-4 lg:px-10">
        <div className="mt-4 mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-light uppercase tracking-[0.3em] text-black">
            ORIGIN & DESTINATION
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-[#777] mt-4 uppercase font-light">
            THE FINAL SIGNATURE
          </p>
          <div className="w-full h-[0.5px] bg-[#EAEAEA] mt-8 hidden sm:block"></div>
        </div>

        <div className="lg:flex lg:gap-12">
          {/* Left side: Forms */}
          <div className="lg:flex-1 pb-32 lg:pb-0">
            <div className="mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-black mb-6 border-b border-[#EAEAEA] pb-4">
                CONSIGNMENT PROFILE
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">
                    CLIENT IDENTITY <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="FULL NAME"
                    className="w-full border-b border-[#EAEAEA] bg-transparent px-0 py-4 text-sm focus:border-black outline-none transition-all duration-500 rounded-none placeholder:text-[#BBB] placeholder:font-light tracking-widest"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">
                    DESTINATION <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="RESIDENCE DETAILS (HOUSE, STREET, AREA, PINCODE)"
                    className="w-full border-b border-[#EAEAEA] bg-transparent px-0 py-4 text-sm focus:border-black outline-none transition-all duration-500 rounded-none resize-none uppercase placeholder:text-[#BBB] placeholder:font-light tracking-widest"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="PRIMARY CONTACT"
                      className="w-full border-b border-[#EAEAEA] bg-transparent px-0 py-4 text-sm focus:border-black outline-none transition-all duration-500 rounded-none placeholder:text-[#BBB] placeholder:font-light tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">
                      Confirm Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={confirmPhone}
                      onChange={(e) => setConfirmPhone(e.target.value)}
                      placeholder="CONFIRM CONTACT"
                      className="w-full border-b border-[#EAEAEA] bg-transparent px-0 py-4 text-sm focus:border-black outline-none transition-all duration-500 rounded-none placeholder:text-[#BBB] placeholder:font-light tracking-widest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">
                    Alternative Phone <span className="text-[#999]">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="SECONDARY CONTACT (OPTIONAL)"
                    className="w-full border-b border-[#EAEAEA] bg-transparent px-0 py-4 text-sm focus:border-black outline-none transition-all duration-500 rounded-none placeholder:text-[#BBB] placeholder:font-light tracking-widest"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-[#EAEAEA]">
                <label className="block text-xs uppercase tracking-[0.2em] text-black mb-4 font-semibold">
                  Personalisation <span className="text-red-500">*</span>
                </label>
                <p className="text-[10px] tracking-[0.15em] text-[#777] mb-6 uppercase leading-relaxed font-light">
                  PERSONALISE YOUR PIECE WITH A CUSTOM ENGRAVING
                </p>
                <input
                  type="text"
                  value={engravingName}
                  onChange={(e) => setEngravingName(e.target.value)}
                  placeholder="NAME OR INITIALS"
                  className="w-full border-b border-[#EAEAEA] bg-transparent px-0 py-4 text-sm focus:border-black outline-none transition-all duration-500 rounded-none uppercase placeholder:text-[#BBB] placeholder:font-light tracking-[0.2em]"
                />
              </div>
            </div>

          </div>

          {/* Right side: Summary */}
          <div className="hidden lg:block lg:w-96 xl:w-[400px]">
            <div className="bg-[#F9F9F9] border border-[#EAEAEA] p-8 sticky top-32">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-black mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 font-sans" style={{ letterSpacing: "0.05em", fontSize: "0.85rem", color: "#111" }}>
                <div className="flex justify-between items-center pb-3 border-b border-[#EAEAEA]">
                  <span className="uppercase text-[#555]">Subtotal</span>
                  <span className="font-semibold">₹{orderData.subtotal.toFixed(2)}</span>
                </div>

                {orderData.subtotal > orderData.total && (
                  <div className="flex justify-between items-center pb-3 border-b border-[#EAEAEA]">
                    <span className="uppercase text-[#555]">Benefit</span>
                    <span className="font-semibold">-₹{(orderData.subtotal - orderData.total).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="uppercase text-sm tracking-widest text-[#111] font-semibold">Total Payable</span>
                  <span className="text-lg tracking-wider font-semibold" style={{ color: '#93722B' }}>₹{orderData.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-8 py-4 text-xs font-medium uppercase tracking-[0.2em] transition-colors border bg-black border-black text-white hover:bg-[#222] disabled:bg-transparent disabled:border-[#CCC] disabled:text-[#999] disabled:cursor-not-allowed"
              >
                {loading ? "AUTHORIZING..." : "SECURE CHECKOUT"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black p-4 z-40">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold tracking-widest uppercase text-black">
            Total Payable
          </span>
          <span className="text-lg tracking-wider font-semibold" style={{ color: '#93722B' }}>
            ₹{orderData.total.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors border bg-black border-black text-white disabled:bg-[#F9F9F9] disabled:border-[#CCC] disabled:text-[#999] disabled:cursor-not-allowed"
        >
          {loading ? "AUTHORIZING..." : "SECURE CHECKOUT"}
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
