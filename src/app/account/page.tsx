"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PlayerProfile = { id: string; name: string; createdAt: string };
const STORAGE = "nexus-player-profiles-v1";
const ACTIVE = "nexus-games-player-name";

export default function AccountPage() {
  const [profiles,setProfiles]=useState<PlayerProfile[]>([]);
  const [active,setActive]=useState("");
  const [name,setName]=useState("");
  const [ready,setReady]=useState(false);
  const [notice,setNotice]=useState("Crée plusieurs profils locaux pour partager la plateforme sur un même appareil.");
  useEffect(()=>{
    try {
      const raw=localStorage.getItem(STORAGE);
      const parsed:unknown=raw?JSON.parse(raw):[];
      const safe=Array.isArray(parsed)?parsed.filter((p):p is PlayerProfile=>!!p&&typeof p.id==="string"&&typeof p.name==="string"):[];
      const current=localStorage.getItem(ACTIVE)||"Joueur Nexus";
      const initial=(safe.length?safe:[{id:"default",name:current,createdAt:new Date().toISOString()}]).slice(0,8).map(p=>({...p,name:p.name.slice(0,24)}));
      setProfiles(initial); setActive(current); setName("");
      localStorage.setItem(STORAGE,JSON.stringify(initial));
    } catch { setNotice("Le stockage local est indisponible. Les profils ne pourront pas être conservés."); }
    setReady(true);
  },[]);
  const save=(next:PlayerProfile[],selected:string)=>{
    setProfiles(next);setActive(selected);
    try {localStorage.setItem(STORAGE,JSON.stringify(next));localStorage.setItem(ACTIVE,selected);setNotice("Profil enregistré sur cet appareil.");}
    catch {setNotice("Impossible d'enregistrer les profils dans ce navigateur.");}
  };
  const create=()=>{
    const clean=name.trim().slice(0,24);
    if(!clean){setNotice("Choisis un pseudo avant de créer un profil.");return;}
    if(profiles.length>=8){setNotice("Maximum : 8 profils locaux.");return;}
    if(profiles.some(p=>p.name.toLowerCase()===clean.toLowerCase())){setNotice("Ce pseudo existe déjà sur cet appareil.");return;}
    const item={id:String(Date.now()),name:clean,createdAt:new Date().toISOString()};
    save([item,...profiles],clean);setName("");
  };
  const exportBackup=()=>{
    const keys=["nexus-games-favorites","nexus-games-player-name","nexus-platform-city-visited","nexus-creator-creations-v1","nexus-community-games-v1","nexus-community-liked-v1","nexus-challenges","nexus-xp","nexus-local-leaderboard","nexus-city-save-v1","nexus-player-profiles-v1"];
    const data:Record<string,unknown>={};
    try {
      for(const key of keys){const value=localStorage.getItem(key);if(value!==null){try{data[key]=JSON.parse(value);}catch{data[key]=value;}}}
      const content=JSON.stringify({format:"nexus-games-backup",version:1,exportedAt:new Date().toISOString(),data},null,2);
      if(content.length>1000000){setNotice("La sauvegarde dépasse 1 Mo. Supprime quelques créations avant de recommencer.");return;}
      const blob=new Blob([content],{type:"application/json"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="nexus-games-backup.json";link.click();URL.revokeObjectURL(url);
      setNotice("Sauvegarde locale exportée. Garde le fichier en lieu sûr.");
    } catch {setNotice("Impossible de créer la sauvegarde dans ce navigateur.");}
  };
  const remove=(id:string)=>{
    if(profiles.length<=1){setNotice("Conserve au moins un profil sur cet appareil.");return;}
    const next=profiles.filter(p=>p.id!==id);
    const selected=profiles.find(p=>p.id===id)?.name===active?next[0].name:active;
    save(next,selected);
  };
  return <main className="account-page">
    <header className="account-top"><Link className="brand" href="/"><span className="brand-mark">N</span><span>NEXUS<span className="brand-light">GAMES</span></span></Link><span className="account-beta">BETA · 0.0.1.8</span><Link className="back-link" href="/">← RETOUR À L'ACCUEIL</Link></header>
    <section className="account-card">
      <div className="eyebrow"><span/> ESPACE JOUEUR NEXUS</div>
      <h1>TES PROFILS.<br/><em>TON UNIVERS.</em></h1>
      <p className="account-intro">Crée et sélectionne des profils locaux pour personnaliser l'espace joueur sur cet appareil.</p>
      <div className="account-local-active"><span>PROFIL ACTIF</span><strong>{active||"Chargement…"}</strong></div>
      <div className="account-fields"><label>NOUVEAU PSEUDO<input value={name} maxLength={24} onChange={e=>setName(e.target.value)} placeholder="Ton pseudo" onKeyDown={e=>{if(e.key==="Enter")create();}}/></label><button className="primary-button account-submit" onClick={create} disabled={!ready||profiles.length>=8}>＋ CRÉER UN PROFIL</button></div>
      <div className="account-profile-list">{profiles.map(profile=><article className="account-profile" key={profile.id}><div className="account-profile-avatar">{profile.name.charAt(0).toUpperCase()}</div><div className="account-profile-info"><strong>{profile.name}</strong><small>{profile.name===active?"PROFIL ACTIF":"PROFIL LOCAL"}</small></div><div className="account-profile-actions">{profile.name!==active&&<button onClick={()=>save(profiles,profile.name)}>UTILISER</button>}<button onClick={()=>remove(profile.id)} disabled={profiles.length<=1}>SUPPRIMER</button></div></article>)}</div>
      <div className="account-backup"><button className="primary-button" onClick={exportBackup}>↓ SAUVEGARDER MES DONNÉES</button><small>Export JSON des profils, favoris, créations, progression et sauvegarde Nexus City. Taille maximale : 1 Mo.</small></div><div className="account-notice"><strong>🔒 Profils locaux uniquement</strong><p>Cette version ne crée pas de compte Internet. Aucun e-mail ni mot de passe n'est demandé. Les profils sont enregistrés dans le navigateur de cet appareil ; favoris, XP et progression restent partagés localement pour le moment.</p></div>
      <div className="community-notice" role="status">{notice}</div>
      <Link className="account-home" href="/">← Revenir à Nexus Games</Link>
    </section>
    <footer className="account-footer">NEXUS GAMES · VERSION BÊTA 0.0.1.8</footer>
  </main>;
}
