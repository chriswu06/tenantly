import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Summons uploads go through a Server Action: 10 MB files plus multipart overhead.
    serverActions: { bodySizeLimit: "11mb" },
    // The proxy (src/proxy.ts) sees every request, so it needs the same headroom.
    proxyClientMaxBodySize: "11mb",
  },
};

export default nextConfig;
