"use client";

import Link from "next/link";
import { useState } from "react";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  return (
    <main className="account-page">
      <header className="account-top">
        <Link className="brand" href="/"><span className="brand-mark">N</span><span>NEXUS<span className="brand-light">GAMES</span></span></Link>
        <span className="account-beta">BETA · 0.0.0.6</span>
        <Link className="back-link" href="/">← RETOUR À L'ACCUEIL</Link>
      </header>
      <section className="account-card">
        <div className="eyebrow"><span /> ESPACE JOUEUR NEXUS</div>
        <h1>TON COMPTE.<br /><em>TON UNIVERS.</em></h1>
        <p className="account-intro">Prépare ton espace joueur Nexus Games.</p>
        <div className="account-tabs">
          <button className={mode === "signup" ? "account-tab selected" : "account-tab"} onClick={() => setMode("signup")}>CRÉER UN COMPTE</button>
          <button className={mode === "login" ? "account-tab selected" : "account-tab"} onClick={() => setMode("login")}>SE CONNECTER</button>
        </div>
        <div className="account-fields">
          {mode === "signup" && <label>PSEUDO<input type="text" placeholder="Ton pseudo" disabled /></label>}
          <label>ADRESSE E-MAIL<input type="email" placeholder="exemple@email.com" disabled /></label>
          <label>MOT DE PASSE<input type="password" placeholder="8 caractères minimum" disabled /></label>
          <button className="primary-button account-submit" disabled>{mode === "signup" ? "INSCRIPTION BIENTÔT DISPONIBLE" : "CONNEXION BIENTÔT DISPONIBLE"}</button>
        </div>
        <div className="account-notice"><strong>🔒 Connexion en préparation</strong><p>Les comptes en ligne ne sont pas encore activés. Cette page est une maquette : aucun identifiant n'est envoyé ni enregistré. Ton profil local et tes favoris continuent de fonctionner sur cet appareil.</p></div>
        <Link className="account-home" href="/">← Revenir à Nexus Games</Link>
      </section>
      <footer className="account-footer">NEXUS GAMES · VERSION BÊTA 0.0.0.6</footer>
    </main>
  );
}
