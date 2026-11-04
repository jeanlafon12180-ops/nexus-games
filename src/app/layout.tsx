import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Games — Play Your Own Universe",
  description: "Nexus Games : une nouvelle plateforme gaming indépendante. Une nouvelle identité, des univers originaux et une expérience PC et navigateur.",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
