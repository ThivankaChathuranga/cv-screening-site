const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./pdf-CNDt0o42.js","./motion-Bb98_Kva.js","./mammoth.browser-CzZn0L7-.js","./rolldown-runtime-COiEfhsA.js"])))=>i.map(i=>d[i]);
import{i as e}from"./rolldown-runtime-COiEfhsA.js";import{A as t,C as n,D as r,E as i,F as a,I as o,L as s,M as c,N as l,P as u,S as d,T as f,_ as p,a as m,b as h,c as g,d as _,f as v,g as y,h as b,i as x,j as S,l as C,m as ee,n as w,o as te,p as ne,r as re,s as T,t as E,u as ie,v as D,w as O,x as ae,y as k}from"./r3f-yHNnHYK6.js";import{i as A,n as j,t as oe}from"./motion-Bb98_Kva.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var M=e(s(),1),se=e(o(),1),N=ae(),P=`modulepreload`,ce=function(e,t){return new URL(e,t).href},le={},ue=function(e){return e.pathname.endsWith(`.css`)},de=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},F=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=ce(t,n);let r=s(t),i=ue(r);return de(le,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:P,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{let i=a=>{t.removeEventListener(`load`,i),t.removeEventListener(`error`,i),a.type===`error`?n(Error(`Unable to preload CSS for ${r}`)):e(a)};t.addEventListener(`load`,i),t.addEventListener(`error`,i)})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},I=`
uniform float uTime; uniform float uSize;
attribute float aSeed;
varying float vTw;
void main(){
  vec3 p = position;
  p.y += sin(uTime * 0.25 + aSeed * 30.0) * 0.4;
  p.x += cos(uTime * 0.2 + aSeed * 20.0) * 0.3;
  vTw = 0.45 + 0.55 * sin(uTime * 1.5 + aSeed * 50.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.5 + aSeed) / max(0.1, -mv.z);
}`,fe=`
uniform vec3 uColor; uniform float uOpacity;
varying float vTw;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor * 1.6, a * a * vTw * uOpacity);
  gl_FragColor = (any(isnan(gl_FragColor)) || any(isinf(gl_FragColor))) ? vec4(0.0) : clamp(gl_FragColor, 0.0, 6.0);
}`;function pe({count:e=260,scale:t=[30,14,60],position:i=[0,1,-16],color:a=`#5ef2ff`,size:o=60,opacity:s=.5}){let c=(0,M.useRef)(),l=(0,M.useMemo)(()=>{let r=new O,i=new Float32Array(e*3),a=new Float32Array(e);for(let n=0;n<e;n++)i.set([(Math.random()-.5)*t[0],(Math.random()-.5)*t[1],(Math.random()-.5)*t[2]],n*3),a[n]=Math.random();return r.setAttribute(`position`,new n(i,3)),r.setAttribute(`aSeed`,new n(a,1)),r},[e]),u=(0,M.useMemo)(()=>({uTime:{value:0},uSize:{value:o},uColor:{value:new r(a)},uOpacity:{value:s}}),[]);return k((e,t)=>{c.current&&(c.current.uniforms.uTime.value+=t)}),(0,N.jsx)(`points`,{geometry:l,position:i,frustumCulled:!1,children:(0,N.jsx)(`shaderMaterial`,{ref:c,vertexShader:I,fragmentShader:fe,uniforms:u,transparent:!0,depthWrite:!1,blending:2,toneMapped:!1})})}var L={scrollY:0,vh:typeof window<`u`?window.innerHeight:800,maxScroll:1,sections:{},pointer:{x:0,y:0},drag:{active:!1,velocity:0},hoveredDoc:-1,pulse:0,quality:`high`,isMobile:!1,reducedMotion:!1,lenis:null},me=(e,t=0,n=1)=>Math.min(n,Math.max(t,e)),R=(e,t,n)=>me((e-t)/(n-t)),z=e=>e*e*e*(e*(e*6-15)+10),he=e=>e===1?1:1-2**(-10*e);function B(e){let t=L.sections[e];return t?me((L.scrollY+L.vh/2-t.top)/t.height):0}function V(e,t=1){let n=L.sections[e];if(!n)return 0;let r=L.scrollY;return r+L.vh*(1+t)>n.top&&r-L.vh*t<n.top+n.height}function ge(){L.vh=window.innerHeight,L.maxScroll=Math.max(1,document.documentElement.scrollHeight-L.vh),document.querySelectorAll(`[data-stage]`).forEach(e=>{let t=e.getBoundingClientRect();L.sections[e.dataset.stage]={top:t.top+window.scrollY,height:t.height}})}var _e=[{stage:`hero`,pos:[0,.25,9.6],target:[0,0,0],shiftX:-2.7,mobileY:-2.4},{stage:`scan`,pos:[-3.8,1.7,9.4],target:[.6,0,1]},{stage:`embed`,pos:[7.6,3.8,-9.8],target:[0,0,-18],shiftX:-3.2},{stage:`rank`,pos:[-6.4,4.6,-25.6],target:[.3,2.1,-36],shiftX:-2.6,mobileY:-3.2},{stage:`results`,pos:[6.4,3,-28.4],target:[0,1.9,-36]},{stage:`privacy`,pos:[3.6,1.6,9.2],target:[0,0,0],shiftX:-3},{stage:`cta`,pos:[13,15,9],target:[0,-2,-17]}],H=new a,ve=new a,ye=new a;function be(){let{camera:e,size:t}=h(),n=(0,M.useRef)(new a(0,0,0)),r=t.width/t.height>=1.05,o=(0,M.useMemo)(()=>{let e=(e,t)=>new a(e[0]+(r&&t.shiftX||0),e[1]+(r?0:t.mobileY||0),e[2]);return{p:new i(_e.map(t=>e(t.pos,t)),!1,`centripetal`),t:new i(_e.map(t=>e(t.target,t)),!1,`centripetal`)}},[r]);return k((r,i)=>{let a=_e.map(e=>{let t=L.sections[e.stage];return t?t.top+t.height/2-L.vh/2:0}),s=L.scrollY,c=0;for(;c<a.length-2&&s>a[c+1];)c++;let l=Math.max(1,a[c+1]-a[c]),u=z(Math.min(1,Math.max(0,(s-a[c])/l))),d=(c+u)/(_e.length-1);o.p.getPoint(d,H),o.t.getPoint(d,ve);let f=t.width/t.height,p=f<.8?1.65:f<1.2?1.25:1;H.sub(ve).multiplyScalar(p).add(ve);let m=+!L.reducedMotion;H.x+=L.pointer.x*.7*m,H.y+=L.pointer.y*.4*m,y.damp3(e.position,H,.35,i),y.damp3(n.current,ve,.3,i),ye.copy(n.current),e.lookAt(ye)}),null}var xe=`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`,U={demo:`https://YOUR-APP.streamlit.app`,github:`https://github.com/YOUR-USERNAME/cv-screening-nlp`,linkedin:`https://www.linkedin.com/in/YOUR-PROFILE`},W={bg:`#04060b`,blue:`#4f8cff`,cyan:`#5ef2ff`,violet:`#9b7bff`,mint:`#3dffb0`,amber:`#ffb547`,coral:`#ff5d6c`,paper:`#f4f2ec`};async function Se(){try{let e=await fetch(`./links.json`,{cache:`no-store`});e.ok&&Object.assign(U,await e.json())}catch{}}var Ce=`
uniform float uTime; uniform float uPulse;
varying vec3 vNormal; varying vec3 vPos; varying float vNoise;
${xe}
void main(){
  vNormal = normalize(normalMatrix * normal);
  float n = snoise(position * 2.2 + uTime * 0.35);
  float n2 = snoise(position * 5.0 - uTime * 0.6) * 0.35;
  vNoise = n + n2;
  vec3 p = position + normal * (vNoise * 0.07 + uPulse * 0.12);
  vPos = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`,we=`
uniform float uTime; uniform float uPulse; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
varying vec3 vNormal; varying vec3 vPos; varying float vNoise;
void main(){
  // clamp: float error can push the base below 0, and pow() of a negative number is NaN
  float fres = pow(clamp(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 0.0, 1.0), 2.2);
  float bands = 0.5 + 0.5 * sin(vNoise * 7.0 + uTime * 1.4);
  vec3 col = mix(uA, uB, bands);
  col = mix(col, uC, smoothstep(0.35, 1.0, vNoise));
  float glow = 1.4 + fres * 2.8 + uPulse * 3.0;
  gl_FragColor = vec4(col * glow, 1.0);
  gl_FragColor = (any(isnan(gl_FragColor)) || any(isinf(gl_FragColor))) ? vec4(0.0) : clamp(gl_FragColor, 0.0, 16.0);
}`;function Te({radius:e,tube:t,color:n,speed:r,tilt:i,dots:a=3}){let o=(0,M.useRef)();return k((e,t)=>{o.current.rotation.z+=t*r}),(0,N.jsx)(`group`,{rotation:i,children:(0,N.jsxs)(`group`,{ref:o,children:[(0,N.jsxs)(`mesh`,{children:[(0,N.jsx)(`torusGeometry`,{args:[e,t,16,220]}),(0,N.jsx)(`meshBasicMaterial`,{color:n,toneMapped:!1,transparent:!0,opacity:.85})]}),Array.from({length:a}).map((r,i)=>{let o=i/a*Math.PI*2;return(0,N.jsxs)(`mesh`,{position:[Math.cos(o)*e,Math.sin(o)*e,0],children:[(0,N.jsx)(`sphereGeometry`,{args:[t*3.2,16,16]}),(0,N.jsx)(`meshBasicMaterial`,{color:n,toneMapped:!1})]},i)})]})})}function Ee({highQuality:e}){let t=(0,M.useRef)(),n=(0,M.useRef)(),i=(0,M.useRef)(),a=(0,M.useRef)(),[o,s]=(0,M.useState)(!1),c=(0,M.useMemo)(()=>({uTime:{value:0},uPulse:{value:0},uA:{value:new r(W.blue)},uB:{value:new r(W.cyan)},uC:{value:new r(W.violet)}}),[]);return k((e,n)=>{let r=a.current?.uniforms;L.pulse=Math.max(0,L.pulse-n*1.4),r&&(r.uTime.value+=n,r.uPulse.value=L.pulse);let s=R(B(`privacy`),.15,.5)*(1-R(B(`privacy`),.85,1)),c=1+(o?.06:0)+s*.1+L.pulse*.1;y.damp3(t.current.scale,[c,c,c],.25,n);let l=t.current;y.dampE(l.rotation,[L.pointer.y*.35,e.clock.elapsedTime*.15+L.pointer.x*.5,0],.6,n),i.current.rotation.y-=n*.25}),(0,N.jsxs)(`group`,{ref:t,onPointerOver:e=>{e.stopPropagation(),s(!0),document.body.style.cursor=`pointer`},onPointerOut:()=>{s(!1),document.body.style.cursor=``},onClick:e=>{e.stopPropagation(),L.pulse=1},children:[(0,N.jsxs)(`mesh`,{ref:n,castShadow:!0,children:[(0,N.jsx)(`icosahedronGeometry`,{args:[1.25,20]}),e?(0,N.jsx)(v,{samples:6,resolution:512,thickness:1.1,roughness:.04,ior:1.35,chromaticAberration:.08,anisotropicBlur:.15,distortion:.35,distortionScale:.35,temporalDistortion:.12,backside:!0,backsideThickness:.4,color:`#dfeaff`,attenuationDistance:2.5,attenuationColor:`#9fd2ff`}):(0,N.jsx)(`meshPhysicalMaterial`,{transmission:1,thickness:1,roughness:.08,ior:1.35,color:`#dfeaff`,transparent:!0,opacity:.9})]}),(0,N.jsxs)(`mesh`,{ref:i,scale:.58,children:[(0,N.jsx)(`icosahedronGeometry`,{args:[1,48]}),(0,N.jsx)(`shaderMaterial`,{ref:a,vertexShader:Ce,fragmentShader:we,uniforms:c,toneMapped:!1})]}),(0,N.jsx)(`pointLight`,{color:W.cyan,intensity:18,distance:7,decay:2}),(0,N.jsx)(Te,{radius:1.75,tube:.006,color:W.cyan,speed:.35,tilt:[1.2,.2,0]}),(0,N.jsx)(Te,{radius:2.05,tube:.005,color:W.violet,speed:-.25,tilt:[.3,1.1,.4],dots:2}),(0,N.jsx)(Te,{radius:2.4,tube:.004,color:W.blue,speed:.18,tilt:[-.6,.4,1.2],dots:4})]})}var De=[{name:`Nadeesha Perera`,role:`HR Executive`,skills:[`Recruitment`,`Payroll`,`EPF/ETF`],score:82,band:`Shortlist`},{name:`Kasun Fernando`,role:`Data Analyst`,skills:[`Python`,`SQL`,`Power BI`],score:68,band:`Shortlist`},{name:`Ishara Silva`,role:`People Ops Officer`,skills:[`Hiring`,`HRIS`,`Welfare`],score:68,band:`Shortlist`},{name:`Amila Gunawardena`,role:`Process Engineer`,skills:[`SMT`,`Six Sigma`,`FMEA`],score:61,band:`Review`},{name:`Dilini Jayasinghe`,role:`Payroll Officer`,skills:[`Payroll`,`Excel`,`EPF/ETF`],score:47,band:`Review`},{name:`Ruwan Bandara`,role:`Quality Engineer`,skills:[`ISO 9001`,`8D`,`IPC-A-610`],score:52,band:`Review`},{name:`Tharindu Herath`,role:`Talent Acquisition`,skills:[`Sourcing`,`Onboarding`],score:44,band:`Review`},{name:`Sachini Abeysekara`,role:`Marketing Executive`,skills:[`Campaigns`,`Branding`],score:21,band:`Reject`},{name:`Harsha Wickrama`,role:`Production Supervisor`,skills:[`Lean`,`5S`,`KPIs`],score:33,band:`Reject`},{name:`Piumi Rathnayake`,role:`People Analytics`,skills:[`SQL`,`Python`,`HRIS`],score:63,band:`Review`}],Oe={Shortlist:W.mint,Review:W.amber,Reject:W.coral},G=1.3,K=1.75,q=512,J=Math.round(q*K/G),ke=[{x:28,y:34,w:72,h:72},{x:116,y:40,w:300,h:34},{x:40,y:128,w:420,h:24}],Ae=(e,t)=>[(e/q-.5)*G,(.5-t/J)*K];function je(e,t){let n=document.createElement(`canvas`);n.width=q,n.height=J;let r=n.getContext(`2d`),i=(e,t)=>`${e} ${t}px "Inter Variable", Inter, system-ui, sans-serif`;r.fillStyle=`#f7f5f0`,r.fillRect(0,0,q,J);for(let e=0;e<2200;e++)r.fillStyle=`rgba(0,0,0,${Math.random()*.025})`,r.fillRect(Math.random()*q,Math.random()*J,1.5,1.5);r.fillStyle=[`#1d4f8c`,`#2a78d6`,`#3a5f7d`][t%3],r.fillRect(0,0,q,8),r.fillStyle=`#c9d3e0`,r.beginPath(),r.arc(64,70,34,0,Math.PI*2),r.fill(),r.fillStyle=`#93a3b8`,r.beginPath(),r.arc(64,62,13,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(64,96,22,14,0,Math.PI,0),r.fill(),r.fillStyle=`#10131a`,r.font=i(700,30),r.fillText(e.name,118,66),r.fillStyle=`#5b6372`,r.font=i(500,20),r.fillText(e.role,118,96),r.fillStyle=`#7b8494`,r.font=i(400,16),r.fillText(`${e.name.split(` `)[0].toLowerCase()}@example.com  ·  +94 77 ${100+t*37} ${4400+t*211}`,42,146),r.fillStyle=`#e1ded6`,r.fillRect(40,168,432,2);let a=(e,t)=>{r.fillStyle=`#1d4f8c`,r.font=i(700,15),r.fillText(e.split(``).join(` `),42,t)},o=(e,t,n)=>{for(let i=0;i<t;i++){let t=.55+.4*Math.abs(Math.sin(n*3.1+i*1.7));r.fillStyle=i%3==0?`#9aa2ae`:`#c4c8cf`,r.beginPath(),r.roundRect(42,e+i*22,428*t,9,4),r.fill()}};a(`EXPERIENCE`,206),o(222,6,t),a(`SKILLS`,384);let s=42;e.skills.forEach((e,t)=>{r.font=i(600,16);let n=r.measureText(e).width+26;r.fillStyle=[`#e3eefc`,`#e5f6ee`,`#f1ebfb`][t%3],r.beginPath(),r.roundRect(s,400,n,32,16),r.fill(),r.fillStyle=[`#1d4f8c`,`#106b45`,`#5a3f9e`][t%3],r.fillText(e,s+13,422),s+=n+10}),a(`EDUCATION`,480),o(496,2,t+4),a(`PROJECTS`,572),o(588,3,t+9);let c=new f(n);return c.colorSpace=l,c.anisotropy=8,c}function Me({c:e,i:t,texture:n,refs:r,hovered:i,setHovered:a}){let o=(0,M.useRef)([]);return r.current[t]=r.current[t]||{},r.current[t].redact=o,(0,N.jsxs)(`group`,{ref:e=>r.current[t].group=e,onPointerOver:e=>{r.current[t].interactive&&(e.stopPropagation(),a(t),document.body.style.cursor=`pointer`)},onPointerOut:()=>{a(-1),document.body.style.cursor=``},onClick:e=>{r.current[t].interactive&&(e.stopPropagation(),r.current[t].spin=(r.current[t].spin||0)+Math.PI*2)},children:[(0,N.jsxs)(`group`,{ref:e=>r.current[t].inner=e,children:[(0,N.jsx)(_,{args:[G,K,.03],radius:.025,smoothness:4,castShadow:!0,receiveShadow:!0,children:(0,N.jsx)(`meshPhysicalMaterial`,{color:W.paper,roughness:.62,sheen:.4,sheenRoughness:.6,clearcoat:.15,clearcoatRoughness:.35})}),(0,N.jsxs)(`mesh`,{position:[0,0,.0162],children:[(0,N.jsx)(`planeGeometry`,{args:[1.28,1.73]}),(0,N.jsx)(`meshStandardMaterial`,{map:n,roughness:.55,metalness:0})]}),ke.map((e,t)=>{let[n,r]=Ae(e.x,e.y+e.h/2),i=e.w/q*G,a=e.h/J*K;return(0,N.jsx)(`group`,{position:[n,r,.018],children:(0,N.jsxs)(`mesh`,{ref:e=>o.current[t]=e,position:[i/2,0,0],scale:[1e-4,1,1],children:[(0,N.jsx)(`planeGeometry`,{args:[i,a]}),(0,N.jsx)(`meshStandardMaterial`,{color:`#0b0e15`,roughness:.35,metalness:.2})]})},t)}),(0,N.jsxs)(`mesh`,{position:[G/2-.08,K/2-.08,.019],children:[(0,N.jsx)(`circleGeometry`,{args:[.035,24]}),(0,N.jsx)(`meshBasicMaterial`,{color:Oe[e.band],toneMapped:!1})]})]}),i===t&&(0,N.jsx)(p,{position:[0,1.095,0],center:!0,distanceFactor:4.2,zIndexRange:[20,0],children:(0,N.jsxs)(`div`,{className:`doc-tip`,children:[(0,N.jsx)(`div`,{className:`doc-tip__name`,children:e.name}),(0,N.jsxs)(`div`,{className:`doc-tip__row`,children:[(0,N.jsx)(`span`,{className:`doc-tip__score`,children:e.score}),(0,N.jsx)(`span`,{className:`badge badge--${e.band.toLowerCase()}`,children:e.band})]}),(0,N.jsx)(`div`,{className:`doc-tip__hint`,children:`click to spin`})]})})]})}var Y=new S,Ne=new a,Pe=new c,Fe=new a;function Ie({count:e=10}){let n=De.slice(0,e),r=(0,M.useRef)([]),[i,o]=(0,M.useState)(-1),[s,c]=(0,M.useState)(null),l=(0,M.useRef)(0),u=(0,M.useRef)(),d=e=>{L.hoveredDoc=e,o(e)};(0,M.useEffect)(()=>{let e=!0;return document.fonts.ready.then(()=>{e&&c(n.map((e,t)=>je(e,t)))}),()=>{e=!1}},[e]),(0,M.useEffect)(()=>()=>s?.forEach(e=>e.dispose()),[s]);let f=(0,M.useMemo)(()=>{let e=L.isMobile?1:1.42;return n.map((t,r)=>{let i=r-(n.length-1)/2;return{row:new a(i*e,Math.sin(r*1.3)*.12,1.5-Math.abs(i)*.16)}})},[e]);return k((e,a)=>{let o=B(`scan`),s=z(R(o,.02,.3)),c=R(o,.32,.72),d=z(R(o,.8,.98)),p=z(R(B(`privacy`),.05,.45)),m=(n.length-1)/2*(L.isMobile?1:1.42)+1,h=t.lerp(-m,m,c);L.drag.velocity*=.04**a,l.current+=a*(L.reducedMotion?.02:.07)+L.drag.velocity*a;let g=t.lerp(L.isMobile?3:3.75,2.75,d>.99?p:0),_=e.clock.elapsedTime;if(u.current){let e=+(c>0&&c<1);u.current.position.x=h,y.damp(u.current.material,`opacity`,e*.9,.12,a),u.current.visible=u.current.material.opacity>.01}n.forEach((e,o)=>{let u=r.current[o];if(!u?.group)return;let m=o/n.length*Math.PI*2+l.current,v=Ne.set(Math.cos(m)*g,Math.sin(o*2.1+_*.6)*.75,Math.sin(m)*g*.8),b=v.clone().lerp(f[o].row,s);b.lerp(Fe,d),d>.99&&p>0&&b.copy(v).multiplyScalar(p);let x=+(i===o);u.interactive=s<.05&&d<.05||p>.9,x&&b.add(v.clone().normalize().multiplyScalar(.35)),Y.position.copy(b),Y.lookAt(b.x*.35,b.y*.35,14),Pe.copy(Y.quaternion),s>0&&(Y.lookAt(b.x,b.y,20),Pe.slerp(Y.quaternion,s)),y.damp3(u.group.position,b,x?.12:.08,a),y.dampQ(u.group.quaternion,Pe,.12,a);let S=(u.spin||0)+d*Math.PI*3;u.spinNow=u.spinNow??0,u.spinNow=t.damp(u.spinNow,S,4,a),u.inner.rotation.set(Math.sin(_*.7+o)*.05,u.spinNow,Math.cos(_*.5+o)*.04);let C=d<.995||p>.01&&B(`cta`)<.36,ee=1-z(R(B(`cta`),0,.35)),w=(L.isMobile?.72:1)*(d>.99?p*ee*.72:1-d*.95)*(1+x*.07);u.group.visible=C,u.group.scale.setScalar(Math.max(1e-4,w));let te=u.group.position.x,ne=Math.max(R(h,te-.7,te+.5)*+(c>0),d>.99?p:0,+(s>.99&&c>=1));u.redact.current.forEach((e,n)=>{if(!e)return;let r=Math.max(1e-4,R(ne,n*.15,.6+n*.15));e.scale.x=t.damp(e.scale.x,r,10,a),e.position.x=e.geometry.parameters.width*e.scale.x/2})})}),s?(0,N.jsxs)(`group`,{children:[n.map((e,t)=>(0,N.jsx)(Me,{c:e,i:t,texture:s[t],refs:r,hovered:i,setHovered:d},t)),(0,N.jsxs)(`mesh`,{ref:u,position:[0,0,1.65],visible:!1,children:[(0,N.jsx)(`planeGeometry`,{args:[.06,2.6]}),(0,N.jsx)(`meshBasicMaterial`,{color:W.cyan,transparent:!0,opacity:0,toneMapped:!1})]})]}):null}var Le=`
uniform float uTime; uniform float uFlow; uniform float uSize; uniform float uPulse;
attribute vec3 aStart; attribute vec3 aCtrl; attribute float aSeed; attribute float aSpeed;
varying float vT; varying float vAlpha;
vec3 bezier(vec3 a, vec3 b, vec3 c, float t){ float u = 1.0 - t; return u*u*a + 2.0*u*t*b + t*t*c; }
void main(){
  float t = fract(uTime * aSpeed + aSeed);
  vec3 p = bezier(aStart, aCtrl, vec3(0.0), t);
  // swirl around the core as particles get closer
  float ang = t * t * 2.4;
  p.xz = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p.xz;
  p += normalize(p + 0.0001) * uPulse * 1.5 * (1.0 - t);
  vT = t;
  vAlpha = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(0.82, 1.0, t)) * uFlow;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.45 + 0.9 * (1.0 - t)) * (1.0 / -mv.z);
}`,Re=`
uniform vec3 uA; uniform vec3 uB;
varying float vT; varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a = a * a;
  vec3 col = mix(uA, uB, vT) * 2.2;
  gl_FragColor = vec4(col, a * vAlpha);
  gl_FragColor = (any(isnan(gl_FragColor)) || any(isinf(gl_FragColor))) ? vec4(0.0) : clamp(gl_FragColor, 0.0, 6.0); // additive: keep the sum of overlapping points finite
}`;function ze({count:e=4e3}){let i=(0,M.useRef)(),o=(0,M.useMemo)(()=>{let t=new O,r=new Float32Array(e*3),i=new Float32Array(e*3),o=new Float32Array(e),s=new Float32Array(e);for(let t=0;t<e;t++){let e=Math.random()*Math.PI*2,n=3.2+Math.random()*2.2,a=(Math.random()-.5)*2.4;r.set([Math.cos(e)*n,a,Math.sin(e)*n*.8],t*3);let c=e+.9+Math.random()*.6,l=n*.55;i.set([Math.cos(c)*l,a*.4+(Math.random()-.5),Math.sin(c)*l],t*3),o[t]=Math.random(),s[t]=.08+Math.random()*.12}return t.setAttribute(`position`,new n(new Float32Array(e*3),3)),t.setAttribute(`aStart`,new n(r,3)),t.setAttribute(`aCtrl`,new n(i,3)),t.setAttribute(`aSeed`,new n(o,1)),t.setAttribute(`aSpeed`,new n(s,1)),t.boundingSphere=new u(new a,7),t},[e]),s=(0,M.useMemo)(()=>({uTime:{value:0},uFlow:{value:1},uPulse:{value:0},uSize:{value:70},uA:{value:new r(W.blue)},uB:{value:new r(W.cyan)}}),[]);return k((e,n)=>{let r=i.current?.uniforms;if(!r)return;let a=B(`scan`),o=R(a,.75,.95)*(1-R(a,.97,1)),s=1-z(R(a,.98,1))*(1-R(B(`privacy`),.1,.4));r.uTime.value+=n*(1+o*3)*(L.reducedMotion?.3:1),r.uFlow.value=t.damp(r.uFlow.value,(.55+o*.45)*s,4,n),r.uPulse.value=L.pulse,r.uSize.value=L.isMobile?55:70}),(0,N.jsx)(`points`,{geometry:o,frustumCulled:!1,children:(0,N.jsx)(`shaderMaterial`,{ref:i,vertexShader:Le,fragmentShader:Re,uniforms:s,transparent:!0,depthWrite:!1,blending:2,toneMapped:!1})})}var Be=[0,0,-18],X=[{label:`HR & People`,color:W.mint,center:[-2.6,.9,.6]},{label:`Data & Analytics`,color:W.cyan,center:[2.7,1.4,-.8]},{label:`Engineering`,color:W.blue,center:[.6,-1.9,1.8]},{label:`Quality`,color:W.violet,center:[2.4,-1.2,-2.6]},{label:`Finance`,color:W.amber,center:[-2.2,-1.4,-2.4]}],Ve=`
uniform float uTime; uniform float uMorph; uniform float uSize; uniform float uReveal;
attribute vec3 aCluster; attribute vec3 aColor; attribute float aSeed;
varying vec3 vColor; varying float vAlpha;
void main(){
  float m = smoothstep(0.0, 1.0, clamp(uMorph * 1.25 - aSeed * 0.25, 0.0, 1.0));
  vec3 p = mix(position, aCluster, m);
  p += 0.06 * vec3(sin(uTime*0.7 + aSeed*40.0), cos(uTime*0.6 + aSeed*30.0), sin(uTime*0.5 + aSeed*20.0));
  vColor = mix(vec3(0.55, 0.65, 0.85), aColor, m);
  float tw = 0.65 + 0.35 * sin(uTime * 2.0 + aSeed * 60.0);
  vAlpha = uReveal * tw;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.6 + aSeed * 0.8) / -mv.z;
}`,He=`
varying vec3 vColor; varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float core = smoothstep(0.5, 0.0, d);
  float a = core * core;
  gl_FragColor = vec4(vColor * (1.4 + core * 1.6), a * vAlpha);
  gl_FragColor = (any(isnan(gl_FragColor)) || any(isinf(gl_FragColor))) ? vec4(0.0) : clamp(gl_FragColor, 0.0, 6.0); // additive: keep the sum of overlapping points finite
}`;function Ue(){let e=1-Math.random(),t=Math.random();return Math.sqrt(-2*Math.log(e))*Math.cos(2*Math.PI*t)}function We({count:e=2600}){let i=(0,M.useRef)(),o=(0,M.useRef)([]),s=(0,M.useRef)([]),c=(0,M.useRef)(),l=(0,M.useRef)(),{geometry:d,jd:f,matches:m}=(0,M.useMemo)(()=>{let t=new O,i=new Float32Array(e*3),o=new Float32Array(e*3),s=new Float32Array(e*3),c=new Float32Array(e),l=new r,d=[];for(let t=0;t<e;t++){let e=8*Math.cbrt(Math.random()),n=Math.random()*Math.PI*2,r=Math.acos(2*Math.random()-1);i.set([e*Math.sin(r)*Math.cos(n),e*Math.cos(r)*.7,e*Math.sin(r)*Math.sin(n)],t*3);let a=t%X.length,u=X[a].center,f=.62,p=[u[0]+Ue()*f,u[1]+Ue()*f*.8,u[2]+Ue()*f];o.set(p,t*3),l.set(X[a].color),s.set([l.r,l.g,l.b],t*3),c[t]=Math.random(),a===0&&d.push(p)}t.setAttribute(`position`,new n(i,3)),t.setAttribute(`aCluster`,new n(o,3)),t.setAttribute(`aColor`,new n(s,3)),t.setAttribute(`aSeed`,new n(c,1)),t.boundingSphere=new u(new a,10);let f=new a(...X[0].center).add(new a(.35,.25,.3));return{geometry:t,jd:f,matches:d.map(e=>new a(...e)).sort((e,t)=>e.distanceTo(f)-t.distanceTo(f)).slice(3,9)}},[e]),h=(0,M.useMemo)(()=>({uTime:{value:0},uMorph:{value:0},uSize:{value:110},uReveal:{value:0}}),[]);return k((e,n)=>{let r=V(`embed`,1.2)||V(`privacy`,.6)||V(`results`,1)||V(`cta`,1);if(i.current.visible=r,!r)return;let a=B(`embed`),u=z(R(a,.05,.55)),d=z(R(a,.5,.75)),f=l.current.uniforms;if(f.uTime.value+=n,f.uMorph.value=u,f.uReveal.value=t.damp(f.uReveal.value,1,2,n),f.uSize.value=L.isMobile?80:110,i.current.rotation.y+=n*(L.reducedMotion?.01:.04),o.current.forEach((e,t)=>{if(!e)return;let r=R(d,t*.08,.5+t*.08);e.material.opacity=r*.9,e.material.dashOffset-=n*.6,e.visible=r>.01}),c.current){let t=1+Math.sin(e.clock.elapsedTime*3)*.15;c.current.scale.setScalar((.12+d*.06)*t*(.3+u*.7))}s.current.forEach(e=>{e&&(e.style.opacity=String(R(a,.45,.6)*(1-R(a,.92,1))))})}),(0,N.jsxs)(`group`,{ref:i,position:Be,children:[(0,N.jsx)(`points`,{geometry:d,frustumCulled:!1,children:(0,N.jsx)(`shaderMaterial`,{ref:l,vertexShader:Ve,fragmentShader:He,uniforms:h,transparent:!0,depthWrite:!1,blending:2,toneMapped:!1})}),(0,N.jsxs)(`mesh`,{ref:c,position:f,children:[(0,N.jsx)(`icosahedronGeometry`,{args:[1,3]}),(0,N.jsx)(`meshBasicMaterial`,{color:`#ffffff`,toneMapped:!1})]}),(0,N.jsx)(`pointLight`,{position:f,color:W.mint,intensity:6,distance:4}),m.map((e,t)=>(0,N.jsx)(b,{ref:e=>o.current[t]=e,points:[f,e],color:W.mint,lineWidth:1.6,dashed:!0,dashSize:.12,gapSize:.08,transparent:!0,opacity:0,toneMapped:!1},t)),!L.isMobile&&X.map((e,t)=>(0,N.jsx)(p,{position:[e.center[0],e.center[1]+1.25,e.center[2]],center:!0,zIndexRange:[10,0],children:(0,N.jsxs)(`div`,{ref:e=>s.current[t]=e,className:`cluster-label`,style:{opacity:0},children:[(0,N.jsx)(`span`,{style:{background:e.color}}),e.label]})},e.label))]})}var Ge=[0,0,-36],Ke={Shortlist:W.mint,Review:W.amber,Reject:W.coral},qe=[{id:`C04`,score:82,band:`Shortlist`},{id:`C11`,score:68,band:`Shortlist`},{id:`C17`,score:68,band:`Shortlist`},{id:`C02`,score:61,band:`Review`},{id:`C09`,score:52,band:`Review`},{id:`C13`,score:44,band:`Review`},{id:`C06`,score:33,band:`Reject`},{id:`C20`,score:21,band:`Reject`}],Je=4.6;function Ye({row:e,i:t,x:n,refs:r}){let i=Ke[e.band];return(0,N.jsxs)(`group`,{position:[n,0,Math.abs(t-3.5)*.25],ref:e=>r.current[t]={...r.current[t]||{},group:e},children:[(0,N.jsxs)(`mesh`,{castShadow:!0,receiveShadow:!0,ref:e=>r.current[t]={...r.current[t]||{},body:e},position:[0,.5,0],children:[(0,N.jsx)(`boxGeometry`,{args:[.72,1,.72]}),(0,N.jsx)(`meshPhysicalMaterial`,{color:`#0e1626`,metalness:.35,roughness:.18,clearcoat:1,clearcoatRoughness:.1,emissive:i,emissiveIntensity:.06}),(0,N.jsx)(ee,{threshold:15,color:i,toneMapped:!1})]}),(0,N.jsxs)(`mesh`,{ref:e=>r.current[t]={...r.current[t]||{},cap:e},"rotation-x":-Math.PI/2,children:[(0,N.jsx)(`planeGeometry`,{args:[.7,.7]}),(0,N.jsx)(`meshBasicMaterial`,{color:i,toneMapped:!1,transparent:!0,opacity:.9})]}),(0,N.jsx)(`group`,{ref:e=>r.current[t]={...r.current[t]||{},label:e},visible:!L.isMobile,children:!L.isMobile&&(0,N.jsx)(p,{center:!0,zIndexRange:[10,0],children:(0,N.jsxs)(`div`,{className:`tower-label`,style:{opacity:0},ref:e=>r.current[t]={...r.current[t]||{},labelEl:e},children:[(0,N.jsx)(`b`,{children:e.score}),(0,N.jsx)(`span`,{children:e.id})]})})})]})}function Xe({highQuality:e}){let t=(0,M.useRef)(),n=(0,M.useRef)([]),r=(0,M.useRef)(),i=(0,M.useRef)([]);return(0,M.useEffect)(()=>{i.current.forEach(e=>e&&(e.target=r.current))},[]),k((e,r)=>{let i=L.sections.rank,a=(i?L.scrollY+L.vh*.9>i.top:!1)&&(V(`rank`,.6)||V(`results`,1.1)||V(`cta`,1));if(t.current.visible=a,!a){n.current.forEach(e=>e?.labelEl&&(e.labelEl.style.opacity=`0`));return}let o=Math.max(B(`rank`),+(B(`results`)>0));qe.forEach((e,t)=>{let r=n.current[t];if(!r?.body)return;let i=he(R(o,.12+t*.045,.45+t*.045)),a=Math.max(.02,e.score/100*Je*i);r.body.scale.y=a,r.body.position.y=a/2,r.cap.position.y=a+.002,r.label&&(r.label.position.y=a+.45),r.labelEl&&(r.labelEl.style.opacity=String(R(i,.6,1)*(1-R(B(`cta`),0,.2))))})}),(0,N.jsxs)(`group`,{ref:t,position:Ge,children:[qe.map((e,t)=>(0,N.jsx)(Ye,{row:e,i:t,x:(t-(qe.length-1)/2)*1.15,refs:n},e.id)),(0,N.jsxs)(`mesh`,{"rotation-x":-Math.PI/2,receiveShadow:!0,position:[0,0,0],children:[(0,N.jsx)(`planeGeometry`,{args:[22,22]}),e?(0,N.jsx)(ne,{blur:[400,120],resolution:1024,mixBlur:1,mixStrength:28,roughness:.9,depthScale:1.1,minDepthThreshold:.4,maxDepthThreshold:1.4,color:`#060a12`,metalness:.6,mirror:0}):(0,N.jsx)(`meshStandardMaterial`,{color:`#070b13`,roughness:.5,metalness:.5})]}),(0,N.jsx)(`gridHelper`,{args:[22,22,`#1b2a44`,`#0f1828`],position:[0,.003,0]}),(0,N.jsx)(`object3D`,{ref:r,position:[0,1,0]}),(0,N.jsx)(`directionalLight`,{ref:e=>i.current[0]=e,position:[6,11,7],intensity:2.2,castShadow:!0,"shadow-mapSize":[2048,2048],"shadow-camera-left":-8,"shadow-camera-right":8,"shadow-camera-top":8,"shadow-camera-bottom":-8,"shadow-camera-near":1,"shadow-camera-far":30,"shadow-bias":-4e-4,"shadow-normalBias":.02}),(0,N.jsx)(`spotLight`,{ref:e=>i.current[1]=e,position:[-7,6,-4],angle:.5,penumbra:1,intensity:60,color:W.violet}),(0,N.jsx)(`spotLight`,{ref:e=>i.current[2]=e,position:[7,5,3],angle:.6,penumbra:1,intensity:40,color:W.cyan})]})}function Ze({high:e}){let t=(0,M.useRef)();return k(()=>{t.current.visible=V(`hero`,2.5)||V(`scan`,1)||V(`privacy`,1.2)||V(`cta`,1.5)}),(0,N.jsxs)(`group`,{ref:t,children:[(0,N.jsx)(Ee,{highQuality:e}),(0,N.jsx)(Ie,{count:L.isMobile?7:10}),(0,N.jsx)(ze,{count:e?4200:1800}),(0,N.jsx)(C,{position:[0,-2.6,0],opacity:.55,scale:16,blur:2.6,far:5,resolution:512,color:`#000814`,frames:1/0}),(0,N.jsx)(`spotLight`,{position:[5,7,7],angle:.45,penumbra:1,intensity:120,color:`#ffffff`,castShadow:!0,"shadow-mapSize":[1024,1024],"shadow-bias":-3e-4}),(0,N.jsx)(`spotLight`,{position:[-7,-2,-4],angle:.6,penumbra:1,intensity:70,color:W.violet}),(0,N.jsx)(`pointLight`,{position:[-4,3,4],intensity:8,color:W.blue})]})}d.dithering_fragment.includes(`isnan`)||(d.dithering_fragment+=`
gl_FragColor = (any(isnan(gl_FragColor)) || any(isinf(gl_FragColor))) ? vec4(0.0, 0.0, 0.0, 1.0) : clamp(gl_FragColor, 0.0, 64.0);`);var Qe=typeof location<`u`?new URLSearchParams(location.search):new URLSearchParams,$e=Qe.has(`record`),Z=Qe.get(`fx`);function et({onReady:e}){let[t,n]=(0,M.useState)(!L.isMobile),{gl:r}=h(),i=(0,M.useRef)(0);return k(()=>{i.current<4&&++i.current===4&&e?.()}),(0,N.jsxs)(N.Fragment,{children:[!$e&&(0,N.jsx)(T,{onDecline:()=>{n(!1),L.quality=`low`,r.setPixelRatio(Math.min(window.devicePixelRatio,1.1))},onIncline:()=>{L.isMobile||(n(!0),L.quality=`high`,r.setPixelRatio(Math.min(window.devicePixelRatio,1.75)))},flipflops:3}),(0,N.jsx)(`color`,{attach:`background`,args:[W.bg]}),(0,N.jsx)(`fog`,{attach:`fog`,args:[W.bg,16,48]}),(0,N.jsx)(`ambientLight`,{intensity:.25}),(0,N.jsx)(`hemisphereLight`,{args:[`#9fc4ff`,`#0a0f1c`,.35]}),(0,N.jsxs)(ie,{resolution:256,frames:1,children:[(0,N.jsx)(g,{form:`rect`,intensity:3,position:[0,5,-9],scale:[10,4,1],color:`#ffffff`}),(0,N.jsx)(g,{form:`rect`,intensity:2,position:[-6,1,-1],"rotation-y":Math.PI/2,scale:[20,2,1],color:W.cyan}),(0,N.jsx)(g,{form:`rect`,intensity:2,position:[6,1,1],"rotation-y":-Math.PI/2,scale:[20,2,1],color:W.violet}),(0,N.jsx)(g,{form:`ring`,intensity:4,position:[0,6,6],scale:3,color:`#ffffff`})]}),(0,N.jsx)(be,{}),(0,N.jsx)(Ze,{high:t}),(0,N.jsx)(We,{count:t?2600:1200}),(0,N.jsx)(Xe,{highQuality:t}),(0,N.jsx)(pe,{count:t?260:100,color:W.cyan}),Z!==`off`&&(0,N.jsxs)(w,{multisampling:0,enableNormalPass:!1,frameBufferType:Qe.get(`fb`)===`float`?1015:1016,children:[(!Z||Z.includes(`bloom`))&&(0,N.jsx)(E,{mipmapBlur:!Qe.has(`nomip`),intensity:t?.85:.6,luminanceThreshold:.82,luminanceSmoothing:.2,radius:.75}),(!Z||Z.includes(`vignette`))&&(0,N.jsx)(m,{offset:.25,darkness:.75}),(!Z||Z.includes(`noise`))&&(0,N.jsx)(re,{opacity:.035,premultiply:!0}),(0,N.jsx)(x,{mode:te.ACES_FILMIC})]})]})}var tt=[{s:`met`,req:`Manage end-to-end recruitment`,ev:`Managed recruitment for machine operators and staff roles`},{s:`met`,req:`Labour law compliance (EPF, ETF, gratuity)`,ev:`Ensured compliance with the Shop and Office Act, EPF and ETF`},{s:`partial`,req:`3+ years of HR experience`,ev:`HR Executive, apparel manufacturing (2024 – present)`},{s:`missing`,req:`CIPM qualification`,ev:null,nice:!0}],nt=[[`Requirements`,35],[`Skills`,25],[`Meaning match`,15],[`Keyword match`,10],[`Experience`,10],[`Education`,5]],rt=[{v:.97,d:3,label:`NDCG@5`,note:`best CVs at the top`},{v:1,d:2,label:`Precision@3`,note:`top 3 all relevant`},{v:.992,d:3,label:`AUC`,note:`relevant vs. not relevant`},{v:100,d:0,suffix:`%`,label:`Shortlist precision`,note:`every shortlisted CV was a fit`}],it={met:`✓`,partial:`~`,missing:`✕`};function Q({n:e,children:t}){return(0,N.jsxs)(`div`,{className:`eyebrow`,children:[e&&(0,N.jsx)(`span`,{className:`eyebrow__n`,children:e}),t]})}function at({children:e}){return(0,N.jsx)(`span`,{className:`line-mask`,children:(0,N.jsx)(`span`,{"data-intro":!0,children:e})})}function ot({onExternal:e,onTry:t}){let n=(0,M.useRef)();return(0,M.useEffect)(()=>{let e=A.context(()=>{A.utils.toArray(`[data-stage]`).forEach(e=>{let t=e.querySelectorAll(`[data-in]`);if(!t.length)return;let n=A.timeline({scrollTrigger:{trigger:e,start:`top top`,end:`bottom bottom`,scrub:.6}});n.set({},{},1),t.forEach(e=>{let t=parseFloat(e.dataset.in),r=e.dataset.out?parseFloat(e.dataset.out):null;n.fromTo(e,{autoAlpha:0,y:90,rotateX:18,scale:.96},{autoAlpha:1,y:0,rotateX:0,scale:1,duration:.12,ease:`power2.out`},t),r!=null&&n.to(e,{autoAlpha:0,y:-70,rotateX:-12,scale:.97,duration:.1,ease:`power2.in`},r),e.querySelectorAll(`[data-bar]`).forEach((e,r)=>{n.fromTo(e,{scaleX:0},{scaleX:1,duration:.12,ease:`power3.out`},t+.04+r*.015)}),e.querySelectorAll(`[data-req]`).forEach((e,r)=>{n.fromTo(e,{autoAlpha:0,x:-24},{autoAlpha:1,x:0,duration:.06},t+.05+r*.03)})})}),A.utils.toArray(`[data-count]`).forEach(e=>{let t=parseFloat(e.dataset.count),n=parseInt(e.dataset.dec||`0`,10),r=e.dataset.suffix||``,i={v:0};j.create({trigger:e,start:`top 85%`,onEnter:()=>A.to(i,{v:t,duration:1.8,ease:`expo.out`,onUpdate:()=>e.textContent=i.v.toFixed(n)+r}),onLeaveBack:()=>{i.v=0,e.textContent=0 .toFixed(n)+r}})}),A.utils.toArray(`[data-reveal]`).forEach(e=>{A.fromTo(e,{autoAlpha:0,y:70,rotateX:14},{autoAlpha:1,y:0,rotateX:0,duration:1.2,ease:`expo.out`,scrollTrigger:{trigger:e,start:`top 88%`,toggleActions:`play none none reverse`}})}),A.to(`.hero__inner`,{yPercent:-30,autoAlpha:0,ease:`none`,scrollTrigger:{trigger:`.hero`,start:`top top`,end:`bottom 30%`,scrub:!0}})},n);return()=>e.revert()},[]),(0,N.jsxs)(`div`,{ref:n,children:[(0,N.jsxs)(`section`,{className:`hero`,"data-stage":`hero`,id:`top`,children:[(0,N.jsxs)(`div`,{className:`hero__inner`,children:[(0,N.jsx)(`div`,{"data-intro-wrap":!0,className:`line-mask`,children:(0,N.jsx)(`span`,{"data-intro":!0,children:(0,N.jsx)(Q,{children:`Open-source NLP · Explainable · Blind by default`})})}),(0,N.jsxs)(`h1`,{className:`display`,children:[(0,N.jsx)(at,{children:`Read every CV`}),(0,N.jsxs)(at,{children:[`like your `,(0,N.jsx)(`em`,{children:`best`})]}),(0,N.jsx)(at,{children:`recruiter would.`})]}),(0,N.jsx)(`div`,{className:`line-mask`,children:(0,N.jsx)(`p`,{"data-intro":!0,className:`lead`,children:`An AI screening engine that matches CVs to a job description requirement by requirement, and shows the evidence behind every score.`})}),(0,N.jsx)(`div`,{className:`line-mask`,children:(0,N.jsxs)(`div`,{"data-intro":!0,className:`hero__ctas`,children:[(0,N.jsxs)(`button`,{className:`btn btn--primary`,onClick:t,children:[`Try it with your CVs `,(0,N.jsx)(`span`,{children:`→`})]}),(0,N.jsx)(`button`,{className:`btn btn--ghost glass`,onClick:()=>e(U.github,{newTab:!0}),children:`View source`})]})})]}),(0,N.jsxs)(`div`,{className:`hero__hint`,children:[(0,N.jsx)(`span`,{children:`Drag to spin · Hover a CV · Click the core`}),(0,N.jsx)(`i`,{className:`scroll-cue`})]})]}),(0,N.jsx)(`section`,{className:`stage stage--scan`,"data-stage":`scan`,id:`how`,children:(0,N.jsxs)(`div`,{className:`sticky`,children:[(0,N.jsxs)(`article`,{className:`card glass card--left`,"data-in":`0.02`,"data-out":`0.5`,children:[(0,N.jsx)(Q,{n:`01`,children:`Blind by default`}),(0,N.jsx)(`h2`,{children:`Personal details vanish before scoring begins.`}),(0,N.jsx)(`p`,{children:`Names, photos, contact details, NIC numbers, age, gender and marital status are masked first. The score can only see skills and experience.`}),(0,N.jsx)(`div`,{className:`chips`,children:[`Name`,`Photo`,`Email`,`Phone`,`NIC`,`Age`,`Gender`].map(e=>(0,N.jsx)(`span`,{className:`chip chip--redact`,children:e},e))})]}),(0,N.jsxs)(`article`,{className:`card glass card--right`,"data-in":`0.58`,"data-out":`0.93`,children:[(0,N.jsx)(Q,{n:`02`,children:`Structure, not text`}),(0,N.jsx)(`h2`,{children:`Every CV becomes evidence.`}),(0,N.jsx)(`p`,{children:`Each CV is split into sections and sentences. Years of experience come from real date ranges, with overlapping jobs merged. Education level is read, not guessed.`})]})]})}),(0,N.jsx)(`section`,{className:`stage stage--embed`,"data-stage":`embed`,children:(0,N.jsx)(`div`,{className:`sticky`,children:(0,N.jsxs)(`article`,{className:`card glass card--left`,"data-in":`0.06`,"data-out":`0.9`,children:[(0,N.jsx)(Q,{n:`03`,children:`Meaning, not keywords`}),(0,N.jsx)(`h2`,{children:`Every sentence becomes a point in 384-dimensional space.`}),(0,N.jsxs)(`p`,{children:[`A sentence-embedding model (`,(0,N.jsx)(`code`,{children:`all-MiniLM-L6-v2`}),`) places similar ideas close together. `,(0,N.jsx)(`q`,{children:`Talent acquisition`}),` lands next to `,(0,N.jsx)(`q`,{children:`recruitment`}),`, though they share no words.`]}),(0,N.jsxs)(`div`,{className:`note`,children:[(0,N.jsx)(`span`,{className:`dot dot--mint`}),` The job description (bright star) links to its nearest CVs`]})]})})}),(0,N.jsx)(`section`,{className:`stage stage--rank`,"data-stage":`rank`,id:`explain`,children:(0,N.jsxs)(`div`,{className:`sticky`,children:[(0,N.jsxs)(`article`,{className:`card glass card--left card--wide`,"data-in":`0.04`,"data-out":`0.94`,children:[(0,N.jsx)(Q,{n:`04`,children:`Ranked, with reasons`}),(0,N.jsx)(`h2`,{children:`A fit score you can defend.`}),(0,N.jsxs)(`div`,{className:`reqs`,children:[(0,N.jsxs)(`div`,{className:`reqs__head`,children:[`Requirement checklist · `,(0,N.jsx)(`b`,{children:`Candidate C04`}),` `,(0,N.jsx)(`span`,{className:`badge badge--shortlist`,children:`Shortlist · 82`})]}),tt.map(e=>(0,N.jsxs)(`div`,{className:`req req--${e.s}`,"data-req":!0,children:[(0,N.jsx)(`span`,{className:`req__mark`,children:it[e.s]}),(0,N.jsxs)(`div`,{children:[(0,N.jsxs)(`div`,{className:`req__text`,children:[e.req,e.nice&&(0,N.jsx)(`em`,{children:` nice-to-have`})]}),e.ev&&(0,N.jsxs)(`div`,{className:`req__ev`,children:[`“`,e.ev,`”`]})]})]},e.req))]})]}),(0,N.jsxs)(`article`,{className:`card glass card--right card--narrow`,"data-in":`0.3`,"data-out":`0.94`,children:[(0,N.jsx)(Q,{children:`Six signals`}),nt.map(([e,t])=>(0,N.jsxs)(`div`,{className:`signal`,children:[(0,N.jsxs)(`div`,{className:`signal__row`,children:[(0,N.jsx)(`span`,{children:e}),(0,N.jsxs)(`b`,{children:[t,`%`]})]}),(0,N.jsx)(`div`,{className:`signal__track`,children:(0,N.jsx)(`i`,{"data-bar":!0,style:{width:`${t/35*100}%`}})})]},e))]})]})}),(0,N.jsx)(`section`,{className:`stage stage--results`,"data-stage":`results`,id:`results`,children:(0,N.jsxs)(`div`,{className:`results`,children:[(0,N.jsxs)(`div`,{"data-reveal":!0,children:[(0,N.jsx)(Q,{n:`05`,children:`Measured, not claimed`}),(0,N.jsx)(`h2`,{className:`h2-xl`,children:`Tested on 80 labelled CV–job pairs.`})]}),(0,N.jsx)(`div`,{className:`stats`,children:rt.map(e=>(0,N.jsxs)(`div`,{className:`stat glass`,"data-reveal":!0,children:[(0,N.jsx)(`div`,{className:`stat__v`,"data-count":e.v,"data-dec":e.d,"data-suffix":e.suffix||``,children:`0`}),(0,N.jsx)(`div`,{className:`stat__l`,children:e.label}),(0,N.jsx)(`div`,{className:`stat__n`,children:e.note})]},e.label))}),(0,N.jsx)(`p`,{className:`fine`,"data-reveal":!0,children:`vs. the previous keyword hybrid: NDCG@5 0.954 → 0.970, AUC 0.980 → 0.992. Includes hard cases: a keyword-stuffed CV, synonym-only CVs and an overqualified manager. A small, self-built test set: a sanity check, not a guarantee.`})]})}),(0,N.jsx)(`section`,{className:`stage stage--privacy`,"data-stage":`privacy`,id:`privacy`,children:(0,N.jsxs)(`div`,{className:`privacy`,children:[(0,N.jsxs)(`div`,{"data-reveal":!0,children:[(0,N.jsx)(Q,{n:`06`,children:`Responsible by design`}),(0,N.jsx)(`h2`,{className:`h2-xl`,children:`Built for fair hiring.`})]}),(0,N.jsx)(`div`,{className:`pillars`,children:[[`A person decides`,`The tool ranks and explains. Every hiring decision stays with a human reviewer.`],[`Nothing is stored`,`CVs are read in memory and the model runs locally. Candidate data never leaves the machine.`],[`Bias-aware`,`Blind screening, candidate codes for panels, and flags for gaps. Follows data-protection law such as Sri Lanka’s PDPA.`]].map(([e,t],n)=>(0,N.jsxs)(`div`,{className:`pillar glass`,"data-reveal":!0,children:[(0,N.jsxs)(`span`,{className:`pillar__n`,children:[`0`,n+1]}),(0,N.jsx)(`h3`,{children:e}),(0,N.jsx)(`p`,{children:t})]},e))})]})}),(0,N.jsxs)(`section`,{className:`stage stage--cta`,"data-stage":`cta`,children:[(0,N.jsxs)(`div`,{className:`cta`,children:[(0,N.jsxs)(`h2`,{className:`display display--cta`,"data-reveal":!0,children:[`Screen your CVs`,(0,N.jsx)(`br`,{}),`right here.`]}),(0,N.jsx)(`p`,{className:`lead cta__lead`,"data-reveal":!0,children:`Paste a job description, drop in CVs, get a ranked shortlist with evidence. It all runs in your browser, so no CV is ever uploaded.`}),(0,N.jsxs)(`div`,{className:`hero__ctas`,"data-reveal":!0,children:[(0,N.jsxs)(`button`,{className:`btn btn--primary`,onClick:t,children:[`Try it now `,(0,N.jsx)(`span`,{children:`→`})]}),(0,N.jsx)(`button`,{className:`btn btn--ghost glass`,onClick:()=>e(U.demo,{newTab:!0}),children:`Python app`}),(0,N.jsx)(`button`,{className:`btn btn--ghost glass`,onClick:()=>e(U.github,{newTab:!0}),children:`GitHub`}),(0,N.jsx)(`button`,{className:`btn btn--ghost glass`,onClick:()=>e(U.linkedin,{newTab:!0}),children:`LinkedIn`})]}),(0,N.jsx)(`div`,{className:`stack`,"data-reveal":!0,children:[`Python`,`scikit-learn`,`Sentence embeddings`,`fastembed`,`Streamlit`,`Three.js`,`React Three Fiber`,`GSAP`].map(e=>(0,N.jsx)(`span`,{children:e},e))})]}),(0,N.jsxs)(`footer`,{className:`footer glass`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`b`,{children:`Thivanka Chathuranga`}),(0,N.jsx)(`span`,{children:`BSc (Hons) Data Science`})]}),(0,N.jsx)(`span`,{children:`© 2026 Thivanka Chathuranga · MIT licence`})]})]})]})}A.registerPlugin(j);function st(){(0,M.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;L.reducedMotion=e;let t=new oe({lerp:e?1:.075,smoothWheel:!e,wheelMultiplier:.9,touchMultiplier:1.4});L.lenis=t,location.search.includes(`debug`)&&(window.__lenis=t),t.on(`scroll`,e=>{L.scrollY=e.animatedScroll,j.update()});let n=e=>t.raf(e*1e3);A.ticker.add(n),A.ticker.lagSmoothing(0);let r=()=>ge();return j.addEventListener(`refresh`,r),window.addEventListener(`resize`,r),ge(),requestAnimationFrame(()=>j.refresh()),()=>{A.ticker.remove(n),j.removeEventListener(`refresh`,r),window.removeEventListener(`resize`,r),t.destroy(),L.lenis=null}},[])}function ct(e,t={}){if(L.lenis)L.lenis.scrollTo(e,{duration:2.4,easing:e=>1-(1-e)**4,...t});else{let t=typeof e==`string`?document.querySelector(e):null;window.scrollTo({top:t?t.offsetTop:e,behavior:`smooth`})}}var lt=[[`#how`,`How it works`],[`#explain`,`Explainable`],[`#results`,`Results`],[`#privacy`,`Privacy`]];function ut({onNavigate:e,onTry:t}){let n=(0,M.useRef)(),[r,i]=(0,M.useState)(!1);(0,M.useEffect)(()=>{let e,t=()=>{n.current&&(n.current.style.transform=`scaleX(${L.scrollY/L.maxScroll})`),e=requestAnimationFrame(t)};return e=requestAnimationFrame(t),()=>cancelAnimationFrame(e)},[]);let a=(e,t)=>{e.preventDefault(),i(!1),ct(t,{offset:0})};return(0,N.jsxs)(`header`,{className:`nav glass ${r?`is-open`:``}`,children:[(0,N.jsxs)(`a`,{href:`#top`,className:`nav__brand`,onClick:e=>a(e,0),children:[`cv`,(0,N.jsx)(`span`,{children:`/`}),`nlp`]}),(0,N.jsx)(`nav`,{className:`nav__links`,children:lt.map(([e,t])=>(0,N.jsx)(`a`,{href:e,onClick:t=>a(t,e),children:t},e))}),(0,N.jsx)(`button`,{className:`btn btn--small btn--primary nav__cta`,onClick:t,children:`Try it`}),(0,N.jsxs)(`button`,{className:`nav__burger`,"aria-label":`Menu`,onClick:()=>i(e=>!e),children:[(0,N.jsx)(`i`,{}),(0,N.jsx)(`i`,{})]}),(0,N.jsx)(`div`,{className:`nav__progress`,ref:n})]})}function dt({ready:e,onEnter:t}){let[n,r]=(0,M.useState)(0),i=(0,M.useRef)(),a=(0,M.useRef)(!1);return(0,M.useEffect)(()=>{let t,n=()=>{r(t=>{let n=e?100:86;return Math.min(n,t+Math.max(.4,(n-t)*(e?.12:.03)))}),t=requestAnimationFrame(n)};return t=requestAnimationFrame(n),()=>cancelAnimationFrame(t)},[e]),(0,M.useEffect)(()=>{n<99.5||a.current||(a.current=!0,A.timeline({onComplete:()=>i.current&&(i.current.style.display=`none`)}).to(`.preloader__count, .preloader__brand, .preloader__bar`,{yPercent:-120,opacity:0,duration:.7,ease:`expo.in`,stagger:.05}).to(i.current,{clipPath:`inset(0 0 100% 0)`,duration:1.1,ease:`expo.inOut`},`-=0.2`).add(t,`-=0.6`))},[n,t]),(0,N.jsxs)(`div`,{className:`preloader`,ref:i,children:[(0,N.jsxs)(`div`,{className:`preloader__brand`,children:[`cv`,(0,N.jsx)(`span`,{children:`/`}),`nlp`]}),(0,N.jsx)(`div`,{className:`preloader__count`,children:Math.floor(n).toString().padStart(3,`0`)}),(0,N.jsx)(`div`,{className:`preloader__bar`,children:(0,N.jsx)(`i`,{style:{transform:`scaleX(${n/100})`}})})]})}function ft(){return(0,N.jsxs)(`div`,{className:`curtain`,"aria-hidden":`true`,children:[(0,N.jsx)(`div`,{className:`curtain__panel curtain__panel--a`}),(0,N.jsx)(`div`,{className:`curtain__panel curtain__panel--b`}),(0,N.jsx)(`div`,{className:`curtain__label`,children:`Opening…`})]})}function pt(e,{newTab:t=!1}={}){t?window.open(e,`_blank`,`noopener`):A.timeline({onComplete:()=>{window.location.href=e,setTimeout(()=>A.set(`.curtain__panel, .curtain__label`,{clearProps:`all`}),1500)}}).set(`.curtain`,{pointerEvents:`auto`}).fromTo(`.curtain__panel--a`,{yPercent:100},{yPercent:0,duration:.7,ease:`expo.inOut`}).fromTo(`.curtain__panel--b`,{yPercent:100},{yPercent:0,duration:.7,ease:`expo.inOut`},`-=0.55`).fromTo(`.curtain__label`,{opacity:0,y:20},{opacity:1,y:0,duration:.4},`-=0.3`)}var mt=`Nadeesha Perera
nadeesha.perera@example.com | +94 77 123 4567 | linkedin.com/in/nadeesha-example
Gender: Female

