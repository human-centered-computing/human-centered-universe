(function(){
"use strict";
const MAP={see_the_person_first:"HUMAN",make_the_failure_traceable:"LIGHT",protect_the_right_not_to_be_measured:"DARK"};
const COPY={
tr:{title:"ON ÜÇÜNCÜ ÇENTİK — 3D gözlem",help:"Döndürmek için sürükleyin veya ← → kullanın. Uzaklık için ↑ ↓ kullanın.",reset:"Görünümü sıfırla",note:"Sanatsal ve simgesel bir bilim kurgu yorumudur; arkeolojik rekonstrüksiyon değildir.",fallback:"WebGL kullanılamıyor. Hikâye ve üç gözlemci seçimi metin olarak erişilebilir.",legend:"Seçiminiz, çentik ile sayılmayan on üçüncü kişi arasındaki ilişkiyi değiştirir."},
en:{title:"THE THIRTEENTH NOTCH — 3D observation",help:"Drag or use ← → to orbit. Use ↑ ↓ to change distance.",reset:"Reset view",note:"An artistic, symbolic science-fiction interpretation; not an archaeological reconstruction.",fallback:"WebGL is unavailable. The story and all three Observer choices remain available as text.",legend:"Your choice changes the relation between the notch and the uncounted thirteenth person."}};
let active=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mul=(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;};
const perspective=(fov,aspect,near,far)=>{const f=1/Math.tan(fov/2),n=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*n,-1,0,0,2*far*near*n,0]);};
const lookAt=(e,t,u)=>{let zx=e[0]-t[0],zy=e[1]-t[1],zz=e[2]-t[2],l=Math.hypot(zx,zy,zz)||1;zx/=l;zy/=l;zz/=l;let xx=u[1]*zz-u[2]*zy,xy=u[2]*zx-u[0]*zz,xz=u[0]*zy-u[1]*zx;l=Math.hypot(xx,xy,xz)||1;xx/=l;xy/=l;xz/=l;const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1]);};
const shader=(g,type,src)=>{const s=g.createShader(type);g.shaderSource(s,src);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS))throw Error(g.getShaderInfoLog(s));return s;};
const makeProgram=g=>{const v=shader(g,g.VERTEX_SHADER,"attribute vec3 a_position;attribute vec4 a_color;uniform mat4 u_matrix;uniform float u_pointSize;varying vec4 v_color;void main(){gl_Position=u_matrix*vec4(a_position,1.);gl_PointSize=u_pointSize;v_color=a_color;}"),f=shader(g,g.FRAGMENT_SHADER,"precision mediump float;varying vec4 v_color;void main(){gl_FragColor=v_color;}"),p=g.createProgram();g.attachShader(p,v);g.attachShader(p,f);g.linkProgram(p);if(!g.getProgramParameter(p,g.LINK_STATUS))throw Error(g.getProgramInfoLog(p));return p;};
const pv=(a,x,y,z,c)=>a.push(x,y,z,...c);
const ln=(a,x,y,z,X,Y,Z,c)=>{pv(a,x,y,z,c);pv(a,X,Y,Z,c);};
const box=(a,cx,cy,cz,sx,sy,sz,c,rot=0)=>{const co=Math.cos(rot),si=Math.sin(rot),q=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([x,y,z])=>{x*=sx/2;y*=sy/2;z*=sz/2;return[cx+x*co-z*si,cy+y,cz+x*si+z*co];});[[0,1,2,0,2,3],[5,4,7,5,7,6],[4,0,3,4,3,7],[1,5,6,1,6,2],[3,2,6,3,6,7],[4,5,1,4,1,0]].flat().forEach(i=>pv(a,...q[i],c));};
const ring=(a,x,y,z,r,c,n=60)=>{for(let i=0;i<n;i++){const p=i*2*Math.PI/n,q=(i+1)*2*Math.PI/n;ln(a,x+Math.cos(p)*r,y,z+Math.sin(p)*r,x+Math.cos(q)*r,y,z+Math.sin(q)*r,c);}};
function geometry(mode,time){
 const s=[],l=[],p=[],stone=[.38,.31,.23,1],top=[.49,.40,.28,1],grid=[.18,.16,.16,.5];
 box(s,-2.5,1.62,0,.82,3.24,.9,stone);box(s,-2.5,3.08,0,2.2,.58,1,top);
 for(let i=-6;i<=6;i++){ln(l,i,.01,-4.6,i,.01,4.6,grid);ln(l,-6,.01,i*.7,6,.01,i*.7,grid);}
 for(let i=0;i<13;i++){const last=i===12,c=last?(mode==="HUMAN"?[.96,.68,.23,1]:mode==="LIGHT"?[.65,.86,1,1]:mode==="DARK"?[.67,.48,.85,.9]:[.78,.51,.22,.72]):[.72,.56,.31,.82];box(s,-2.08,.42+i*.205,-.47,last?.22:.42,.07,.1,c,.06);}
 for(let i=0;i<13;i++){const row=i<7?0:1,col=row?i-7:i,x=.15+col*.78+(row?.36:0),z=-1.22+row*2.1,last=i===12,a=last&&mode==="NEUTRAL"?.28:1,c=last?(mode==="HUMAN"?[.96,.68,.23,1]:mode==="LIGHT"?[.65,.86,1,1]:mode==="DARK"?[.67,.48,.85,.9]:[.54,.5,.48,a]):[.57,.63,.68,.9];box(s,x,.55,z,.24,.78,.23,c);pv(p,x,1.08,z,[c[0],c[1],c[2],a]);}
 const pulse=.5+.5*Math.sin(time*2.2),acc=mode==="HUMAN"?[.96,.68,.23,.9]:mode==="LIGHT"?[.65,.86,1,.9]:mode==="DARK"?[.67,.48,.85,.78]:[.72,.56,.31,.65];
 for(let i=0;i<89;i++){const f=i/89,g=(i+1)/89;ln(l,-1.72+f*3.45,2.72+.16*Math.sin(f*Math.PI*8-time*1.2),.06*Math.sin(f*Math.PI*4),-1.72+g*3.45,2.72+.16*Math.sin(g*Math.PI*8-time*1.2),.06*Math.sin(g*Math.PI*4),acc);}
 const x=4.43,z=.88;
 if(mode==="HUMAN"){ring(l,x,.04,z,.52+.08*pulse,[.96,.68,.23,.78]);ln(l,-2.05,3.34,0,x,1.05,z,[.96,.68,.23,.55]);}
 else if(mode==="LIGHT"){for(let i=0;i<13;i++){const row=i<7?0:1,col=row?i-7:i,X=.15+col*.78+(row?.36:0),Z=-1.22+row*2.1;ln(l,-2.05,2.58,0,X,1.05,Z,[.65,.86,1,.36]);}ring(l,-2.5,3.45,0,.72+.06*pulse,[.65,.86,1,.7]);}
 else if(mode==="DARK"){ring(l,x,.04,z,.75+.18*pulse,[.67,.48,.85,.55]);for(let j=0;j<3;j++)ring(l,x,.03+j*.02,z,1.05+j*.38,[.42,.28,.62,.26]);}
 else ln(l,-2.05,3.34,0,x,1.05,z,[.72,.56,.31,.25]);
 return {s:new Float32Array(s),l:new Float32Array(l),p:new Float32Array(p)};
}
const attrs=(g,p,b)=>{g.bindBuffer(g.ARRAY_BUFFER,b);const P=g.getAttribLocation(p,"a_position"),C=g.getAttribLocation(p,"a_color");g.enableVertexAttribArray(P);g.vertexAttribPointer(P,3,g.FLOAT,false,28,0);g.enableVertexAttribArray(C);g.vertexAttribPointer(C,4,g.FLOAT,false,28,12);};
function destroy(){if(active){active.destroy();active=null;}}
function mount(o={}){
 destroy();const canvas=o.canvas;if(!canvas)return null,fall=o.fallback||canvas.parentElement?.querySelector(".tn3d-fallback"),g=canvas.getContext("webgl",{antialias:true,alpha:false});if(!g){canvas.hidden=true;if(fall)fall.hidden=false;return null;}
 let prog;try{prog=makeProgram(g);}catch(e){console.error(e);canvas.hidden=true;if(fall)fall.hidden=false;return null;}
 const buf=g.createBuffer(),ml=g.getUniformLocation(prog,"u_matrix"),sl=g.getUniformLocation(prog,"u_pointSize");let mode=MAP[o.mode]||o.mode||"NEUTRAL",yaw=-.18,dist=11.8,drag=false,last=0,raf=0,dead=false;const reduced=matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||false;
 const resize=()=>{const d=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.floor(canvas.clientWidth*d)),h=Math.max(1,Math.floor(canvas.clientHeight*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;g.viewport(0,0,w,h);}};
 const draw=(data,primitive,size=1)=>{g.bindBuffer(g.ARRAY_BUFFER,buf);g.bufferData(g.ARRAY_BUFFER,data,g.DYNAMIC_DRAW);attrs(g,prog,buf);g.uniform1f(sl,size);g.drawArrays(primitive,0,data.length/7);};
 const frame=t=>{if(dead)return;resize();if(!reduced&&!drag)yaw+=.000025*Math.min(t-(frame.last||t),40);frame.last=t;const eye=[Math.sin(yaw)*dist,4.25,Math.cos(yaw)*dist],m=mul(perspective(Math.PI/3,canvas.width/canvas.height,.1,60),lookAt(eye,[.5,1.35,0],[0,1,0])),q=geometry(mode,reduced?0:t/1000);g.clearColor(.025,.022,.026,1);g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);g.enable(g.DEPTH_TEST);g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);g.useProgram(prog);g.uniformMatrix4fv(ml,false,m);draw(q.s,g.TRIANGLES);g.disable(g.DEPTH_TEST);draw(q.l,g.LINES);draw(q.p,g.POINTS,9);raf=requestAnimationFrame(frame);};
 const down=e=>{drag=true;last=e.clientX;canvas.setPointerCapture?.(e.pointerId);},move=e=>{if(drag){yaw+=(e.clientX-last)*.009;last=e.clientX;}},up=()=>drag=false,wheel=e=>{e.preventDefault();dist=clamp(dist+e.deltaY*.008,7.5,17);},key=e=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home"].includes(e.key))return;e.preventDefault();if(e.key==="ArrowLeft")yaw-=.12;if(e.key==="ArrowRight")yaw+=.12;if(e.key==="ArrowUp")dist=clamp(dist-.5,7.5,17);if(e.key==="ArrowDown")dist=clamp(dist+.5,7.5,17);if(e.key==="Home"){yaw=-.18;dist=11.8;}};
 canvas.addEventListener("pointerdown",down);canvas.addEventListener("pointermove",move);canvas.addEventListener("pointerup",up);canvas.addEventListener("pointercancel",up);canvas.addEventListener("wheel",wheel,{passive:false});canvas.addEventListener("keydown",key);
 const instance={setMode(v){mode=MAP[v]||v||"NEUTRAL";canvas.dataset.mode=mode;},reset(){yaw=-.18;dist=11.8;canvas.focus();},destroy(){dead=true;cancelAnimationFrame(raf);canvas.removeEventListener("pointerdown",down);canvas.removeEventListener("pointermove",move);canvas.removeEventListener("pointerup",up);canvas.removeEventListener("pointercancel",up);canvas.removeEventListener("wheel",wheel);canvas.removeEventListener("keydown",key);}};
 instance.setMode(mode);raf=requestAnimationFrame(frame);active=instance;return instance;
}
window.HCUThirteenthNotch3D={mount,destroy,copyFor:locale=>COPY[locale]||COPY.en};
})();