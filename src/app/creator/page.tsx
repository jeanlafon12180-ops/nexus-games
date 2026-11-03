"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Tile = "" | "player" | "platform" | "coin" | "tree" | "enemy" | "goal";
type Creation = { id: string; title: string; description: string; genre: string; tiles: Tile[]; publishedAt: string };
const STORAGE = "nexus-creator-creations-v1";
const validTiles: Tile[] = ["", "player", "platform", "coin", "tree", "enemy", "goal"];
const isCreation = (value: unknown): value is Creation => !!value && typeof value === "object" && "id" in value && typeof value.id === "string" && "title" in value && typeof value.title === "string" && value.title.length <= 40 && "description" in value && typeof value.description === "string" && value.description.length <= 180 && "genre" in value && typeof value.genre === "string" && "tiles" in value && Array.isArray(value.tiles) && value.tiles.length === 70 && value.tiles.every(tile => validTiles.includes(tile as Tile));
const COMMUNITY_STORAGE = "nexus-community-games-v1";
const EMPTY = Array.from({ length: 70 }, (_, i): Tile => (i >= 60 ? "platform" : ""));
const palette: { id: Tile; label: string; icon: string }[] = [
  { id: "player", label: "Joueur", icon: "🧑" },
  { id: "platform", label: "Plateforme", icon: "🟩" },
  { id: "coin", label: "Pièce", icon: "🪙" },
  { id: "tree", label: "Arbre", icon: "🌳" },
  { id: "enemy", label: "Obstacle", icon: "👾" },
  { id: "goal", label: "Arrivée", icon: "🏁" },
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
  const [coins, setCoins] = useState(0);
  const [notice, setNotice] = useState("Place des objets dans la grille pour construire ton niveau.");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setCreations(parsed.filter(isCreation).slice(0, 30));
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
    const x = player % 10;
    const y = Math.floor(player / 10);
    const nx = Math.max(0, Math.min(9, x + dx));
    const ny = Math.max(0, Math.min(6, y + dy));
    const next = ny * 10 + nx;
    if (tiles[next] === "platform" || tiles[next] === "enemy") return;
    if (tiles[next] === "coin") {
      setTiles(board => board.map((tile, index) => index === next ? "" : tile));
      setCoins(count => count + 1);
    }
    if (tiles[next] === "goal") {
      setNotice("Niveau terminé ! Tu as récupéré " + coins + " pièce(s).");
      setPlaying(false);
    }
    setPlayer(next);
  }, [playing, player, tiles, coins]);

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
    setCoins(0);
    setPlaying(true);
    setNotice("Mode test actif : déplace ton personnage avec les flèches ou ZQSD.");
  };
  const save = (publish: boolean) => {
    if (!title.trim()) { setNotice("Ajoute un nom à ton jeu avant de l'enregistrer."); return; }
    const item: Creation = { id: String(Date.now()), title: title.trim(), description: description.trim(), genre, tiles, publishedAt: new Date().toISOString() };
    const next = [item, ...creations.filter(c => c.title !== item.title)].slice(0, 30);
    persist(next);
    if (publish) {
      try {
        const raw = localStorage.getItem(COMMUNITY_STORAGE);
        const existing: unknown = raw ? JSON.parse(raw) : [];
        const community = Array.isArray(existing) ? existing as Creation[] : [];
        localStorage.setItem(COMMUNITY_STORAGE, JSON.stringify([item, ...community.filter(entry => entry.title !== item.title)].slice(0, 50)));
        setNotice("Création publiée dans la galerie communautaire de cet appareil. Elle n'est pas visible sur Internet.");
      } catch {
        setNotice("Création enregistrée dans ta bibliothèque, mais la galerie locale est indisponible.");
      }
    } else {
      setNotice("Brouillon enregistré sur cet appareil.");
    }
  };
  const exportCreation = (item: Creation) => {
    const payload = { format: "nexus-games-creation", version: 1, game: item };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".nexusgame.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Fichier de partage téléchargé. Tu peux l'envoyer à un autre joueur.");
  };

  const exportCurrent = () => {
    if (!title.trim()) { setNotice("Ajoute un nom à ton jeu avant l'export."); return; }
    exportCreation({ id: String(Date.now()), title: title.trim(), description: description.trim(), genre, tiles, publishedAt: new Date().toISOString() });
  };

  const importCreation = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 250000) throw new Error("Fichier trop volumineux (250 Ko maximum).");
      const parsed: unknown = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object" || !("format" in parsed) || parsed.format !== "nexus-games-creation" || !("version" in parsed) || parsed.version !== 1 || !("game" in parsed)) throw new Error("Ce fichier n'est pas une création Nexus Games.");
      const game = parsed.game as Partial<Creation>;
      const allowed: Tile[] = ["", "player", "platform", "coin", "tree", "enemy", "goal"];
      if (typeof game.title !== "string" || typeof game.description !== "string" || typeof game.genre !== "string" || !Array.isArray(game.tiles) || game.tiles.length !== 70 || !game.tiles.every(tile => allowed.includes(tile as Tile))) throw new Error("Le fichier ne contient pas un niveau valide.");
      const imported: Creation = { id: String(Date.now()), title: game.title.slice(0,40), description: game.description.slice(0,180), genre: game.genre.slice(0,30), tiles: game.tiles as Tile[], publishedAt: new Date().toISOString() };
      setTitle(imported.title); setDescription(imported.description); setGenre(imported.genre); setTiles(imported.tiles); setPlaying(false);
      persist([imported, ...creations.filter(item => item.title !== imported.title)].slice(0,30));
      setNotice("Création importée avec succès et ajoutée à ta bibliothèque locale.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Impossible d'importer ce fichier."); }
  };

  const load = (item: Creation) => {
    setTitle(item.title); setDescription(item.description); setGenre(item.genre);
    setTiles(item.tiles); setPlaying(false); setNotice("Création chargée dans l'éditeur.");
  };

  return <main className="creator-page">
    <div className="creator-top"><Link className="creator-brand" href="/">NEXUS<span>GAMES</span></Link><Link className="creator-back" href="/">← RETOUR À LA PLATEFORME</Link></div>
    <section className="creator-hero"><div className="creator-kicker">NEXUS GAMES · OUTIL DE CRÉATION · NEXUS GAMES 2.1.0</div><h1>NEXUS <em>CREATOR</em><br/>STUDIO.</h1><p>Imagine ton jeu, construis un niveau, teste-le et enregistre ta création. Un premier atelier de création 2D directement dans ton navigateur.</p></section>
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
        <div className="creator-grid" aria-label="Grille de création">{tiles.map((tile,index)=><button key={index} className={"creator-tile "+(tile?"tile-"+tile:"")} onClick={()=>place(index)} aria-label={"Case "+(index+1)}>{tile==="player"?"🧑":tile==="platform"?"":tile==="coin"?"🪙":tile==="tree"?"🌳":tile==="enemy"?"👾":tile==="goal"?"🏁":""}</button>)}</div>
        <p className="creator-hint">Choisis un objet dans la palette, puis touche une case pour le placer. Place le personnage, des plateformes et des objets pour composer ton niveau.</p>
        <div className="creator-playbar"><span>{playing?"APERÇU EN COURS":"ÉDITEUR DE NIVEAU"}{playing?" · "+coins+" PIÈCE(S)":""}</span><button onClick={()=>setPlaying(false)}>MODE ÉDITION</button></div>
        {playing && <div className="creator-grid" aria-label="Aperçu du jeu">{tiles.map((tile,index)=><div key={index} className={"creator-tile "+(tile?"tile-"+tile:"")}>{index===player?"🧑":tile==="platform"?"":tile==="coin"?"🪙":tile==="tree"?"🌳":tile==="enemy"?"👾":tile==="goal"?"🏁":""}</div>)}</div>}
        <div className="creator-actions"><button className="primary" onClick={startPlay}>▶ TESTER LE JEU</button><button onClick={()=>{setTiles(EMPTY);setCoins(0);setPlaying(false);setNotice("Niveau réinitialisé.");}}>RÉINITIALISER</button></div>
        {playing && <div className="creator-playbar"><span>COMMANDES DE DÉPLACEMENT</span><div className="creator-actions"><button onClick={()=>move(0,-1)}>↑</button><button onClick={()=>move(-1,0)}>←</button><button onClick={()=>move(0,1)}>↓</button><button onClick={()=>move(1,0)}>→</button></div></div>}
      </section>
      <aside className="creator-side">
        <section className="creator-panel"><h2>03 / ENREGISTRER & PARTAGER</h2><p>Conserve ton brouillon, publie-le dans ta bibliothèque ou exporte un fichier pour l'envoyer à un autre joueur.</p><div className="creator-share-actions"><button onClick={exportCurrent}>↓ EXPORTER MON JEU</button><label className="creator-import-button">↑ IMPORTER UN FICHIER<input type="file" accept=".json,.nexusgame.json,application/json" onChange={importCreation}/></label></div><button className="creator-save" onClick={()=>save(false)}>ENREGISTRER LE BROUILLON</button><button className="creator-save" style={{marginTop:8}} onClick={()=>save(true)}>PUBLIER MA CRÉATION ↗</button><div className="creator-status" role="status">{notice}</div></section>
        <section className="creator-panel"><h2>MES CRÉATIONS <span style={{color:"var(--green)"}}>{ready?creations.length:0}</span></h2>{creations.length===0?<div className="creator-empty">Aucune création enregistrée pour le moment.</div>:<div className="creator-list">{creations.map(item=><article className="creator-item" key={item.id}><b>{item.title}</b><small>{item.genre} · {new Date(item.publishedAt).toLocaleDateString("fr-FR")}</small><div className="creator-actions"><button onClick={()=>load(item)}>OUVRIR</button><button onClick={()=>exportCreation(item)}>EXPORTER</button><button onClick={()=>persist(creations.filter(c=>c.id!==item.id))}>SUPPRIMER</button></div></article>)}</div>}</section>
        <section className="creator-panel"><h2>PARTAGE COMMUNAUTAIRE</h2><p>La publication publique, les profils créateurs et le téléchargement des jeux seront ajoutés avec le système de comptes et le serveur de Nexus Games.</p><div className="creator-status">Pour le moment, tes créations restent privées sur cet appareil. Aucun compte ni identifiant n'est demandé.</div></section>
      </aside>
    </div>
    <p className="creator-note">NEXUS CREATOR STUDIO · NEXUS GAMES 2.1.0 · Les créations sont enregistrées localement dans ce navigateur. Le partage entre joueurs n'est pas encore activé.</p>
  </main>;
}