PROFILE
Data analyst with 3 years of experience in manufacturing analytics. She builds Power BI dashboards and automates reporting with Python.

EXPERIENCE
Data Analyst, ABC Electronics (2023 - present)
- Built Power BI dashboards for production yield, scrap and OTD used by plant management
- Wrote SQL queries on SQL Server ERP data; automated monthly reports with Python and pandas
- Used regression and hypothesis testing to identify drivers of solder defects

SKILLS
Python, pandas, SQL, Power BI, Excel (pivot tables), statistics, Git, scikit-learn

EDUCATION
BSc (Hons) Data Science
`,ht=`Kasun Fernando
kasun.f@example.com | 071 555 0101

SUMMARY
Business intelligence developer, 4 years. Experienced in Tableau, MySQL and ETL pipelines.

EXPERIENCE
BI Developer, Retail Group (2021 - present)
- Designed Tableau dashboards for sales and inventory
- Built ETL data pipelines in Airflow feeding a PostgreSQL warehouse
- Stakeholder communication with regional managers

SKILLS
SQL, PostgreSQL, Tableau, Excel, ETL, Airflow, basic Python
`,gt=`Ishara Jayasinghe
ishara.j@example.com

ABOUT
Recent graduate passionate about machine learning and NLP research.

PROJECTS
- Sentiment analysis of product reviews using transformers and PyTorch
- Image classification with deep learning (Keras)

