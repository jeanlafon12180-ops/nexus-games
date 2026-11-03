"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tile = "" | "player" | "platform" | "coin" | "tree" | "enemy";
type Creation = { id: string; title: string; description: string; genre: string; tiles: Tile[]; publishedAt: string };
const STORAGE = "nexus-community-games-v1";
const allowed: Tile[] = ["", "player", "platform", "coin", "tree", "enemy"];
const icons: Record<string,string> = { player:"🧑", coin:"🪙", tree:"🌳", enemy:"👾" };

export default function CommunityPage() {
  const [games,setGames] = useState<Creation[]>([]);
  const [ready,setReady] = useState(false);
  const [notice,setNotice] = useState("Les créations publiées depuis Creator Studio apparaissent ici sur cet appareil.");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setGames(parsed.filter((g): g is Creation => !!g && typeof g.title === "string" && Array.isArray(g.tiles) && g.tiles.length === 70));
    } catch { setNotice("Le stockage local est indisponible dans ce navigateur."); }
    setReady(true);
  }, []);
  const persist = (next: Creation[]) => {
    setGames(next);
    try { localStorage.setItem(STORAGE,JSON.stringify(next)); }
    catch { setNotice("Impossible d'enregistrer : le stockage local est peut-être plein."); }
  };
  const importGame = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file=event.target.files?.[0]; event.target.value=""; if(!file)return;
    try {
      if(file.size>250000) throw new Error("Fichier trop volumineux (250 Ko maximum).");
      const parsed: unknown=JSON.parse(await file.text());
      if(!parsed || typeof parsed!=="object" || !("format" in parsed) || parsed.format!=="nexus-games-creation" || !("game" in parsed)) throw new Error("Ce fichier n'est pas une création Nexus Games.");
      const game=(parsed as {game?:Partial<Creation>}).game;
      if(!game || typeof game.title!=="string" || typeof game.description!=="string" || typeof game.genre!=="string" || !Array.isArray(game.tiles) || game.tiles.length!==70 || !game.tiles.every(t=>allowed.includes(t as Tile))) throw new Error("Le niveau contenu dans ce fichier n'est pas valide.");
      const item:Creation={id:String(Date.now()),title:game.title.slice(0,40),description:game.description.slice(0,180),genre:game.genre.slice(0,30),tiles:game.tiles as Tile[],publishedAt:new Date().toISOString()};
      persist([item,...games.filter(g=>g.title!==item.title)].slice(0,50));
      setNotice("Création importée dans la galerie locale. Elle reste visible uniquement sur cet appareil.");
    } catch(error) { setNotice(error instanceof Error?error.message:"Import impossible."); }
  };
  const exportGame=(game:Creation)=>{
    const blob=new Blob([JSON.stringify({format:"nexus-games-creation",version:1,game},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url;
    a.download=game.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+".nexusgame.json"; a.click(); URL.revokeObjectURL(url);
  };
  return <main className="community-page">
    <div className="community-top"><Link className="community-brand" href="/">NEXUS<span>GAMES</span></Link><Link className="community-back" href="/">← RETOUR À L'ACCUEIL</Link></div>
    <section className="community-hero"><div className="creator-kicker">NEXUS GAMES · ESPACE CRÉATEURS · BETA 0.0.1.7</div><h1>COMMUNITY <em>GALLERY.</em></h1><p>Découvre les créations préparées avec Nexus Creator Studio. Publie tes propres niveaux ou importe un fichier partagé par un autre joueur.</p><div className="community-actions"><label className="community-import">＋ IMPORTER UN JEU<input type="file" accept=".json,.nexusgame.json,application/json" onChange={importGame}/></label><Link className="community-back" href="/creator">OUVRIR CREATOR STUDIO ↗</Link></div><div className="community-notice" role="status">{notice}</div></section>
    <div className="community-grid">{games.map(game=><article className="community-card" key={game.id}><small>{game.genre.toUpperCase()} · {new Date(game.publishedAt).toLocaleDateString("fr-FR")}</small><h2>{game.title}</h2><p>{game.description}</p><div className="community-preview" aria-label={"Aperçu de "+game.title}>{game.tiles.map((tile,i)=><div key={i} className={"community-cell "+(tile?"tile-"+tile:"")}>{icons[tile]||""}</div>)}</div><div className="community-card-actions"><button onClick={()=>exportGame(game)}>↓ EXPORTER</button><button onClick={()=>persist(games.filter(g=>g.id!==game.id))}>SUPPRIMER</button></div></article>)}</div>
    {ready && games.length===0 && <div className="community-empty">La galerie est encore vide. Crée un niveau dans Creator Studio et choisis « Publier ma création », ou importe un fichier Nexus Games partagé par un autre joueur.</div>}
    <p className="creator-note">GALERIE COMMUNAUTAIRE LOCALE · Les créations sont enregistrées dans le navigateur de cet appareil. La publication publique sur Internet et les comptes joueurs arriveront après la mise en place d'un serveur sécurisé.</p>
  </main>;
}
