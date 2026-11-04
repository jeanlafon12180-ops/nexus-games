import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Games 5.0 — Play beyond limits",
  description: "Nexus Games 5.0 : joue à dix univers 3D WebGL, explore le catalogue et retrouve tes jeux récents.",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
