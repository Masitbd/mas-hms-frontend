"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

const inter = Inter({ subsets: ["latin"] });

export default function PrimaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noNav = ["/signup", "/signin"];

  if (noNav.includes(pathname)) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="">{children}</div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
