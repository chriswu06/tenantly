"use client";

/** Last resort when the root layout itself fails; it replaces the whole document. */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0, color: "#0f172a" }}>
        <main style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 22 }}>Standing isn’t available right now</h1>
          <p style={{ color: "#475569" }}>Please try again in a moment.</p>
          <button type="button" onClick={retry} style={{ marginTop: 12, padding: "10px 16px", borderRadius: 8, border: 0, background: "#1d4ed8", color: "#fff", fontWeight: 600 }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
