"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Block = { id: number; x: number; y: number; size: number };

export default function NeonDodge() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [ended, setEnded] = useState(false);
  const gameRef = useRef({ playerX: 50, blocks: [] as Block[], frame: 0, score: 0, id: 0 });

  useEffect(() => {
    try { setBest(Number(localStorage.getItem("nexus-neon-dodge-best") || 0)); } catch {}
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      const game = gameRef.current;
      game.frame += 1;
      if (game.frame % 17 === 0) {
        game.id += 1;
        game.blocks.push({ id: game.id, x: 5 + Math.random() * 88, y: -8, size: 5 + Math.random() * 3 });
      }
      game.blocks = game.blocks.map((block) => ({ ...block, y: block.y + 2.15 })).filter((block) => block.y < 105);
      const collision = game.blocks.some((block) => block.y > 82 && block.y < 96 && Math.abs(block.x - game.playerX) < block.size / 2 + 4);
      if (collision) {
        setPlaying(false);
        setEnded(true);
        setBest((current) => {
          const next = Math.max(current, game.score);
          try { localStorage.setItem("nexus-neon-dodge-best", String(next)); } catch {}
          return next;
        });
      } else {
        if (game.frame % 5 === 0) {
          game.score += 1;
          setScore(game.score);
        }
        setBlocks([...game.blocks]);
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const move = (event: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(event.key)) event.preventDefault();
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        gameRef.current.playerX = Math.max(5, gameRef.current.playerX - 6);
        setPlayerX(gameRef.current.playerX);
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        gameRef.current.playerX = Math.min(95, gameRef.current.playerX + 6);
        setPlayerX(gameRef.current.playerX);
      }
    };
    window.addEventListener("keydown", move);
    return () => window.removeEventListener("keydown", move);
  }, [playing]);

  function start() {
    gameRef.current = { playerX: 50, blocks: [], frame: 0, score: 0, id: 0 };
    setPlayerX(50); setBlocks([]); setScore(0); setEnded(false); setPlaying(true);
  }

  function movePlayer(direction: number) {
    const next = Math.max(5, Math.min(95, gameRef.current.playerX + direction * 7));
    gameRef.current.playerX = next;
    setPlayerX(next);
  }

  return (
    <main className="arcade-page">
      <header className="arcade-top"><Link className="brand" href="/"><span className="brand-mark">N</span><span>NEXUS<span className="brand-light">GAMES</span></span></Link><span className="arcade-version">ARCADE ORIGINAL · NEXUS GAMES 2.1</span><Link className="back-link" href="/">← RETOUR AU CATALOGUE</Link></header>
      <section className="arcade-content">
        <div className="eyebrow"><span /> NEXUS ARCADE · JEU HTML5</div>
        <h1>NEON <em>DODGE.</em></h1>
        <p className="arcade-intro">Esquive les obstacles aussi longtemps que possible. Chaque seconde compte !</p>
        <div className="arcade-hud"><div><span>SCORE</span><strong>{score.toString().padStart(3, "0")}</strong></div><div><span>RECORD LOCAL</span><strong>{best.toString().padStart(3, "0")}</strong></div><div><span>CONTRÔLES</span><strong>← → / A D</strong></div></div>
        <div className="arena-wrap">
          <div className="arena">
            <div className="arena-scanlines" />
            <div className="arena-grid" />
            {blocks.map((block) => <div key={block.id} className="falling-block" style={{ left: block.x + "%", top: block.y + "%", width: block.size + "%" }} />)}
            <div className="player-ship" style={{ left: playerX + "%" }}><span /></div>
            {!playing && <div className="arena-overlay"><div className="overlay-panel"><div className="eyebrow"><span /> {ended ? "PARTIE TERMINÉE" : "PRÊT À JOUER ?"}</div><h2>{ended ? "BIEN JOUÉ." : "ÉVITE LES BLOCS."}</h2><p>{ended ? "Ton score : " + score + " points. Tu peux retenter ta chance !" : "Déplace ton vaisseau à gauche et à droite pour éviter les obstacles."}</p><button className="primary-button" onClick={start}>{ended ? "↻ REJOUER" : "▶ COMMENCER"}</button></div></div>}
          </div>
        </div>
        <div className="touch-controls"><button onClick={() => movePlayer(-1)} aria-label="Aller à gauche">←</button><span>COMMANDES</span><button onClick={() => movePlayer(1)} aria-label="Aller à droite">→</button></div>
        <div className="arcade-footnote">JEU ORIGINAL NEXUS GAMES · VERSION 2.1 · RECORD ENREGISTRÉ SUR CET APPAREIL</div>
      </section>
    </main>
  );
}