SKILLS
Python, PyTorch, TensorFlow, NLP, deep learning, Git

EDUCATION
BSc Computer Science (2026)
`,_t=`Ruwan Silva
ruwan.silva@example.com | +94 76 222 3344
Date of birth: 12 March 1990

PROFILE
Accountant with 6 years of experience in financial reporting and budgeting.

EXPERIENCE
Senior Accountant, Trading Co.
- Month-end closing, management accounts and variance analysis in Excel
- Prepared budgets and cash flow forecasts

SKILLS
Excel, financial reporting, budgeting, QuickBooks
`,vt=`Dilini Wickramasinghe
dilini.w@example.com | 077 888 9900
Marital status: Married

PROFILE
HR professional with 5 years of experience in a garment manufacturing company with 2,000 employees.

EXPERIENCE
HR Executive, Apparel Manufacturing (2021 - present)
- Managed recruitment for machine operators and staff roles
- Conducted disciplinary inquiries and grievance handling; maintained good industrial relations
- Ensured compliance with labour law: Shop and Office Act, Wages Board, EPF, ETF, gratuity
- Prepared payroll inputs and maintained HRIS records
- Coordinated training needs analysis and annual performance appraisals
- Organised employee engagement and welfare events

QUALIFICATIONS
BSc HRM; CIPM Professional Qualification
`,yt=`Tharindu Bandara
tharindu.b@example.com

