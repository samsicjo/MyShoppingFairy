import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { ModalProvider } from "./context/ModalContext";

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
      <head>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ModalProvider>
            <FavoriteProvider>
              <StyleDataProvider>
                <StylingProvider>
                  {children}
                </StylingProvider>
              </StyleDataProvider>
            </FavoriteProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

