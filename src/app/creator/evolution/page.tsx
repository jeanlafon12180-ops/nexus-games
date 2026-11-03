"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Tile = "" | "player" | "platform" | "coin" | "obstacle" | "goal";
type Mode = "platform" | "dodge";
type Project = { id: string; title: string; mode: Mode; tiles: Tile[]; updatedAt: string };
const STORAGE = "nexus-creator-evolution-v1";
const COUNT = 96;
const EMPTY: Tile[] = Array.from({ length: COUNT }, (_, i) => i >= 84 ? "platform" : "");
const VALID: Tile[] = ["", "player", "platform", "coin", "obstacle", "goal"];

const copy = {
  fr: {
    back: "← RETOUR À NEXUS GAMES", kicker: "CREATOR STUDIO · ÉVOLUTION 2.2",
    titleA: "CONSTRUIS TON", titleB: "PROCHAIN JEU.",
    intro: "Un atelier 2D plus complet : compose ton niveau, choisis un mode, teste-le et exporte ton projet.",
    project: "PROJET", name: "NOM DU JEU", mode: "MODE DE JEU", platform: "Plateforme", dodge: "Évitement",
    board: "ÉDITEUR DE NIVEAU", palette: "PALETTE", player: "Joueur", ground: "Sol", coin: "Pièce", obstacle: "Obstacle", goal: "Arrivée", erase: "Gomme",
    test: "▶ TESTER", edit: "MODE ÉDITION", reset: "EFFACER LE NIVEAU", save: "ENREGISTRER", export: "EXPORTER JSON", import: "IMPORTER JSON",
    library: "MES PROJETS", empty: "Aucun projet enregistré.", load: "OUVRIR", remove: "SUPPRIMER",
    helpPlatform: "Mode plateforme : rejoins le drapeau. Les plateformes et obstacles bloquent le passage.",
    helpDodge: "Mode évitement : collecte les pièces et évite les obstacles pour atteindre le score cible.",
    keyboard: "Déplacements : flèches ou ZQSD. Sur mobile, utilise les commandes ci-dessous.",
    notice: "Place les éléments sur la grille pour commencer.", saved: "Projet enregistré sur cet appareil.",
    exported: "Fichier JSON exporté.", imported: "Projet importé dans l’éditeur.",
    win: "Niveau terminé !", hit: "Obstacle touché : essaie encore.", target: "Objectif atteint !",
    invalid: "Fichier invalide ou incompatible.", titleRequired: "Donne un nom à ton jeu.",
    language: "ENGLISH", private: "Les projets sont enregistrés uniquement dans ce navigateur. L’export JSON permet de les transférer ; la publication publique nécessitera un serveur."
  },
  en: {
    back: "← BACK TO NEXUS GAMES", kicker: "CREATOR STUDIO · EVOLUTION 2.2",
    titleA: "BUILD YOUR", titleB: "NEXT GAME.",
    intro: "A more complete 2D workshop: design a level, choose a mode, play-test it and export your project.",
    project: "PROJECT", name: "GAME TITLE", mode: "GAME MODE", platform: "Platformer", dodge: "Dodge",
    board: "LEVEL EDITOR", palette: "TOOLBOX", player: "Player", ground: "Ground", coin: "Coin", obstacle: "Obstacle", goal: "Goal", erase: "Eraser",
    test: "▶ PLAY TEST", edit: "EDIT MODE", reset: "CLEAR LEVEL", save: "SAVE PROJECT", export: "EXPORT JSON", import: "IMPORT JSON",
    library: "MY PROJECTS", empty: "No saved projects yet.", load: "OPEN", remove: "DELETE",
    helpPlatform: "Platform mode: reach the flag. Ground and obstacles block your path.",
    helpDodge: "Dodge mode: collect coins and avoid obstacles to reach the target score.",
    keyboard: "Move with arrows or WASD. On mobile, use the controls below.",
    notice: "Place objects on the grid to get started.", saved: "Project saved on this device.",
    exported: "JSON file exported.", imported: "Project imported into the editor.",
    win: "Level complete!", hit: "Obstacle hit: try again.", target: "Target reached!",
    invalid: "Invalid or incompatible file.", titleRequired: "Enter a game title.",
    language: "FRANÇAIS", private: "Projects are stored in this browser only. JSON export lets you transfer them; public publishing will require a server."
  }
};