SUMMARY
Talent acquisition specialist, 4 years, at an IT services firm.

EXPERIENCE
Talent Acquisition Specialist, Tech Services (2022 - present)
- Owned the hiring pipeline for software engineers: sourcing candidates, screening and offers
- Partnered with hiring managers; improved time-to-hire by 20%
- Ran onboarding and new-joiner engagement surveys

SKILLS
Talent acquisition, LinkedIn Recruiter, onboarding, stakeholder management, communication
`,bt=`Sachini Rathnayake
sachini.r@example.com | 070 333 1122

PROFILE
Payroll officer with 3 years of experience.

EXPERIENCE
Payroll Officer, Logistics Company
- Salary processing for 600 employees, EPF and ETF returns
- Maintained attendance and leave records
- Answered employee queries on pay

SKILLS
Payroll, Excel, EPF/ETF, attention to detail
`,xt=`Amila Gunawardena
amila.g@example.com | +94 71 444 5566

PROFILE
Process engineer with 5 years of experience in electronics manufacturing (EMS).

EXPERIENCE
Process Engineer, EMS Company (2021 - present)
- Responsible for SMT lines: pick and place programming, reflow oven profiling, stencil design
- Improved first pass yield by 6% on PCBA lines through kaizen and six sigma projects
- Led 8D and FMEA for customer complaints; root cause analysis with fishbone diagrams
- Maintained work instructions per ISO 9001 and IPC-A-610; audited ESD control
- Supervised a team of 8 technicians

