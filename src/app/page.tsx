"use client";

import { useState } from "react";

const pillars = [
  { number: "01", title: "Des jeux originaux", text: "Des univers conçus pour Nexus Games, développés avec une vraie exigence de qualité." },
  { number: "02", title: "PC & navigateur", text: "Une plateforme pensée pour retrouver les futurs jeux sur ordinateur ou directement sur le Web." },
  { number: "03", title: "Une expérience soignée", text: "Une interface claire, une bibliothèque personnelle et une identité gaming cohérente." }
];

const stages = [
  { number: "01", title: "La plateforme", text: "Construire une base rapide, accessible et agréable à utiliser.", state: "EN COURS" },
  { number: "02", title: "Le premier jeu", text: "Développer un jeu original, le tester et le publier uniquement lorsqu'il est prêt.", state: "À VENIR" },
  { number: "03", title: "PC & Web", text: "Préparer une expérience adaptée au navigateur et à Windows.", state: "À VENIR" }
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="nexus-site">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Nexus Games, accueil">
          <span className="wordmark-symbol">N</span>
          <span>NEXUS<span className="wordmark-light">GAMES</span></span>
        </a>
        <button className="mobile-menu" type="button" aria-label="Ouvrir le menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navigation principale">
          <a href="#vision" onClick={() => setMenuOpen(false)}>Notre vision</a>
          <a href="#catalogue" onClick={() => setMenuOpen(false)}>Catalogue</a>
          <a href="#roadmap" onClick={() => setMenuOpen(false)}>Développement</a>
          <a className="nav-cta" href="#catalogue" onClick={() => setMenuOpen(false)}>Explorer Nexus <span>↗</span></a>
        </nav>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-grid" />
        <div className="hero-copy">
          <div className="status-line"><span className="status-pulse" /> NOUVELLE ÈRE · NEXUS GAMES 8.0</div>
          <h1>PLAY YOUR<br /><span>OWN</span> UNIVERSE.</h1>
          <p className="hero-description">Une nouvelle plateforme gaming. Des univers originaux. Une expérience pensée pour aller plus loin.</p>
          <div className="hero-buttons">
            <a className="button-primary" href="#vision">Découvrir le projet <span>↗</span></a>
            <a className="button-quiet" href="#catalogue">Voir le catalogue <span>↓</span></a>
          </div>
          <div className="hero-footnote"><span className="footnote-mark">N</span><span>UNE PLATEFORME EN CONSTRUCTION<br /><b>LES FONDATIONS D'ABORD. LES JEUX ENSUITE.</b></span></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-ring ring-back" />
          <div className="visual-ring ring-front" />
          <div className="visual-core"><span>N</span><i>NX</i></div>
          <div className="visual-orbit orbit-a"><b /></div>
          <div className="visual-orbit orbit-b"><b /></div>
          <div className="visual-coordinate coordinate-top">48° 51' 24.0"N</div>
          <div className="visual-coordinate coordinate-bottom">NEXUS SYSTEM / 008</div>
          <div className="visual-cross cross-one">+</div><div className="visual-cross cross-two">+</div>
        </div>
        <div className="hero-side-label">INDEPENDENT GAMING PLATFORM · EST. 2026</div>
        <a className="scroll-cue" href="#vision"><span /> DÉFILER POUR EXPLORER</a>
      </section>

      <section className="intro-strip" aria-label="Présentation">
        <div><span className="strip-index">A</span><b>UNE NOUVELLE IDENTITÉ</b></div>
        <div><span className="strip-index">B</span><b>UNE BASE TECHNIQUE SOLIDE</b></div>
        <div><span className="strip-index">C</span><b>UNE QUALITÉ SANS COMPROMIS</b></div>
      </section>

      <section className="vision-section section-wrap" id="vision">
        <div className="section-kicker"><span>01 / LA VISION</span><i /></div>
        <div className="vision-heading">
          <h2>PLUS QU'UN<br /><em>CATALOGUE.</em></h2>
          <p>Nexus Games se construit comme une plateforme indépendante : un lieu pour découvrir des créations originales, retrouver sa bibliothèque et explorer de nouveaux mondes.</p>
        </div>
        <div className="pillar-grid">
          {pillars.map((item) => (
            <article className="pillar-card" key={item.number}>
              <span className="pillar-number">{item.number}</span>
              <div className="pillar-icon">{item.number === "01" ? "◇" : item.number === "02" ? "⌘" : "✳"}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="card-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section" id="catalogue">
        <div className="section-wrap">
          <div className="section-kicker"><span>02 / LE CATALOGUE</span><i /></div>
          <div className="catalog-heading">
            <div><h2>YOUR NEXT<br /><em>ADVENTURE.</em></h2><p>Découvrez les univers originaux de Nexus Games, avec leur statut de développement clairement indiqué.</p></div>
            <div className="catalog-counter"><strong>01</strong><span>PROJET AU CATALOGUE</span></div>
          </div>
          <div className="project-spotlight">
            <div className="project-visual">
              <span className="project-orbit" />
              <span className="project-city-mark">EC</span>
              <span className="project-visual-caption">NEXUS ORIGINAL / PROJECT 001</span>
            </div>
            <div className="project-details">
              <span className="project-status"><i /> AU CATALOGUE · PROTOTYPE EN DÉVELOPPEMENT · BUILD 0.5</span>
              <h3>NEXUS EMERGENCY<br /><em>CITY.</em></h3>
              <p>Le premier univers de Nexus Games : une métropole originale à explorer à pied, avec une vue à la première ou à la troisième personne, et une première voiture civile pilotable trois missions guidées, une flotte de véhicules d'urgence, des piétons animés et une circulation ambiante. Le prototype est accessible, tandis que le jeu complet reste en développement.</p>
              <div className="project-tags"><span>OPEN CITY</span><span>DRIVABLE CAR</span><span>FIRST / THIRD PERSON</span><span>POLICE · FIRE · MEDICAL</span><span>NPC · TRAFFIC AI</span></div>
              <a className="button-primary" href="/emergency-city">Jouer au prototype <span>↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="roadmap-section section-wrap" id="roadmap">
        <div className="section-kicker"><span>03 / LA CONSTRUCTION</span><i /></div>
        <div className="roadmap-heading"><h2>BUILT WITH<br /><em>PURPOSE.</em></h2><p>Chaque étape doit apporter quelque chose de concret. Pas de fausses annonces, pas de jeux affichés avant d'être prêts.</p></div>
        <div className="roadmap-list">
          {stages.map((item) => (
            <article className="roadmap-item" key={item.number}>
              <span className="roadmap-number">{item.number}</span>
              <div className="roadmap-info"><h3>{item.title}</h3><p>{item.text}</p></div>
              <span className={item.state === "EN COURS" ? "roadmap-state current" : "roadmap-state"}>{item.state}</span>
              <span className="roadmap-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-orb" aria-hidden="true">N</div>
        <div className="section-kicker"><span>04 / LE DÉBUT</span><i /></div>
        <h2>THE NEXT LEVEL<br /><em>STARTS HERE.</em></h2>
        <p>Nexus Games est en construction. La suite se prépare.</p>
        <a className="button-primary" href="#top">Retour en haut <span>↑</span></a>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top"><span className="wordmark-symbol">N</span><span>NEXUS<span className="wordmark-light">GAMES</span></span></a>
        <span className="footer-center">INDEPENDENT GAMING PLATFORM</span>
        <span className="footer-right">© 2026 NEXUS GAMES · 8.0</span>
      </footer>
    </main>
  );
}
