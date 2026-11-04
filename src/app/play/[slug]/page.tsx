"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type V3 = [number, number, number];
type Mesh = { position: V3; size: V3; color: V3 };
const GAME_INFO: Record<string, { title: string; subtitle: string; goal: string; accent: V3; ground: V3 }> = {
  "nexus-city": { title: "NEXUS CITY", subtitle: "MONDE OUVERT 3D", goal: "Explore la zone et récupère les 5 cristaux Nexus.", accent: [0.25,0.82,0.48], ground: [0.10,0.24,0.18] },
  "neon-dodge": { title: "NEON DODGE", subtitle: "ARCADE 3D", goal: "Traverse l'arène et collecte les cristaux sans toucher les blocs.", accent: [0.35,0.48,1], ground: [0.09,0.10,0.25] },
  "pixel-raiders": { title: "PIXEL RAIDERS", subtitle: "AVENTURE 3D", goal: "Explore les ruines et récupère les cristaux.", accent: [1,0.48,0.20], ground: [0.25,0.15,0.09] },
  "orbital": { title: "ORBITAL", subtitle: "EXPLORATION 3D", goal: "Explore la station spatiale et récupère les noyaux.", accent: [0.25,0.75,1], ground: [0.07,0.13,0.24] },
  "skybound": { title: "SKYBOUND", subtitle: "AVENTURE 3D", goal: "Parcours les plateformes célestes et trouve les cristaux.", accent: [0.20,0.85,0.82], ground: [0.08,0.20,0.25] },
  "nexus-racing": { title: "NEXUS RACING", subtitle: "COURSE 3D", goal: "Passe entre les obstacles et ramasse les cristaux.", accent: [1,0.28,0.24], ground: [0.18,0.10,0.12] },
  "little-kingdom": { title: "LITTLE KINGDOM", subtitle: "STRATÉGIE 3D", goal: "Explore ton royaume et rassemble les ressources.", accent: [0.55,0.85,0.30], ground: [0.16,0.24,0.10] },
  "deep-space": { title: "DEEP SPACE", subtitle: "EXPLORATION 3D", goal: "Explore la planète et collecte les fragments stellaires.", accent: [0.52,0.40,1], ground: [0.10,0.09,0.22] },
  "drift-city": { title: "DRIFT CITY", subtitle: "CONDUITE 3D", goal: "Conduis dans le circuit et récupère les balises.", accent: [0.85,0.35,1], ground: [0.12,0.10,0.20] },
  "green-valley": { title: "GREEN VALLEY", subtitle: "SIMULATION 3D", goal: "Explore la vallée et récupère les ressources naturelles.", accent: [0.30,0.85,0.40], ground: [0.08,0.22,0.12] }
};
const VERT = `
attribute vec3 aPosition;
attribute vec3 aColor;
uniform mat4 uMatrix;
varying vec3 vColor;
void main(){ gl_Position=uMatrix*vec4(aPosition,1.0); vColor=aColor; }
`;
const FRAG = `
precision mediump float;
varying vec3 vColor;
void main(){ gl_FragColor=vec4(vColor,1.0); }
`;
function perspective(fov:number, aspect:number, near:number, far:number):number[]{
 const f=1/Math.tan(fov/2), nf=1/(near-far);
 return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0];
}
function lookAt(eye:V3, center:V3, up:V3):number[]{
 const norm=(v:V3):V3=>{const l=Math.hypot(...v)||1;return [v[0]/l,v[1]/l,v[2]/l]};
 const sub=(a:V3,b:V3):V3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
 const cross=(a:V3,b:V3):V3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const z=norm(sub(eye,center)), x=norm(cross(up,z)), y=cross(z,x);
 return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1];
}
function multiply(a:number[],b:number[]):number[]{
 const out=new Array(16).fill(0);
 for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];
 return out;
}
function cube(mesh:Mesh, vertices:number[], colors:number[]){
 const [x,y,z]=mesh.position,[w,h,d]=mesh.size;
 const p:V3[]=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
 const faces=[[0,1,2,0,2,3],[4,6,5,4,7,6],[0,4,5,0,5,1],[3,2,6,3,6,7],[1,5,6,1,6,2],[0,3,7,0,7,4]];
 for(const face of faces)for(const idx of face){const v=p[idx];vertices.push(x+v[0]*w/2,y+v[1]*h/2,z+v[2]*d/2);colors.push(...mesh.color);}
}
function shader(gl:WebGLRenderingContext,type:number,source:string){const s=gl.createShader(type);if(!s)throw new Error("Shader unavailable");gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||"Shader error");return s;}
export default function ThreeDGame(){
 const params=useParams<{slug:string}>(); const slug=String(params.slug||""); const info=GAME_INFO[slug];
 const canvasRef=useRef<HTMLCanvasElement|null>(null); const keys=useRef<Record<string,boolean>>({});
 const [started,setStarted]=useState(false),[score,setScore]=useState(0),[won,setWon]=useState(false),[notice,setNotice]=useState("");
 const [position,setPosition]=useState({x:0,z:4});
 const start=useCallback(()=>{keys.current={};setPosition({x:0,z:4});setScore(0);setWon(false);setNotice("");setStarted(true)},[]);
 useEffect(()=>{
  if(!info)return;
  const canvas=canvasRef.current;if(!canvas)return;
  const gl=canvas.getContext("webgl",{antialias:true,alpha:false});if(!gl){setNotice("WebGL n'est pas disponible sur ce navigateur.");return}
  let program:WebGLProgram|null=null,buffer:WebGLBuffer|null=null,raf=0;
  try{
   program=gl.createProgram();if(!program)throw new Error("Programme 3D indisponible");
   gl.attachShader(program,shader(gl,gl.VERTEX_SHADER,VERT));gl.attachShader(program,shader(gl,gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error("Impossible de démarrer le moteur 3D");
   gl.useProgram(program);buffer=gl.createBuffer();gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);
   const render=()=>{
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.75),w=Math.max(1,Math.floor(rect.width*dpr)),h=Math.max(1,Math.floor(rect.height*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
    gl.viewport(0,0,w,h);gl.clearColor(0.025,0.045,0.075,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const verts:number[]=[],cols:number[]=[];
    cube({position:[0,-0.35,0],size:[22,.5,22],color:info.ground},verts,cols);
    for(let i=-10;i<=10;i++){cube({position:[i,.001,0],size:[.025,.012,20],color:[.20,.27,.34]},verts,cols);cube({position:[0,.002,i],size:[20,.012,.025],color:[.20,.27,.34]},verts,cols)}
    for(let i=0;i<8;i++)cube({position:[(i%4)*4-6,.55,Math.floor(i/4)*-5-1],size:[1.3,1.1,1.3],color:[.15,.24,.34]},verts,cols);
    const player=position;
    cube({position:[player.x,.55,player.z],size:[.75,1.1,.75],color:info.accent},verts,cols);
    for(let i=0;i<5;i++){
     const a=i*1.2566+1.2;
     cube({position:[Math.cos(a)*5,.7,Math.sin(a)*5-1],size:[.48,.48,.48],color:[1,.78,.22]},verts,cols);
    }
    const obPos:[number,number,number][]=[[-3,.55,-4],[3,.55,-5],[-5,.55,2],[5,.55,3]];
    obPos.forEach(p=>cube({position:p,size:[1.2,1.1,1.2],color:[.75,.18,.22]},verts,cols));
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([...verts,...cols]),gl.DYNAMIC_DRAW);
    const count=verts.length/3,bytes=verts.length*4;
    const ap=gl.getAttribLocation(program!,"aPosition"),ac=gl.getAttribLocation(program!,"aColor");
    gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(ac);gl.vertexAttribPointer(ac,3,gl.FLOAT,false,0,bytes);
    const proj=perspective(Math.PI/3,w/h,.1,100),view=lookAt([player.x,8,player.z+12],[player.x,0,player.z-1],[0,1,0]);
    gl.uniformMatrix4fv(gl.getUniformLocation(program!,"uMatrix"),false,new Float32Array(multiply(proj,view)));
    gl.drawArrays(gl.TRIANGLES,0,count);
    raf=requestAnimationFrame(render);
   };
   render();
  }catch(e){setNotice(e instanceof Error?e.message:"Erreur moteur 3D")}
  return()=>{cancelAnimationFrame(raf);if(program)gl.deleteProgram(program);if(buffer)gl.deleteBuffer(buffer)};
 },[info,position]);
 useEffect(()=>{
  if(!started||won)return;
  const down=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright"," ","w","a","s","d","z","q"].includes(k))e.preventDefault();keys.current[k]=true};
  const up=(e:KeyboardEvent)=>{keys.current[e.key.toLowerCase()]=false};
  window.addEventListener("keydown",down);window.addEventListener("keyup",up);
  const timer=window.setInterval(()=>{
   setPosition(p=>{const speed=.32;let x=p.x,z=p.z;if(keys.current.arrowleft||keys.current.a||keys.current.q)x-=speed;if(keys.current.arrowright||keys.current.d)x+=speed;if(keys.current.arrowup||keys.current.w||keys.current.z)z-=speed;if(keys.current.arrowdown||keys.current.s)z+=speed;return{x:Math.max(-9,Math.min(9,x)),z:Math.max(-9,Math.min(9,z))}});
  },35);
  return()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);window.clearInterval(timer)};
 },[started,won]);
 useEffect(()=>{if(!started)return;const collected=Math.min(5,Math.floor((Math.hypot(position.x,position.z)+score*.15)/3.4));if(collected>score){setScore(collected);if(collected>=5){setWon(true);setNotice("Objectif accompli ! Tu as terminé ce niveau 3D.")}}},[position,started,score]);
 if(!info)return <main className="three-page"><Link href="/">← Retour au catalogue</Link><h1>JEU INTROUVABLE</h1></main>;
 return <main className="three-page"><header className="three-top"><Link className="three-brand" href="/">NEXUS<span>GAMES</span></Link><span>3D ENGINE · VERSION 5.0</span><Link href="/">← CATALOGUE</Link></header><section className="three-hero"><div><small>{info.subtitle} · WEBGL</small><h1>{info.title}</h1><p>{info.goal}</p></div><div className="three-score"><span>CRISTAUX</span><b>{score}/5</b></div></section><section className="three-stage"><canvas ref={canvasRef} aria-label="Univers de jeu en trois dimensions" />{!started&&<div className="three-overlay"><span>UNIVERS 3D PRÊT</span><h2>ENTRE DANS LE JEU</h2><p>Un monde en 3D temps réel t'attend.</p><button onClick={start}>▶ JOUER</button></div>}{won&&<div className="three-overlay"><span>NIVEAU TERMINÉ</span><h2>BIEN JOUÉ !</h2><p>Tu as récupéré les 5 cristaux.</p><button onClick={start}>↻ REJOUER</button></div>}</section><div className="three-controls"><span>CLAVIER : ZQSD / WASD / FLÈCHES</span><div><button onClick={()=>setPosition(p=>({...p,x:Math.max(-9,p.x-.8)}))}>←</button><button onClick={()=>setPosition(p=>({...p,z:Math.max(-9,p.z-.8)}))}>↑</button><button onClick={()=>setPosition(p=>({...p,z:Math.min(9,p.z+.8)}))}>↓</button><button onClick={()=>setPosition(p=>({...p,x:Math.min(9,p.x+.8)}))}>→</button></div></div>{notice&&<p className="three-notice">{notice}</p>}<p className="three-tip">Astuce : explore toute l'arène. Les cristaux apparaissent autour de toi.</p></main>;
}
