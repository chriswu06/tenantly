import { ImageResponse } from "next/og";

export const alt = "Standing: check whether your landlord was licensed to take you to Baltimore City rent court";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colors are the design tokens' hex values (ImageResponse can't read CSS variables).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f8fafc", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "#1d4ed8", color: "#fff", fontSize: 38, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>S</div>
          <div style={{ fontSize: 40, fontWeight: 600, color: "#0f172a" }}>Standing</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignSelf: "flex-start", padding: "8px 16px", borderRadius: 10, border: "2px solid #bfdbfe", background: "#eff6ff", color: "#1d4ed8", fontSize: 26 }}>
            Baltimore City · Rent court
          </div>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.1, color: "#0f172a", letterSpacing: -1.5 }}>
            Check whether your landlord was licensed to take you to court
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#475569" }}>Free · About 2 minutes · No account needed</div>
      </div>
    ),
    size,
  );
}
