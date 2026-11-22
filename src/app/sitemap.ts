import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const ROUTES = ["", "/use-cases", "/research", "/projects", "/experience", "/education", "/volunteering", "/achievements", "/news", "/skills", "/pictures", "/ask"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({ url: `https://rachelcooray.com${r}`, changeFrequency: "monthly", priority: r === "" ? 1 : 0.7 }));
}
