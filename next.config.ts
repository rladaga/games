import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Brand logos/backgrounds can come from any URL the admin pastes/uploads.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
