export type SizeStatus = "AVAILABLE" | "COMING SOON" | "NOT AVAILABLE";

export type SizeItem = {
  size: string;
  status: SizeStatus;
  priceAddon: number;
};

export function parseSizeItem(raw: any): SizeItem {
  if (!raw) {
    return { size: "", status: "AVAILABLE", priceAddon: 0 };
  }

  // 1. If raw is an array (e.g. ["S", "AVAILABLE", 0] or ["PREIMUM", "COMING SOON", 2000])
  if (Array.isArray(raw)) {
    const size = String(raw[0] ?? "").trim();
    const statusRaw = String(raw[1] ?? "AVAILABLE").trim().toUpperCase();
    
    let status: SizeStatus = "AVAILABLE";
    if (statusRaw.includes("COMING")) {
      status = "COMING SOON";
    } else if (
      statusRaw.includes("NOT") ||
      statusRaw.includes("UNAVAILABLE") ||
      statusRaw.includes("OUT")
    ) {
      status = "NOT AVAILABLE";
    }

    const priceAddon = Number(raw[2] ?? 0) || 0;
    return { size, status, priceAddon };
  }

  // 2. If raw is already an object
  if (typeof raw === "object" && !Array.isArray(raw)) {
    const size = String(raw.size ?? raw.name ?? raw.label ?? "").trim();
    const statusRaw = String(raw.status ?? raw.availability ?? "AVAILABLE").trim().toUpperCase();
    
    let status: SizeStatus = "AVAILABLE";
    if (statusRaw.includes("COMING")) {
      status = "COMING SOON";
    } else if (
      statusRaw.includes("NOT") ||
      statusRaw.includes("UNAVAILABLE") ||
      statusRaw.includes("OUT")
    ) {
      status = "NOT AVAILABLE";
    }

    const priceAddon = Number(raw.priceAddon ?? raw.price_addon ?? raw.addon ?? raw.priceAddOn ?? 0) || 0;
    return { size, status, priceAddon };
  }

  // 2. If raw is a string (e.g. "S", "S,AVAILABLE,0", "{S,AVAILABLE,0}", "{M,COMING SOON,50}")
  if (typeof raw === "string") {
    // Try parsing as JSON first in case it's a JSON string like '{"size":"S","status":"AVAILABLE","priceAddon":0}'
    const trimmed = raw.trim();
    if (trimmed.startsWith("{") && trimmed.includes('"')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseSizeItem(parsed);
      } catch {
        // Fall back to tuple parsing below
      }
    }

    // Strip wrapping braces, brackets, or parentheses
    const cleaned = trimmed.replace(/^[\{\[\(]+|[\}\]\)]+$/g, "").trim();
    const parts = cleaned.split(",").map((s) => s.trim());

    if (parts.length >= 2) {
      const size = parts[0];
      const statusRaw = (parts[1] || "").toUpperCase();
      
      let status: SizeStatus = "AVAILABLE";
      if (statusRaw.includes("COMING")) {
        status = "COMING SOON";
      } else if (
        statusRaw.includes("NOT") ||
        statusRaw.includes("UNAVAILABLE") ||
        statusRaw.includes("OUT")
      ) {
        status = "NOT AVAILABLE";
      }

      const priceAddon = parts.length >= 3 ? (Number(parts[2].replace(/[^0-9.-]/g, "")) || 0) : 0;
      return { size, status, priceAddon };
    }

    // Single plain string legacy: "S"
    return { size: cleaned, status: "AVAILABLE", priceAddon: 0 };
  }

  return { size: String(raw).trim(), status: "AVAILABLE", priceAddon: 0 };
}

export function getSizeAddon(sizes: any[] | undefined, targetSize: string): number {
  if (!sizes || !Array.isArray(sizes) || !targetSize) return 0;
  for (const raw of sizes) {
    const parsed = parseSizeItem(raw);
    if (parsed.size.toLowerCase() === targetSize.toLowerCase()) {
      return parsed.priceAddon;
    }
  }
  return 0;
}

