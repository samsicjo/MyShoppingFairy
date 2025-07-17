import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

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
          <StyleDataProvider>
            <StylingProvider>
              {children}
            </StylingProvider>
          </StyleDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
