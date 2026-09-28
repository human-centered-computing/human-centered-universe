(function(){
  "use strict";

  const CHOICE_TO_MODE={
    hold_the_relation:"HUMAN",
    human_direction:"HUMAN",
    measure_without_declaring_truth:"LIGHT",
    light_direction:"LIGHT",
    keep_uncertainty_open:"DARK",
    dark_direction:"DARK"
  };
  const COPY={
    en:{title:"FIRST VIBRATION — 3D observation",help:"Drag or use ← → to orbit. Use ↑ ↓ to change distance.",reset:"Reset view",fallback:"WebGL is unavailable. The story and every choice remain available as text."},
    tr:{title:"İLK TİTREŞİM — 3D gözlem",help:"Döndürmek için sürükleyin veya ← → kullanın. Uzaklık için ↑ ↓ kullanın.",reset:"Görünümü sıfırla",fallback:"WebGL kullanılamıyor. Hikâye ve tüm seçimler metin olarak erişilebilir."},
    de:{title:"ERSTE SCHWINGUNG — 3D-Beobachtung",help:"Ziehen oder ← → zum Drehen; ↑ ↓ für die Entfernung.",reset:"Ansicht zurücksetzen",fallback:"WebGL ist nicht verfügbar. Geschichte und Auswahl bleiben als Text zugänglich."},
    es:{title:"PRIMERA VIBRACIÓN — observación 3D",help:"Arrastra o usa ← → para girar; ↑ ↓ para la distancia.",reset:"Restablecer vista",fallback:"WebGL no está disponible. La historia y las opciones siguen accesibles como texto."},
    fr:{title:"PREMIÈRE VIBRATION — observation 3D",help:"Faites glisser ou utilisez ← → pour tourner ; ↑ ↓ pour la distance.",reset:"Réinitialiser la vue",fallback:"WebGL n’est pas disponible. Le récit et les choix restent accessibles en texte."},
    it:{title:"PRIMA VIBRAZIONE — osservazione 3D",help:"Trascina o usa ← → per ruotare; ↑ ↓ per la distanza.",reset:"Reimposta vista",fallback:"WebGL non è disponibile. Storia e scelte restano accessibili come testo."},
    pt:{title:"PRIMEIRA VIBRAÇÃO — observação 3D",help:"Arrasta ou usa ← → para rodar; ↑ ↓ para a distância.",reset:"Repor vista",fallback:"WebGL não está disponível. A história e as escolhas continuam acessíveis em texto."},
    ru:{title:"ПЕРВАЯ ВИБРАЦИЯ — 3D-наблюдение",help:"Перетаскивайте или используйте ← → для вращения; ↑ ↓ для дистанции.",reset:"Сбросить вид",fallback:"WebGL недоступен. История и выборы остаются доступны в виде текста."},
    "zh-CN":{title:"第一次振动 — 3D观察",help:"拖动或使用 ← → 环绕；使用 ↑ ↓ 调整距离。",reset:"重置视图",fallback:"WebGL不可用。故事和所有选择仍可通过文本访问。"},
    ja:{title:"第一の振動 — 3D観測",help:"ドラッグまたは ← → で回転、↑ ↓ で距離を変更します。",reset:"表示をリセット",fallback:"WebGLを利用できません。物語と選択肢はテキストで引き続き利用できます。"},
    ar:{title:"الاهتزاز الأول — مشاهدة ثلاثية الأبعاد",help:"اسحب أو استخدم ← → للدوران، و↑ ↓ للمسافة.",reset:"إعادة ضبط المشهد",fallback:"WebGL غير متاح. تبقى القصة وجميع الخيارات متاحة نصيًا."},
    ku:{title:"LERIZÎNA YEKEM — temaşeya 3D",help:"Ji bo zivirandinê bikişîne an ← → bi kar bîne; ji bo dûrahiyê ↑ ↓.",reset:"Dîmenê vegerîne",fallback:"WebGL ne berdest e. Çîrok û hemû hilbijartin wekî nivîs berdest in."}
  };

  let active=null;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const multiply=(a,b)=>{
    const out=new Float32Array(16);
    for(let c=0;c<4;c++) for(let r=0;r<4;r++) out[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
    return out;
  };
  const perspective=(fov,aspect,near,far)=>{
    const f=1/Math.tan(fov/2),nf=1/(near-far);
    return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
  };
  const lookAt=(eye,target,up)=>{
    let zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2];
    let zlen=Math.hypot(zx,zy,zz)||1; zx/=zlen; zy/=zlen; zz/=zlen;
    let xx=up[1]*zz-up[2]*zy,xy=up[2]*zx-up[0]*zz,xz=up[0]*zy-up[1]*zx;
    let xlen=Math.hypot(xx,xy,xz)||1; xx/=xlen; xy/=xlen; xz/=xlen;
    const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
    return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*eye[0]+xy*eye[1]+xz*eye[2]),-(yx*eye[0]+yy*eye[1]+yz*eye[2]),-(zx*eye[0]+zy*eye[1]+zz*eye[2]),1]);
  };
  const shader=(gl,type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
  const program=(gl)=>{
    const vs=shader(gl,gl.VERTEX_SHADER,"attribute vec3 a_position;attribute vec4 a_color;uniform mat4 u_matrix;uniform float u_pointSize;varying vec4 v_color;void main(){gl_Position=u_matrix*vec4(a_position,1.0);gl_PointSize=u_pointSize;v_color=a_color;}");
    const fs=shader(gl,gl.FRAGMENT_SHADER,"precision mediump float;varying vec4 v_color;void main(){gl_FragColor=v_color;}");
    const p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;
  };
  const pushVertex=(a,x,y,z,c)=>a.push(x,y,z,c[0],c[1],c[2],c[3]);
  const pushBox=(a,cx,cy,cz,sx,sy,sz,color,rotation=0)=>{
    const corners=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const world=corners.map(([x,y,z])=>{x*=sx/2;y*=sy/2;z*=sz/2;const co=Math.cos(rotation),si=Math.sin(rotation);return[cx+x*co-z*si,cy+y,cz+x*si+z*co];});
    const faces=[[0,1,2,0,2,3],[5,4,7,5,7,6],[4,0,3,4,3,7],[1,5,6,1,6,2],[3,2,6,3,6,7],[4,5,1,4,1,0]];
    faces.flat().forEach(i=>pushVertex(a,...world[i],color));
  };
  const staticGeometry=()=>{
    const solid=[],lines=[];
    for(let i=0;i<12;i++){
      const angle=i*Math.PI*2/12,r=5.2,x=Math.sin(angle)*r,z=Math.cos(angle)*r;
      const shade=.42+(i%3)*.035,color=[shade*.94,shade*.82,shade*.58,1];
      pushBox(solid,x,1.55,z,.68,3.1,.72,color,angle);
      pushBox(solid,x,3.05,z,1.75,.62,.78,[shade,shade*.88,shade*.65,1],angle);
    }
    const ring=(radius,y,color,segments=96)=>{for(let i=0;i<=segments;i++){const a=i*Math.PI*2/segments;pushVertex(lines,Math.sin(a)*radius,y,Math.cos(a)*radius,color);}};
    ring(5.9,.03,[.42,.36,.25,.8]);ring(3.6,.025,[.22,.25,.34,.55]);
    for(let i=0;i<12;i++){const a=i*Math.PI*2/12;pushVertex(lines,Math.sin(a)*3.6,.03,Math.cos(a)*3.6,[.2,.22,.3,.25]);pushVertex(lines,Math.sin(a)*5.9,.03,Math.cos(a)*5.9,[.35,.3,.22,.5]);}
    return {solid:new Float32Array(solid),lines:new Float32Array(lines)};
  };
  const dynamicGeometry=(mode,time)=>{
    const lines=[],points=[];const turns=4,segments=180;
    const palette=mode==="LIGHT"?[[.82,.91,1,.9],[.55,.72,1,.65]]:mode==="DARK"?[[.58,.48,.75,.72],[.22,.16,.34,.5]]:mode==="HUMAN"?[[.92,.75,.35,.92],[.64,.72,.98,.74]]:[[.86,.67,.28,.82],[.48,.4,.68,.58]];
    const speed=mode==="LIGHT"?1.25:mode==="DARK"?.38:.75;
    for(let strand=0;strand<2;strand++) for(let i=0;i<=segments;i++){
      const f=i/segments,a=f*Math.PI*2*turns+time*speed+strand*Math.PI;
      const radius=.34+f*1.0+(mode==="HUMAN"?.12*Math.sin(f*Math.PI*4):0);
      const y=.18+f*4.2;
      pushVertex(lines,Math.cos(a)*radius,y,Math.sin(a)*radius,palette[strand]);
      if(i%12===0) pushVertex(points,Math.cos(a)*radius,y,Math.sin(a)*radius,[palette[strand][0],palette[strand][1],palette[strand][2],1]);
    }
    if(mode==="LIGHT") for(let band=0;band<5;band++) for(let i=0;i<=100;i++){const x=-3.2+i*.064,z=(band-2)*.42,y=.28+.2*Math.sin(i*.28+time*1.8+band);pushVertex(lines,x,y,z,[.68,.86,1,.54]);}
    if(mode==="DARK") for(let arc=0;arc<3;arc++) for(let i=0;i<=72;i++){const a=-1.15+i/72*2.3,r=1.9+arc*.46;pushVertex(lines,Math.sin(a)*r,.12+arc*.08,Math.cos(a)*r,[.38,.3,.52,.34]);}
    return {lines:new Float32Array(lines),points:new Float32Array(points)};
  };
  const upload=(gl,data,usage)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,usage);return b;};
  const configureAttributes=(gl,p,buffer)=>{
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);const stride=7*4;
    const pos=gl.getAttribLocation(p,"a_position"),col=gl.getAttribLocation(p,"a_color");
    gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,stride,0);
    gl.enableVertexAttribArray(col);gl.vertexAttribPointer(col,4,gl.FLOAT,false,stride,3*4);
  };
  function copyFor(locale){return COPY[locale]||COPY.en;}
  function destroy(){if(active){active.destroy();active=null;}}
  function mount(options={}){
    destroy();const canvas=options.canvas;if(!canvas)return null;
    const fallback=options.fallback||canvas.parentElement?.querySelector(".fv3d-fallback");
    const gl=canvas.getContext("webgl",{antialias:true,alpha:false,preserveDrawingBuffer:false});
    if(!gl){canvas.hidden=true;if(fallback)fallback.hidden=false;return null;}
    let p;try{p=program(gl);}catch(error){console.error(error);canvas.hidden=true;if(fallback)fallback.hidden=false;return null;}
    const stat=staticGeometry(),solidBuffer=upload(gl,stat.solid,gl.STATIC_DRAW),staticLineBuffer=upload(gl,stat.lines,gl.STATIC_DRAW),dynamicBuffer=gl.createBuffer();
    const matrixLoc=gl.getUniformLocation(p,"u_matrix"),pointSizeLoc=gl.getUniformLocation(p,"u_pointSize");
    let mode=CHOICE_TO_MODE[options.mode]||options.mode||"NEUTRAL",yaw=.28,distance=10.8,pitch=.31,dragging=false,lastX=0,raf=0,dead=false;
    const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||false;
    const resize=()=>{const ratio=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,Math.floor(canvas.clientWidth*ratio)),h=Math.max(1,Math.floor(canvas.clientHeight*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}};
    const drawBuffer=(buffer,count,primitive,size=1)=>{configureAttributes(gl,p,buffer);gl.uniform1f(pointSizeLoc,size);gl.drawArrays(primitive,0,count);};
    const frame=(stamp)=>{
      if(dead)return;resize();if(!reduced&&!dragging)yaw+=.000035*Math.min(stamp-(frame.last||stamp),40);frame.last=stamp;
      const eye=[Math.sin(yaw)*distance,3.25+Math.sin(pitch)*1.6,Math.cos(yaw)*distance];
      const view=lookAt(eye,[0,1.65,0],[0,1,0]),proj=perspective(Math.PI/3,canvas.width/canvas.height,.1,60),matrix=multiply(proj,view);
      const t=reduced?0:stamp/1000,dyn=dynamicGeometry(mode,t);
      gl.clearColor(.025,.03,.055,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(p);gl.uniformMatrix4fv(matrixLoc,false,matrix);
      drawBuffer(solidBuffer,stat.solid.length/7,gl.TRIANGLES);
      gl.disable(gl.DEPTH_TEST);drawBuffer(staticLineBuffer,stat.lines.length/7,gl.LINE_STRIP);
      gl.bindBuffer(gl.ARRAY_BUFFER,dynamicBuffer);gl.bufferData(gl.ARRAY_BUFFER,dyn.lines,gl.DYNAMIC_DRAW);drawBuffer(dynamicBuffer,dyn.lines.length/7,gl.LINE_STRIP);
      gl.bufferData(gl.ARRAY_BUFFER,dyn.points,gl.DYNAMIC_DRAW);drawBuffer(dynamicBuffer,dyn.points.length/7,gl.POINTS,mode==="HUMAN"?5:4);
      raf=requestAnimationFrame(frame);
    };
    const onDown=e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture?.(e.pointerId);};
    const onMove=e=>{if(!dragging)return;yaw+=(e.clientX-lastX)*.009;lastX=e.clientX;};
    const onUp=()=>{dragging=false;};
    const onWheel=e=>{e.preventDefault();distance=clamp(distance+e.deltaY*.008,7,16);};
    const onKey=e=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home"].includes(e.key))return;e.preventDefault();if(e.key==="ArrowLeft")yaw-=.12;if(e.key==="ArrowRight")yaw+=.12;if(e.key==="ArrowUp")distance=clamp(distance-.5,7,16);if(e.key==="ArrowDown")distance=clamp(distance+.5,7,16);if(e.key==="Home"){yaw=.28;distance=10.8;}};
    canvas.addEventListener("pointerdown",onDown);canvas.addEventListener("pointermove",onMove);canvas.addEventListener("pointerup",onUp);canvas.addEventListener("pointercancel",onUp);canvas.addEventListener("wheel",onWheel,{passive:false});canvas.addEventListener("keydown",onKey);
    const instance={
      setMode(value){mode=CHOICE_TO_MODE[value]||value||"NEUTRAL";canvas.dataset.mode=mode;},
      reset(){yaw=.28;distance=10.8;pitch=.31;canvas.focus();},
      destroy(){dead=true;cancelAnimationFrame(raf);canvas.removeEventListener("pointerdown",onDown);canvas.removeEventListener("pointermove",onMove);canvas.removeEventListener("pointerup",onUp);canvas.removeEventListener("pointercancel",onUp);canvas.removeEventListener("wheel",onWheel);canvas.removeEventListener("keydown",onKey);}
    };
    instance.setMode(mode);raf=requestAnimationFrame(frame);active=instance;return instance;
  }
  window.HCUFirstVibration3D={mount,destroy,copyFor};
})();
