import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dopamine — Because Feeling Good Matters",
  description: "Brand pakaian olahraga lokal untuk kenyamanan dan performa maksimal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
