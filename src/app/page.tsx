"use client";

import { useMemo, useState } from "react";

type Game = {
  id: number;
  title: string;
  category: string;
  label: string;
  color: string;
  icon: string;
  description: string;
};

const games: Game[] = [
  { id: 1, title: "Neon Drift", category: "Course", label: "ARCADE", color: "violet", icon: "✦", description: "Fonce dans une ville néon et bats le chrono." },
  { id: 2, title: "Pixel Raiders", category: "Action", label: "ACTION", color: "orange", icon: "⚔", description: "Une aventure rétro pleine de défis." },
  { id: 3, title: "Orbital", category: "Réflexion", label: "PUZZLE", color: "blue", icon: "◉", description: "Trouve ton chemin parmi les astres." },
  { id: 4, title: "Skybound", category: "Aventure", label: "AVENTURE", color: "teal", icon: "⬡", description: "Explore des mondes suspendus dans le ciel." },
  { id: 5, title: "Turbo League", category: "Course", label: "SPORT", color: "red", icon: "↗", description: "Des courses rapides et spectaculaires." },
  { id: 6, title: "Little Kingdom", category: "Stratégie", label: "STRATÉGIE", color: "green", icon: "♜", description: "Construis et développe ton royaume." }
];

const categories = ["Tout", "Action", "Aventure", "Course", "Réflexion", "Stratégie"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [notice, setNotice] = useState("");

  const filteredGames = useMemo(() => games.filter((game) => {
    const categoryMatch = activeCategory === "Tout" || game.category === activeCategory;
    const queryMatch = game.title.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  }), [activeCategory, query]);

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Nexus Games accueil">
          <span className="brand-mark">N</span>
          <span>NEXUS<span className="brand-light">GAMES</span></span>
        </a>
        <div className="side-label">MENU</div>
        <nav className="side-nav" aria-label="Navigation principale">
          <a className="side-link active" href="#home"><span>⌂</span> Accueil</a>
          <a className="side-link" href="#discover"><span>◈</span> Découvrir</a>
          <a className="side-link" href="#library"><span>▤</span> Ma bibliothèque <small>{favorites.length}</small></a>
        </nav>
        <div className="side-label categories-label">EXPLORER</div>
        <nav className="side-nav">
          {categories.slice(1).map((category) => (
            <button key={category} className="side-link side-button" onClick={() => { setActiveCategory(category); document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span className="category-dot" /> {category}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="status-dot" />
          <span>La prochaine partie commence ici.</span>
          <small>NEXUS GAMES · 0.0.0.2</small>
        </div>
      </aside>

      <section className="main-area" id="home">
        <header className="topbar">
          <div className="breadcrumb"><span>ESPACE JOUEUR</span><b>/</b> ACCUEIL</div>
          <div className="top-actions">
            <span className="online-pill"><i /> PLATEFORME EN CONSTRUCTION</span>
            <button className="avatar" aria-label="Profil joueur" onClick={() => setNotice("Les profils joueurs arriveront dans une prochaine version.")}>J</button>
          </div>
        </header>

        <div className="content">
          <section className="hero">
            <div className="hero-grid" />
            <div className="hero-content">
              <div className="eyebrow"><span /> TON PROCHAIN UNIVERS T'ATTEND</div>
              <h1>PLAY BEYOND<br /><em>LIMITS.</em></h1>
              <p>Découvre. Joue. Recommence.<br />Toute ta passion du jeu, au même endroit.</p>
              <div className="hero-actions">
                <a className="primary-button" href="#discover"><span>▶</span> EXPLORER LES JEUX</a>
                <a className="secondary-button" href="#about">DÉCOUVRIR NEXUS <span>↗</span></a>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="hero-emblem">N</div>
              <div className="hero-caption"><span>NG / 001</span><b>THE NEXT LEVEL</b></div>
            </div>
            <div className="hero-index"><span>01</span> / 03</div>
          </section>

          <section className="stats-row" aria-label="Informations sur la plateforme">
            <div><strong>01</strong><span>UNE NOUVELLE<br />EXPÉRIENCE GAMING</span></div>
            <div><strong>∞</strong><span>DE NOUVEAUX MONDES<br />À EXPLORER</span></div>
            <div><strong>0€</strong><span>ACCÈS AU<br />PROTOTYPE</span></div>
            <div className="stats-note">CONÇU POUR LES JOUEURS.<br /><b>PROPULSÉ PAR NEXUS.</b></div>
          </section>

          <section className="discover-section" id="discover">
            <div className="section-heading">
              <div><div className="eyebrow"><span /> LE TERRAIN DE JEU</div><h2>À LA <em>DÉCOUVERTE</em></h2></div>
              <label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un jeu..." aria-label="Rechercher un jeu" /><kbd>⌘ K</kbd></label>
            </div>
            <div className="filters" role="group" aria-label="Filtrer par catégorie">
              {categories.map((category) => <button key={category} className={activeCategory === category ? "filter active-filter" : "filter"} onClick={() => setActiveCategory(category)}>{category}</button>)}
            </div>
            <div className="game-grid">
              {filteredGames.map((game, index) => (
                <article className="game-card" key={game.id}>
                  <div className={"game-art art-" + game.color}>
                    <div className="art-noise" />
                    <span className="game-label">{game.label}</span>
                    <span className="game-symbol">{game.icon}</span>
                    <span className="art-number">0{index + 1}</span>
                    <button className={"favorite-button " + (favorites.includes(game.id) ? "is-favorite" : "")} onClick={() => toggleFavorite(game.id)} aria-label={favorites.includes(game.id) ? "Retirer des favoris" : "Ajouter aux favoris"}>{favorites.includes(game.id) ? "♥" : "♡"}</button>
                  </div>
                  <div className="game-info">
                    <div><h3>{game.title}</h3><span>{game.category}</span></div>
                    <button className="card-arrow" onClick={() => setNotice(game.title + " : cette démo est une fiche de présentation. Le jeu sera intégré après validation de ses droits et de son fonctionnement.")} aria-label={"En savoir plus sur " + game.title}>↗</button>
                  </div>
                  <p className="game-description">{game.description}</p>
                </article>
              ))}
              {filteredGames.length === 0 && <div className="empty-state">Aucun jeu ne correspond à ta recherche.</div>}
            </div>
          </section>

          <section className="library-banner" id="library">
            <div><div className="eyebrow"><span /> TON ESPACE PERSONNEL</div><h2>TA BIBLIOTHÈQUE.<br /><em>TES RÈGLES.</em></h2><p>Ajoute tes jeux favoris et retrouve-les ici.</p></div>
            <div className="library-count"><strong>{favorites.length.toString().padStart(2, "0")}</strong><span>JEUX FAVORIS</span></div>
          </section>

          <footer id="about"><a className="footer-brand" href="#home">NEXUS<span>GAMES</span></a><span>UN PROJET EN CONSTRUCTION · VERSION 0.0.0.2</span><span>© 2026 NEXUS GAMES</span></footer>
        </div>
      </section>

      {notice && <div className="modal-backdrop" role="presentation" onClick={() => setNotice("")}><div className="notice-modal" role="dialog" aria-modal="true" aria-label="Information" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setNotice("")} aria-label="Fermer">×</button><div className="eyebrow"><span /> NEXUS GAMES</div><h2>ON PRÉPARE<br /><em>LA SUITE.</em></h2><p>{notice}</p><button className="primary-button" onClick={() => setNotice("")}>COMPRIS</button></div></div>}
    </main>
  );
}
