import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Games 6.0 — Play beyond limits",
  description: "Nexus Games 6.0 : découvre Nexus Battle Royale, une expérience battle royale 3D à la troisième personne.",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
