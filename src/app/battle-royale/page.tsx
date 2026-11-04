"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type V3=[number,number,number];
type Bot={id:number,x:number,z:number,active:boolean,taggedAt:number};
type Pulse={x:number,z:number,life:number};
type World={x:number,z:number,yaw:number,bots:Bot[],pulses:Pulse[],zone:number,health:number,shields:number,eliminations:number,tick:number,started:boolean,ended:boolean};
const initialBots=():Bot[]=>Array.from({length:7},(_,i)=>({id:i+1,x:Math.cos(i*6.28/7)*13,z:Math.sin(i*6.28/7)*13,active:true,taggedAt:0}));
const VERT=`
attribute vec3 aPosition; attribute vec3 aColor; uniform mat4 uMatrix; varying vec3 vColor;
void main(){gl_Position=uMatrix*vec4(aPosition,1.0);vColor=aColor;}
`;
const FRAG=`
precision mediump float; varying vec3 vColor;
void main(){gl_FragColor=vec4(vColor,1.0);}
`;
function shader(gl:WebGLRenderingContext,type:number,src:string){const s=gl.createShader(type);if(!s)throw new Error("Shader indisponible");gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||"Erreur shader");return s;}
function perspective(f:number,a:number,n:number,far:number){const t=1/Math.tan(f/2),nf=1/(n-far);return[t/a,0,0,0,0,t,0,0,0,0,(far+n)*nf,-1,0,0,2*far*n*nf,0];}
function lookAt(e:V3,c:V3,u:V3){const norm=(v:V3):V3=>{const l=Math.hypot(...v)||1;return[v[0]/l,v[1]/l,v[2]/l]},sub=(a:V3,b:V3):V3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cross=(a:V3,b:V3):V3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];const z=norm(sub(e,c)),x=norm(cross(u,z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*e[0]+x[1]*e[1]+x[2]*e[2]),-(y[0]*e[0]+y[1]*e[1]+y[2]*e[2]),-(z[0]*e[0]+z[1]*e[1]+z[2]*e[2]),1];}
function mul(a:number[],b:number[]){const o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
function addCube(p:number[],c:number[],pos:V3,size:V3,color:V3){const [x,y,z]=pos,[w,h,d]=size,verts:V3[]=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],faces=[[0,1,2,0,2,3],[4,6,5,4,7,6],[0,4,5,0,5,1],[3,2,6,3,6,7],[1,5,6,1,6,2],[0,3,7,0,7,4]];for(const face of faces)for(const id of face){const v=verts[id];p.push(x+v[0]*w/2,y+v[1]*h/2,z+v[2]*d/2);c.push(...color);}}
function addCharacter(p:number[],c:number[],x:number,z:number,color:V3){addCube(p,c,[x,.78,z],[.68,1.05,.48],color);addCube(p,c,[x,1.48,z],[.48,.48,.48],[.95,.76,.58]);addCube(p,c,[x,.18,z],[.22,.36,.24],[.13,.16,.22]);}
export default function NexusBattleRoyale(){
 const canvas=useRef<HTMLCanvasElement|null>(null),keys=useRef<Record<string,boolean>>({}),world=useRef<World>({x:0,z:18,yaw:0,bots:initialBots(),pulses:[],zone:25,health:100,shields:50,eliminations:0,tick:0,started:false,ended:false});
 const [started,setStarted]=useState(false),[health,setHealth]=useState(100),[shields,setShields]=useState(50),[alive,setAlive]=useState(8),[kills,setKills]=useState(0),[seconds,setSeconds]=useState(0),[notice,setNotice]=useState("Prépare-toi à atterrir sur l'île Nexus.");
 const reset=useCallback(()=>{world.current={x:0,z:18,yaw:0,bots:initialBots(),pulses:[],zone:25,health:100,shields:50,eliminations:0,tick:0,started:true,ended:false};keys.current={};setHealth(100);setShields(50);setAlive(8);setKills(0);setSeconds(0);setNotice("Trouve les capsules de bouclier et reste dans la zone sûre.");setStarted(true)},[]);
 const pulse=useCallback(()=>{const w=world.current;if(!w.started||w.ended)return;w.pulses.push({x:w.x-Math.sin(w.yaw)*1.3,z:w.z-Math.cos(w.yaw)*1.3,life:20});setNotice("Impulsion Nexus déclenchée !")},[]);
 useEffect(()=>{const c=canvas.current;if(!c)return;const gl=c.getContext("webgl",{antialias:true});if(!gl){setNotice("WebGL n'est pas disponible sur ce navigateur.");return;}let program:WebGLProgram|null=null,buffer:WebGLBuffer|null=null,raf=0;try{program=gl.createProgram();if(!program)throw new Error("Moteur 3D indisponible");gl.attachShader(program,shader(gl,gl.VERTEX_SHADER,VERT));gl.attachShader(program,shader(gl,gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error("Échec du moteur 3D");gl.useProgram(program);buffer=gl.createBuffer();gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);
 const render=()=>{const w=world.current,rect=c.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.6),width=Math.max(1,Math.floor(rect.width*dpr)),height=Math.max(1,Math.floor(rect.height*dpr));if(c.width!==width||c.height!==height){c.width=width;c.height=height;}gl.viewport(0,0,width,height);gl.clearColor(.35,.66,.82,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const p:number[]=[],col:number[]=[];
 addCube(p,col,[0,-.8,0],[54,.9,54],[.16,.43,.25]);
 // island shoreline and landmarks
 addCube(p,col,[0,-1.1,0],[58,.35,58],[.15,.42,.55]);
 for(let i=-24;i<=24;i+=4){addCube(p,col,[i,-.29,0],[.07,.015,50],[.22,.49,.28]);addCube(p,col,[0,-.28,i],[50,.015,.07],[.22,.49,.28]);}
 // buildings
 const buildings:[number,number,number,number,V3][]=[[-9,-8,5,4,[.65,.68,.72]],[10,-10,6,5,[.78,.58,.32]],[-13,8,4,5,[.43,.56,.72]],[12,8,5,4,[.62,.48,.68]],[0,-17,8,4,[.65,.72,.78]]];
 for(const [x,z,a,b,cc] of buildings){addCube(p,col,[x,1.2,z],[a,3.8,b],cc);addCube(p,col,[x,3.3,z],[a+0.3,.35,b+0.3],[.22,.28,.38]);}
 // trees
 for(let i=0;i<18;i++){const x=Math.sin(i*17.3)*22,z=Math.cos(i*11.7)*22;if(Math.hypot(x,z)<13)continue;addCube(p,col,[x,.35,z],[.35,1.5,.35],[.35,.22,.12]);addCube(p,col,[x,1.55,z],[1.7,1.7,1.7],[.12,.48,.22]);}
 // zone ring, made from little neon markers
 for(let i=0;i<64;i++){const a=i*Math.PI*2/64;addCube(p,col,[Math.cos(a)*w.zone,.12,Math.sin(a)*w.zone],[.32,.16,.32],[.2,.85,1]);}
 // supply capsules
 for(const [x,z] of [[-7,2],[8,3],[2,-12],[-15,-8],[14,-16]] as [number,number][]){addCube(p,col,[x,.5,z],[.55,.75,.55],[.18,.85,.95]);addCube(p,col,[x,.92,z],[.8,.12,.8],[.8,.95,1]);}
 for(const bot of w.bots)if(bot.active)addCharacter(p,col,bot.x,bot.z,[.92,.38,.22]);
 addCharacter(p,col,w.x,w.z,[.24,.86,.58]);
 for(const shot of w.pulses){addCube(p,col,[shot.x,.7,shot.z],[.55,.55,.55],[.3,.85,1]);}
 gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([...p,...col]),gl.DYNAMIC_DRAW);const bytes=p.length*4,ap=gl.getAttribLocation(program!,"aPosition"),ac=gl.getAttribLocation(program!,"aColor");gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(ac);gl.vertexAttribPointer(ac,3,gl.FLOAT,false,0,bytes);
 const yaw=w.yaw,camX=w.x+Math.sin(yaw)*7,camZ=w.z+Math.cos(yaw)*7;const projection=perspective(Math.PI/3,width/height,.1,130),view=lookAt([camX,6.2,camZ],[w.x,.5,w.z-1],[0,1,0]);gl.uniformMatrix4fv(gl.getUniformLocation(program!,"uMatrix"),false,new Float32Array(mul(projection,view)));gl.drawArrays(gl.TRIANGLES,0,p.length/3);raf=requestAnimationFrame(render);};render();
 }catch(e){setNotice(e instanceof Error?e.message:"Erreur 3D");}
 return()=>{cancelAnimationFrame(raf);if(program)gl.deleteProgram(program);if(buffer)gl.deleteBuffer(buffer);};
 },[]);
 useEffect(()=>{if(!started)return;const down=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();if(["w","a","s","d","z","q","arrowup","arrowdown","arrowleft","arrowright"," "].includes(k))e.preventDefault();keys.current[k]=true;if(k==="e"||k===" ")pulse();};const up=(e:KeyboardEvent)=>{keys.current[e.key.toLowerCase()]=false;};window.addEventListener("keydown",down);window.addEventListener("keyup",up);
 const timer=window.setInterval(()=>{const w=world.current;if(w.ended)return;w.tick++;setSeconds(Math.floor(w.tick/10));const forward=(keys.current.w||keys.current.z||keys.current.arrowup?1:0)-(keys.current.s||keys.current.arrowdown?1:0),side=(keys.current.d||keys.current.arrowright?1:0)-(keys.current.a||keys.current.q||keys.current.arrowleft?1:0);const speed=.34,fx=-Math.sin(w.yaw),fz=-Math.cos(w.yaw),rx=Math.cos(w.yaw),rz=-Math.sin(w.yaw);w.x=Math.max(-25,Math.min(25,w.x+(fx*forward+rx*side)*speed));w.z=Math.max(-25,Math.min(25,w.z+(fz*forward+rz*side)*speed));if(keys.current.arrowleft)w.yaw-=.035;if(keys.current.arrowright)w.yaw+=.035;
 w.zone=Math.max(8,25-Math.floor(w.tick/100)*1.2);
 w.bots=w.bots.map(bot=>{if(!bot.active)return bot;const dx=w.x-bot.x,dz=w.z-bot.z,dist=Math.hypot(dx,dz);if(dist>2.6){bot.x+=dx/(dist||1)*.075;bot.z+=dz/(dist||1)*.075;}else if(w.tick-bot.taggedAt>35){bot.taggedAt=w.tick;if(w.shields>0)w.shields=Math.max(0,w.shields-12);else w.health=Math.max(0,w.health-12);setShields(w.shields);setHealth(w.health);}return bot;});
 w.pulses=w.pulses.filter(s=>s.life-->0);for(const shot of w.pulses){for(const bot of w.bots){if(bot.active&&Math.hypot(bot.x-shot.x,bot.z-shot.z)<2.8){bot.active=false;w.eliminations++;setKills(w.eliminations);setAlive(1+w.bots.filter(b=>b.active).length);}}}
 const out=Math.hypot(w.x,w.z)>w.zone;if(out&&w.tick%10===0){if(w.shields>0)w.shields=Math.max(0,w.shields-5);else w.health=Math.max(0,w.health-5);setShields(w.shields);setHealth(w.health);setNotice("Attention : tu es hors de la zone sûre !");}
 if(w.health<=0){w.ended=true;setNotice("Partie terminée. Relance une partie pour retenter ta chance.");}
 if(w.bots.every(b=>!b.active)){w.ended=true;setNotice("VICTOIRE ! Tu es le dernier joueur sur l'île.");}
 },100);return()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);window.clearInterval(timer);};},[started,pulse]);
 const moveTouch=(key:string,on:boolean)=>{keys.current[key]=on;};
 return <main className="battle-page"><header className="battle-top"><Link href="/" className="battle-brand">NEXUS<span>GAMES</span></Link><span>SEASON 01 · ISLAND SHOWDOWN</span><Link href="/">← QUITTER</Link></header><section className="battle-heading"><div><small>MODE BATTLE ROYALE · PROTOTYPE 3D</small><h1>NEXUS <em>BATTLE ROYALE</em></h1><p>Une île. Huit joueurs. Une seule place de champion.</p></div><div className="battle-alive"><b>{alive}</b><span>JOUEURS RESTANTS</span></div></section><section className="battle-hud"><div><span>VIE</span><b>{health}%</b><i><u style={{width:health+"%"}}/></i></div><div><span>BOUCLIER</span><b>{shields}%</b><i><u style={{width:shields+"%"}}/></i></div><div><span>ÉLIMINATIONS</span><b>{kills}</b></div><div><span>TEMPS</span><b>{Math.floor(seconds/60).toString().padStart(2,"0")}:{(seconds%60).toString().padStart(2,"0")}</b></div></section><section className="battle-stage"><canvas ref={canvas} aria-label="Arène battle royale en trois dimensions à la troisième personne"/>{!started&&<div className="battle-overlay"><small>ÎLE NEXUS · 3D TEMPS RÉEL</small><h2>PRÊT À SAUTER<br/>DANS L'ARÈNE ?</h2><p>Affronte 7 bots dans un prototype arcade non réaliste.</p><button onClick={reset}>▶ LANCER LA PARTIE</button></div>}{started&&world.current.ended&&<div className="battle-overlay"><small>FIN DE PARTIE</small><h2>{world.current.health>0?"CHAMPION NEXUS !":"BIEN TENTÉ !"}</h2><p>{notice}</p><button onClick={reset}>↻ REJOUER</button></div>}</section><section className="battle-bottom"><div><b>COMMANDES</b><span>ZQSD / WASD / FLÈCHES : BOUGER</span><span>← → : ORIENTER LA CAMÉRA</span><span>E / ESPACE : IMPULSION NEXUS</span></div><div className="battle-touch"><button onPointerDown={()=>moveTouch("q",true)} onPointerUp={()=>moveTouch("q",false)} onPointerLeave={()=>moveTouch("q",false)}>◀</button><button onPointerDown={()=>moveTouch("z",true)} onPointerUp={()=>moveTouch("z",false)} onPointerLeave={()=>moveTouch("z",false)}>▲</button><button onPointerDown={()=>moveTouch("s",true)} onPointerUp={()=>moveTouch("s",false)} onPointerLeave={()=>moveTouch("s",false)}>▼</button><button onPointerDown={()=>moveTouch("d",true)} onPointerUp={()=>moveTouch("d",false)} onPointerLeave={()=>moveTouch("d",false)}>▶</button><button onClick={pulse}>✦</button></div></section><p className="battle-notice">{notice}</p><p className="battle-footnote">Prototype solo hors ligne · bots locaux · aucun vrai multijoueur connecté pour le moment.</p></main>;
}
