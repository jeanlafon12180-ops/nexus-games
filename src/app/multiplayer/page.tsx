import Link from "next/link";

const modes = [
  { title: "Salon privé", status: "À CONNECTER", detail: "Créer un espace de jeu avec un code d'invitation. L'authentification et le serveur de salon ne sont pas encore disponibles." },
  { title: "Partie coopérative", status: "EN PRÉPARATION", detail: "Préparer les règles de synchronisation, les joueurs et les événements de partie avant le développement du serveur." },
  { title: "Match compétitif", status: "EN PRÉPARATION", detail: "Prévoir des résultats validés côté serveur. Aucun score local ne sera présenté comme un classement mondial." }
];

export default function MultiplayerPage() {
  return <main className="community-foundation">
    <header><Link href="/" className="evo-brand">NEXUS<span>GAMES</span></Link><Link href="/" className="evo-back">← ACCUEIL</Link></header>
    <section className="community-hero"><span>2.6.0 · MULTIPLAYER FOUNDATION</span><h1>PLAY<br/><em>TOGETHER.</em></h1><p>Les bases de la future expérience multijoueur Nexus Games.</p></section>
    <section className="community-grid">{modes.map(mode => <article className="community-card" key={mode.title}><small>{mode.status}</small><h2>{mode.title}</h2><p>{mode.detail}</p></article>)}</section>
    <section className="community-note"><b>État actuel</b><p>Cette version prépare l'architecture et l'interface. Aucun salon, matchmaking, chat ou jeu en réseau n'est actif. Les jeux existants restent jouables en local.</p><Link href="/community-share" className="evo-primary">DÉCOUVRIR LE PARTAGE DE CRÉATIONS</Link></section>
    <footer className="evo-footer">NEXUS GAMES 2.6.0 · MULTIPLAYER FOUNDATION</footer>
  </main>;
}
