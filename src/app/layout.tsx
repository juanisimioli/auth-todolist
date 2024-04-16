import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Todo List",
  description: "Example app using JWT and server actions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
