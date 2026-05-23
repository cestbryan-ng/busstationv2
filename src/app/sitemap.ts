import { MetadataRoute } from "next";

const BASE_URL = "http://46.224.128.125:9006";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/about",
    "/contact-us",
    "/faqs",
    "/login",
    "/register",
    "/market-place",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));

  // On ne génère pas les routes dynamiques au build (pas d'API disponible)
  return [...staticRoutes];
}