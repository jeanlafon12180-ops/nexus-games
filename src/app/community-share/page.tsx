"use client";

import "./community-share.css";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";

const FORMAT = "nexus-games-creation";
const MAX_BYTES = 500_000;

type SharedCreation = { format: string; schemaVersion: number; createdAt: string; creation: { name: string; description: string; game: string; payload: unknown } };

function validate(value: unknown): value is SharedCreation {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  if (item.format !== FORMAT || item.schemaVersion !== 1 || typeof item.createdAt !== "string") return false;
  if (!item.creation || typeof item.creation !== "object" || Array.isArray(item.creation)) return false;
  const creation = item.creation as Record<string, unknown>;
  return typeof creation.name === "string" && creation.name.trim().length > 0 && creation.name.length <= 60
    && typeof creation.description === "string" && creation.description.length <= 500
    && typeof creation.game === "string" && creation.game.length <= 40
    && "payload" in creation;
}

export default function CommunitySharePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("Creator Evolution");
  const [payload, setPayload] = useState("{}");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<SharedCreation | null>(null);

  function exportCreation() {
    try {
      const parsed = JSON.parse(payload) as unknown;
      const bundle: SharedCreation = { format: FORMAT, schemaVersion: 1, createdAt: new Date().toISOString(), creation: { name: name.trim(), description: description.trim(), game, payload: parsed } };
      if (!validate(bundle)) throw new Error("Vérifie le nom, la description et le contenu JSON.");
      const serialized = JSON.stringify(bundle, null, 2);
      if (new Blob([serialized]).size > MAX_BYTES) throw new Error("Le fichier dépasse la limite de 500 Ko.");
      const url = URL.createObjectURL(new Blob([serialized], { type: "application/json" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "nexus-creation.json"; anchor.click();
      URL.revokeObjectURL(url); setNotice("Fichier créé sur ton appareil. Il n'a pas été envoyé sur Internet.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Export impossible."); }
  }

  async function importCreation(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) { setNotice("Fichier refusé : limite de 500 Ko."); return; }
    try {
      const value: unknown = JSON.parse(await file.text());
      if (!validate(value)) throw new Error("Format Nexus Creation invalide.");
      setPreview(value); setNotice("Fiche vérifiée. Aucun contenu n'a été exécuté ni publié.");
    } catch (error) { setPreview(null); setNotice(error instanceof Error ? error.message : "Import impossible."); }
  }

  return <main className="community-foundation">
    <header><Link href="/" className="evo-brand">NEXUS<span>GAMES</span></Link><Link href="/" className="evo-back">← ACCUEIL</Link></header>
    <section className="community-hero"><span>2.6.0 · COMMUNITY TOOLS</span><h1>SHARE<br/><em>YOUR CREATION.</em></h1><p>Crée une fiche de partage portable ou vérifie un fichier reçu.</p></section>
    <section className="community-editor">
      <label>Nom de la création<input maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="Mon niveau" /></label>
      <label>Description<textarea maxLength={500} value={description} onChange={e => setDescription(e.target.value)} placeholder="Présente ton jeu ou ton niveau." /></label>
      <label>Outil<select value={game} onChange={e => setGame(e.target.value)}><option>Creator Evolution</option><option>Creator Studio</option><option>Autre</option></select></label>
      <label>Contenu JSON<textarea className="community-json" value={payload} onChange={e => setPayload(e.target.value)} spellCheck={false}/></label>
      <div className="community-actions"><button className="evo-primary" onClick={exportCreation}>EXPORTER LA FICHE</button><label className="evo-primary community-file">IMPORTER ET VÉRIFIER<input type="file" accept="application/json,.json" onChange={importCreation}/></label></div>
      {notice && <p role="status" className="community-notice">{notice}</p>}
      {preview && <article className="community-preview"><small>FICHE IMPORTÉE · VERSION {preview.schemaVersion}</small><h2>{preview.creation.name}</h2><p>{preview.creation.description}</p><p>Outil : {preview.creation.game}</p><pre>{JSON.stringify(preview.creation.payload, null, 2)}</pre></article>}
    </section>
    <p className="community-privacy">Les fichiers restent sur ton appareil. Cette page ne publie rien dans une galerie publique et n'envoie aucun fichier à un serveur.</p>
    <footer className="evo-footer">NEXUS GAMES 2.6.0 · LOCAL CREATION SHARING</footer>
  </main>;
}