SKILLS
SMT, PCB assembly, lean, six sigma, FMEA, IPC-A-610, ESD, AutoCAD

EDUCATION
BSc Electronic Engineering
`,St=`Harsha Senanayake
harsha.s@example.com

PROFILE
Production supervisor, 7 years, in a food processing plant.

EXPERIENCE
Production Supervisor, Food Manufacturing
- Supervised 40 operators across three shifts
- Implemented 5S and kaizen on packing lines
- Tracked KPIs and downtime

SKILLS
Lean manufacturing, 5S, team leadership, production planning
`,Ct=`Chamari Herath
chamari.h@example.com | 075 909 8877

PROFILE
Quality engineer, 4 years, electronics assembly.

EXPERIENCE
Quality Engineer, Electronics Assembly Plant
- Managed ISO 9001 and IATF 16949 quality management system audits
- Led root cause analysis using 8D and 5 whys for field returns
- Trained operators on IPC-A-610 workmanship standards and ESD

SKILLS
QMS, ISO 9001, IATF 16949, 8D, IPC-A-610, ESD control, problem solving
`,wt=`Nuwan Karunaratne
nuwan.k@example.com

SUMMARY
Mechanical design engineer, 3 years.

EXPERIENCE
Design Engineer, Machinery Fabricator
- 3D modelling in SolidWorks and AutoCAD drawings for sheet metal parts
- Supported prototype builds

SKILLS
SolidWorks, AutoCAD, GD&T, CNC basics
`,Tt=`Piumi Abeysekara
piumi.a@example.com | 072 121 2121

PROFILE
People analytics specialist with 3 years of experience, combining HR and data.

EXPERIENCE
People Analytics Analyst, Manufacturing Group
- Built Power BI dashboards on headcount, attrition and absenteeism
- SQL and Python to analyse HRIS data and predict employee attrition with machine learning
- Supported recruitment reporting and engagement survey analysis

SKILLS
Python, SQL, Power BI, Excel, statistics, HRIS, machine learning
`,Et=`Lahiru Madushanka
lahiru.m@example.com | 078 456 7812

SKILLS
Python, SQL, Power BI, Tableau, machine learning, deep learning, statistics, pandas,
Excel, Git, ETL, data visualization, forecasting, NLP, AWS

EXPERIENCE
Cashier, City Supermarket (2022 - present)
- Handled cash, card payments and customer service at the checkout
- Helped with monthly stock counts

EDUCATION
G.C.E. Advanced Level (Commerce)
`,Dt=`Shanika Fonseka
shanika.f@example.com | +94 77 600 1234

PROFILE
HR Manager with 12 years of experience leading HR for manufacturing companies of up to 3,000 employees.

EXPERIENCE
HR Manager, Industrial Products PLC (2016 - present)
- Lead a team of 9 HR staff covering recruitment, payroll, employee relations and training
- Negotiated with trade unions and handled industrial disputes and labour tribunal cases
- Designed the performance management framework and annual KPI cycle
- Implemented SAP SuccessFactors HRIS across three sites

Assistant HR Manager, Textile Mills (2013 - 2016)
- Managed recruitment, disciplinary inquiries and compliance with EPF, ETF and gratuity

QUALIFICATIONS
MBA (HRM); BSc HRM; CIPM Professional Qualification
`,Ot=`Kavindi Samarasinghe
kavindi.s@example.com

PROFILE
HR undergraduate looking for a first HR role.

EXPERIENCE
HR Intern, Apparel Company (Jan 2026 - Aug 2026)
- Helped the recruitment team schedule interviews and file candidate documents
- Updated attendance sheets in Excel
- Assisted in organising an employee engagement day

EDUCATION
BSc HRM (reading), final year
`,kt=`Dinesh Wijeratne
dinesh.w@example.com | 071 234 9087

PROFILE
SMT machine technician with 6 years in electronics manufacturing.

EXPERIENCE
Senior SMT Technician, EMS Company (2020 - present)
- Set up and operate pick and place machines and reflow ovens
- Changeovers, feeder setup and first-article checks on PCBA lines
- Follow ESD procedures and IPC-A-610 inspection criteria
SMT Operator, Electronics Plant (2018 - 2020)

EDUCATION
NVQ Level 4 Diploma in Electronics
`,At=`Ravindu Peiris
ravindu.p@example.com | 077 777 0042

SUMMARY
Data engineer with 4 years of experience building data pipelines.

EXPERIENCE
Data Engineer, Fintech Company (2022 - present)
- Built ETL pipelines in Python and Airflow loading data into a PostgreSQL warehouse
- Wrote complex SQL for reporting tables used by analysts
- Created a few Power BI dashboards for operations KPIs
- Deployed jobs on AWS; version control with Git

EDUCATION
BSc Computer Science
`,jt=`Menaka Dissanayake
menaka.d@example.com | 076 345 6789

PROFILE
People operations generalist with 4 years in a 1,500-person electronics factory.

EXPERIENCE
People Operations Officer, Electronics Manufacturer (2022 - present)
- End-to-end hiring for factory operators, technicians and office staff
- Run domestic inquiries and resolve worker complaints; keep a good relationship with the joint council
- Statutory compliance with Sri Lankan employment law, EPF and ETF filings
- Prepare monthly salary inputs and keep the HR information system up to date
- Plan induction, skills training and the yearly appraisal cycle
- Organise staff welfare, sports day and engagement activities

EDUCATION
BA in Human Resource Management
`,Mt=`Gihan Liyanage
gihan.l@example.com | 070 909 1234

SUMMARY
Manufacturing engineer, 4 years, surface-mount electronics assembly.

EXPERIENCE
Manufacturing Engineer, Automotive Electronics Plant (2022 - present)
- Engineering owner for two surface-mount lines: placement programs, oven thermal profiles, stencil changes
- Six Sigma Green Belt project raised first pass yield on PCBA from 94% to 98%
- Ran FMEA and 8D investigations for customer returns
- Kept work instructions aligned with ISO 9001 and IPC-A-610; ESD audits on the shop floor
- Line layouts in AutoCAD

EDUCATION
BEng (Hons) Mechatronics Engineering
`,Nt=`Oshadi Rajapaksha
oshadi.r@example.com

PROFILE
Marketing executive with 3 years of experience in FMCG brand campaigns.

