import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoriteContext";

import { StylingProvider } from "./context/StylingContext";
import { StyleDataProvider } from "./context/StyleDataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Shopping Fairy",
  description: "Your personal AI fashion stylist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <FavoriteProvider>
            <StyleDataProvider>
              <StylingProvider>
                {children}
              </StylingProvider>
            </StyleDataProvider>
          </FavoriteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
