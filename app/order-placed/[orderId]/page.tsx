"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { logEvent } from "@/utils/analytics";

const OrderPlacedPage: React.FC = () => {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      logEvent("Order", "Purchase", orderId);
    }
  }, [orderId]);

  // Prevent going back
  useEffect(() => {
    const handlePopState = () => {
      router.replace("/");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us. Your order ID is:
        </p>
        <p className="text-pink-600 font-mono font-semibold mb-8">{orderId}</p>
        <button
          onClick={() => router.replace("/")}
          className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderPlacedPage;
