import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "용인시장 업무추진비 투명성 모니터링",
  description: "용인시장 업무추진비 사용 내역을 투명하게 공개합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
