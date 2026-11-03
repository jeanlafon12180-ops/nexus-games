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
  const [sortOrder, setSortOrder] = useState("featured");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [playerName, setPlayerName] = useState("Joueur Nexus");
  const [profileOpen, setProfileOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [cityVisited, setCityVisited] = useState(false);
  const [createdGames, setCreatedGames] = useState(0);
  const [communityGames, setCommunityGames] = useState(0);

  useEffect(() => {
    try {
      const savedFavorites = window.localStorage.getItem("nexus-games-favorites");
      const savedName = window.localStorage.getItem("nexus-games-player-name");
      setCityVisited(window.localStorage.getItem("nexus-platform-city-visited") === "1");
      const creatorData = JSON.parse(window.localStorage.getItem("nexus-creator-creations-v1") || "[]");
      const communityData = JSON.parse(window.localStorage.getItem("nexus-community-games-v1") || "[]");
      setCreatedGames(Array.isArray(creatorData) ? creatorData.length : 0);
      setCommunityGames(Array.isArray(communityData) ? communityData.length : 0);
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

  const challenges = [
    { id: "profile", title: "Personnaliser ton pseudo", detail: "Choisis une identité de joueur.", points: 50, complete: playerName.trim().length > 0 && playerName !== "Joueur Nexus" },
    { id: "favorites", title: "Créer ta collection", detail: "Ajoute au moins 3 jeux en favoris.", points: 100, complete: favorites.length >= 3 },
    { id: "city", title: "Explorer Nexus City", detail: "Lance le jeu de simulation.", points: 75, complete: cityVisited },
    { id: "creator", title: "Créer ton premier jeu", detail: "Enregistre une création dans Creator Studio.", points: 150, complete: createdGames > 0 },
    { id: "gallery", title: "Découvrir la galerie", detail: "Publie ou importe une création dans la galerie.", points: 100, complete: communityGames > 0 }
  ];
  const nexusXp = challenges.filter((challenge) => challenge.complete).reduce((total, challenge) => total + challenge.points, 0);
  const playerLevels = [
    { name: "Recrue", minXp: 0, nextXp: 75 },
    { name: "Explorateur", minXp: 75, nextXp: 150 },
    { name: "Aventurier", minXp: 150, nextXp: 225 },
    { name: "Vétéran", minXp: 225, nextXp: 350 },
    { name: "Légende", minXp: 350, nextXp: 500 },
    { name: "Mythique", minXp: 475, nextXp: 475 }
  ];
  const currentLevel = [...playerLevels].reverse().find((level) => nexusXp >= level.minXp) ?? playerLevels[0];
  const nextLevel = playerLevels.find((level) => level.minXp > nexusXp);
  const levelProgress = nextLevel
    ? Math.min(100, Math.round(((nexusXp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100))
    : 100;
  const playerBadges = [
    { id: "profile", name: "Identité Nexus", icon: "✦", detail: "Personnaliser son pseudo", earned: playerName.trim().length > 0 && playerName !== "Joueur Nexus" },
    { id: "collector", name: "Collectionneur", icon: "♥", detail: "Ajouter 3 jeux favoris", earned: favorites.length >= 3 },
    { id: "explorer", name: "Explorateur", icon: "⌖", detail: "Visiter Nexus City", earned: cityVisited },
    { id: "xp", name: "Premier XP", icon: "★", detail: "Obtenir ses premiers points XP", earned: nexusXp > 0 },
    { id: "creator", name: "Créateur", icon: "✎", detail: "Enregistrer un jeu dans Creator Studio", earned: createdGames > 0 },
    { id: "gallery", name: "Galeriste", icon: "◇", detail: "Ajouter une création à la galerie", earned: communityGames > 0 },
    { id: "collector-plus", name: "Super collection", icon: "♥", detail: "Ajouter 5 jeux en favoris", earned: favorites.length >= 5 }
  ];
  const earnedBadges = playerBadges.filter((badge) => badge.earned).length;
  const filteredGames = useMemo(() => {
    const filtered = games.filter((game) => {
      const categoryMatch = activeCategory === "Tout" || (activeCategory === "Favoris" ? favorites.includes(game.id) : game.category === activeCategory);
      const queryMatch = (game.title + " " + game.description).toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
    return [...filtered].sort((a,b) => {
      if (sortOrder === "az") return a.title.localeCompare(b.title, "fr");
      if (sortOrder === "za") return b.title.localeCompare(a.title, "fr");
      if (sortOrder === "playable") return (a.status === "JOUABLE" ? 0 : 1) - (b.status === "JOUABLE" ? 0 : 1);
      if (sortOrder === "category") return a.category.localeCompare(b.category, "fr");
      return games.indexOf(a) - games.indexOf(b);
    });
  }, [activeCategory, query, favorites, sortOrder]);

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
          <a className="side-link" href="#challenges"><span>✧</span> Défis Nexus</a>
          <Link className="side-link creator-nav-link" href="/creator"><span>＋</span> Creator Studio <small>NEW</small></Link>
          <Link className="side-link" href="/community"><span>◇</span> Galerie communautaire</Link>
          <a className="side-link" href="#player-rank"><span>♛</span> Badges & niveaux</a>
        </nav>
        <div className="side-label categories-label">EXPLORER</div>
        <nav className="side-nav">{categories.slice(1).map((category) => <button key={category} className="side-link side-button" onClick={() => { setActiveCategory(category); document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" }); }}><span className="category-dot" /> {category}</button>)}</nav>
        <div className="sidebar-bottom"><div className="status-dot" /><span>La prochaine partie commence ici.</span><small>NEXUS GAMES · VERSION 2.0.0</small></div>
      </aside>

      <section className="main-area" id="home">
        <header className="topbar"><div className="breadcrumb"><span>ESPACE JOUEUR</span><b>/</b> ACCUEIL</div><div className="top-actions"><span className="online-pill"><i /> 2 JEUX JOUABLES</span><span className="version-chip">VERSION · 2.0.0</span><button className="avatar" onClick={() => setProfileOpen(true)} aria-label="Ouvrir mon profil">{playerName.trim().charAt(0).toUpperCase() || "N"}</button></div></header>
        <div className="content">
          <section className="hero">
            <div className="hero-grid" />
            <div className="hero-content">
              <div className="eyebrow"><span /> TON PROCHAIN UNIVERS T'ATTEND</div>
              <h1>PLAY BEYOND<br /><em>LIMITS.</em></h1><div className="hero-release">NEXUS GAMES <b>2.0</b> · NOUVELLE EXPÉRIENCE</div>
              <p>Découvre. Joue. Recommence.<br />Toute ta passion du jeu, au même endroit.</p>
              <div className="hero-actions"><Link className="primary-button" href="/games/nexus-city"><span>▶</span> JOUER À NEXUS CITY</Link><Link className="secondary-button" href="/games/neon-dodge">JOUER À NEON DODGE <span>↗</span></Link><a className="text-button" href="#discover">EXPLORER LE STORE ↓</a></div>
            </div>
            <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-emblem">N</div><div className="hero-caption"><span>NG / 020</span><b>PLAY YOUR WAY</b></div></div>
            <div className="hero-index"><span>01</span> / 03</div>
          </section>

          <section className="stats-row" aria-label="Informations sur la plateforme">
            <div><strong>10</strong><span>JEUX AU<br />CATALOGUE</span></div><div><strong>02</strong><span>JEUX<br />JOUABLES</span></div><div><strong>0€</strong><span>ACCÈS AU<br />PROTOTYPE</span></div><div className="stats-note">UNE PLATEFORME INDÉPENDANTE.<br /><b>PROPULSÉE PAR NEXUS.</b></div>
          </section>

          <section className="continue-section" aria-labelledby="continue-title">
            <div className="continue-heading">
              <div><div className="eyebrow"><span /> REPRENDRE TA PARTIE</div><h2 id="continue-title">TES JEUX <em>JOUABLES</em></h2><p>Les deux expériences Nexus Games sont toujours là. Choisis ton univers et lance ta partie.</p></div>
              <span className="playable-count">02 JEUX DISPONIBLES</span>
            </div>
            <div className="continue-grid">
              <Link className="continue-card continue-city" href="/games/nexus-city">
                <span className="continue-kicker">SIMULATION · JOUABLE</span><span className="continue-symbol">✈</span>
                <span className="continue-card-title">NEXUS CITY</span><span className="continue-card-copy">Explore la ville, choisis un métier, conduis des véhicules et accomplis tes missions.</span>
                <span className="continue-launch">LANCER LE JEU <b>↗</b></span>
              </Link>
              <Link className="continue-card continue-neon" href="/games/neon-dodge">
                <span className="continue-kicker">ARCADE · JOUABLE</span><span className="continue-symbol">✦</span>
                <span className="continue-card-title">NEON DODGE</span><span className="continue-card-copy">Évite les obstacles, améliore ton score et bats ton record personnel.</span>
                <span className="continue-launch">LANCER LE JEU <b>↗</b></span>
              </Link>
            </div>
          </section>
          <section className="hub-section" aria-label="Les espaces Nexus Games">
            <div className="eyebrow"><span /> TON HUB DE JEU</div>
            <div className="hub-grid">
              <Link href="/creator" className="hub-card"><span>＋</span><div><b>CREATOR STUDIO</b><small>Construis et teste tes propres niveaux.</small></div><strong>↗</strong></Link>
              <Link href="/community" className="hub-card"><span>◇</span><div><b>GALERIE COMMUNAUTAIRE</b><small>Retrouve tes créations locales et importe des jeux.</small></div><strong>↗</strong></Link>
              <a href="#player-rank" className="hub-card"><span>♛</span><div><b>NEXUS PLAYER CLUB</b><small>Défis, XP, badges et progression personnelle.</small></div><strong>↗</strong></a>
            </div>
          </section>
\n          <section className="discover-section" id="discover">
            <div className="section-heading"><div><div className="eyebrow"><span /> NEXUS STORE</div><h2>DÉCOUVRE LE <em>CATALOGUE</em></h2><p className="section-subtitle">Deux jeux jouables aujourd’hui, et de nouveaux univers en préparation.</p></div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un jeu..." aria-label="Rechercher un jeu" /><kbd>⌕</kbd></label><label className="library-sort">TRIER <select value={sortOrder} onChange={event=>setSortOrder(event.target.value)} aria-label="Trier les jeux"><option value="featured">À la une</option><option value="az">A → Z</option><option value="za">Z → A</option><option value="playable">Jeux jouables</option><option value="category">Catégorie</option></select></label></div>
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

          <section className="nexus-challenges" id="challenges">
            <div className="nexus-challenge-heading"><div><div className="eyebrow"><span /> NEXUS PLAYER CLUB</div><h2>TES <em>DÉFIS NEXUS</em></h2><p>Des objectifs sur la plateforme, en dehors des jeux. Chaque défi validé te rapporte des points d'expérience.</p></div><div className="nexus-xp"><strong>{nexusXp}</strong><span>XP NEXUS</span></div></div>
            <div className="nexus-challenge-grid">{challenges.map((challenge) => <article className={"nexus-challenge-card "+(challenge.complete?"completed":"")} key={challenge.id}><div className="nexus-challenge-status">{challenge.complete?"✓ VALIDÉ":"À FAIRE"}</div><h3>{challenge.title}</h3><p>{challenge.detail}</p><b>+{challenge.points} XP</b></article>)}</div>
            <div className="nexus-challenge-foot">Progression enregistrée sur cet appareil · Les points ne sont pas transférables entre appareils pour le moment.</div>
          </section>

          <section className="nexus-rank-section" id="player-rank">
            <div className="nexus-rank-heading">
              <div><div className="eyebrow"><span /> NEXUS PLAYER CLUB</div><h2>BADGES & <em>NIVEAUX</em></h2><p>Fais progresser ton profil en réalisant les défis de la plateforme.</p></div>
              <div className="nexus-level-emblem"><span>NIVEAU</span><strong>{playerLevels.indexOf(currentLevel) + 1}</strong><b>{currentLevel.name}</b></div>
            </div>
            <div className="nexus-level-progress">
              <div className="nexus-level-progress-label"><span>{nexusXp} XP · {currentLevel.name}</span><span>{nextLevel ? nextLevel.nextXp + " XP pour le niveau suivant" : "Niveau maximum atteint"}</span></div>
              <div className="nexus-level-track"><span style={{ width: levelProgress + "%" }} /></div>
            </div>
            <div className="nexus-badge-heading"><h3>COLLECTION DE BADGES</h3><span>{earnedBadges}/{playerBadges.length} DÉBLOQUÉS</span></div>
            <div className="nexus-badge-grid">{playerBadges.map((badge) => <article className={"nexus-badge-card " + (badge.earned ? "unlocked" : "locked")} key={badge.id}><div className="nexus-badge-icon">{badge.earned ? badge.icon : "?"}</div><div><b>{badge.name}</b><p>{badge.detail}</p><small>{badge.earned ? "BADGE DÉBLOQUÉ" : "À DÉBLOQUER"}</small></div></article>)}</div>
            <div className="nexus-local-leaderboard">
              <div><div className="eyebrow"><span /> CLASSEMENT PERSONNEL</div><h3>TON <em>TABLEAU DE PROGRESSION</em></h3><p>Ce classement est local : il affiche uniquement le profil de cet appareil. Il ne s'agit pas encore d'un classement mondial ou multijoueur.</p></div>
              <div className="nexus-local-player"><span>01</span><b>{playerName.trim() || "Joueur Nexus"}</b><strong>{nexusXp} XP</strong><small>NIVEAU {playerLevels.indexOf(currentLevel) + 1}</small></div>
            </div>
            <div className="nexus-challenge-foot">Niveaux, badges et progression sauvegardés dans le navigateur de cet appareil. Les comptes en ligne et le classement mondial ne sont pas encore disponibles.</div>
          </section>

          <section className="library-banner" id="library"><div><div className="eyebrow"><span /> TON ESPACE PERSONNEL</div><h2>TA BIBLIOTHÈQUE.<br /><em>TES RÈGLES.</em></h2><p>Ajoute tes jeux favoris et retrouve-les ici.</p><div className="favorite-list">{games.filter((game) => favorites.includes(game.id)).map((game) => <button key={game.id} onClick={() => setSelectedGame(game)}>{game.title} ↗</button>)}{favorites.length === 0 && <span>Ajoute des favoris avec le cœur sur les fiches.</span>}</div><button className="library-clear" onClick={()=>setFavorites([])} disabled={favorites.length===0}>VIDER LES FAVORIS</button></div><div className="library-count"><strong>{favorites.length.toString().padStart(2, "0")}</strong><span>JEUX FAVORIS</span></div></section>
          <footer id="about"><a className="footer-brand" href="#home">NEXUS<span>GAMES</span></a><span>UN PROJET EN CONSTRUCTION · VERSION BETA 1.0.0</span><span>© 2026 NEXUS GAMES</span></footer>
        </div>
      </section>

      {profileOpen && <div className="modal-backdrop" role="presentation" onClick={() => setProfileOpen(false)}><div className="game-modal profile-modal" role="dialog" aria-modal="true" aria-label="Mon profil joueur" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setProfileOpen(false)} aria-label="Fermer">×</button><div className="eyebrow"><span /> ESPACE JOUEUR</div><h2>MON <em>PROFIL</em></h2><p>Choisis un pseudo pour personnaliser ton espace sur cet appareil.</p><p><a className="account-home" href="/account">Créer un compte en ligne — bientôt disponible ↗</a></p><label className="profile-label" htmlFor="player-name">PSEUDO JOUEUR</label><input id="player-name" className="profile-input" maxLength={24} value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Ton pseudo" /><div className="profile-note">Tes favoris et ton pseudo sont enregistrés dans le navigateur de cet appareil. Aucun compte en ligne n'est créé pour le moment.</div><button className="primary-button modal-play" onClick={() => setProfileOpen(false)}>ENREGISTRER</button></div></div>}
      {selectedGame && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedGame(null)}><div className="game-modal" role="dialog" aria-modal="true" aria-label={"Fiche de " + selectedGame.title} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedGame(null)} aria-label="Fermer">×</button><div className={"modal-game-art art-" + selectedGame.color}><span>{selectedGame.icon}</span><b>{selectedGame.label}</b></div><div className="eyebrow"><span /> FICHE DU JEU · {selectedGame.category.toUpperCase()}</div><h2>{selectedGame.title}</h2><p>{selectedGame.details}</p><div className="game-meta"><span>{selectedGame.players}</span><span className={selectedGame.status === "JOUABLE" ? "meta-ready" : ""}>{selectedGame.status}</span></div>{selectedGame.slug ? <Link className="primary-button modal-play" href={selectedGame.slug}>▶ LANCER LE JEU</Link> : <button className="secondary-button modal-play" onClick={() => setSelectedGame(null)}>RETOUR AU CATALOGUE</button>}</div></div>}
    </main>
  );
}
