import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlowBoard",
  description: "Strona do tworzenia i zarządzania planami.",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl-PL"
      className={cn("h-full", "antialiased", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full  min-w-full">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
