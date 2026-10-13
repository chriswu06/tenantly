import { ImageResponse } from "next/og";

export const alt = "Tenantly: check whether your landlord was licensed to take you to Baltimore City rent court";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colors are the design tokens' hex values (ImageResponse can't read CSS variables).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0b1437", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="m" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#4338ca" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#m)" />
            <path d="M8.5 15 16 8.5 23.5 15v8.25a1.75 1.75 0 0 1-1.75 1.75h-11.5a1.75 1.75 0 0 1-1.75-1.75Z" stroke="#fff" strokeWidth="2.25" strokeLinejoin="round" />
            <path d="m12.5 18.75 2.5 2.5 4.75-4.75" stroke="#5eead4" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 600, color: "#ffffff" }}>Tenantly</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.1, color: "#ffffff", letterSpacing: -1.5 }}>
            Was your landlord licensed to take you to court?
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#5eead4" }}>Free · About 2 minutes · No account needed</div>
      </div>
    ),
    size,
  );
}
