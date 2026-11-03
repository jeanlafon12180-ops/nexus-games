"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tile = "" | "player" | "platform" | "coin" | "tree" | "enemy" | "goal";
type Comment = { id: string; author: string; text: string; createdAt: string };
type Creation = { id: string; title: string; description: string; genre: string; tiles: Tile[]; publishedAt: string; likes?: number; comments?: Comment[] };
const STORAGE = "nexus-community-games-v1";
const LIKED_STORAGE = "nexus-community-liked-v1";
const allowed: Tile[] = ["", "player", "platform", "coin", "tree", "enemy", "goal"];
const isCommunityCreation = (value: unknown): value is Creation => !!value && typeof value === "object" && "id" in value && typeof value.id === "string" && "title" in value && typeof value.title === "string" && value.title.length <= 40 && "description" in value && typeof value.description === "string" && value.description.length <= 180 && "genre" in value && typeof value.genre === "string" && "tiles" in value && Array.isArray(value.tiles) && value.tiles.length === 70 && value.tiles.every(tile => allowed.includes(tile as Tile));
const icons: Record<string,string> = { player:"🧑", coin:"🪙", tree:"🌳", enemy:"👾" };

export default function CommunityPage() {
  const [games,setGames] = useState<Creation[]>([]);
  const [ready,setReady] = useState(false);
  const [liked,setLiked]=useState<string[]>([]);
  const [drafts,setDrafts]=useState<Record<string,string>>({});
  const [notice,setNotice] = useState("Les créations publiées depuis Creator Studio apparaissent ici sur cet appareil.");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setGames(parsed.filter(isCommunityCreation).slice(0, 50));
      const savedLikes=localStorage.getItem(LIKED_STORAGE);
      if(savedLikes){const value:unknown=JSON.parse(savedLikes);if(Array.isArray(value)&&value.every(x=>typeof x==="string"))setLiked(value);}
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
      if(!parsed || typeof parsed!=="object" || !("format" in parsed) || parsed.format!=="nexus-games-creation" || !("version" in parsed) || parsed.version!==1 || !("game" in parsed)) throw new Error("Ce fichier n'est pas une création Nexus Games.");
      const game=(parsed as {game?:Partial<Creation>}).game;
      if(!game || typeof game.title!=="string" || typeof game.description!=="string" || typeof game.genre!=="string" || !Array.isArray(game.tiles) || game.tiles.length!==70 || !game.tiles.every(t=>allowed.includes(t as Tile))) throw new Error("Le niveau contenu dans ce fichier n'est pas valide.");
      const item:Creation={id:String(Date.now()),title:game.title.slice(0,40),description:game.description.slice(0,180),genre:game.genre.slice(0,30),tiles:game.tiles as Tile[],publishedAt:new Date().toISOString()};
      persist([item,...games.filter(g=>g.title!==item.title)].slice(0,50));
      setNotice("Création importée dans la galerie locale. Elle reste visible uniquement sur cet appareil.");
    } catch(error) { setNotice(error instanceof Error?error.message:"Import impossible."); }
  };
  const likeGame=(game:Creation)=>{
    const nextLiked=liked.includes(game.id)?liked.filter(id=>id!==game.id):[...liked,game.id];
    setLiked(nextLiked);
    try{localStorage.setItem(LIKED_STORAGE,JSON.stringify(nextLiked));}catch{}
    persist(games.map(item=>item.id===game.id?{...item,likes:Math.max(0,(item.likes||0)+(nextLiked.includes(game.id)?1:-1))}:item));
  };
  const addComment=(game:Creation)=>{
    const text=(drafts[game.id]||"").trim().slice(0,180);
    if(!text){setNotice("Écris un commentaire avant de l'ajouter.");return;}
    const author=localStorage.getItem("nexus-games-player-name")||"Joueur Nexus";
    const comment:Comment={id:String(Date.now()),author:author.slice(0,24),text,createdAt:new Date().toISOString()};
    persist(games.map(item=>item.id===game.id?{...item,comments:[...(item.comments||[]),comment].slice(-20)}:item));
    setDrafts(current=>({...current,[game.id]:""}));
    setNotice("Commentaire ajouté sur cet appareil.");
  };
  const exportGame=(game:Creation)=>{
    const portable={id:game.id,title:game.title,description:game.description,genre:game.genre,tiles:game.tiles,publishedAt:game.publishedAt};
    const blob=new Blob([JSON.stringify({format:"nexus-games-creation",version:1,game:portable},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url;
    a.download=game.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+".nexusgame.json"; a.click(); URL.revokeObjectURL(url);
  };
  return <main className="community-page">
    <div className="community-top"><Link className="community-brand" href="/">NEXUS<span>GAMES</span></Link><Link className="community-back" href="/">← RETOUR À L'ACCUEIL</Link></div>
    <section className="community-hero"><div className="creator-kicker">NEXUS GAMES · ESPACE CRÉATEURS · NEXUS GAMES 2.0.0</div><h1>COMMUNITY <em>GALLERY.</em></h1><p>Découvre les créations préparées avec Nexus Creator Studio. Publie tes propres niveaux ou importe un fichier partagé par un autre joueur.</p><div className="community-actions"><label className="community-import">＋ IMPORTER UN JEU<input type="file" accept=".json,.nexusgame.json,application/json" onChange={importGame}/></label><Link className="community-back" href="/creator">OUVRIR CREATOR STUDIO ↗</Link></div><div className="community-notice" role="status">{notice}</div></section>
    <div className="community-grid">{games.map(game=><article className="community-card" key={game.id}><small>{game.genre.toUpperCase()} · {new Date(game.publishedAt).toLocaleDateString("fr-FR")}</small><h2>{game.title}</h2><p>{game.description}</p><div className="community-preview" aria-label={"Aperçu de "+game.title}>{game.tiles.map((tile,i)=><div key={i} className={"community-cell "+(tile?"tile-"+tile:"")}>{icons[tile]||(tile==="goal"?"🏁":"")}</div>)}</div><div className="community-card-actions"><button onClick={()=>likeGame(game)}>{liked.includes(game.id)?"♥":"♡"} {game.likes||0} J'AIME</button><button onClick={()=>exportGame(game)}>↓ EXPORTER</button><button onClick={()=>persist(games.filter(g=>g.id!==game.id))}>SUPPRIMER</button></div><div className="community-comments"><b>COMMENTAIRES LOCAUX ({(game.comments||[]).length})</b>{(game.comments||[]).slice(-3).map(comment=><div className="community-comment" key={comment.id}><strong>{comment.author}</strong><span>{comment.text}</span></div>)}<div className="community-comment-form"><input value={drafts[game.id]||""} maxLength={180} onChange={e=>setDrafts(current=>({...current,[game.id]:e.target.value}))} placeholder="Ajouter un commentaire…" aria-label={"Commenter "+game.title}/><button onClick={()=>addComment(game)}>ENVOYER</button></div></div></article>)}</div>
    {ready && games.length===0 && <div className="community-empty">La galerie est encore vide. Crée un niveau dans Creator Studio et choisis « Publier ma création », ou importe un fichier Nexus Games partagé par un autre joueur.</div>}
    <p className="creator-note">GALERIE COMMUNAUTAIRE LOCALE · Les créations sont enregistrées dans le navigateur de cet appareil. Les réactions et commentaires sont enregistrés uniquement sur cet appareil. Le partage public et la synchronisation entre joueurs nécessitent un serveur sécurisé.</p>
  </main>;
}
