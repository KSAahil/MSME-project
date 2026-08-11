import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.NEXT_PUBLIC_PRODUCT_NAME || "AI Munim",
    short_name: "AI Munim",
    description: "Say it. Bill it. Collect it.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f1e8",
    theme_color: "#153c33",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
