import type { Metadata } from "next";

import { AppSidebar } from "@/components/app-sidebar";

import "../styles/globals.css";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "Prism",
  description: "Prism"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`antialiased text-neutral-900`}
      >
        <Providers>
          <AppSidebar />
          <main className="flex flex-col w-full h-screen text-foreground">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
