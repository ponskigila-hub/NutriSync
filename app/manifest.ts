import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Theraria — NutriSync AI",
    short_name: "Theraria",
    description: "A gentle, demo-first companion for nutrition, movement, and daily routines.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: "#1f4638",
    icons: [
      {
        src: "/theraria-logo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/theraria-logo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
