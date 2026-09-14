import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All local images are already pre-optimized WebP files (compressed and
    // downscaled during project export prep). Running them through Vercel's
    // runtime image-optimization API on top of that is redundant, and burns
    // through the free-tier optimization quota fast (returns HTTP 402 once
    // exceeded). Disabling it here serves every image directly and
    // predictably, on any host.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
