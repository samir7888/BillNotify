import { MetadataRoute } from "next";

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return url
    ? url.replace(/\/+$/, "")
    : "https://billnotify.basnetsameer.com.np";
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
