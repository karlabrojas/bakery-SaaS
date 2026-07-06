import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          process.env.SUPABASE_URL?.replace("https://", "").replace("/", "") ||
          "",
      },
    ],
  },
};

export default nextConfig;
