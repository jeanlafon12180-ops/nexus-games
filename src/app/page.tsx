"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Game = {
  id: number;
  title: string;
  category: string;
  label: string;
  color: string;
  icon: string;
  description: string;
  players: string;
  status: "JOUABLE" | "BIENTÔT";
  slug?: string;
  details: string;
};

const games: Game[] = [
  { id: 10, title: "Nexus City", category: "Simulation", label: "ROLEPLAY", color: "green", icon: "✈", description: "Une ville à explorer et un aéroport à développer.", players: "1 joueur", status: "JOUABLE", slug: "/games/nexus-city", details: "Un univers de simulation original avec métiers, missions et gestion aéroportuaire." },
  { id: 1, title: "Neon Dodge", category: "Action", label: "ARCADE", color: "violet", icon: "✦", description: "Esquive les obstacles et bats ton meilleur score.", players: "1 joueur", status: "JOUABLE", slug: "/games/neon-dodge", details: "Un mini-jeu d'arcade original créé pour Nexus Games. Déplace ton vaisseau, évite les blocs et essaie de survivre le plus longtemps possible." },
  { id: 2, title: "Pixel Raiders", category: "Action", label: "ACTION", color: "orange", icon: "⚔", description: "Une aventure rétro pleine de défis.", players: "1 joueur", status: "BIENTÔT", details: "Une aventure d'action au style rétro. La fiche est prête, le jeu est encore en développement." },
  { id: 3, title: "Orbital", category: "Réflexion", label: "PUZZLE", color: "blue", icon: "◉", description: "Trouve ton chemin parmi les astres.", players: "1 joueur", status: "BIENTÔT", details: "Un jeu de réflexion spatial en préparation." },
  { id: 4, title: "Skybound", category: "Aventure", label: "AVENTURE", color: "teal", icon: "⬡", description: "Explore des mondes suspendus dans le ciel.", players: "1 joueur", status: "BIENTÔT", details: "Une aventure d'exploration en préparation." },
  { id: 5, title: "Turbo League", category: "Course", label: "SPORT", color: "red", icon: "↗", description: "Des courses rapides et spectaculaires.", players: "1–4 joueurs", status: "BIENTÔT", details: "Un jeu de course arcade en préparation." },
  { id: 6, title: "Little Kingdom", category: "Stratégie", label: "STRATÉGIE", color: "green", icon: "♜", description: "Construis et développe ton royaume.", players: "1 joueur", status: "BIENTÔT", details: "Un jeu de stratégie et de construction en préparation." },
  { id: 7, title: "Deep Space", category: "Aventure", label: "EXPLORATION", color: "blue", icon: "✧", description: "Pars à la découverte d'une galaxie inconnue.", players: "1 joueur", status: "BIENTÔT", details: "Un jeu d'exploration spatiale en préparation." },
  { id: 8, title: "Drift City", category: "Course", label: "ARCADE", color: "violet", icon: "⌁", description: "Maîtrise les virages dans une ville futuriste.", players: "1 joueur", status: "BIENTÔT", details: "Un jeu de course et de drift en préparation." },
  { id: 9, title: "Green Valley", category: "Stratégie", label: "SIMULATION", color: "green", icon: "♧", description: "Développe une vallée et ses villages.", players: "1 joueur", status: "BIENTÔT", details: "Un jeu de gestion paisible en préparation." }
];

