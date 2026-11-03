import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Games 2.0 — Play beyond limits",
  description: "Nexus Games 2.0 : joue à Nexus City et Neon Dodge, crée tes niveaux et découvre la galerie locale.",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
