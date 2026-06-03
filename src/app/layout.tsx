import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WalletProvider } from "@/lib/WalletProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://crab-on-monad.vercel.app"),
  title: "Crab on Monad — Grab the $CRAB",
  description:
    "The degenerate Monad mogul, pincher of charts and normies. $CRAB on the Monad network.",
  openGraph: {
    title: "Crab on Monad — Grab the $CRAB",
    description:
      "The degenerate Monad mogul, pincher of charts and normies. $CRAB on the Monad network.",
    images: ["/img/crab-hero.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#0affff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
