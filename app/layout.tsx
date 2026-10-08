import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Worry Stone",
  description: "오늘도 동글동글 괜찮아",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}