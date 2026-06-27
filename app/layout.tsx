import type { Metadata } from "next";
import { Nunito_Sans, Quicksand } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Groene Kansen Kaart — Vergroenen in Leiden",
  description:
    "Ontdek groene initiatieven en vergroeningsprojecten in Leiden op de interactieve Groene Kansen Kaart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${nunitoSans.variable} ${quicksand.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
