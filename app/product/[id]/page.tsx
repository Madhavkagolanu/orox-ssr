"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Share2 } from "lucide-react";
import ProductPageSkeleton from "@/components/ProductPageSkeleton/ProductPageSkeleton";
import { logEvent } from "@/utils/analytics";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import { parseSizeItem, SizeItem } from "@/utils/sizes";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  offerprice?: number;
  images: string[];
  sizes?: any;
  returnpolicy: string;
  stock_qty: number;
};

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showImage, setShowImage] = useState<string | null>(null);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProduct(data);
        logEvent("Product", "View", data.name);
      }

      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  const parsedSizes: SizeItem[] = useMemo(() => {
    if (!product?.sizes || !Array.isArray(product.sizes)) return [];
    return product.sizes.map(parseSizeItem);
  }, [product?.sizes]);

  const hasSizes = parsedSizes.length > 0;

  useEffect(() => {
    if (product && parsedSizes.length > 0) {
      const inCart = cart.find((c) => c.uid === product.id);
      if (inCart && inCart.size) {
        setSelectedSize(inCart.size);
      } else if (!selectedSize) {
        const firstAvailable = parsedSizes.find((s) => s.status === "AVAILABLE");
        setSelectedSize(firstAvailable ? firstAvailable.size : parsedSizes[0].size);
      }
    }
  }, [product, cart, parsedSizes, selectedSize]);

  if (loading) return <ProductPageSkeleton />;

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
        <h1 className="text-7xl font-playfair tracking-normal text-zinc-900">404</h1>
        <h2 className="mt-4 text-xl tracking-wide text-zinc-600 uppercase">Product Not Found</h2>
        <a
          href="/"
          className="inline-block mt-8 px-8 py-3 bg-zinc-900 text-white text-sm uppercase tracking-widest hover:bg-black transition-colors"
        >
          Return to Boutique
        </a>
      </div>
    );
  }

  if (!product) return null;

  const cartItem = product ? cart.find((c) => c.uid === product.id) : undefined;

  const currentSizeObj = parsedSizes.find((s) => s.size === selectedSize) || (parsedSizes.length > 0 ? parsedSizes[0] : null);
  const sizeAddon = currentSizeObj?.priceAddon ?? 0;
  const effectivePrice = product.price + sizeAddon;
  const effectiveOfferPrice = product.offerprice ? product.offerprice + sizeAddon : undefined;

  const offerPercent =
    effectiveOfferPrice && effectivePrice
      ? Math.round(((effectivePrice - effectiveOfferPrice) / effectivePrice) * 100)
      : null;

  const isOutOfStock = product.stock_qty === 0;
  const isSizeUnavailable = currentSizeObj ? currentSizeObj.status !== "AVAILABLE" : false;
  const isActionDisabled = isOutOfStock || (hasSizes && (!selectedSize || isSizeUnavailable));

  const getActionText = () => {
    if (isOutOfStock) return "PIECE UNAVAILABLE";
    if (currentSizeObj?.status === "COMING SOON") return "COMING SOON";
    if (currentSizeObj?.status === "NOT AVAILABLE") return "PIECE UNAVAILABLE";
    return "ADD TO BAG";
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("Piece unavailable");
      return;
    }

    if (hasSizes && !selectedSize) {
      toast.error("Please select a variant");
      return;
    }

    if (currentSizeObj && currentSizeObj.status === "COMING SOON") {
      toast.error("This variant is coming soon");
      return;
    }

    if (currentSizeObj && currentSizeObj.status === "NOT AVAILABLE") {
      toast.error("This variant is currently not available");
      return;
    }

    // Because it's max 1 variant per product, first remove any existing variant of this product in cart
    const existing = cart.find((c) => c.uid === product.id);
    if (existing) {
      await removeFromCart(existing.uid, existing.size);
    }

    const newItem = {
      uid: product.id,
      size: selectedSize || "",
      quantity: 1,
    };

    await addToCart(newItem);
    logEvent("Product", "Add to Cart", product.name);
  };

  const handleSizeChange = async (sizeObj: SizeItem) => {
    setSelectedSize(sizeObj.size);

    if (sizeObj.status !== "AVAILABLE") {
      if (cartItem) {
        await removeFromCart(product!.id, cartItem.size);
      }
      return;
    }

    if (cartItem && cartItem.size !== sizeObj.size) {
      await removeFromCart(product!.id, cartItem.size);
      const newItem = {
        uid: product!.id,
        size: sizeObj.size,
        quantity: cartItem.quantity,
      };
      await addToCart(newItem);
    }
  };

  const handleQuantityChange = async (newQty: number) => {
    if (isOutOfStock || !cartItem) return;

    if (newQty <= 0) {
      await removeFromCart(product.id, cartItem.size);
    } else {
      if (newQty > 1 || newQty > product.stock_qty) {
        toast.error(`Maximum 1 piece permitted per order`);
        return;
      }

      await updateQuantity(product.id, cartItem.size, newQty);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name,
      text: product?.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully");
      } catch (err) {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden">
      <div className="pt-20">
        <div className="block lg:hidden">
          <div className="relative w-full max-w-[100vw]">
            <div className="relative">
              <Swiper
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                  el: ".custom-swiper-pagination",
                }}
                className="w-full h-[70vh] sm:h-[80vh] md:h-[85vh]"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={product.name}
                      className={`w-full h-full object-cover cursor-pointer ${isOutOfStock ? "brightness-[0.6] contrast-[1.1] saturate-[0.8]" : ""
                        }`}
                      onClick={() => setShowImage(img)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {isOutOfStock && (
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-2 z-10 border-b border-l border-[#222]">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
                    UNAVAILABLE
                  </span>
                </div>
              )}

              <div className="custom-swiper-pagination flex justify-center gap-2 py-3" />
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1
                  className={`text-2xl font-playfair tracking-wide ${isOutOfStock ? "text-zinc-500" : "text-zinc-900"
                    }`}
                >
                  {product.name}
                </h1>
                {(offerPercent ?? 0) > 0 && !isOutOfStock && (
                  <span className="text-xs uppercase tracking-widest text-zinc-500">
                    Client Privilege
                  </span>
                )}
              </div>
              <button
                onClick={handleShare}
                className="p-2 transition-opacity hover:opacity-70 active:scale-95"
              >
                <Share2 size={22} strokeWidth={1.25} className="text-zinc-800" />
              </button>
            </div>

            <p
              className={`mt-3 ${isOutOfStock ? "text-gray-400" : "text-gray-600"
                }`}
            >
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-3">
                  {effectiveOfferPrice && !isOutOfStock ? (
                    <>
                      <span className="text-3xl font-medium tracking-tight" style={{ color: '#93722B' }}>
                        ₹{effectiveOfferPrice.toLocaleString()}
                      </span>
                      <span className="line-through text-base font-medium opacity-60 mb-1" style={{ color: '#93722B' }}>
                        ₹{effectivePrice.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span
                      className={`text-3xl font-medium tracking-tight ${isOutOfStock ? "text-zinc-400" : ""}`}
                      style={!isOutOfStock ? { color: '#93722B' } : {}}
                    >
                      ₹{effectivePrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1 block">
                    Magnetic Backplate Only · Phone Not Included
                  </span>
                </div>

                <div className="w-[160px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {cartItem && !isOutOfStock ? (
                      <motion.div
                        key="quantity"
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center h-12 w-full border border-black"
                      >
                        <button
                          onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                          className="flex-1 h-full flex items-center justify-center text-black hover:bg-zinc-100 active:bg-zinc-200 transition-colors font-light text-xl"
                        >
                          −
                        </button>
                        <span className="flex-1 h-full flex items-center justify-center text-xs font-medium tracking-widest text-black border-x border-black">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                          disabled={cartItem.quantity >= 1 || cartItem.quantity >= product.stock_qty}
                          className={`flex-1 h-full flex items-center justify-center font-light text-xl transition-colors ${cartItem.quantity >= 1 || cartItem.quantity >= product.stock_qty
                            ? "bg-zinc-50 cursor-not-allowed text-zinc-300"
                            : "text-black hover:bg-zinc-100 active:bg-zinc-200"
                            }`}
                        >
                          +
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="add"
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleAddToCart}
                        disabled={isActionDisabled}
                        className={`w-full h-12 flex items-center justify-center text-[11px] tracking-[0.2em] font-medium uppercase transition-all duration-300 ${isActionDisabled
                          ? "bg-zinc-100 cursor-not-allowed text-zinc-400 border border-zinc-200"
                          : "bg-black text-white hover:bg-white hover:text-black border border-black"
                          }`}
                      >
                        <span>{getActionText()}</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {hasSizes && !isOutOfStock && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                    Select Variant
                  </h3>
                  {currentSizeObj && (
                    <span className="text-[10px] tracking-[0.2em] uppercase font-light text-zinc-500">
                      {currentSizeObj.status === "COMING SOON"
                        ? "Coming Soon"
                        : currentSizeObj.status === "NOT AVAILABLE"
                        ? "Sold Out"
                        : "Available"}
                    </span>
                  )}
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  {parsedSizes.map((item: SizeItem) => {
                    const isSelected = selectedSize === item.size;
                    const isInCart = cartItem?.size === item.size;
                    const isComingSoon = item.status === "COMING SOON";
                    const isNotAvailable = item.status === "NOT AVAILABLE";

                    let classes =
                      "relative min-w-[54px] h-11 px-4 flex flex-col items-center justify-center text-xs tracking-[0.18em] uppercase transition-all duration-200 border ";

                    if (isNotAvailable) {
                      classes +=
                        "bg-[#FAFAFA] text-zinc-300 border-zinc-200 cursor-not-allowed select-none overflow-hidden ";
                    } else if (isComingSoon) {
                      classes += isSelected
                        ? "bg-black text-white border-black font-medium "
                        : "bg-white text-zinc-600 border-dashed border-zinc-300 hover:border-black ";
                    } else if (isSelected) {
                      classes += "bg-black text-white border-black font-medium ";
                    } else if (isInCart) {
                      classes += "bg-zinc-50 text-zinc-900 border-zinc-400 hover:border-black ";
                    } else {
                      classes += "bg-white text-zinc-800 border-zinc-200 hover:border-black font-light ";
                    }

                    return (
                      <button
                        key={item.size}
                        className={classes}
                        onClick={() => handleSizeChange(item)}
                        disabled={isNotAvailable}
                        type="button"
                        title={
                          isNotAvailable
                            ? "Sold Out"
                            : isComingSoon
                            ? "Coming Soon"
                            : undefined
                        }
                      >
                        <span className="leading-none">{item.size}</span>
                        {isComingSoon && (
                          <span
                            className={`text-[7px] tracking-[0.2em] uppercase mt-1 leading-none ${
                              isSelected ? "text-zinc-300" : "text-zinc-400"
                            }`}
                          >
                            Soon
                          </span>
                        )}
                        {isNotAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[120%] h-[1px] bg-zinc-300 transform -rotate-25" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {Boolean(product.returnpolicy && product.returnpolicy.trim()) && (
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-700">
                  Return Policy
                </h3>
                <p className="text-gray-600 mt-2">{product.returnpolicy}</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="w-full relative">
                <Swiper
                  modules={[Pagination]}
                  pagination={{
                    clickable: true,
                    el: ".custom-swiper-pagination-desktop",
                  }}
                  className="w-full h-[600px] overflow-hidden"
                >
                  {product.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img}
                        alt={product.name}
                        className={`w-full h-full object-cover cursor-pointer ${isOutOfStock ? "brightness-[0.6] contrast-[1.1] saturate-[0.8]" : ""
                          }`}
                        onClick={() => setShowImage(img)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {isOutOfStock && (
                  <div className="absolute top-0 right-0 bg-black text-white px-6 py-3 z-10 border-b border-l border-[#222]">
                    <span className="text-xs uppercase tracking-[0.3em] font-medium">
                      UNAVAILABLE
                    </span>
                  </div>
                )}

                <div className="custom-swiper-pagination-desktop flex justify-center gap-2 py-4" />
              </div>

              <div className="flex flex-col py-4 px-4 lg:px-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-2">
                    <h1
                      className={`text-5xl font-playfair tracking-wide ${isOutOfStock ? "text-zinc-500" : "text-zinc-900"
                        }`}
                    >
                      {product.name}
                    </h1>
                    {(offerPercent ?? 0) > 0 && !isOutOfStock && (
                      <span className="text-sm uppercase tracking-widest text-zinc-500">
                        Client Privilege
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleShare}
                    className="p-3 transition-opacity hover:opacity-70 active:scale-95 group"
                    title="Share"
                  >
                    <Share2
                      size={24}
                      strokeWidth={1}
                      className="text-zinc-800 transition-transform group-hover:scale-110"
                    />
                  </button>
                </div>

                <p
                  className={`text-base ${isOutOfStock ? "text-gray-400" : "text-gray-600"
                    } my-6 leading-relaxed font-light`}
                >
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-12 mt-6">
                  <div>
                    {effectiveOfferPrice && !isOutOfStock ? (
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-light text-zinc-900">
                          ₹{effectiveOfferPrice.toLocaleString()}
                        </span>
                        <span className="line-through text-base text-zinc-400">
                          ₹{effectivePrice.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`text-3xl font-light ${
                          isOutOfStock ? "text-zinc-400" : "text-zinc-900"
                        }`}
                      >
                        ₹{effectivePrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 block">
                      Magnetic Backplate Only · Phone Not Included
                    </span>
                  </div>

                  <div className="w-[180px] h-12">
                    <AnimatePresence mode="wait" initial={false}>
                      {cartItem && !isOutOfStock ? (
                        <motion.div
                          key="quantity"
                          initial={{ opacity: 0, x: 5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center h-12 border border-zinc-200 bg-white"
                        >
                          <button
                            onClick={() =>
                              handleQuantityChange(cartItem.quantity - 1)
                            }
                            className="flex-1 h-full flex items-center justify-center text-black hover:bg-zinc-100 active:bg-zinc-200 transition-colors font-light text-xl"
                          >
                            −
                          </button>
                          <span className="w-12 text-center text-xs tracking-widest font-mono text-zinc-900">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(cartItem.quantity + 1)
                            }
                            disabled={
                              cartItem.quantity >= 1 ||
                              cartItem.quantity >= product.stock_qty
                            }
                            className={`flex-1 h-full flex items-center justify-center font-light text-xl transition-colors ${
                              cartItem.quantity >= 1 ||
                              cartItem.quantity >= product.stock_qty
                                ? "bg-zinc-50 cursor-not-allowed text-zinc-300"
                                : "text-black hover:bg-zinc-100 active:bg-zinc-200"
                            }`}
                          >
                            +
                          </button>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="add"
                          initial={{ opacity: 0, x: 5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.2 }}
                          onClick={handleAddToCart}
                          disabled={isActionDisabled}
                          className={`w-full h-12 flex items-center justify-center text-[11px] tracking-[0.2em] font-medium uppercase transition-all duration-300 ${
                            isActionDisabled
                              ? "bg-zinc-100 cursor-not-allowed text-zinc-400 border border-zinc-200"
                              : "bg-black text-white hover:bg-white hover:text-black border border-black"
                          }`}
                        >
                          <span>{getActionText()}</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {hasSizes && !isOutOfStock && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                        Select Variant
                      </h3>
                      {currentSizeObj && (
                        <span className="text-[10px] tracking-[0.2em] uppercase font-light text-zinc-500">
                          {currentSizeObj.status === "COMING SOON"
                            ? "Coming Soon"
                            : currentSizeObj.status === "NOT AVAILABLE"
                            ? "Sold Out"
                            : "Available"}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2.5 flex-wrap">
                      {parsedSizes.map((item: SizeItem) => {
                        const isSelected = selectedSize === item.size;
                        const isInCart = cartItem?.size === item.size;
                        const isComingSoon = item.status === "COMING SOON";
                        const isNotAvailable = item.status === "NOT AVAILABLE";

                        let classes =
                          "relative min-w-[54px] h-11 px-4 flex flex-col items-center justify-center text-xs tracking-[0.18em] uppercase transition-all duration-200 border ";

                        if (isNotAvailable) {
                          classes +=
                            "bg-[#FAFAFA] text-zinc-300 border-zinc-200 cursor-not-allowed select-none overflow-hidden ";
                        } else if (isComingSoon) {
                          classes += isSelected
                            ? "bg-black text-white border-black font-medium "
                            : "bg-white text-zinc-600 border-dashed border-zinc-300 hover:border-black ";
                        } else if (isSelected) {
                          classes +=
                            "bg-black text-white border-black font-medium ";
                        } else if (isInCart) {
                          classes +=
                            "bg-zinc-50 text-zinc-900 border-zinc-400 hover:border-black ";
                        } else {
                          classes +=
                            "bg-white text-zinc-800 border-zinc-200 hover:border-black font-light ";
                        }

                        return (
                          <button
                            key={item.size}
                            className={classes}
                            onClick={() => handleSizeChange(item)}
                            disabled={isNotAvailable}
                            type="button"
                            title={
                              isNotAvailable
                                ? "Sold Out"
                                : isComingSoon
                                ? "Coming Soon"
                                : undefined
                            }
                          >
                            <span className="leading-none">{item.size}</span>
                            {isComingSoon && (
                              <span
                                className={`text-[7px] tracking-[0.2em] uppercase mt-1 leading-none ${
                                  isSelected ? "text-zinc-300" : "text-zinc-400"
                                }`}
                              >
                                Soon
                              </span>
                            )}
                            {isNotAvailable && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[120%] h-[1px] bg-zinc-300 transform -rotate-25" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {Boolean(product.returnpolicy && product.returnpolicy.trim()) && (
                  <div className="mt-auto">
                    <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-mono mb-2">
                      Return Policy
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                      {product.returnpolicy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-8 lg:-mt-12">
        <RelatedProducts currentProductId={product.id} />
      </div>

      <AnimatePresence>
        {showImage && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setShowImage(null)}
          >
            <motion.img
              src={showImage}
              alt="fullscreen"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-swiper-pagination .swiper-pagination-bullet,
        .custom-swiper-pagination-desktop .swiper-pagination-bullet {
          background-color: #d1d5db;
          opacity: 1;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active,
        .custom-swiper-pagination-desktop .swiper-pagination-bullet-active {
          background-color: #1f2937;
          transform: scale(1.2);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}