const categories = ["Tout", "Action", "Aventure", "Course", "Réflexion", "Stratégie", "Simulation"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [playerName, setPlayerName] = useState("Joueur Nexus");
  const [profileOpen, setProfileOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const savedFavorites = window.localStorage.getItem("nexus-games-favorites");
      const savedName = window.localStorage.getItem("nexus-games-player-name");
      if (savedFavorites) {
        const parsed: unknown = JSON.parse(savedFavorites);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "number")) setFavorites(parsed);
      }
      if (savedName) setPlayerName(savedName);
    } catch {
      // Le navigateur peut désactiver le stockage local : la plateforme reste utilisable.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem("nexus-games-favorites", JSON.stringify(favorites));
      window.localStorage.setItem("nexus-games-player-name", playerName);
    } catch {
      // Les favoris restent disponibles pendant la session même si le stockage est bloqué.
    }
  }, [favorites, playerName, storageReady]);

  const filteredGames = useMemo(() => games.filter((game) => {
    const categoryMatch = activeCategory === "Tout" || (activeCategory === "Favoris" ? favorites.includes(game.id) : game.category === activeCategory);
    const queryMatch = (game.title + " " + game.description).toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  }), [activeCategory, query, favorites]);

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="Nexus Games accueil"><span className="brand-mark">N</span><span>NEXUS<span className="brand-light">GAMES</span></span></a>
        <div className="side-label">MENU</div>
        <nav className="side-nav" aria-label="Navigation principale">
          <a className="side-link active" href="#home"><span>⌂</span> Accueil</a>
          <a className="side-link" href="#discover"><span>◈</span> Découvrir</a>
          <a className="side-link" href="#library"><span>▤</span> Ma bibliothèque <small>{favorites.length}</small></a>
        </nav>
        <div className="side-label categories-label">EXPLORER</div>
        <nav className="side-nav">{categories.slice(1).map((category) => <button key={category} className="side-link side-button" onClick={() => { setActiveCategory(category); document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" }); }}><span className="category-dot" /> {category}</button>)}</nav>
        <div className="sidebar-bottom"><div className="status-dot" /><span>La prochaine partie commence ici.</span><small>NEXUS GAMES · BETA 0.0.0.8</small></div>
      </aside>

      <section className="main-area" id="home">
        <header className="topbar"><div className="breadcrumb"><span>ESPACE JOUEUR</span><b>/</b> ACCUEIL</div><div className="top-actions"><span className="online-pill"><i /> 1 JEU DISPONIBLE</span><span className="version-chip">BETA · V 0.0.0.8</span><button className="avatar" onClick={() => setProfileOpen(true)} aria-label="Ouvrir mon profil">{playerName.trim().charAt(0).toUpperCase() || "N"}</button></div></header>
        <div className="content">
          <section className="hero">
            <div className="hero-grid" />
            <div className="hero-content">
              <div className="eyebrow"><span /> TON PROCHAIN UNIVERS T'ATTEND</div>
              <h1>PLAY BEYOND<br /><em>LIMITS.</em></h1>
              <p>Découvre. Joue. Recommence.<br />Toute ta passion du jeu, au même endroit.</p>
              <div className="hero-actions"><Link className="primary-button" href="/games/nexus-city"><span>▶</span> DÉCOUVRIR NEXUS CITY</Link><a className="secondary-button" href="#discover">EXPLORER LE CATALOGUE <span>↗</span></a></div>
            </div>
            <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-emblem">N</div><div className="hero-caption"><span>NG / 003</span><b>THE NEXT LEVEL</b></div></div>
            <div className="hero-index"><span>01</span> / 03</div>
          </section>

          <section className="stats-row" aria-label="Informations sur la plateforme">
            <div><strong>10</strong><span>JEUX AU<br />CATALOGUE</span></div><div><strong>02</strong><span>JEUX<br />JOUABLES</span></div><div><strong>0€</strong><span>ACCÈS AU<br />PROTOTYPE</span></div><div className="stats-note">UNE PLATEFORME INDÉPENDANTE.<br /><b>PROPULSÉE PAR NEXUS.</b></div>
          </section>

          <section className="discover-section" id="discover">
            <div className="section-heading"><div><div className="eyebrow"><span /> LE TERRAIN DE JEU</div><h2>À LA <em>DÉCOUVERTE</em></h2><p className="section-subtitle">Explore le catalogue et ouvre la fiche de chaque jeu.</p></div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un jeu..." aria-label="Rechercher un jeu" /><kbd>⌕</kbd></label></div>
            <div className="filters" role="group" aria-label="Filtrer par catégorie">{categories.map((category) => <button key={category} className={activeCategory === category ? "filter active-filter" : "filter"} onClick={() => setActiveCategory(category)}>{category}</button>)}<button className={activeCategory === "Favoris" ? "filter active-filter" : "filter"} onClick={() => setActiveCategory("Favoris")}>♥ Favoris ({favorites.length})</button></div>
            <div className="game-grid">
              {filteredGames.map((game, index) => (
                <article className="game-card" key={game.id}>
                  <button className={"game-art art-" + game.color} onClick={() => setSelectedGame(game)} aria-label={"Ouvrir la fiche de " + game.title}>
                    <span className="game-label">{game.label}</span><span className="game-symbol">{game.icon}</span><span className="art-number">0{index + 1}</span><span className="art-open">VOIR LA FICHE ↗</span>
                    <span className={"status-tag " + (game.status === "JOUABLE" ? "status-playable" : "")}>{game.status}</span>
                  </button>
                  <div className="game-info"><div><h3>{game.title}</h3><span>{game.category} · {game.players}</span></div><button className={"favorite-button favorite-inline " + (favorites.includes(game.id) ? "is-favorite" : "")} onClick={() => toggleFavorite(game.id)} aria-label={favorites.includes(game.id) ? "Retirer des favoris" : "Ajouter aux favoris"}>{favorites.includes(game.id) ? "♥" : "♡"}</button></div>
                  <p className="game-description">{game.description}</p>
                </article>
              ))}
              {filteredGames.length === 0 && <div className="empty-state">Aucun jeu ne correspond à ta recherche.</div>}
            </div>
          </section>

          <section className="library-banner" id="library"><div><div className="eyebrow"><span /> TON ESPACE PERSONNEL</div><h2>TA BIBLIOTHÈQUE.<br /><em>TES RÈGLES.</em></h2><p>Ajoute tes jeux favoris et retrouve-les ici.</p><div className="favorite-list">{games.filter((game) => favorites.includes(game.id)).map((game) => <button key={game.id} onClick={() => setSelectedGame(game)}>{game.title} ↗</button>)}{favorites.length === 0 && <span>Ajoute des favoris avec le cœur sur les fiches.</span>}</div></div><div className="library-count"><strong>{favorites.length.toString().padStart(2, "0")}</strong><span>JEUX FAVORIS</span></div></section>
          <footer id="about"><a className="footer-brand" href="#home">NEXUS<span>GAMES</span></a><span>UN PROJET EN CONSTRUCTION · VERSION BETA 0.0.0.8</span><span>© 2026 NEXUS GAMES</span></footer>
        </div>
      </section>

      {profileOpen && <div className="modal-backdrop" role="presentation" onClick={() => setProfileOpen(false)}><div className="game-modal profile-modal" role="dialog" aria-modal="true" aria-label="Mon profil joueur" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setProfileOpen(false)} aria-label="Fermer">×</button><div className="eyebrow"><span /> ESPACE JOUEUR</div><h2>MON <em>PROFIL</em></h2><p>Choisis un pseudo pour personnaliser ton espace sur cet appareil.</p><p><a className="account-home" href="/account">Créer un compte en ligne — bientôt disponible ↗</a></p><label className="profile-label" htmlFor="player-name">PSEUDO JOUEUR</label><input id="player-name" className="profile-input" maxLength={24} value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Ton pseudo" /><div className="profile-note">Tes favoris et ton pseudo sont enregistrés dans le navigateur de cet appareil. Aucun compte en ligne n'est créé pour le moment.</div><button className="primary-button modal-play" onClick={() => setProfileOpen(false)}>ENREGISTRER</button></div></div>}
      {selectedGame && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedGame(null)}><div className="game-modal" role="dialog" aria-modal="true" aria-label={"Fiche de " + selectedGame.title} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedGame(null)} aria-label="Fermer">×</button><div className={"modal-game-art art-" + selectedGame.color}><span>{selectedGame.icon}</span><b>{selectedGame.label}</b></div><div className="eyebrow"><span /> FICHE DU JEU · {selectedGame.category.toUpperCase()}</div><h2>{selectedGame.title}</h2><p>{selectedGame.details}</p><div className="game-meta"><span>{selectedGame.players}</span><span className={selectedGame.status === "JOUABLE" ? "meta-ready" : ""}>{selectedGame.status}</span></div>{selectedGame.slug ? <Link className="primary-button modal-play" href={selectedGame.slug}>▶ LANCER LE JEU</Link> : <button className="secondary-button modal-play" onClick={() => setSelectedGame(null)}>RETOUR AU CATALOGUE</button>}</div></div>}
    </main>
  );
}
