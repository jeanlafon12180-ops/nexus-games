import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Games 4.0 — Play beyond limits",
  description: "Nexus Games 4.0 : découvre Nexus City, Neon Dodge et Nexus Racing, retrouve tes jeux récents et explore les outils de création.",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
