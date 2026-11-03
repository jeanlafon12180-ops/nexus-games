"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./marketplace.css";

type Creation = { id: string; title: string; description: string; genre: string; tiles: unknown[]; publishedAt: string; likes?: number };
const DATA_KEY = "nexus-community-games-v1";
const FAV_KEY = "nexus-marketplace-favorites-v1";
const valid = (v: unknown): v is Creation => !!v && typeof v === "object" && "id" in v && typeof v.id === "string" && "title" in v && typeof v.title === "string" && v.title.length <= 40 && "description" in v && typeof v.description === "string" && v.description.length <= 180 && "genre" in v && typeof v.genre === "string" && "tiles" in v && Array.isArray(v.tiles) && v.tiles.length === 70;
const categories = ["Tout", "Action", "Aventure", "Réflexion", "Course", "Autre"];

export default function MarketplacePage() {
  const [items,setItems] = useState<Creation[]>([]);
  const [favorites,setFavorites] = useState<string[]>([]);
  const [category,setCategory] = useState("Tout");
  const [query,setQuery] = useState("");
  const [onlyFavorites,setOnlyFavorites] = useState(false);
  const [selected,setSelected] = useState<Creation|null>(null);
  const [ready,setReady] = useState(false);
  const [notice,setNotice] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DATA_KEY); const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setItems(parsed.filter(valid).slice(0,50));
      const favRaw = localStorage.getItem(FAV_KEY); const fav: unknown = favRaw ? JSON.parse(favRaw) : [];
      if (Array.isArray(fav) && fav.every(x => typeof x === "string")) setFavorites(fav);
    } catch { setNotice("Le stockage local est indisponible."); }
    setReady(true);
  }, []);
  const visible = useMemo(() => items.filter(item => (category === "Tout" || item.genre.toLowerCase() === category.toLowerCase()) && (!onlyFavorites || favorites.includes(item.id)) && (item.title+" "+item.description+" "+item.genre).toLowerCase().includes(query.toLowerCase())),[items,category,onlyFavorites,favorites,query]);
  function toggleFavorite(id:string) {
    const next = favorites.includes(id) ? favorites.filter(x=>x!==id) : [...favorites,id];
    setFavorites(next);
    try { localStorage.setItem(FAV_KEY,JSON.stringify(next)); setNotice("Favoris enregistrés sur cet appareil."); }
    catch { setNotice("Impossible d'enregistrer les favoris."); }
  }
  return <main className="market-page">
    <header><Link href="/" className="evo-brand">NEXUS<span>GAMES</span></Link><Link href="/" className="evo-back">← ACCUEIL</Link></header>
    <section className="market-hero"><span>VERSION 2.7.0 · CREATOR MARKETPLACE</span><h1>DISCOVER<br/><em>CREATIONS.</em></h1><p>Explore les niveaux créés avec Nexus Games, retrouve tes favoris et ouvre leurs fiches détaillées.</p><div className="market-actions"><Link href="/creator" className="evo-primary">CRÉER UN NIVEAU</Link><Link href="/community-share" className="market-link">IMPORTER UNE FICHE ↗</Link></div></section>
    <section className="market-toolbar"><input aria-label="Rechercher une création" placeholder="Rechercher une création…" value={query} onChange={e=>setQuery(e.target.value)}/><button className={onlyFavorites?"chosen":""} onClick={()=>setOnlyFavorites(v=>!v)}>♡ Mes favoris ({favorites.length})</button></section>
    <nav className="market-filters" aria-label="Catégories">{categories.map(c=><button key={c} className={category===c?"chosen":""} onClick={()=>setCategory(c)}>{c}</button>)}</nav>
    {notice && <p className="market-notice" role="status">{notice}</p>}
    <section className="market-grid">{visible.map(item=><article className="market-card" key={item.id}><div className="market-art"><span>◇</span><small>{item.genre.toUpperCase()}</small></div><div className="market-card-body"><h2>{item.title}</h2><p>{item.description}</p><div className="market-meta"><span>{item.tiles.length} cases</span><span>{item.likes||0} appréciations locales</span></div><div className="market-card-actions"><button onClick={()=>setSelected(item)}>VOIR LA FICHE</button><button aria-label={favorites.includes(item.id)?"Retirer des favoris":"Ajouter aux favoris"} onClick={()=>toggleFavorite(item.id)}>{favorites.includes(item.id)?"♥":"♡"}</button></div></div></article>)}</section>
    {ready && visible.length===0 && <div className="market-empty"><h2>{items.length===0?"Le Marketplace est prêt à accueillir tes créations.":"Aucun résultat."}</h2><p>{items.length===0?"Publie un niveau depuis Creator Studio ou importe une création dans la galerie locale. Les créations de cet appareil apparaîtront ici.":"Essaie une autre recherche ou enlève le filtre favoris."}</p><Link href="/community" className="evo-primary">OUVRIR LA GALERIE LOCALE</Link></div>}
    {selected && <div className="market-modal-backdrop" role="presentation" onClick={()=>setSelected(null)}><section className="market-modal" role="dialog" aria-modal="true" aria-labelledby="market-detail-title" onClick={e=>e.stopPropagation()}><button className="market-close" onClick={()=>setSelected(null)} aria-label="Fermer">×</button><small>FICHE DE CRÉATION · STOCKAGE LOCAL</small><h2 id="market-detail-title">{selected.title}</h2><p>{selected.description}</p><p>Catégorie : {selected.genre}</p><p>Publié localement le {new Date(selected.publishedAt).toLocaleDateString("fr-FR")}</p><button onClick={()=>toggleFavorite(selected.id)}>{favorites.includes(selected.id)?"♥ Retirer des favoris":"♡ Ajouter aux favoris"}</button></section></div>}
    <p className="market-footnote">Catalogue local : aucune création n'est envoyée sur Internet. Les favoris sont enregistrés dans ce navigateur. Les achats, paiements et publications publiques ne sont pas activés.</p>
    <footer className="evo-footer">NEXUS GAMES 2.7.0 · CREATOR MARKETPLACE</footer>
  </main>;
}
