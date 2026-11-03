"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NexusApiHealth } from "@/lib/online-contract";

type CheckState = "checking" | "available" | "unavailable";
const LOCAL_KEYS = [
  "nexus-games-favorites", "nexus-games-player-name", "nexus-platform-city-visited",
  "nexus-city-save-v1", "nexus-neon-dodge-best", "nexus-creator-creations-v1",
  "nexus-community-games-v1", "nexus-community-liked-v1", "nexus-player-accent-v1",
  "nexus-player-status-v1", "nexus-recent-games-v1", "nexus-creator-evolution-v1"
] as const;

export default function OnlinePage() {
  const [check, setCheck] = useState<CheckState>("checking");
  const [health, setHealth] = useState<NexusApiHealth | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/health", { cache: "no-store" })
      .then(response => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json() as Promise<NexusApiHealth>;
      })
      .then(data => {
        if (!active) return;
        setHealth(data);
        setCheck("available");
      })
      .catch(() => {
        if (active) setCheck("unavailable");
      });
    return () => { active = false; };
  }, []);

  function exportLocalData() {
    try {
      const data: Record<string, string> = {};
      for (const key of LOCAL_KEYS) {
        const value = window.localStorage.getItem(key);
        if (value !== null) data[key] = value;
      }
      const bundle = {
        format: "nexus-games-network-transfer",
        schemaVersion: 1,
        createdAt: new Date().toISOString(),
        scope: "local-browser-data",
        data
      };
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "nexus-games-network-transfer.json";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setNotice("Export créé. Tes données restent sur ton appareil ; aucun envoi vers Internet n'a été effectué.");
    } catch {
      setNotice("Export impossible sur cet appareil. Vérifie les autorisations du navigateur.");
    }
  }

  return <main className="network-page">
    <header className="network-top"><Link href="/" className="evo-brand">NEXUS<span>GAMES</span></Link><Link href="/" className="evo-back">← RETOUR À L'ACCUEIL</Link></header>
    <section className="network-hero">
      <span>VERSION 2.5.0 · ONLINE FOUNDATION</span>
      <h1>WELCOME TO<br/><em>NEXUS NETWORK.</em></h1>
      <p>Le socle technique de la future expérience connectée Nexus Games.</p>
    </section>
    <section className="network-status-panel">
      <div><span className="network-kicker">ÉTAT DE L'API</span><h2>{check === "checking" ? "Vérification…" : check === "available" ? "API accessible" : "API indisponible"}</h2><p>{health ? "Le point de contrôle répond. Cela ne signifie pas que les comptes ou la synchronisation sont activés." : "Impossible de joindre le point de contrôle pour le moment."}</p></div>
      <span className={"network-state "+(check === "available" ? "is-ready" : check === "unavailable" ? "is-offline" : "")}>{check === "checking" ? "TEST" : check === "available" ? "RÉPONSE OK" : "HORS LIGNE"}</span>
    </section>
    <section className="network-grid">
      <article className="network-card"><span>01 / IDENTITÉ</span><b>Comptes joueurs</b><p>Format de profil versionné préparé. Création de compte et connexion non activées.</p><small>EN PRÉPARATION</small></article>
      <article className="network-card"><span>02 / SAUVEGARDES</span><b>Cloud Save</b><p>Contrat commun défini pour les sauvegardes de Nexus City, Neon Dodge et Creator Studio.</p><small>LOCAL UNIQUEMENT</small></article>
      <article className="network-card"><span>03 / COMMUNAUTÉ</span><b>Galerie partagée</b><p>La future API pourra recevoir des créations après ajout d'une authentification et de contrôles de sécurité.</p><small>NON ACTIVÉE</small></article>
      <article className="network-card"><span>04 / COMPÉTITION</span><b>Classements mondiaux</b><p>Structure réservée à une prochaine étape. Aucun score n'est transmis à un serveur.</p><small>NON ACTIVÉS</small></article>
    </section>
    <section className="network-transfer">
      <div><span className="network-kicker">PORTABILITÉ DES DONNÉES</span><h2>Garde une copie de tes données.</h2><p>Exporte les données locales connues dans un fichier JSON versionné. Cet export ne crée pas de compte et ne synchronise rien en ligne.</p></div>
      <button className="evo-primary" onClick={exportLocalData}>EXPORTER MES DONNÉES JSON</button>
      {notice && <p className="network-notice" role="status">{notice}</p>}
    </section>
    <footer className="evo-footer">NEXUS GAMES 2.5.0 · NETWORK FOUNDATION · AUCUNE CONNEXION CLOUD ACTIVE</footer>
  </main>;
}
