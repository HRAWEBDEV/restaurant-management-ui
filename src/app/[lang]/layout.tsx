import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { cn } from "@/lib/utils";
import {
  isActiveLocale,
  localeNames,
  locales,
} from "@/internalization/localications";

const iranSans = localFont({
  src: [
    {
      path: "../../../public/fonts/fa/sans/IRANSansWebFaNum-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../public/fonts/fa/sans/IRANSansWebFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/fa/sans/IRANSansWebFaNum.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/fa/sans/IRANSansWebFaNum-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/fa/sans/IRANSansWebFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/fa/sans/IRANSansWebFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans",
});

const roboto = localFont({
  src: "../../../public/fonts/en/roboto/Roboto-VariableFont_wdth,wght.ttf",
  weight: "100 900",
  variable: "--font-roboto",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales
    .filter((locale) => localeNames[locale].active)
    .map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Restaurant Management",
  description: "Restaurant management dashboard",
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!isActiveLocale(lang)) notFound();

  const { dir } = localeNames[lang];

  return (
    <html
      lang={lang}
      dir={dir}
      style={{ "--font-sans": lang === "fa" ? "var(--font-iran-sans)" : "var(--font-roboto)" } as CSSProperties}
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        geistMono.variable,
        iranSans.variable,
        roboto.variable
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
