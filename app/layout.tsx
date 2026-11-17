import type { Metadata } from "next";
import "./globals.css";
import "./pool-refresh.css";
export const metadata: Metadata = {
  title: { default: "Poolside — NPLQ Revision", template: "%s | Poolside" },
  description:
    "Your independent NPLQ study companion. Refresh your knowledge, practise mock assessments and prepare for your lifeguard interview.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