const palette: { id: Tile; key: keyof typeof copy.fr; icon: string }[] = [
  { id: "player", key: "player", icon: "🧑" },
  { id: "platform", key: "ground", icon: "🟩" },
  { id: "coin", key: "coin", icon: "🪙" },
  { id: "obstacle", key: "obstacle", icon: "👾" },
  { id: "goal", key: "goal", icon: "🏁" },
  { id: "", key: "erase", icon: "⌫" }
];

export default function CreatorEvolutionPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t = copy[lang];
  const [title, setTitle] = useState("Mon jeu 2D");
  const [mode, setMode] = useState<Mode>("platform");
  const [tiles, setTiles] = useState<Tile[]>(EMPTY);
  const [tool, setTool] = useState<Tile>("platform");
  const [projects, setProjects] = useState<Project[]>([]);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState(72);
  const [score, setScore] = useState(0);
  const [notice, setNotice] = useState(copy.fr.notice);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setProjects(parsed.filter(isProject).slice(0, 30));
      }
    } catch { /* local storage may be unavailable */ }
    setReady(true);
  }, []);

  function isProject(value: unknown): value is Project {
    if (!value || typeof value !== "object") return false;
    const p = value as Partial<Project>;
    return typeof p.id === "string" && typeof p.title === "string" && p.title.length <= 40 &&
      (p.mode === "platform" || p.mode === "dodge") && Array.isArray(p.tiles) &&
      p.tiles.length === COUNT && p.tiles.every(tile => VALID.includes(tile as Tile));
  }

  const persist = useCallback((next: Project[]) => {
    setProjects(next);
    try { localStorage.setItem(STORAGE, JSON.stringify(next)); }
    catch { setNotice("Stockage indisponible : exporte ton projet pour le conserver."); }
  }, []);

  const move = useCallback((dx: number, dy: number) => {
    if (!playing) return;
    const x = player % 12, y = Math.floor(player / 12);
    const nx = Math.max(0, Math.min(11, x + dx));
    const ny = Math.max(0, Math.min(7, y + dy));
    const next = ny * 12 + nx;
    const cell = tiles[next];
    if (mode === "platform" && (cell === "platform" || cell === "obstacle")) return;
    if (cell === "obstacle") {
      setPlaying(false);
      setNotice(t.hit);
      return;
    }
    if (cell === "coin") {
      setScore(value => value + 1);
      setTiles(current => current.map((tile, i) => i === next ? "" : tile));
    }
    if (mode === "platform" && cell === "goal") {
      setPlaying(false);
      setNotice(t.win + " " + score + " " + t.coin.toLowerCase() + "(s).");
    } else if (mode === "dodge" && score + (cell === "coin" ? 1 : 0) >= 5) {
      setPlaying(false);
      setNotice(t.target);
    }
    setPlayer(next);
  }, [playing, player, tiles, mode, score, t]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const keys: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
        a: [-1, 0], d: [1, 0], w: [0, -1], s: [0, 1], q: [-1, 0], z: [0, -1]
      };
      const dir = keys[event.key] ?? keys[event.key.toLowerCase()];
      if (playing && dir) { event.preventDefault(); move(dir[0], dir[1]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, move]);

  const start = () => {
    const startIndex = tiles.findIndex(tile => tile === "player");
    setPlayer(startIndex >= 0 ? startIndex : 72);
    setScore(0);
    setPlaying(true);
    setNotice(t.keyboard);
  };

  const save = () => {
    if (!title.trim()) { setNotice(t.titleRequired); return; }
    const project: Project = { id: String(Date.now()), title: title.trim().slice(0, 40), mode, tiles, updatedAt: new Date().toISOString() };
    persist([project, ...projects.filter(item => item.title !== project.title)].slice(0, 30));
    setNotice(t.saved);
  };

  const exportProject = (project?: Project) => {
    const data: Project = project ?? { id: String(Date.now()), title: title.trim().slice(0, 40), mode, tiles, updatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify({ format: "nexus-games-evolution", version: 1, project: data }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".nexusgame.json";
    a.click();
    URL.revokeObjectURL(url);
    setNotice(t.exported);
  };

  const importProject = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 300000) throw new Error();
      const raw: unknown = JSON.parse(await file.text());
      if (!raw || typeof raw !== "object" || !("format" in raw) || raw.format !== "nexus-games-evolution" ||
          !("version" in raw) || raw.version !== 1 || !("project" in raw) || !isProject(raw.project)) throw new Error();
      const p = raw.project;
      setTitle(p.title); setMode(p.mode); setTiles(p.tiles); setPlaying(false);
      persist([{ ...p, id: String(Date.now()) }, ...projects.filter(item => item.title !== p.title)].slice(0, 30));
      setNotice(t.imported);
    } catch { setNotice(t.invalid); }
  };

  const load = (p: Project) => { setTitle(p.title); setMode(p.mode); setTiles(p.tiles); setPlaying(false); };
  const tileIcon = (tile: Tile) => tile === "player" ? "🧑" : tile === "coin" ? "🪙" : tile === "obstacle" ? "👾" : tile === "goal" ? "🏁" : "";
  const projectCount = useMemo(() => ready ? projects.length : 0, [ready, projects.length]);

  return <main className="evo-page">
    <header className="evo-top"><Link href="/" className="evo-brand">NEXUS<span>GAMES</span></Link><div><button className="evo-lang" onClick={() => setLang(lang === "fr" ? "en" : "fr")}>{t.language}</button><Link href="/" className="evo-back">{t.back}</Link></div></header>
    <section className="evo-hero"><span>{t.kicker}</span><h1>{t.titleA}<br/><em>{t.titleB}</em></h1><p>{t.intro}</p></section>
    <div className="evo-layout">
      <section className="evo-panel evo-editor">
        <div className="evo-panel-head"><h2>01 / {t.project}</h2><span>12 × 8 GRID</span></div>
        <div className="evo-fields"><label>{t.name}<input value={title} maxLength={40} onChange={e=>setTitle(e.target.value)}/></label><label>{t.mode}<select value={mode} onChange={e=>{setMode(e.target.value as Mode);setPlaying(false);}}><option value="platform">{t.platform}</option><option value="dodge">{t.dodge}</option></select></label></div>
        <div className="evo-panel-head"><h2>02 / {t.board}</h2><span>{t.palette}</span></div>
        <div className="evo-palette">{palette.map(item=><button key={item.key} className={tool===item.id?"selected":""} onClick={()=>{setTool(item.id);setPlaying(false);}}>{item.icon} {t[item.key]}</button>)}</div>
        <div className="evo-grid" aria-label={t.board}>{tiles.map((tile,index)=><button key={index} disabled={playing} onClick={()=>setTiles(current=>current.map((value,i)=>i===index?tool:value))} className={"evo-cell "+(tile?"cell-"+tile:"")} aria-label={"Tile "+(index+1)}>{playing && index === player ? "🧑" : tileIcon(tile)}</button>)}</div>
        <p className="evo-help">{mode === "platform" ? t.helpPlatform : t.helpDodge}</p>
        {playing && <div className="evo-score">SCORE : {score} {mode === "dodge" ? "/ 5" : ""}</div>}
        <div className="evo-actions"><button className="evo-primary" onClick={playing?()=>setPlaying(false):start}>{playing?t.edit:t.test}</button><button onClick={()=>{setTiles(EMPTY);setPlaying(false);setScore(0);}}>{t.reset}</button></div>
        {playing && <div className="evo-pad"><button onClick={()=>move(0,-1)}>↑</button><div><button onClick={()=>move(-1,0)}>←</button><button onClick={()=>move(0,1)}>↓</button><button onClick={()=>move(1,0)}>→</button></div></div>}
        <div className="evo-status" role="status">{notice}</div>
      </section>
      <aside className="evo-side">
        <section className="evo-panel"><div className="evo-panel-head"><h2>03 / {t.project}</h2><span>JSON</span></div><button className="evo-primary full" onClick={save}>{t.save}</button><button className="full" onClick={()=>exportProject()}>{t.export}</button><label className="evo-import full">{t.import}<input type="file" accept=".json,.nexusgame.json,application/json" onChange={importProject}/></label><p className="evo-private">{t.private}</p></section>
        <section className="evo-panel"><div className="evo-panel-head"><h2>{t.library}</h2><span>{projectCount}</span></div>{projects.length===0?<p className="evo-empty">{t.empty}</p>:<div className="evo-projects">{projects.map(p=><article key={p.id}><b>{p.title}</b><small>{p.mode==="platform"?t.platform:t.dodge} · {p.updatedAt?new Date(p.updatedAt).toLocaleDateString(lang==="fr"?"fr-FR":"en-GB"):""}</small><div><button onClick={()=>load(p)}>{t.load}</button><button onClick={()=>exportProject(p)}>{t.export}</button><button onClick={()=>persist(projects.filter(item=>item.id!==p.id))}>{t.remove}</button></div></article>)}</div>}</section>
      </aside>
    </div>
    <footer className="evo-footer">NEXUS GAMES 2.2.0 · CREATOR EVOLUTION · NEXUS CITY & NEON DODGE REMAIN UNCHANGED</footer>
  </main>;
}