EXPERIENCE
Marketing Executive, Beverage Company (2023 - present)
- Planned social media campaigns and in-store promotions
- Managed agency relationships and campaign budgets
- Tracked sales and brand awareness metrics

EDUCATION
BBA Marketing
`,Pt=`Data Analyst - Electronics Manufacturing

We are looking for a Data Analyst to turn production, quality and HR data into insights.

Responsibilities
- Build and maintain dashboards in Power BI for production yield, scrap and on-time delivery
- Write SQL queries to extract and clean data from the ERP and MES databases
- Use Python (pandas) for analysis, forecasting and automation of monthly reports
- Apply statistics and regression to find drivers of defects and downtime
- Present findings to managers with clear communication

Requirements
- Degree in Data Science, Statistics, Computer Science or related field
- 2+ years of experience in data analysis
- Strong SQL, Python and Excel; Power BI or Tableau
- Knowledge of machine learning is an advantage
- Experience with Git is a plus
`,Ft=`HR Executive - Recruitment & Employee Relations

Join our HR team in a 1,000+ employee manufacturing site.

Responsibilities
- Manage end-to-end recruitment for blue-collar and white-collar roles
- Handle employee relations, grievance handling and disciplinary inquiries
- Ensure compliance with Sri Lankan labour law (Shop and Office Act, Wages Board, EPF, ETF, gratuity)
- Support payroll inputs and HRIS data accuracy
- Coordinate training and development programmes and performance management (KPIs, appraisals)
- Drive employee engagement and welfare activities

Requirements
- Degree in HRM or related field; CIPM qualification preferred
- 3+ years of HR experience, preferably in manufacturing
- Good communication and problem solving skills
`,It=`Process Engineer - SMT / PCB Assembly

Responsibilities
- Own SMT line processes: pick and place programming, reflow profiling, stencil design
- Improve yield and cycle time on PCB assembly lines using lean and six sigma tools
- Lead root cause analysis (8D, fishbone, FMEA) for customer and internal defects
- Maintain process documentation in line with ISO 9001 and IPC-A-610
- Ensure ESD control on the production floor

Requirements
- BSc in Electrical, Electronic or Mechatronics Engineering
- 3+ years of process engineering experience in electronics manufacturing
- Knowledge of AutoCAD or SolidWorks
- Leadership and problem solving skills
`,Lt=`Quality Engineer - Electronics Manufacturing

Responsibilities
- Maintain the ISO 9001 / IATF 16949 quality management system and lead internal audits
- Lead customer complaint investigations using 8D and root cause analysis
- Monitor process quality using SPC charts and first pass yield data
- Train operators on IPC-A-610 workmanship standards and ESD control
- Work with suppliers to resolve incoming quality issues

