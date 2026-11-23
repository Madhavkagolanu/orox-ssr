"use client";
// PageTracker is now handled via Next.js Analytics or a custom hook
// This component is a no-op placeholder – GA init happens in layout.tsx
// Use this pattern in components that need to track page views client-side
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logPageView } from "@/utils/analytics";

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    logPageView();
  }, [pathname, searchParams]);

  return null;
}
