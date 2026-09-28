
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Allow images from common external hosts (add more as needed)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // Suppress noisy build warnings
};

export default nextConfig;
