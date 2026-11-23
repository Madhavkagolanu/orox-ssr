"use client";
import { useState, useEffect } from "react";
import { Search, X, User } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useRouter, usePathname } from "next/navigation";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();
  const { user, signInWithGoogle, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Orders", path: "/my-orders" },
    { label: "Cart", path: "/cart" },
    { label: "Contact", path: "/contact" },
  ];

  const sidebarVariants: Variants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "tween", duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
    exit: { x: "-100%", opacity: 0, transition: { type: "tween", duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
  };

  const fmt = () => {
    const n = user?.user_metadata?.full_name || user?.email;
    if (!n) return "Guest";
    if (n.includes("@")) return n.split("@")[0];
    const p = n.split(" ");
    return p.length > 1 ? `${p[0]} ${p[1][0]}.` : n;
  };
  const displayName = fmt();

  const iconBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s",
  };

  if (pathname === '/login') return null;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* ── TOP NAVBAR ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          height: scrolled ? "64px" : "80px",
          background: "#FFFFFF",
          borderBottom: "1px solid transparent",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.03)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Menu"
            style={iconBtn}
            className="group"
          >
            {/* Architectural Hamburger */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="square">
              <line x1="2" y1="8" x2="22" y2="8" className="group-hover:translate-x-1 transition-transform" />
              <line x1="2" y1="16" x2="22" y2="16" className="group-hover:-translate-x-1 transition-transform" />
            </svg>
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            style={iconBtn}
          >
            <Search style={{ width: 20, height: 20, color: "#000000", strokeWidth: 1 }} />
          </button>
        </div>

        {/* ── LOGO ── */}
        <div
          onClick={() => router.push("/")}
          style={{ justifySelf: "center", cursor: "pointer", userSelect: "none" }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 300,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#000000",
              display: "block",
            }}
          >
            OROX
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            onClick={() => router.push("/cart")}
            aria-label="Cart"
            style={{ ...iconBtn, position: "relative" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M5 8h14v13H5z" />
              <path d="M8 8V5a4 4 0 0 1 8 0v3" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "-2px",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#000000",
                  color: "#FFFFFF",
                  fontSize: "9px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── EDITORIAL SIDEBAR ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: isMobile ? "100%" : "50vw",
                maxWidth: "600px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "#FFFFFF",
                borderRight: "1px solid #E5E5E5",
              }}
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Sidebar Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "2rem",
                }}
              >
                <button onClick={() => setSidebarOpen(false)} style={iconBtn}>
                  <X style={{ width: 28, height: 28, color: "#000000", strokeWidth: 1 }} />
                </button>

                <div
                  onClick={() => { setSidebarOpen(false); router.push("/"); }}
                  style={{ cursor: "pointer" }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 300,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#000000",
                    }}
                  >
                    OROX
                  </span>
                </div>
              </div>

              {/* Main Links */}
              <div style={{ flex: 1, padding: "4rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <nav style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {navItems.map((item) => {
                    return (
                      <button
                        key={item.label}
                        onClick={() => { setSidebarOpen(false); router.push(item.path); }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: isMobile ? "2.5rem" : "3.5rem",
                          fontWeight: 300,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          fontFamily: "'Inter', sans-serif",
                          color: "#000000",
                          textAlign: "left",
                          lineHeight: 0.9,
                          transition: "opacity 0.4s ease",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.4")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>

                <div style={{ marginTop: "4rem", height: "1px", width: "40px", background: "#E5E5E5" }} />

                {/* Secondary Links */}
                <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { label: "Warranty & Care", path: "/warranty" },
                    { label: "Handover & Replacements", path: "/returns" },
                  ].map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        setSidebarOpen(false);
                        router.push(link.path);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        color: "#666666",
                        fontWeight: 300,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        transition: "opacity 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div style={{ padding: "2rem", borderTop: "1px solid #E5E5E5" }}>
                {user ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#A0A0A0", marginBottom: "0.25rem", fontWeight: 300 }}>
                        Welcome
                      </span>
                      <span style={{ fontSize: "0.85rem", color: "#000000", fontWeight: 300, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {displayName}
                      </span>
                    </div>
                    <button
                      onClick={signOut}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "10px",
                        color: "#666666",
                        fontWeight: 300,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        borderBottom: "1px solid #E5E5E5",
                        paddingBottom: "2px",
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "10px",
                      fontWeight: 300,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#000000",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "opacity 0.3s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <User size={14} strokeWidth={1.5} />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
