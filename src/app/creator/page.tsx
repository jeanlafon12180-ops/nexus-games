"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Tile = "" | "player" | "platform" | "coin" | "tree" | "enemy";
type Creation = { id: string; title: string; description: string; genre: string; tiles: Tile[]; publishedAt: string };
const STORAGE = "nexus-creator-creations-v1";
const EMPTY = Array.from({ length: 70 }, (_, i): Tile => (i >= 60 ? "platform" : ""));
const palette: { id: Tile; label: string; icon: string }[] = [
  { id: "player", label: "Joueur", icon: "🧑" },
  { id: "platform", label: "Plateforme", icon: "🟩" },
  { id: "coin", label: "Pièce", icon: "🪙" },
  { id: "tree", label: "Arbre", icon: "🌳" },
  { id: "enemy", label: "Obstacle", icon: "👾" },
  { id: "", label: "Gomme", icon: "⌫" }
];

export default function CreatorPage() {
  const [title, setTitle] = useState("Mon premier jeu");
  const [description, setDescription] = useState("Une petite aventure créée avec Nexus Creator Studio.");
  const [genre, setGenre] = useState("Plateforme");
  const [tiles, setTiles] = useState<Tile[]>(EMPTY);
  const [tool, setTool] = useState<Tile>("platform");
  const [creations, setCreations] = useState<Creation[]>([]);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState(0);
  const [notice, setNotice] = useState("Place des objets dans la grille pour construire ton niveau.");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setCreations(parsed as Creation[]);
      }
    } catch { /* stockage indisponible : l'éditeur reste utilisable en mémoire */ }
    setReady(true);
  }, []);

  const persist = useCallback((items: Creation[]) => {
    setCreations(items);
    try { localStorage.setItem(STORAGE, JSON.stringify(items)); }
    catch { setNotice("Stockage indisponible : garde cette page ouverte pour conserver ta création."); }
  }, []);

  const place = (index: number) => {
    if (playing) return;
    setTiles(current => current.map((tile, i) => i === index ? tool : tile));
    setNotice(tool ? "Objet placé dans ton niveau." : "Case effacée.");
  };

  const move = useCallback((dx: number, dy: number) => {
    if (!playing) return;
    setPlayer(current => {
      const x = current % 10;
      const y = Math.floor(current / 10);
      const nx = Math.max(0, Math.min(9, x + dx));
      const ny = Math.max(0, Math.min(6, y + dy));
      const next = ny * 10 + nx;
      if (tiles[next] === "platform" || tiles[next] === "enemy") return current;
      return next;
    });
  }, [playing, tiles]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!playing) return;
      const keys: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
        q: [-1, 0], d: [1, 0], z: [0, -1], s: [0, 1]
      };
      const direction = keys[event.key] ?? keys[event.key.toLowerCase()];
      if (direction) { event.preventDefault(); move(direction[0], direction[1]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, move]);

  const startPlay = () => {
    const start = tiles.findIndex(tile => tile === "player");
    setPlayer(start >= 0 ? start : 50);
    setPlaying(true);
    setNotice("Mode test actif : déplace ton personnage avec les flèches ou ZQSD.");
  };
  const save = (publish: boolean) => {
    if (!title.trim()) { setNotice("Ajoute un nom à ton jeu avant de l'enregistrer."); return; }
    const item: Creation = { id: String(Date.now()), title: title.trim(), description: description.trim(), genre, tiles, publishedAt: new Date().toISOString() };
    const next = [item, ...creations.filter(c => c.title !== item.title)].slice(0, 30);
    persist(next);
    setNotice(publish ? "Jeu publié dans ta bibliothèque locale. Il est visible uniquement sur cet appareil." : "Brouillon enregistré sur cet appareil.");
  };
  const load = (item: Creation) => {
    setTitle(item.title); setDescription(item.description); setGenre(item.genre);
    setTiles(item.tiles); setPlaying(false); setNotice("Création chargée dans l'éditeur.");
  };

  return <main className="creator-page">
    <div className="creator-top"><Link className="creator-brand" href="/">NEXUS<span>GAMES</span></Link><Link className="creator-back" href="/">← RETOUR À LA PLATEFORME</Link></div>
    <section className="creator-hero"><div className="creator-kicker">NEXUS GAMES · OUTIL DE CRÉATION · BETA 0.0.1.5</div><h1>NEXUS <em>CREATOR</em><br/>STUDIO.</h1><p>Imagine ton jeu, construis un niveau, teste-le et enregistre ta création. Un premier atelier de création 2D directement dans ton navigateur.</p></section>
    <div className="creator-layout">
      <section className="creator-panel">
        <h2>01 / CONFIGURER TON JEU</h2>
        <div className="creator-fields">
          <label>NOM DU JEU<input value={title} maxLength={40} onChange={e=>setTitle(e.target.value)} placeholder="Nom de ton jeu"/></label>
          <label>GENRE<select value={genre} onChange={e=>setGenre(e.target.value)}><option>Plateforme</option><option>Aventure</option><option>Arcade</option><option>Réflexion</option><option>Exploration</option></select></label>
          <label className="wide">DESCRIPTION<textarea value={description} maxLength={180} onChange={e=>setDescription(e.target.value)}/></label>
        </div>
        <h2>02 / CONSTRUIRE LE NIVEAU</h2>
        <div className="creator-toolbar"><span className="creator-label">PALETTE D'OBJETS</span><div className="creator-tools">{palette.map(item=><button key={item.label} className={tool===item.id?"active":""} onClick={()=>{setTool(item.id);setPlaying(false);}}>{item.icon} {item.label}</button>)}</div></div>
        <div className="creator-grid" aria-label="Grille de création">{tiles.map((tile,index)=><button key={index} className={"creator-tile "+(tile?"tile-"+tile:"")} onClick={()=>place(index)} aria-label={"Case "+(index+1)}>{tile==="player"?"🧑":tile==="platform"?"":tile==="coin"?"🪙":tile==="tree"?"🌳":tile==="enemy"?"👾":""}</button>)}</div>
        <p className="creator-hint">Choisis un objet dans la palette, puis touche une case pour le placer. Place le personnage, des plateformes et des objets pour composer ton niveau.</p>
        <div className="creator-playbar"><span>{playing?"APERÇU EN COURS":"ÉDITEUR DE NIVEAU"}</span><button onClick={()=>setPlaying(false)}>MODE ÉDITION</button></div>
        {playing && <div className="creator-grid" aria-label="Aperçu du jeu">{tiles.map((tile,index)=><div key={index} className={"creator-tile "+(tile?"tile-"+tile:"")}>{index===player?"🧑":tile==="platform"?"":tile==="coin"?"🪙":tile==="tree"?"🌳":tile==="enemy"?"👾":""}</div>)}</div>}
        <div className="creator-actions"><button className="primary" onClick={startPlay}>▶ TESTER LE JEU</button><button onClick={()=>{setTiles(EMPTY);setPlaying(false);setNotice("Niveau réinitialisé.");}}>RÉINITIALISER</button></div>
        {playing && <div className="creator-playbar"><span>COMMANDES DE DÉPLACEMENT</span><div className="creator-actions"><button onClick={()=>move(0,-1)}>↑</button><button onClick={()=>move(-1,0)}>←</button><button onClick={()=>move(0,1)}>↓</button><button onClick={()=>move(1,0)}>→</button></div></div>}
      </section>
      <aside className="creator-side">
        <section className="creator-panel"><h2>03 / ENREGISTRER</h2><p>Conserve ton brouillon ou publie-le dans ta bibliothèque personnelle Nexus Games.</p><button className="creator-save" onClick={()=>save(false)}>ENREGISTRER LE BROUILLON</button><button className="creator-save" style={{marginTop:8}} onClick={()=>save(true)}>PUBLIER MA CRÉATION ↗</button><div className="creator-status" role="status">{notice}</div></section>
        <section className="creator-panel"><h2>MES CRÉATIONS <span style={{color:"var(--green)"}}>{ready?creations.length:0}</span></h2>{creations.length===0?<div className="creator-empty">Aucune création enregistrée pour le moment.</div>:<div className="creator-list">{creations.map(item=><article className="creator-item" key={item.id}><b>{item.title}</b><small>{item.genre} · {new Date(item.publishedAt).toLocaleDateString("fr-FR")}</small><div className="creator-actions"><button onClick={()=>load(item)}>OUVRIR</button><button onClick={()=>persist(creations.filter(c=>c.id!==item.id))}>SUPPRIMER</button></div></article>)}</div>}</section>
        <section className="creator-panel"><h2>PARTAGE COMMUNAUTAIRE</h2><p>La publication publique, les profils créateurs et le téléchargement des jeux seront ajoutés avec le système de comptes et le serveur de Nexus Games.</p><div className="creator-status">Pour le moment, tes créations restent privées sur cet appareil. Aucun compte ni identifiant n'est demandé.</div></section>
      </aside>
    </div>
    <p className="creator-note">NEXUS CREATOR STUDIO · BETA 0.0.1.5 · Les créations sont enregistrées localement dans ce navigateur. Le partage entre joueurs n'est pas encore activé.</p>
  </main>;
}
