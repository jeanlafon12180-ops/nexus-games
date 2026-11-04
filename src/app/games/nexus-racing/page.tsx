"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Obstacle = { id: number; lane: number; y: number; kind: "car" | "coin" };
const laneX = [20, 50, 80];

export default function NexusRacing() {
  const [running, setRunning] = useState(false);
  const [lane, setLane] = useState(1);
  const [objects, setObjects] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [best, setBest] = useState(0);
  const [crashed, setCrashed] = useState(false);
  const [boost, setBoost] = useState(100);
  const [boosting, setBoosting] = useState(false);
  const state = useRef({ lane: 1, objects: [] as Obstacle[], tick: 0, score: 0, coins: 0, id: 0, boost: 100, boosting: false });

  useEffect(() => {
    try { setBest(Number(localStorage.getItem("nexus-racing-best") || 0)); } catch {}
  }, []);

  const move = useCallback((direction: number) => {
    const next = Math.max(0, Math.min(2, state.current.lane + direction));
    state.current.lane = next;
    setLane(next);
  }, []);

  const start = useCallback(() => {
    state.current = { lane: 1, objects: [], tick: 0, score: 0, coins: 0, id: 0, boost: 100, boosting: false };
    setLane(1); setObjects([]); setScore(0); setCoins(0); setBoost(100); setBoosting(false); setCrashed(false); setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D", " "].includes(event.key)) event.preventDefault();
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") move(-1);
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") move(1);
      if (event.code === "Space" && state.current.boost > 0) { state.current.boosting = true; setBoosting(true); }
    };
    const onUp = (event: KeyboardEvent) => { if (event.code === "Space") { state.current.boosting = false; setBoosting(false); } };
    const onBlur = () => { state.current.boosting = false; setBoosting(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onUp); window.removeEventListener("blur", onBlur); };
  }, [running, move]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      const s = state.current;
      s.tick += 1;
      const fast = s.boosting && s.boost > 0;
      s.boost = Math.max(0, Math.min(100, s.boost + (fast ? -2.2 : 0.55)));
      const speed = fast ? 4.6 : 2.8 + Math.min(1.4, s.score / 700);
      if (s.tick % Math.max(8, 17 - Math.floor(s.score / 180)) === 0) {
        s.id += 1;
        const laneIndex = Math.floor(Math.random() * 3);
        const kind = Math.random() < 0.24 ? "coin" : "car";
        s.objects.push({ id: s.id, lane: laneIndex, y: -12, kind });
      }
      s.objects = s.objects.map(item => ({ ...item, y: item.y + speed })).filter(item => item.y < 112);
      const hit = s.objects.find(item => item.kind === "car" && item.lane === s.lane && item.y > 78 && item.y < 94);
      if (hit) {
        setRunning(false); setCrashed(true); setBoosting(false); s.boosting = false;
        try { const next = Math.max(Number(localStorage.getItem("nexus-racing-best") || 0), s.score); localStorage.setItem("nexus-racing-best", String(next)); setBest(next); } catch {}
        return;
      }
      const collected = s.objects.filter(item => item.kind === "coin" && item.lane === s.lane && item.y > 78 && item.y < 94);
      if (collected.length) { s.coins += collected.length; setCoins(s.coins); s.objects = s.objects.filter(item => !collected.includes(item)); }
      if (s.tick % 4 === 0) { s.score += fast ? 3 : 1; setScore(s.score); }
      setBoost(Math.round(s.boost)); setObjects([...s.objects]);
    }, 50);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <main className="racing-page">
      <style jsx global>{`
        .racing-page{min-height:100vh;background:radial-gradient(ellipse at 50% 0%,#173044 0%,#080d14 48%,#070a10 100%);color:#f4f7fb;padding:0 20px 55px;font-family:Arial,sans-serif}
        .racing-top{max-width:1100px;height:76px;margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff1c;gap:12px}
        .racing-brand{font-weight:900;letter-spacing:2px}.racing-brand b{color:#62d7ff}.racing-back{font-size:10px;color:#a9bac8;letter-spacing:1px}
        .racing-wrap{max-width:920px;margin:38px auto}.racing-kicker{font-size:10px;letter-spacing:2px;color:#68d8ff;font-weight:800}.racing-title{font-size:clamp(48px,8vw,76px);line-height:.95;margin:12px 0;font-weight:1000;letter-spacing:-3px}.racing-title span{color:#69d9ff}.racing-sub{color:#9eafbf;font-size:14px}
        .racing-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:25px 0}.racing-stat{background:#111e2b;border:1px solid #ffffff14;border-radius:9px;padding:13px}.racing-stat small{display:block;color:#8fa5b8;font-size:9px;letter-spacing:1px}.racing-stat strong{display:block;font-size:22px;margin-top:5px}
        .racing-game-shell{max-width:560px;margin:0 auto;background:#0d1722;border:1px solid #3b7891;border-radius:15px;padding:12px;box-shadow:0 25px 80px #0009}
        .racing-track{height:min(66vh,590px);min-height:390px;position:relative;overflow:hidden;border-radius:9px;background:linear-gradient(90deg,#172c3b 0 8%,#273b49 8% 92%,#172c3b 92%);border:1px solid #6c8b9b}
        .racing-track:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0 45px,#ffffff20 46px 75px,transparent 76px 120px);background-size:100% 120px;animation:racing-road 1s linear infinite}
        @keyframes racing-road{to{background-position:0 120px}}
        .racing-lane{position:absolute;top:0;bottom:0;width:1px;border-left:2px dashed #d9e5ed55}.racing-lane.one{left:36%}.racing-lane.two{left:64%}
        .racing-car{position:absolute;z-index:3;width:46px;height:76px;transform:translateX(-50%);border-radius:12px 12px 8px 8px;display:grid;place-items:center;font-size:28px;filter:drop-shadow(0 8px 7px #0008)}
        .racing-player{bottom:7%;background:linear-gradient(135deg,#66e0ff,#1473bd);border:2px solid #d4f7ff;box-shadow:0 0 22px #45d5ff66}
        .racing-enemy{top:0;background:linear-gradient(135deg,#ff8a67,#a92c45);border:2px solid #ffc2b1}
        .racing-coin{position:absolute;z-index:2;transform:translate(-50%,-50%);font-size:29px;filter:drop-shadow(0 0 10px #ffd34d)}
        .racing-overlay{position:absolute;z-index:5;inset:0;background:#06101bd9;display:grid;place-items:center;padding:25px;text-align:center}
        .racing-overlay-card{max-width:350px}.racing-overlay h2{font-size:32px;margin:10px 0}.racing-overlay p{color:#a8bbcb;line-height:1.7;font-size:13px}
        .racing-primary{border:0;border-radius:7px;padding:14px 22px;background:#62d7ff;color:#06131b;font-weight:900;letter-spacing:1px;cursor:pointer}
        .racing-controls{display:flex;align-items:center;justify-content:center;gap:12px;margin:14px auto 0;flex-wrap:wrap}.racing-controls button{min-width:58px;height:48px;border:1px solid #ffffff2b;border-radius:8px;background:#152536;color:#fff;font-size:20px;cursor:pointer}.racing-controls .boost-button{min-width:110px;font-size:11px;font-weight:900;color:#ffe18a}.racing-controls button:disabled{opacity:.4}
        .racing-boost{height:7px;background:#ffffff18;border-radius:9px;margin-top:13px;overflow:hidden}.racing-boost span{display:block;height:100%;background:linear-gradient(90deg,#4ecbff,#ffe17a);transition:width .1s}
        .racing-help{text-align:center;color:#8298aa;font-size:10px;margin:14px 0 0}
        @media(max-width:600px){.racing-page{padding:0 12px 35px}.racing-top{height:62px}.racing-wrap{margin:26px auto}.racing-stats{grid-template-columns:repeat(2,1fr)}.racing-track{height:58vh;min-height:360px}.racing-stat strong{font-size:19px}}
      `}</style>
      <header className="racing-top"><Link href="/" className="racing-brand">NEXUS <b>GAMES</b></Link><span className="racing-kicker">ARCADE ORIGINAL</span><Link href="/" className="racing-back">← CATALOGUE</Link></header>
      <section className="racing-wrap">
        <div className="racing-kicker">NEXUS ARCADE · COURSE</div>
        <h1 className="racing-title">NEXUS <span>RACING</span></h1>
        <p className="racing-sub">Change de voie, évite le trafic et récupère les crédits. Jusqu'où iras-tu ?</p>
        <div className="racing-stats">
          <div className="racing-stat"><small>SCORE</small><strong>{score.toString().padStart(4,"0")}</strong></div>
          <div className="racing-stat"><small>CRÉDITS</small><strong>🪙 {coins}</strong></div>
          <div className="racing-stat"><small>RECORD LOCAL</small><strong>{best.toString().padStart(4,"0")}</strong></div>
          <div className="racing-stat"><small>TURBO</small><strong>{boost}%</strong></div>
        </div>
        <div className="racing-game-shell">
          <div className="racing-track">
            <div className="racing-lane one"/><div className="racing-lane two"/>
            {objects.map(item => item.kind === "coin"
              ? <div key={item.id} className="racing-coin" style={{left:laneX[item.lane]+"%",top:item.y+"%"}}>🪙</div>
              : <div key={item.id} className="racing-car racing-enemy" style={{left:laneX[item.lane]+"%",top:item.y+"%"}}>🚙</div>)}
            <div className="racing-car racing-player" style={{left:laneX[lane]+"%"}}>🏎️</div>
            {!running && <div className="racing-overlay"><div className="racing-overlay-card"><div className="racing-kicker">{crashed?"COURSE TERMINÉE":"PRÊT SUR LA GRILLE ?"}</div><h2>{crashed?"IMPACT !":"À TOI DE JOUER."}</h2><p>{crashed?"Score : "+score+" · Crédits récupérés : "+coins+". Retente pour battre ton record.":"Évite les voitures, ramasse les crédits et utilise le turbo dans les moments difficiles."}</p><button className="racing-primary" onClick={start}>{crashed?"↻ REJOUER":"▶ DÉMARRER LA COURSE"}</button></div></div>}
          </div>
          <div className="racing-boost"><span style={{width:boost+"%"}}/></div>
          <div className="racing-controls"><button onClick={()=>move(-1)} disabled={!running}>←</button><button onClick={()=>move(1)} disabled={!running}>→</button><button className="boost-button" disabled={!running||boost===0} aria-pressed={boosting} onPointerDown={(event)=>{event.preventDefault();state.current.boosting=true;setBoosting(true);event.currentTarget.setPointerCapture(event.pointerId);}} onPointerUp={()=>{state.current.boosting=false;setBoosting(false)}} onPointerCancel={()=>{state.current.boosting=false;setBoosting(false)}} onLostPointerCapture={()=>{state.current.boosting=false;setBoosting(false)}}>⚡ TURBO</button></div>
          <p className="racing-help">CLAVIER : ← → OU A / D · ESPACE POUR LE TURBO · COMMANDES TACTILES DISPONIBLES</p>
        </div>
      </section>
    </main>
  );
}
