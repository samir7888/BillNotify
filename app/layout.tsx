import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Geist, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const getAppUrl = () => {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url || url.trim() === "") {
    return "https://billnotify.basnetsameer.com.np";
  }
  return url;
};
export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "BillNotify Nepal — Never Miss a Utility Bill",
    template: "%s | BillNotify Nepal",
  },
  description:
    "Get instant email alerts when your Nepal electricity or water bill becomes payable in eSewa or Khalti. Powered by real-time NEA data.",
  keywords: [
    "NEA bill check",
    "Nepal electricity bill",
    "eSewa bill payment",
    "Khalti",
    "NEA utility notification",
    "Nepal energy",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BillNotify Nepal — Auto-Check Utility Bills",
    description:
      "Save your NEA consumer IDs. We check when your bill is payable and send you an instant email alert.",
    url: getAppUrl(),
    siteName: "BillNotify Nepal",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BillNotify Nepal",
    applicationCategory: "UtilityBusiness",
    operatingSystem: "Web",
    description:
      "An automated utility bill checking and notification system for NEA (Nepal Electricity Authority).",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jakartaSans.variable} ${inter.variable} font-inter`}>
        <ClerkProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              },
            }}
            richColors
          />
        </ClerkProvider>
      </body>
    </html>
  );
}
