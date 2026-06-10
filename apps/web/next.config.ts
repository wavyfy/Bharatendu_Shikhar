import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "jczsfwtxnyefjwbjnwsn.supabase.co",
      },
    ],
  },
};

export default nextConfig;