Requirements
- Degree in Engineering or Science
- 3+ years in quality engineering in electronics or automotive manufacturing
- ISO 9001 internal auditor certification is an advantage
- Good Excel and data analysis skills; Power BI is a plus
`;new Map(Object.entries({summary:[`profile`,`summary`,`about`,`about me`,`professional summary`,`career objective`,`objective`,`personal statement`,`overview`],experience:[`experience`,`work experience`,`employment history`,`employment`,`professional experience`,`career history`,`work history`,`relevant experience`],skills:[`skills`,`technical skills`,`key skills`,`core skills`,`core competencies`,`competencies`,`tools`,`skills & tools`],education:[`education`,`qualifications`,`academic qualifications`,`professional qualifications`,`education & qualifications`,`education and qualifications`,`certifications`,`training`],projects:[`projects`,`key projects`,`achievements`,`key achievements`]}).flatMap(([e,t])=>t.map(t=>[t,e])));var Rt=`(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?`;RegExp(`(?:${Rt}\\s+)?((?:19|20)\\d{2})\\s*(?:-|–|—|to|until)\\s*(?:(?:${Rt}\\s+)?((?:19|20)\\d{2})|(present|current|now|date|today|ongoing))`,`gi`);function zt(e){let t=[...e.matchAll(/(\d{1,2})\s*(?:\+|-\s*\d{1,2}|to\s*\d{1,2})?\s*(?:years?|yrs?)/gi)].map(e=>parseFloat(e[1])).filter(e=>e>0&&e<30);return t.length?Math.min(...t):null}var Bt=[[5,`PhD`,/\bph\.?\s?d\b|doctorate/i],[4,`Master's`,/\bmaster'?s?\b|\bm\.?\s?sc\b|\bmba\b|\bm\.?\s?eng\b|postgraduate|post-graduate/i],[3,`Bachelor's`,/\bbachelor'?s?\b|\bb\.?\s?sc\b|\bb\.?\s?eng\b|\bbba\b|\bb\.?\s?com\b|\bll\.?\s?b\b|\bdegree\b|\bgraduate\b|\bb\.?a\b|\bbeng\b/i],[2,`HND / Higher Diploma`,/\bhnd\b|higher national diploma|higher diploma|advanced diploma/i],[1,`Diploma / Certificate`,/\bdiploma\b|\bcertificate\b|\bnvq\b/i]],Vt=Object.fromEntries(Bt.map(([e,t])=>[e,t])),Ht=e=>Bt.filter(([,,t])=>t.test(e)).map(([e])=>e),Ut={python:[`python`],sql:[`sql`,`mysql`,`postgresql`,`postgres`,`t-sql`,`sql server`],r:[`r programming`,`rstudio`,`\\b(?<=, )r(?=[,.\\s])`,`\\br(?=, )`],excel:[`excel`,`spreadsheets`,`vlookup`,`pivot tables?`],"power bi":[`power bi`,`powerbi`],tableau:[`tableau`],"machine learning":[`machine learning`,`machine-learning`,`\\bml\\b`,`scikit-learn`,`sklearn`],"deep learning":[`deep learning`,`neural networks?`,`tensorflow`,`pytorch`,`keras`],nlp:[`nlp`,`natural language processing`,`text mining`,`spacy`,`nltk`,`transformers`],statistics:[`statistics`,`statistical`,`hypothesis testing`,`regression`,`a/b test`],"data visualization":[`data visuali[sz]ation`,`dashboards?`,`matplotlib`,`seaborn`,`plotly`],pandas:[`pandas`,`numpy`],cloud:[`aws`,`azure`,`gcp`,`google cloud`],etl:[`etl`,`data pipelines?`,`airflow`,`data warehouse`,`data warehousing`],erp:[`erp`,`sap`,`oracle ebs`,`dynamics 365`],forecasting:[`forecasting`,`forecasts?`,`time series`],git:[`git`,`github`,`gitlab`,`version control`],javascript:[`javascript`,`typescript`,`\\bjs\\b`],java:[`java`],"web frameworks":[`react`,`angular`,`vue`,`node\\.?js`,`express`,`django`,`flask`,`spring boot`,`\\.net`],"rest api":[`rest(ful)? apis?`,`apis?`,`api endpoints?`,`web services?`],databases:[`relational databases?`,`database design`,`database management`,`mongodb`,`nosql`],"software testing":[`unit tests?`,`unit testing`,`test automation`,`automated tests?`,`jest`,`pytest`,`junit`],"code review":[`code reviews?`],agile:[`agile`,`scrum`,`jira`],"object-oriented programming":[`object[- ]oriented`,`\\boop\\b`],debugging:[`debugging`,`troubleshoot\\w*`,`software defects?`,`bug fix\\w*`,`investigated defects`],"html/css":[`html5?`,`css3?`],"social media":[`social media`,`instagram`,`facebook`,`tiktok`,`content calendars?`],seo:[`seo`,`search engine optimi[sz]ation`],"paid advertising":[`paid ads?`,`paid advertising`,`google ads`,`meta ads`,`facebook ads`,`ppc`,`sem`,`ad campaigns?`,`boosted posts?`],"email marketing":[`email marketing`,`mailchimp`,`newsletters?`],"content creation":[`content creation`,`content planning`,`copywriting`,`content writing`,`creative assets?`,`brand storytelling`],"marketing analytics":[`google analytics`,`ga4`,`marketing analytics`,`campaign (performance|reporting|analytics)`,`conversions?`,`click[- ]through`],"design tools":[`canva`,`photoshop`,`illustrator`,`figma`,`adobe`],"digital marketing":[`digital marketing`,`online marketing`],"accounts payable/receivable":[`accounts payable`,`accounts receivable`],reconciliation:[`reconciliations?`,`bank rec\\w*`,`ledger rec\\w*`],bookkeeping:[`bookkeeping`,`book-keeping`,`general ledger`,`journal entries`,`ledgers?`],"invoice processing":[`invoices?`,`invoicing`],"accounting software":[`quickbooks`,`sage`,`xero`,`tally`,`accounting software`],"financial reporting":[`financial reports?`,`financial reporting`,`financial statements?`,`month[- ]end`,`management accounts`],"accounting qualification":[`aat`,`cima`,`acca`,`chartered accountant`],tax:[`vat`,`paye`,`taxation`,`tax returns?`],recruitment:[`recruitment`,`recruiting`,`recruiter`,`talent acquisition`,`hiring`,`sourcing candidates`,`headhunting`,`interviewing candidates`,`interview scheduling`,`arranged interviews`,`cv screening`,`candidate screening`,`job advertisements?`],"hr administration":[`hr administration`,`employee records`,`employee files`,`personnel (files|records|reports)`,`hr databases?`,`employee documentation`,`employment documentation`,`filing systems?`,`attendance (and leave )?(records|reports|administration)`,`leave administration`,`employment letters`],"microsoft office":[`microsoft office`,`ms office`,`microsoft word`,`ms word`,`outlook`,`powerpoint`],"labour law":[`labou?r laws?`,`employment law`,`shop and office`,`wages board`,`industrial disputes act`,`epf`,`etf`,`gratuity`,`statutory compliance`],payroll:[`payroll`,`salary processing`,`salary administration`,`salary inputs?`],onboarding:[`onboarding`,`induction`,`orientation programmes?`],"compensation & benefits":[`compensation`,`benefits administration`,`c&b`,`salary surveys?`,`reward management`],"employee relations":[`domestic inquir(?:y|ies)`,`joint council`,`worker complaints`,`trade unions?`,`employee relations`,`industrial relations`,`grievance`,`disciplinary`],"performance management":[`performance management`,`kpis?`,`appraisals?`,`performance reviews?`],"training & development":[`training`,`skills training`,`training and development`,`training & development`,`learning and development`,`l&d`,`training needs analysis`],hris:[`hris`,`sap successfactors`,`successfactors`,`workday`,`hr information system`],"employee engagement":[`employee engagement`,`engagement surveys?`,`welfare`,`staff engagement`,`employee experience`],cipm:[`cipm`,`cipd`,`shrm`],smt:[`smt`,`surface[- ]mount`,`pick and place`,`pick-and-place`,`reflow`],"pcb assembly":[`pcba?`,`pcb assembly`,`printed circuit`],"lean manufacturing":[`lean`,`kaizen`,`5s`,`six sigma`,`green belt`,`black belt`,`value stream`,`continuous improvement`],"quality systems":[`iso 9001`,`iatf 16949`,`iso 13485`,`quality management system`,`\\bqms\\b`],"root cause analysis":[`root cause`,`8d`,`fishbone`,`5 whys`,`fmea`],"ipc standards":[`ipc-a-610`,`ipc a 610`,`ipc-j-std-001`,`ipc standards?`],"esd control":[`\\besd\\b`,`electrostatic discharge`],autocad:[`autocad`,`solidworks`,`cad`],"process engineering":[`process engineering`,`process improvement`,`process optimi[sz]ation`],communication:[`communication`,`presentation skills`,`stakeholder`],leadership:[`leadership`,`team lead`,`led a team`,`supervis\\w*`],"problem solving":[`problem solving`,`problem-solving`,`analytical`],"attention to detail":[`attention to detail`,`detail[- ]oriented`,`accurate`,`accuracy`],"time management":[`time management`,`organised`,`organized`],teamwork:[`team ?work`,`collaborat\\w*`,`team player`]},Wt=new Set([`communication`,`leadership`,`problem solving`,`attention to detail`,`time management`,`teamwork`]),Gt=e=>e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`);function Kt(e=[]){let t={...Ut};for(let n of e){let e=String(n).trim().toLowerCase();e&&!t[e]&&(t[e]=[Gt(e)])}return t}var qt=new WeakMap;function Jt(e){if(qt.has(e))return qt.get(e);let t=Object.entries(e).map(([e,t])=>{let n=t.map(e=>e.startsWith(`\\b`)?e:`(?<![\\w])${e}(?![\\w])`);return[e,new RegExp(n.join(`|`),`i`)]});return qt.set(e,t),t}function Yt(e,t=Ut){let n=new Set;for(let[r,i]of Jt(t))i.test(e)&&n.add(r);return n}var Xt=/prefer|advantage|\ba plus\b|\bis a plus\b|\bplus\b|desirable|nice to have|bonus|ideally|would be an asset|good to have|beneficial/i,Zt=/nice to have|preferred|desirable|good to have|bonus/i,Qt=/responsibilit|requirement|qualification|duties|what you.?ll do|what we.?re looking|skills|experience|key tasks|the role|you will|must have|essential|competenc/i,$=/^\s*(?:[-•*·▪●◦–\uf0b7\uf0a7]|\d+[.)])\s+/,$t=/sample document|testing only|^page \d+$|^(strictly )?confidential$/i,en=/^(job description|job title|position|role|vacancy)\s*[:\-–—]\s*/i;function tn(e){let t=e.trim().replace(/:$/,``);return!$.test(e)&&t.split(/\s+/).length<=4&&/^[A-Z]/.test(t)&&!/[.,;|]/.test(t)&&!/\d/.test(t)}function nn(e){let t=e.trim().replace(/:$/,``);return(e.trim().endsWith(`:`)||t.split(/\s+/).length<=4)&&!$.test(e)&&(Qt.test(t)||Zt.test(t))}function rn(e,t=``,n){let r=e.replace(/\s+[•▪●◦\uf0b7\uf0a7]\s+/g,`
• `).split(/\r?\n/).map(e=>e.replace(/\s*Page \d+\s*$/i,``)).filter(e=>e.trim()&&!$t.test(e.trim()));if(!t){let e=r.find(e=>en.test(e.trim()))||r[0];e&&e.split(/\s+/).length<=10&&!$.test(e)&&(t=e.trim().replace(en,``))}let i=r.some(e=>$.test(e))||r.some(nn),a=[];if(i){let e=!1,t=!1;for(let n of r)nn(n)?(e=Zt.test(n),t=!0):tn(n)?(t=!1,e=!1):(t||$.test(n)&&!r.some(nn))&&a.push([n.replace($,``).trim(),e])}else a=r.join(` `).split(/(?<=[.!?;])\s+/).map(e=>[e.trim(),!1]);let o=[];for(let[e,t]of a)for(let r of e.split(/;\s*|,?\s+(?=(?:preferably|ideally)\b)/))r=r.trim().replace(/^[\s.]+|[\s.]+$/g,``),r.split(/\s+/).length<3&&!Yt(r,n).size||o.push({text:r,kind:t||Xt.test(r)?`nice`:`must`,skills:Yt(r,n),years:zt(r)});let s=e=>e.skills.size>=2&&/\bor\b|\//.test(e.text),c=Yt([t,...o.filter(e=>e.kind===`must`&&!s(e)).map(e=>e.text)].join(` `),n),l=[];for(let e of o){if(e.kind!==`must`||!s(e))continue;let t=new Set([...e.skills].filter(e=>!Wt.has(e))),n=[...t].some(e=>c.has(e)),r=l.some(e=>e.size===t.size&&[...e].every(e=>t.has(e)));t.size&&!n&&!r&&l.push(t)}let u=new Set(l.flatMap(e=>[...e])),d=new Set;for(let e of o)e.kind===`nice`&&e.skills.forEach(e=>!c.has(e)&&!u.has(e)&&d.add(e));for(let e of c)Wt.has(e)&&(d.add(e),c.delete(e));let f=o.filter(e=>e.kind===`must`&&e.years).map(e=>e.years),p=o.filter(e=>e.kind===`must`).flatMap(e=>Ht(e.text));return{title:t,text:e,requirements:o,mustSkills:c,niceSkills:d,mustAny:l,requiredYears:f.length?Math.min(...f):null,requiredEducation:p.length?Math.min(...p):null}}function an(e,t=``,n=[]){return rn(e,t,Kt(n))}var on;async function sn(){if(!on){on=await F(()=>import(`./pdf-CNDt0o42.js`),__vite__mapDeps([0,1]),import.meta.url);let e=await F(()=>import(`./pdf.worker.min-BPK52Uye.js`),[],import.meta.url);on.GlobalWorkerOptions.workerSrc=e.default}return on}async function cn(e){let t=await(await sn()).getDocument({data:new Uint8Array(e)}).promise,n=[];for(let e=1;e<=t.numPages;e++){let r=await(await t.getPage(e)).getTextContent(),i=[],a=[],o=null;for(let e of r.items){if(!(`str`in e))continue;let t=Math.round(e.transform[5]);o!==null&&Math.abs(t-o)>2&&a.length&&(i.push(a.join(` `)),a=[]),e.str.trim()&&a.push(e.str.trim()),o=t,e.hasEOL&&a.length&&(i.push(a.join(` `)),a=[],o=null)}a.length&&i.push(a.join(` `)),n.push(i.join(`
`))}return n.join(`

`)}async function ln(t){let{value:n}=await(await F(async()=>{let{default:t}=await import(`./mammoth.browser-CzZn0L7-.js`).then(t=>e(t.default,1));return{default:t}},__vite__mapDeps([2,3]),import.meta.url)).default.extractRawText({arrayBuffer:t});return n.replace(/\n{3,}/g,`

`)}async function un(e){let t=e.name.split(`.`).pop().toLowerCase(),n=await e.arrayBuffer();if(t===`pdf`)return cn(n);if(t===`docx`)return ln(n);if(t===`txt`||t===`md`)return new TextDecoder().decode(n);throw Error(`Unsupported file type`)}var dn=`.pdf,.docx,.txt`;function fn(){let e=(0,M.useRef)(null),[t,n]=(0,M.useState)(null),r=(0,M.useRef)(new Map);return(0,M.useEffect)(()=>{let t=new Worker(new URL(new URL(`worker-jbG2dG0q.js`,import.meta.url).href,``+import.meta.url),{type:`module`});return t.onmessage=({data:e})=>{let t=r.current.get(e.id);t&&(e.type===`progress`&&n({stage:e.stage,value:e.value}),e.type===`result`&&(r.current.delete(e.id),n(null),t.resolve(e.result)),e.type===`error`&&(r.current.delete(e.id),n(null),t.reject(Error(e.message))))},e.current=t,()=>t.terminate()},[]),{run:(0,M.useCallback)(t=>{let i=Math.random().toString(36).slice(2);return new Promise((a,o)=>{r.current.set(i,{resolve:a,reject:o}),n({stage:`Starting`,value:0}),e.current.postMessage({id:i,payload:t})})},[]),progress:t}}var pn=Object.assign({"../sample/cv01_nadeesha.txt":mt,"../sample/cv02_kasun.txt":ht,"../sample/cv03_ishara.txt":gt,"../sample/cv04_ruwan.txt":_t,"../sample/cv05_dilini.txt":vt,"../sample/cv06_tharindu.txt":yt,"../sample/cv07_sachini.txt":bt,"../sample/cv08_amila.txt":xt,"../sample/cv09_harsha.txt":St,"../sample/cv10_chamari.txt":Ct,"../sample/cv11_nuwan.txt":wt,"../sample/cv12_piumi.txt":Tt,"../sample/cv13_lahiru.txt":Et,"../sample/cv14_shanika.txt":Dt,"../sample/cv15_kavindi.txt":Ot,"../sample/cv16_dinesh.txt":kt,"../sample/cv17_ravindu.txt":At,"../sample/cv18_menaka.txt":jt,"../sample/cv19_gihan.txt":Mt,"../sample/cv20_oshadi.txt":Nt,"../sample/data_analyst.txt":Pt,"../sample/hr_executive.txt":Ft,"../sample/process_engineer.txt":It,"../sample/quality_engineer.txt":Lt}),mn=e=>pn[`../sample/${e}.txt`],hn={hr_executive:`HR Executive`,data_analyst:`Data Analyst`,process_engineer:`Process Engineer`,quality_engineer:`Quality Engineer`},gn={Shortlist:`✓`,Review:`!`,Reject:`✕`},_n={met:[`✓`,`Met`],partial:[`~`,`Partial`],missing:[`✕`,`Missing`]},vn=[[`requirements`,`Requirements`,35],[`skills`,`Skills`,25],[`semantic`,`Meaning match`,15],[`keywords`,`Keyword match`,10],[`experience`,`Experience`,10],[`education`,`Education`,5]],yn=e=>{let t=e.replace(/\.[^.]+$/,``).replace(/[_-]+/g,` `).replace(/\s+/g,` `).trim();return t.charAt(0).toUpperCase()+t.slice(1)};function bn({value:e,band:t,size:n=64}){let r={Shortlist:`var(--mint)`,Review:`var(--amber)`,Reject:`var(--coral)`}[t];return(0,N.jsx)(`div`,{className:`ring`,style:{"--size":`${n}px`,"--deg":`${e*3.6}deg`,"--c":r},children:(0,N.jsx)(`div`,{children:(0,N.jsx)(`b`,{children:Math.round(e)})})})}function xn({items:e,kind:t,onRemove:n}){return e?.length?(0,N.jsx)(`div`,{className:`chips`,children:e.map(e=>(0,N.jsxs)(`span`,{className:`chip chip--${t}`,children:[e,n&&(0,N.jsx)(`button`,{"aria-label":`Remove ${e}`,onClick:()=>n(e),children:`×`})]},e))}):(0,N.jsx)(`span`,{className:`muted`,children:`None`})}function Sn({label:e,skills:t,setSkills:n,kind:r}){let[i,a]=(0,M.useState)(``),o=()=>{let e=i.trim().toLowerCase();e&&!t.includes(e)&&n([...t,e]),a(``)};return(0,N.jsxs)(`div`,{className:`field`,children:[(0,N.jsx)(`label`,{children:e}),(0,N.jsx)(xn,{items:t,kind:r,onRemove:e=>n(t.filter(t=>t!==e))}),(0,N.jsxs)(`div`,{className:`add-skill`,children:[(0,N.jsx)(`input`,{list:`skill-list`,value:i,placeholder:`Add a skill…`,onChange:e=>a(e.target.value),onKeyDown:e=>e.key===`Enter`&&(e.preventDefault(),o())}),(0,N.jsx)(`button`,{className:`mini`,onClick:o,disabled:!i.trim(),children:`Add`})]})]})}function Cn({open:e,onClose:t}){let n=(0,M.useRef)(),r=(0,M.useRef)(),i=(0,M.useRef)(),{run:a,progress:o}=fn(),[s,c]=(0,M.useState)(``),[l,u]=(0,M.useState)(``),[d,f]=(0,M.useState)([]),[p,m]=(0,M.useState)([]),[h,g]=(0,M.useState)(0),[_,v]=(0,M.useState)(0),[y,b]=(0,M.useState)([]),[x,S]=(0,M.useState)(!1),[C,ee]=(0,M.useState)(!0),[w,te]=(0,M.useState)(!1),[ne,re]=(0,M.useState)(!0),[T,E]=(0,M.useState)(null),[ie,D]=(0,M.useState)(null),[O,ae]=(0,M.useState)(``),[k,A]=(0,M.useState)(!1),j=(0,M.useMemo)(()=>l.trim()?an(l):null,[l]);(0,M.useEffect)(()=>{j&&(f([...j.mustSkills].sort()),m([...j.niceSkills].sort()),g(j.requiredYears||0),v(j.requiredEducation||0))},[j]),(0,M.useEffect)(()=>{if(!e)return;let n=e=>e.key===`Escape`&&t();return window.addEventListener(`keydown`,n),()=>window.removeEventListener(`keydown`,n)},[e,t]);let oe=async e=>{let t=[...e].filter(e=>/\.(pdf|docx|txt)$/i.test(e.name)),n=await Promise.all(t.map(async e=>{try{let t=await un(e),n=t.split(/\s+/).filter(Boolean).length;return{id:`${e.name}-${e.size}`,name:yn(e.name),text:t,words:n,error:n<30?`No readable text (scanned image?)`:``}}catch{return{id:`${e.name}-${e.size}`,name:yn(e.name),text:``,words:0,error:`Could not read this file`}}}));b(e=>{let t=new Set(e.map(e=>e.id));return[...e,...n.filter(e=>!t.has(e.id))]}),E(null)},se=(e=`hr_executive`)=>{c(hn[e]),u(mn(e));let t=Object.keys(pn).filter(e=>/\/cv\d+_/.test(e)).sort();b(t.map(e=>{let t=pn[e],n=e.split(`/`).pop();return{id:n,name:yn(n.replace(/^cv\d+_/,``)),text:t,words:t.split(/\s+/).length,error:``}})),E(null),D(null)},P=y.filter(e=>!e.error),ce=j&&P.length&&!o,le=async()=>{ae(``),D(null);try{let e=await a({jdText:l,title:s,cvs:P.map(e=>({id:e.id,name:e.name,text:e.text})),overrides:{mustSkills:d,niceSkills:p,requiredYears:h,requiredEducation:_},blind:C,useModel:ne});e.rows.forEach((e,t)=>e.code=`C${String(t+1).padStart(2,`0`)}`),e.title=s,E(e),n.current?.querySelector(`.app__results`)?.scrollTo({top:0,behavior:`smooth`})}catch(e){ae(e.message)}},ue=()=>{let e=[`Rank`,`Candidate`,`Fit score`,`Decision`,`Requirements met`,`Years`,`Education`,`Must-haves found`,`Must-haves missing`,`Flags`],t=T.rows.map(e=>[e.rank,w?e.code:e.name,e.fit,e.band,e.reqMet,e.years??``,e.education,e.mustMatched.join(`; `),e.mustMissing.join(`; `),e.flags.join(`; `)].map(e=>`"${String(e).replace(/"/g,`""`)}"`).join(`,`)),n=new Blob([[e.join(`,`),...t].join(`
`)],{type:`text/csv`}),r=document.createElement(`a`);r.href=URL.createObjectURL(n),r.download=`cv-ranking-${(T.title||`position`).replace(/\W+/g,`-`).toLowerCase()}.csv`,r.click(),URL.revokeObjectURL(r.href)},de=e=>w?e.code:e.name,F=T?Object.fromEntries([`Shortlist`,`Review`,`Reject`].map(e=>[e,T.rows.filter(t=>t.band===e).length])):null,I=T&&ie?T.rows.find(e=>e.id===ie):null,fe=I?T.details[I.id]:null;return(0,N.jsxs)(`div`,{className:`app ${e?`is-open`:``}`,ref:n,"aria-hidden":!e,"data-lenis-prevent":!0,children:[(0,N.jsx)(`datalist`,{id:`skill-list`,children:Object.keys(Ut).map(e=>(0,N.jsx)(`option`,{value:e},e))}),(0,N.jsxs)(`header`,{className:`app__bar`,children:[(0,N.jsxs)(`div`,{className:`app__title`,children:[(0,N.jsxs)(`span`,{className:`app__logo`,children:[`cv`,(0,N.jsx)(`span`,{children:`/`}),`nlp`]}),(0,N.jsx)(`span`,{className:`app__sep`}),`Screen CVs`]}),(0,N.jsxs)(`div`,{className:`app__bar-right`,children:[(0,N.jsxs)(`span`,{className:`pill`,children:[(0,N.jsx)(`i`,{className:`dot dot--mint`}),` Runs in your browser · nothing is uploaded`]}),(0,N.jsx)(`button`,{className:`app__close`,onClick:t,"aria-label":`Close`,children:`×`})]})]}),(0,N.jsxs)(`div`,{className:`app__body`,children:[(0,N.jsxs)(`section`,{className:`app__inputs`,children:[(0,N.jsxs)(`div`,{className:`panel`,children:[(0,N.jsxs)(`div`,{className:`panel__head`,children:[(0,N.jsx)(`span`,{className:`step`,children:`1`}),(0,N.jsx)(`h3`,{children:`Describe the position`}),(0,N.jsxs)(`div`,{className:`sample-menu`,children:[(0,N.jsx)(`span`,{className:`muted`,children:`Try a sample:`}),Object.entries(hn).map(([e,t])=>(0,N.jsx)(`button`,{className:`mini mini--ghost`,onClick:()=>se(e),children:t},e))]})]}),(0,N.jsxs)(`div`,{className:`field`,children:[(0,N.jsx)(`label`,{children:`Position title`}),(0,N.jsx)(`input`,{value:s,onChange:e=>c(e.target.value),placeholder:`e.g. HR Executive`})]}),(0,N.jsxs)(`div`,{className:`field`,children:[(0,N.jsxs)(`div`,{className:`field__row`,children:[(0,N.jsx)(`label`,{children:`Job description`}),(0,N.jsx)(`button`,{className:`mini mini--ghost`,onClick:()=>i.current.click(),children:`Upload JD file`}),(0,N.jsx)(`input`,{ref:i,type:`file`,accept:dn,hidden:!0,onChange:async e=>{let t=e.target.files[0];t&&u(await un(t).catch(()=>``)),e.target.value=``}})]}),(0,N.jsx)(`textarea`,{value:l,onChange:e=>u(e.target.value),rows:8,placeholder:`Paste duties, required skills, qualifications and experience. Bullet points work best.`})]}),j&&(0,N.jsxs)(`div`,{className:`detected`,children:[(0,N.jsxs)(`div`,{className:`detected__title`,children:[`What the tool found `,(0,N.jsx)(`span`,{className:`muted`,children:`· edit if needed, candidates are scored against this`})]}),(0,N.jsx)(Sn,{label:`Must-have skills`,skills:d,setSkills:f,kind:`must`}),j.mustAny.length>0&&(0,N.jsxs)(`p`,{className:`hint`,children:[`Also required, any one of: `,j.mustAny.map(e=>[...e].join(` or `)).join(`; `)]}),(0,N.jsx)(Sn,{label:`Nice-to-have skills`,skills:p,setSkills:m,kind:`nice`}),(0,N.jsxs)(`div`,{className:`grid2`,children:[(0,N.jsxs)(`div`,{className:`field`,children:[(0,N.jsx)(`label`,{children:`Minimum years of experience`}),(0,N.jsx)(`input`,{type:`number`,min:`0`,max:`40`,step:`0.5`,value:h,onChange:e=>g(+e.target.value)})]}),(0,N.jsxs)(`div`,{className:`field`,children:[(0,N.jsx)(`label`,{children:`Minimum education`}),(0,N.jsxs)(`select`,{value:_,onChange:e=>v(+e.target.value),children:[(0,N.jsx)(`option`,{value:0,children:`No minimum`}),Object.entries(Vt).sort((e,t)=>e[0]-t[0]).map(([e,t])=>(0,N.jsx)(`option`,{value:e,children:t},e))]})]})]}),(0,N.jsxs)(`button`,{className:`link`,onClick:()=>A(e=>!e),children:[k?`▾`:`▸`,` `,j.requirements.length,` requirements detected (`,j.requirements.filter(e=>e.kind===`must`).length,` must-have)`]}),k&&(0,N.jsx)(`ul`,{className:`req-list`,children:j.requirements.map((e,t)=>(0,N.jsxs)(`li`,{children:[(0,N.jsx)(`span`,{className:`tag tag--${e.kind}`,children:e.kind===`must`?`Must`:`Nice`}),e.text]},t))})]})]}),(0,N.jsxs)(`div`,{className:`panel`,children:[(0,N.jsxs)(`div`,{className:`panel__head`,children:[(0,N.jsx)(`span`,{className:`step`,children:`2`}),(0,N.jsx)(`h3`,{children:`Add the CVs`})]}),(0,N.jsxs)(`div`,{className:`drop ${x?`is-drag`:``}`,onDragOver:e=>(e.preventDefault(),S(!0)),onDragLeave:()=>S(!1),onDrop:e=>{e.preventDefault(),S(!1),oe(e.dataTransfer.files)},onClick:()=>r.current.click(),role:`button`,tabIndex:0,children:[(0,N.jsx)(`div`,{className:`drop__icon`,children:`⬆`}),(0,N.jsx)(`b`,{children:`Drag & drop CVs here`}),(0,N.jsx)(`span`,{children:`or click to browse · PDF, Word (.docx) or TXT · any number`}),(0,N.jsx)(`input`,{ref:r,type:`file`,accept:dn,multiple:!0,hidden:!0,onChange:e=>(oe(e.target.files),e.target.value=``)})]}),y.length>0&&(0,N.jsxs)(`div`,{className:`files`,children:[(0,N.jsxs)(`div`,{className:`files__head`,children:[(0,N.jsxs)(`span`,{children:[P.length,` CV`,P.length===1?``:`s`,` ready`]}),(0,N.jsx)(`button`,{className:`link`,onClick:()=>(b([]),E(null)),children:`Clear all`})]}),(0,N.jsx)(`ul`,{children:y.map(e=>(0,N.jsxs)(`li`,{className:e.error?`is-error`:``,children:[(0,N.jsx)(`span`,{className:`files__name`,children:e.name}),(0,N.jsx)(`span`,{className:`files__meta`,children:e.error||`${e.words} words`}),(0,N.jsx)(`button`,{"aria-label":`Remove`,onClick:()=>b(y.filter(t=>t.id!==e.id)),children:`×`})]},e.id))})]}),(0,N.jsxs)(`div`,{className:`toggles`,children:[(0,N.jsxs)(`label`,{className:`toggle`,children:[(0,N.jsx)(`input`,{type:`checkbox`,checked:C,onChange:e=>ee(e.target.checked)}),(0,N.jsx)(`i`,{}),`Blind screening (hide personal details)`]}),(0,N.jsxs)(`label`,{className:`toggle`,children:[(0,N.jsx)(`input`,{type:`checkbox`,checked:w,onChange:e=>te(e.target.checked)}),(0,N.jsx)(`i`,{}),`Show candidates as codes`]}),(0,N.jsxs)(`label`,{className:`toggle`,children:[(0,N.jsx)(`input`,{type:`checkbox`,checked:ne,onChange:e=>re(e.target.checked)}),(0,N.jsx)(`i`,{}),`Use AI language model (~23 MB, first time)`]})]})]}),(0,N.jsxs)(`button`,{className:`btn btn--primary run`,disabled:!ce,onClick:le,children:[o?`${o.stage}… ${Math.round(o.value*100)}%`:`Screen ${P.length||``} CVs`.replace(`  `,` `),o&&(0,N.jsx)(`i`,{className:`run__bar`,style:{transform:`scaleX(${o.value})`}})]}),!j&&(0,N.jsx)(`p`,{className:`hint center`,children:`Add a job description to start, or try a sample above.`}),O&&(0,N.jsx)(`p`,{className:`error`,children:O})]}),(0,N.jsxs)(`section`,{className:`app__results`,children:[!T&&(0,N.jsxs)(`div`,{className:`empty`,children:[(0,N.jsx)(`div`,{className:`empty__orb`}),(0,N.jsx)(`h3`,{children:`Your ranking appears here`}),(0,N.jsx)(`p`,{children:`Each CV gets a 0–100 fit score, a decision band, and the sentence from the CV that proves each requirement.`})]}),T&&!I&&(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)(`div`,{className:`res-head`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`div`,{className:`eyebrow`,children:`Results`}),(0,N.jsx)(`h2`,{children:T.title||T.job.title||`Position`}),(0,N.jsxs)(`div`,{className:`muted small`,children:[`Model: `,T.model]})]}),(0,N.jsx)(`button`,{className:`mini`,onClick:ue,children:`⬇ Export CSV`})]}),(0,N.jsx)(`div`,{className:`counts`,children:[`Shortlist`,`Review`,`Reject`].map(e=>(0,N.jsxs)(`div`,{className:`count count--${e.toLowerCase()}`,children:[(0,N.jsx)(`b`,{children:F[e]}),(0,N.jsxs)(`span`,{children:[gn[e],` `,e]})]},e))}),(0,N.jsx)(`ol`,{className:`ranking`,children:T.rows.map(e=>(0,N.jsx)(`li`,{children:(0,N.jsxs)(`button`,{className:`row`,onClick:()=>D(e.id),children:[(0,N.jsxs)(`span`,{className:`row__rank`,children:[`#`,e.rank]}),(0,N.jsx)(bn,{value:e.fit,band:e.band,size:52}),(0,N.jsxs)(`span`,{className:`row__main`,children:[(0,N.jsx)(`span`,{className:`row__name`,children:de(e)}),(0,N.jsxs)(`span`,{className:`row__meta`,children:[`Requirements `,e.reqMet,` · `,e.years==null?`yrs n/a`:`${e.years} yrs`,` · `,e.education]}),e.mustMissing.length>0&&(0,N.jsxs)(`span`,{className:`row__gap`,children:[`Missing: `,e.mustMissing.slice(0,3).join(`, `)]})]}),(0,N.jsxs)(`span`,{className:`badge badge--${e.band.toLowerCase()}`,children:[gn[e.band],` `,e.band]}),(0,N.jsx)(`span`,{className:`row__go`,children:`→`})]})},e.id))})]}),I&&(0,N.jsxs)(`div`,{className:`detail`,children:[(0,N.jsx)(`button`,{className:`link back`,onClick:()=>D(null),children:`← All candidates`}),(0,N.jsxs)(`div`,{className:`detail__head`,children:[(0,N.jsx)(bn,{value:I.fit,band:I.band,size:96}),(0,N.jsxs)(`div`,{children:[(0,N.jsxs)(`div`,{className:`muted small`,children:[`Rank #`,I.rank]}),(0,N.jsx)(`h2`,{children:de(I)}),(0,N.jsxs)(`span`,{className:`badge badge--${I.band.toLowerCase()}`,children:[gn[I.band],` `,I.band]}),(0,N.jsxs)(`div`,{className:`muted small`,style:{marginTop:8},children:[`Requirements met `,I.reqMet,` · `,I.years==null?`experience n/a`:`${I.years} years`,` · `,I.education]})]})]}),(0,N.jsx)(`div`,{className:`bars`,children:vn.map(([e,t,n])=>(0,N.jsxs)(`div`,{className:`bar`,children:[(0,N.jsxs)(`span`,{children:[t,` `,(0,N.jsxs)(`em`,{children:[n,`%`]})]}),(0,N.jsx)(`div`,{className:`bar__track`,children:(0,N.jsx)(`i`,{style:{width:`${I.components[e]}%`}})}),(0,N.jsx)(`b`,{children:I.components[e]})]},e))}),I.flags.map(e=>(0,N.jsxs)(`div`,{className:`flag`,children:[`⚠ `,e]},e)),(0,N.jsxs)(`div`,{className:`grid3`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`label`,{children:`Must-haves found`}),(0,N.jsx)(xn,{items:I.mustMatched,kind:`ok`})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`label`,{children:`Must-haves missing`}),(0,N.jsx)(xn,{items:I.mustMissing,kind:`miss`})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`label`,{children:`Nice-to-haves found`}),(0,N.jsx)(xn,{items:I.niceMatched,kind:`nice`})]})]}),(0,N.jsx)(`h3`,{className:`sub`,children:`Requirement checklist`}),(0,N.jsx)(`p`,{className:`muted small`,children:`Each requirement, with the sentence from the CV that supports it.`}),(0,N.jsx)(`div`,{className:`checklist`,children:fe.requirements.map((e,t)=>(0,N.jsxs)(`div`,{className:`check check--${e.status}`,children:[(0,N.jsx)(`span`,{className:`check__mark`,children:_n[e.status][0]}),(0,N.jsxs)(`div`,{children:[(0,N.jsxs)(`div`,{className:`check__text`,children:[e.requirement,(0,N.jsx)(`span`,{className:`tag`,children:e.kind===`must`?`Must-have`:`Nice-to-have`})]}),e.evidence&&e.status!==`missing`&&(0,N.jsxs)(`div`,{className:`check__ev`,children:[`“`,e.evidence,`”`]})]})]},t))}),(0,N.jsxs)(`details`,{className:`cvtext`,children:[(0,N.jsxs)(`summary`,{children:[`CV text the model scored`,C?` (personal details hidden)`:``]}),(0,N.jsx)(`pre`,{children:fe.text})]})]})]})]})]})}var wn=new URLSearchParams(location.search).has(`debug`);L.isMobile=window.matchMedia(`(max-width: 820px), (pointer: coarse)`).matches;function Tn(){let[e,t]=(0,M.useState)(!1),[n,r]=(0,M.useState)(!1),[i,a]=(0,M.useState)(()=>location.hash===`#try`),o=(0,M.useRef)(null);st(),(0,M.useEffect)(()=>{let e=e=>{if(L.pointer.x=e.clientX/window.innerWidth*2-1,L.pointer.y=-(e.clientY/window.innerHeight*2-1),o.current!=null){let t=e.clientX-o.current;L.drag.velocity+=t*.012,o.current=e.clientX}},t=e=>{e.target.tagName===`CANVAS`&&e.pointerType===`mouse`&&(o.current=e.clientX)},n=()=>o.current=null;return window.addEventListener(`pointermove`,e),window.addEventListener(`pointerdown`,t),window.addEventListener(`pointerup`,n),()=>{window.removeEventListener(`pointermove`,e),window.removeEventListener(`pointerdown`,t),window.removeEventListener(`pointerup`,n)}},[]),(0,M.useEffect)(()=>{L.lenis&&(n&&!i?L.lenis.start():L.lenis.stop())},[n,e,i]),(0,M.useEffect)(()=>{document.body.classList.toggle(`app-open`,i)},[i]);let s=(0,M.useCallback)(e=>{let t=document.querySelector(`.app`);t&&e?.clientX!=null&&(t.style.setProperty(`--ox`,`${e.clientX}px`),t.style.setProperty(`--oy`,`${e.clientY}px`)),history.replaceState(null,``,`#try`),a(!0)},[]),c=(0,M.useCallback)(()=>{history.replaceState(null,``,location.pathname+location.search),a(!1)},[]),u=(0,M.useCallback)(()=>t(!0),[]),d=(0,M.useCallback)(()=>{r(!0),A.fromTo(`.hero [data-intro]`,{yPercent:110,opacity:0,rotateX:-35},{yPercent:0,opacity:1,rotateX:0,duration:1.3,ease:`expo.out`,stagger:.08,delay:.15})},[]);return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`div`,{className:`webgl`,"aria-hidden":`true`,children:(0,N.jsx)(D,{shadows:`percentage`,frameloop:i&&e?`never`:`always`,dpr:[1,L.isMobile?1.25:1.75],gl:{antialias:!1,powerPreference:`high-performance`,stencil:!1},camera:{position:[0,.25,9.6],fov:40,near:.1,far:120},onCreated:e=>{let{gl:t,camera:n,scene:r}=e;wn&&(window.__three={camera:n,scene:r,state:L,get:e.get}),t.toneMapping=4,t.outputColorSpace=l},children:(0,N.jsx)(M.Suspense,{fallback:null,children:(0,N.jsx)(et,{onReady:u})})})}),(0,N.jsx)(ut,{onNavigate:pt,onTry:s}),(0,N.jsx)(`main`,{className:`content`,children:(0,N.jsx)(ot,{onExternal:pt,onTry:s})}),(0,N.jsx)(Cn,{open:i,onClose:c}),(0,N.jsx)(dt,{ready:e,onEnter:d}),(0,N.jsx)(ft,{})]})}Se(),(0,se.createRoot)(document.getElementById(`root`)).render((0,N.jsx)(M.StrictMode,{children:(0,N.jsx)(Tn,{})}));