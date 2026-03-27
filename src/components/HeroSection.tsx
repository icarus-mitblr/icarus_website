import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Load Greek font via a style tag injected once
const injectFont = () => {
  if (document.getElementById("icarus-greek-font")) return;
  const link = document.createElement("link");
  link.id = "icarus-greek-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=GFS+Didot&family=Cinzel:wght@700&display=swap";
  document.head.appendChild(link);
};

// Latin letters and their Greek equivalents (ΙΚΑΡΟΣ)
const LATIN_LETTERS  = ["I", "C", "A", "R", "U", "S"];
const GREEK_LETTERS  = ["Ι", "Κ", "Α", "Ρ", "Ο", "Σ"];

// animation timing
const INTRO_DONE_MS  = 2200;   // after intro reveal finishes
const HOLD_MS        = 2800;   // how long each script stays visible
const MORPH_STAGGER  = 90;     // ms between each letter morphing
const MORPH_DUR      = 0.55;   // seconds per letter crossfade
const FULL_CYCLE_MS  = HOLD_MS * 2 + (MORPH_STAGGER * 6) + MORPH_DUR * 1000 * 2;

const letterVariants = {
  hidden:  { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.3 + i * 0.12,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

// ── MorphLetter ───────────────────────────────────────────────
interface MorphLetterProps {
  latin: string;
  greek: string;
  index: number;
  showGreek: boolean;
  introVisible: boolean;
  morphStarted: boolean;
}

const MorphLetter = ({
  latin,
  greek,
  index,
  showGreek,
  introVisible,
  morphStarted,
}: MorphLetterProps) => {
  const staggerDelay = (index * MORPH_STAGGER) / 1000;

  const sharedStyle: React.CSSProperties = {
    textShadow:
      "0 0 30px hsl(45 93% 47% / 0.35)," +
      "0 2px 12px rgba(0,0,0,0.95)," +
      "0 0 2px rgba(0,0,0,1)",
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  };

  return (
    <motion.span
      custom={index}
      variants={letterVariants}
      initial="hidden"
      animate={introVisible ? "visible" : "hidden"}
      className="font-mono text-6xl md:text-8xl lg:text-9xl font-bold text-primary tracking-[-0.04em]"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "0.62em",
      }}
    >
      {/* Latin character */}
      <motion.span
        style={{ ...sharedStyle, fontFamily: "'Cinzel', serif" }}
        animate={
          morphStarted
            ? showGreek
              ? { opacity: 0, filter: "blur(14px)", y: -18, scale: 0.85 }
              : { opacity: 1, filter: "blur(0px)",  y: 0,   scale: 1    }
            : { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }
        }
        transition={{ delay: staggerDelay, duration: MORPH_DUR, ease: [0.4, 0, 0.2, 1] }}
      >
        {latin}
      </motion.span>

      {/* Greek character */}
      <motion.span
        style={{ ...sharedStyle, fontFamily: "'GFS Didot', serif", letterSpacing: "0.01em" }}
        animate={
          morphStarted
            ? showGreek
              ? { opacity: 1, filter: "blur(0px)",  y: 0,  scale: 1    }
              : { opacity: 0, filter: "blur(14px)", y: 18, scale: 0.85 }
            : { opacity: 0, filter: "blur(14px)", y: 18, scale: 0.85 }
        }
        transition={{ delay: staggerDelay, duration: MORPH_DUR, ease: [0.4, 0, 0.2, 1] }}
      >
        {greek}
      </motion.span>
    </motion.span>
  );
};

// ── SolarSystemBg ─────────────────────────────────────────────
const SolarSystemBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 320;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.7 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.025 + 0.006,
    }));

    const planets = [
      { orbitRX:0.08, orbitRY:0.045, speed:0.018,  size:4.5,  color:"rgba(200,160,110,", glow:"rgba(220,180,130,", phase:0,   tilt:0.15, name:"Mercury" },
      { orbitRX:0.14, orbitRY:0.075, speed:0.012,  size:7.5,  color:"rgba(240,200,100,", glow:"rgba(255,220,120,", phase:1.2, tilt:0.1,  name:"Venus"   },
      { orbitRX:0.21, orbitRY:0.115, speed:0.008,  size:8.0,  color:"rgba(60,140,230,",  glow:"rgba(80,180,255,",  phase:2.5, tilt:0.08, name:"Earth"   },
      { orbitRX:0.30, orbitRY:0.165, speed:0.005,  size:6.0,  color:"rgba(220,90,50,",   glow:"rgba(255,110,60,",  phase:0.8, tilt:0.12, name:"Mars"    },
      { orbitRX:0.44, orbitRY:0.24,  speed:0.0025, size:14.0, color:"rgba(210,175,120,", glow:"rgba(240,205,150,", phase:3.8, tilt:0.06, name:"Jupiter" },
      { orbitRX:0.58, orbitRY:0.31,  speed:0.0015, size:11.5, color:"rgba(220,190,130,", glow:"rgba(245,215,155,", phase:5.1, tilt:0.09, name:"Saturn"  },
      { orbitRX:0.72, orbitRY:0.38,  speed:0.0009, size:9.5,  color:"rgba(160,210,230,", glow:"rgba(180,230,245,", phase:2.2, tilt:0.07, name:"Uranus"  },
      { orbitRX:0.85, orbitRY:0.44,  speed:0.0006, size:9.0,  color:"rgba(60,100,220,",  glow:"rgba(80,130,255,",  phase:4.5, tilt:0.05, name:"Neptune" },
      { orbitRX:0.94, orbitRY:0.49,  speed:0.0004, size:3.5,  color:"rgba(180,140,120,", glow:"rgba(200,160,140,", phase:1.7, tilt:0.18, name:"Pluto"   },
    ];

    const BELT_COUNT = 140;
    const belt = Array.from({ length: BELT_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const rx = 0.36 + Math.random() * 0.06;
      return { angle, rx, ry: rx * 0.54, speed: 0.001 + Math.random() * 0.002, size: Math.random() * 1.6 + 0.4, a: Math.random() * 0.35 + 0.1 };
    });

    let raf: number;

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const minDim = Math.min(w, h);
      const sunX = w / 2, sunY = h / 2;

     ctx.fillStyle = "#00000f";
ctx.fillRect(0, 0, w, h);

const nebula = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.55);
nebula.addColorStop(0,   "rgba(30, 60, 120, 0.18)");
nebula.addColorStop(0.5, "rgba(10, 25,  70, 0.10)");
nebula.addColorStop(1,   "rgba(0,   0,   0, 0)");
ctx.fillStyle = nebula;
ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        const alpha = s.a * (0.55 + 0.45 * Math.sin(s.twinkle));
        ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,245,210,${alpha})`; ctx.fill();
      }

      for (let i = 5; i >= 1; i--) {
        const g = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, minDim * 0.028 * (1 + i * 0.9));
        g.addColorStop(0, `rgba(255,220,60,${0.09 - i * 0.014})`);
        g.addColorStop(1, "rgba(255,140,0,0)");
        ctx.beginPath(); ctx.arc(sunX, sunY, minDim * 0.028 * (1 + i * 0.9), 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }

      const sunR = minDim * 0.028;
      const sg = ctx.createRadialGradient(sunX - sunR*0.3, sunY - sunR*0.3, 0, sunX, sunY, sunR);
      sg.addColorStop(0,   "rgba(255,255,200,0.95)");
      sg.addColorStop(0.4, "rgba(255,220,60,0.92)");
      sg.addColorStop(1,   "rgba(255,130,0,0.85)");
      ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fillStyle = sg; ctx.fill();

      for (const p of planets) {
        ctx.beginPath();
        ctx.ellipse(sunX, sunY, p.orbitRX*minDim, p.orbitRY*minDim, p.tilt, 0, Math.PI*2);
        ctx.strokeStyle = "rgba(200,165,60,0.12)"; ctx.lineWidth = 0.7; ctx.stroke();
      }

      for (const b of belt) {
        b.angle += b.speed;
        const bx = sunX + Math.cos(b.angle) * b.rx * minDim;
        const by = sunY + Math.sin(b.angle) * b.ry * minDim;
        ctx.beginPath(); ctx.arc(bx, by, b.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(165,145,105,${b.a})`; ctx.fill();
      }

      for (const p of planets) {
        p.phase += p.speed;
        const rx = p.orbitRX * minDim, ry = p.orbitRY * minDim;
        const cosT = Math.cos(p.tilt), sinT = Math.sin(p.tilt);
        const ex = Math.cos(p.phase) * rx, ey = Math.sin(p.phase) * ry;
        const px = sunX + ex*cosT - ey*sinT;
        const py = sunY + ex*sinT + ey*cosT;

        const outerGlow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 4);
        outerGlow.addColorStop(0,   `${p.glow}0.28)`);
        outerGlow.addColorStop(0.4, `${p.glow}0.12)`);
        outerGlow.addColorStop(1,   `${p.glow}0)`);
        ctx.beginPath(); ctx.arc(px, py, p.size * 4, 0, Math.PI*2); ctx.fillStyle = outerGlow; ctx.fill();

        const midGlow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2);
        midGlow.addColorStop(0, `${p.glow}0.5)`);
        midGlow.addColorStop(1, `${p.glow}0)`);
        ctx.beginPath(); ctx.arc(px, py, p.size * 2, 0, Math.PI*2); ctx.fillStyle = midGlow; ctx.fill();

        const bg = ctx.createRadialGradient(px - p.size*0.35, py - p.size*0.35, 0, px, py, p.size);
        bg.addColorStop(0,   `${p.color}1.0)`);
        bg.addColorStop(0.5, `${p.color}0.9)`);
        bg.addColorStop(1,   `${p.color}0.65)`);
        ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI*2); ctx.fillStyle = bg; ctx.fill();

        const rim = ctx.createRadialGradient(px, py, p.size*0.6, px, py, p.size*1.15);
        rim.addColorStop(0,   `${p.glow}0)`);
        rim.addColorStop(0.7, `${p.glow}0.2)`);
        rim.addColorStop(1,   `${p.glow}0.4)`);
        ctx.beginPath(); ctx.arc(px, py, p.size*1.15, 0, Math.PI*2); ctx.fillStyle = rim; ctx.fill();

        const shadowAngle = Math.atan2(py - sunY, px - sunX) + Math.PI;
        ctx.save();
        ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI*2); ctx.clip();
        const sg2 = ctx.createRadialGradient(px + Math.cos(shadowAngle)*p.size*0.4, py + Math.sin(shadowAngle)*p.size*0.4, 0, px, py, p.size*1.1);
        sg2.addColorStop(0,   "rgba(0,0,0,0)");
        sg2.addColorStop(0.4, "rgba(0,0,0,0.1)");
        sg2.addColorStop(1,   "rgba(0,0,0,0.5)");
        ctx.fillStyle = sg2; ctx.fill(); ctx.restore();

        if (p.name === "Jupiter") {
          ctx.save(); ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI*2); ctx.clip();
          for (let b = 0; b < 4; b++) {
            const by2 = py - p.size*0.6 + b * p.size*0.4;
            ctx.beginPath(); ctx.ellipse(px, by2, p.size, p.size*0.12, 0, 0, Math.PI*2);
            ctx.fillStyle = `rgba(180,140,90,0.25)`; ctx.fill();
          }
          ctx.restore();
        }

        if (p.name === "Saturn") {
          ctx.save(); ctx.translate(px, py); ctx.scale(1, 0.3);
          for (let ri = 0; ri < 4; ri++) {
            const inner = p.size * (1.35 + ri*0.32), outer = p.size * (1.6 + ri*0.32);
            ctx.beginPath(); ctx.arc(0, 0, outer, 0, Math.PI*2); ctx.arc(0, 0, inner, 0, Math.PI*2, true);
            ctx.fillStyle = `rgba(210,185,130,${0.35 - ri*0.06})`; ctx.fill();
          }
          ctx.restore();
        }

        if (p.name === "Uranus") {
          ctx.save(); ctx.translate(px, py); ctx.scale(0.28, 1);
          for (let ri = 0; ri < 3; ri++) {
            const inner = p.size * (1.4 + ri*0.28), outer = p.size * (1.62 + ri*0.28);
            ctx.beginPath(); ctx.arc(0, 0, outer, 0, Math.PI*2); ctx.arc(0, 0, inner, 0, Math.PI*2, true);
            ctx.fillStyle = `rgba(160,210,230,${0.28 - ri*0.07})`; ctx.fill();
          }
          ctx.restore();
        }

        if (p.name === "Neptune") {
          ctx.save(); ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI*2); ctx.clip();
          ctx.beginPath(); ctx.ellipse(px, py - p.size*0.2, p.size*0.85, p.size*0.18, 0, 0, Math.PI*2);
          ctx.fillStyle = `rgba(120,160,255,0.22)`; ctx.fill();
          ctx.restore();
        }

        if (p.name === "Earth") {
          const moonAngle = p.phase * 13, moonDist = p.size * 3.0;
          const mx = px + Math.cos(moonAngle) * moonDist, my = py + Math.sin(moonAngle) * moonDist;
          const mg = ctx.createRadialGradient(mx-0.5, my-0.5, 0, mx, my, 2.5);
          mg.addColorStop(0, "rgba(230,230,240,0.9)"); mg.addColorStop(1, "rgba(180,180,200,0.5)");
          ctx.beginPath(); ctx.arc(mx, my, 2.5, 0, Math.PI*2); ctx.fillStyle = mg; ctx.fill();
        }

        if (p.name === "Mars") {
          [7.5, 5.0].forEach((dist, mi) => {
            const mAngle = p.phase * (8 + mi*4);
            const mx = px + Math.cos(mAngle) * p.size * dist, my = py + Math.sin(mAngle) * p.size * dist;
            ctx.beginPath(); ctx.arc(mx, my, 1.2, 0, Math.PI*2);
            ctx.fillStyle = "rgba(200,170,140,0.55)"; ctx.fill();
          });
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.82 }}/>
  );
};

// ── CubeSat3D ─────────────────────────────────────────────────
const CubeSat3D = ({ size = 160 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size; canvas.height = size;
    const cx = size/2, cy = size/2, S = size*0.28;
    let rotX = 0.42, rotY = 0.0, raf: number;

    const project = (x:number,y:number,z:number) => {
      const cosY=Math.cos(rotY),sinY=Math.sin(rotY);
      const x1=x*cosY+z*sinY,z1=-x*sinY+z*cosY;
      const cosX=Math.cos(rotX),sinX=Math.sin(rotX);
      const y2=y*cosX-z1*sinX,z2=y*sinX+z1*cosX;
      const fov=3.8,sc=fov/(fov+z2*0.4);
      return{sx:cx+x1*S*sc,sy:cy+y2*S*sc,depth:z2,sc};
    };

    const V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const FACES=[
      {verts:[0,1,2,3],nx:0,ny:0,nz:-1},{verts:[5,4,7,6],nx:0,ny:0,nz:1},
      {verts:[1,5,6,2],nx:1,ny:0,nz:0},{verts:[4,0,3,7],nx:-1,ny:0,nz:0},
      {verts:[4,5,1,0],nx:0,ny:-1,nz:0},{verts:[3,2,6,7],nx:0,ny:1,nz:0},
    ];
    const EDGES=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    const PCB_Y=0.0;
    const CHIPS:[number,number,number,number,number,string,string][]=[
      [0.0,PCB_Y,0.0,0.38,0.28,"OBC","rgba(0,220,80,"],
      [-0.42,PCB_Y,0.38,0.28,0.22,"EPS","rgba(255,180,20,"],
      [0.0,PCB_Y,-0.48,0.30,0.18,"COM","rgba(50,180,255,"],
      [0.45,PCB_Y,-0.1,0.22,0.18,"IMU","rgba(180,80,255,"],
      [0.35,PCB_Y,0.35,0.22,0.16,"PLD","rgba(255,80,80,"],
    ];
    const BATTERY={x:-0.1,y:0.5,z:0.0,w:0.55,h:0.25,d:0.4};
    const TRACES:[number,number,number,number,number,number,string][]=[
      [0.0,PCB_Y,0.0,0.0,PCB_Y,-0.48,"rgba(0,220,80,0.55)"],
      [0.0,PCB_Y,0.0,-0.42,PCB_Y,0.38,"rgba(255,180,20,0.5)"],
      [0.0,PCB_Y,0.0,0.45,PCB_Y,-0.1,"rgba(180,80,255,0.5)"],
      [0.0,PCB_Y,0.0,0.35,PCB_Y,0.35,"rgba(255,80,80,0.45)"],
      [-0.7,PCB_Y,0.38,0.7,PCB_Y,0.38,"rgba(255,180,20,0.3)"],
      [-0.42,PCB_Y,-0.7,-0.42,PCB_Y,0.7,"rgba(255,180,20,0.3)"],
      [-0.7,PCB_Y,-0.1,0.7,PCB_Y,-0.1,"rgba(0,200,80,0.28)"],
      [0.1,PCB_Y,-0.7,0.1,PCB_Y,0.7,"rgba(0,200,80,0.28)"],
    ];
    const VRAILS:[number,number,number,number,number,number][]=[
      [-0.7,-1.0,-0.7,-0.7,1.0,-0.7],[0.7,-1.0,-0.7,0.7,1.0,-0.7],
      [-0.7,-1.0,0.7,-0.7,1.0,0.7],[0.7,-1.0,0.7,0.7,1.0,0.7],
    ];
    const VIAS:[number,number,number][]=[
      [0.0,PCB_Y,-0.1],[-0.42,PCB_Y,-0.1],[0.1,PCB_Y,0.38],[0.1,PCB_Y,-0.48],
      [0.45,PCB_Y,-0.1],[0.1,PCB_Y,0.35],[-0.7,PCB_Y,-0.7],[0.7,PCB_Y,-0.7],
      [-0.7,PCB_Y,0.7],[0.7,PCB_Y,0.7],
    ];
    const LEDS=[
      {x:-0.72,y:-0.5,z:-0.4,col:"rgba(80,255,120,"},
      {x:-0.72,y:-0.5,z:0.0,col:"rgba(255,200,30,"},
      {x:-0.72,y:-0.5,z:0.4,col:"rgba(50,180,255,"},
      {x:0.72,y:-0.3,z:-0.2,col:"rgba(255,80,180,"},
      {x:0.72,y:-0.3,z:0.2,col:"rgba(80,255,120,"},
      {x:0.0,y:-0.6,z:-0.72,col:"rgba(50,180,255,"},
    ];
    const CAMERA={x:0.25,y:0.1,z:-0.72};

    const drawSolarCells=(p:{sx:number;sy:number}[],brightness:number)=>{ctx.save();ctx.beginPath();ctx.moveTo(p[0].sx,p[0].sy);p.forEach(pt=>ctx.lineTo(pt.sx,pt.sy));ctx.closePath();ctx.clip();ctx.fillStyle="rgba(4,7,22,0.12)";ctx.fill();ctx.fillStyle="rgba(20,55,180,0.07)";ctx.fill();const alpha=0.22;const lerp=(t:number,a:number,c:number)=>a+t*(c-a);const bl=(u:number,v:number)=>({sx:lerp(v,lerp(u,p[0].sx,p[3].sx),lerp(u,p[1].sx,p[2].sx)),sy:lerp(v,lerp(u,p[0].sy,p[3].sy),lerp(u,p[1].sy,p[2].sy))});const ROWS=4,COLS=4;ctx.strokeStyle=`rgba(50,100,240,${alpha})`;ctx.lineWidth=0.6;for(let r=1;r<ROWS;r++){const t=r/ROWS,a=bl(t,0),b=bl(t,1);ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(b.sx,b.sy);ctx.stroke();}for(let c=1;c<COLS;c++){const t=c/COLS,a=bl(0,t),b=bl(1,t);ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(b.sx,b.sy);ctx.stroke();}for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const pt=bl((r+0.5)/ROWS,(c+0.5)/COLS);ctx.beginPath();ctx.arc(pt.sx,pt.sy,0.7,0,Math.PI*2);ctx.fillStyle=`rgba(80,140,255,${alpha*0.6})`;ctx.fill();}ctx.restore();ctx.beginPath();ctx.moveTo(p[0].sx,p[0].sy);p.forEach(pt=>ctx.lineTo(pt.sx,pt.sy));ctx.closePath();ctx.strokeStyle=`rgba(210,160,20,${Math.max(0.18,brightness*0.7)})`;ctx.lineWidth=0.8;ctx.stroke();};
    const drawCircuitry=()=>{ctx.save();const pcbPts=[[-0.72,PCB_Y,-0.72],[0.72,PCB_Y,-0.72],[0.72,PCB_Y,0.72],[-0.72,PCB_Y,0.72]].map(([x,y,z])=>project(x,y,z));ctx.beginPath();ctx.moveTo(pcbPts[0].sx,pcbPts[0].sy);pcbPts.forEach(p=>ctx.lineTo(p.sx,p.sy));ctx.closePath();ctx.fillStyle="rgba(8,22,12,0.72)";ctx.fill();ctx.strokeStyle="rgba(0,200,60,0.45)";ctx.lineWidth=0.7;ctx.stroke();for(let i=1;i<8;i++){const t=i/8;const lerp=(a:number,b:number)=>a+t*(b-a);const a=project(lerp(-0.72,0.72),PCB_Y,-0.72);const b=project(lerp(-0.72,0.72),PCB_Y,0.72);const c=project(-0.72,PCB_Y,lerp(-0.72,0.72));const d=project(0.72,PCB_Y,lerp(-0.72,0.72));ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(b.sx,b.sy);ctx.strokeStyle="rgba(0,160,50,0.12)";ctx.lineWidth=0.3;ctx.stroke();ctx.beginPath();ctx.moveTo(c.sx,c.sy);ctx.lineTo(d.sx,d.sy);ctx.stroke();}const{x:bx,y:by,z:bz,w:bw,h:bh,d:bd}=BATTERY;const bv=[[bx-bw/2,by-bh/2,bz-bd/2],[bx+bw/2,by-bh/2,bz-bd/2],[bx+bw/2,by+bh/2,bz-bd/2],[bx-bw/2,by+bh/2,bz-bd/2],[bx-bw/2,by-bh/2,bz+bd/2],[bx+bw/2,by-bh/2,bz+bd/2],[bx+bw/2,by+bh/2,bz+bd/2],[bx-bw/2,by+bh/2,bz+bd/2]].map(([x,y,z])=>project(x as number,y as number,z as number));for(const f of[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6]]){ctx.beginPath();ctx.moveTo(bv[f[0]].sx,bv[f[0]].sy);f.forEach(i=>ctx.lineTo(bv[i].sx,bv[i].sy));ctx.closePath();ctx.fillStyle="rgba(18,28,6,0.65)";ctx.fill();ctx.strokeStyle="rgba(120,200,0,0.55)";ctx.lineWidth=0.7;ctx.stroke();}for(let i=1;i<3;i++){const t=i/3;const lerp=(a:number,b:number)=>a+t*(b-a);const a=project(lerp(bx-bw/2,bx+bw/2),by,bz-bd/2);const b=project(lerp(bx-bw/2,bx+bw/2),by,bz+bd/2);ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(b.sx,b.sy);ctx.strokeStyle="rgba(120,200,0,0.3)";ctx.lineWidth=0.5;ctx.stroke();}for(const[x1,y1,z1,x2,y2,z2,color]of TRACES){const a=project(x1 as number,y1 as number,z1 as number);const b=project(x2 as number,y2 as number,z2 as number);ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(b.sx,b.sy);ctx.strokeStyle=color as string;ctx.lineWidth=1.1;ctx.stroke();}for(const[x1,y1,z1,x2,y2,z2]of VRAILS){const a=project(x1,y1,z1),b=project(x2,y2,z2);ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(b.sx,b.sy);ctx.strokeStyle="rgba(255,180,20,0.3)";ctx.lineWidth=0.6;ctx.setLineDash([2,3]);ctx.stroke();ctx.setLineDash([]);}for(const[cx3,cy3,cz3,cw,ch,label,color]of CHIPS){const center=project(cx3 as number,cy3 as number,cz3 as number);const right=project((cx3 as number)+(cw as number)/2,cy3 as number,cz3 as number);const front=project(cx3 as number,cy3 as number,(cz3 as number)+(ch as number)/2);const pxW=Math.abs(right.sx-center.sx)*2;const pxH=Math.abs(front.sy-center.sy)*2;const rw=Math.max(pxW,10);const rh=Math.max(pxH,7);ctx.fillStyle=`${color}0.72)`;ctx.strokeStyle=`${color}0.85)`;ctx.lineWidth=0.9;ctx.beginPath();ctx.rect(center.sx-rw/2,center.sy-rh/2,rw,rh);ctx.fill();ctx.stroke();for(let p=0;p<3;p++){const ty=center.sy-rh/2+(p+0.5)*(rh/3);ctx.strokeStyle=`${color}0.55)`;ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(center.sx-rw/2-3,ty);ctx.lineTo(center.sx-rw/2,ty);ctx.stroke();ctx.beginPath();ctx.moveTo(center.sx+rw/2,ty);ctx.lineTo(center.sx+rw/2+3,ty);ctx.stroke();}ctx.beginPath();ctx.arc(center.sx-rw/2+2.5,center.sy-rh/2+2,1.2,0,Math.PI*2);ctx.fillStyle=`${color}0.7)`;ctx.fill();ctx.fillStyle=`${color}0.9)`;ctx.font=`bold ${Math.max(5,rw*0.28)}px monospace`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(label as string,center.sx,center.sy);}for(const[vx,vy,vz]of VIAS){const p=project(vx,vy,vz);ctx.beginPath();ctx.arc(p.sx,p.sy,2.2,0,Math.PI*2);ctx.fillStyle="rgba(8,20,10,0.85)";ctx.strokeStyle="rgba(0,220,80,0.65)";ctx.lineWidth=0.7;ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(p.sx,p.sy,0.9,0,Math.PI*2);ctx.fillStyle="rgba(0,220,80,0.7)";ctx.fill();}const cp=project(CAMERA.x,CAMERA.y,CAMERA.z);ctx.beginPath();ctx.arc(cp.sx,cp.sy,5.5,0,Math.PI*2);ctx.fillStyle="rgba(4,6,20,0.88)";ctx.strokeStyle="rgba(200,150,10,0.7)";ctx.lineWidth=0.9;ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(cp.sx,cp.sy,3.5,0,Math.PI*2);ctx.fillStyle="rgba(8,18,60,0.8)";ctx.strokeStyle="rgba(50,120,255,0.5)";ctx.lineWidth=0.6;ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(cp.sx,cp.sy,1.5,0,Math.PI*2);ctx.fillStyle="rgba(30,60,180,0.9)";ctx.fill();ctx.beginPath();ctx.arc(cp.sx-1.2,cp.sy-1.2,0.9,0,Math.PI*2);ctx.fillStyle="rgba(180,220,255,0.35)";ctx.fill();for(const led of LEDS){const p=project(led.x,led.y,led.z);ctx.beginPath();ctx.arc(p.sx,p.sy,3,0,Math.PI*2);ctx.fillStyle=`${led.col}0.85)`;ctx.fill();ctx.beginPath();ctx.arc(p.sx,p.sy,5.5,0,Math.PI*2);ctx.fillStyle=`${led.col}0.18)`;ctx.fill();}ctx.restore();};
    const drawGoldRail=(a:{sx:number;sy:number},b:{sx:number;sy:number},brt:number)=>{const br=Math.max(0.2,brt);ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(b.sx,b.sy);ctx.strokeStyle=`rgba(220,170,20,${0.3+br*0.65})`;ctx.lineWidth=1.8+br*1.2;ctx.lineCap="round";ctx.stroke();ctx.strokeStyle=`rgba(255,230,80,${br*0.4})`;ctx.lineWidth=0.6;ctx.stroke();};
    const drawBolt=(pt:{sx:number;sy:number},brt:number)=>{const br=Math.max(0.15,brt),r=2.2+br*1.2;ctx.beginPath();ctx.arc(pt.sx,pt.sy,r,0,Math.PI*2);ctx.fillStyle=`rgba(14,10,2,${0.8+br*0.15})`;ctx.fill();ctx.strokeStyle=`rgba(210,160,15,${0.3+br*0.6})`;ctx.lineWidth=0.8;ctx.stroke();ctx.beginPath();ctx.arc(pt.sx,pt.sy,r*0.5,0,Math.PI*2);ctx.fillStyle=`rgba(230,180,20,${0.4+br*0.5})`;ctx.fill();ctx.strokeStyle=`rgba(100,70,5,${br*0.6})`;ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(pt.sx-r*0.7,pt.sy);ctx.lineTo(pt.sx+r*0.7,pt.sy);ctx.stroke();ctx.beginPath();ctx.moveTo(pt.sx,pt.sy-r*0.7);ctx.lineTo(pt.sx,pt.sy+r*0.7);ctx.stroke();};

    const draw=()=>{
      ctx.clearRect(0,0,size,size);
      const pts=V.map(([x,y,z])=>project(x,y,z));
      const faceData=FACES.map(({verts,nx,ny,nz})=>{const cosY=Math.cos(rotY),sinY=Math.sin(rotY),cosX=Math.cos(rotX),sinX=Math.sin(rotX);const nx1=nx*cosY+nz*sinY,nz1=-nx*sinY+nz*cosY,ny2=ny*cosX-nz1*sinX,nz2=ny*sinX+nz1*cosX;const dot=-nz2;const lx=-0.5,ly=-0.8,lz=-0.3,len=Math.sqrt(lx*lx+ly*ly+lz*lz);const light=nx1*lx/len+ny2*ly/len+nz2*lz/len;const brightness=Math.max(0.05,light*0.8+0.35);const ps=verts.map(i=>pts[i]);const avgDepth=verts.reduce((s,i)=>s+pts[i].depth,0)/4;return{verts,ps,dot,brightness,avgDepth};}).sort((a,b)=>b.avgDepth-a.avgDepth);
      for(const{ps,brightness}of faceData){drawSolarCells(ps,brightness);}
      drawCircuitry();
      for(const[i,j]of EDGES){const a=pts[i],b=pts[j];const avgDepth=(a.depth+b.depth)/2;const brt=Math.max(0,Math.min(1,(-avgDepth+1.2)/2.4));drawGoldRail(a,b,brt);}
      for(let i=0;i<8;i++){const p=pts[i];const brt=Math.max(0,Math.min(1,(-p.depth+1.2)/2.4));drawBolt(p,brt);}
      const topPts=[pts[0],pts[1],pts[4],pts[5]];const topCenter={sx:topPts.reduce((s,p)=>s+p.sx,0)/4,sy:topPts.reduce((s,p)=>s+p.sy,0)/4-size*0.08};
      ctx.save();ctx.strokeStyle="rgba(215,165,18,0.85)";ctx.lineWidth=1.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(topCenter.sx,topCenter.sy+size*0.06);ctx.lineTo(topCenter.sx,topCenter.sy-size*0.1);ctx.stroke();
      [[size*0.06,-size*0.02],[size*0.045,-size*0.05],[size*0.03,-size*0.08]].forEach(([hw,dy])=>{ctx.beginPath();ctx.moveTo(topCenter.sx-hw,topCenter.sy+dy);ctx.lineTo(topCenter.sx+hw,topCenter.sy+dy);ctx.lineWidth=1.2;ctx.stroke();});
      ctx.beginPath();ctx.arc(topCenter.sx,topCenter.sy-size*0.1,2.5,0,Math.PI*2);ctx.fillStyle="rgba(255,215,40,0.95)";ctx.fill();
      for(let r=6;r<=20;r+=6){ctx.beginPath();ctx.arc(topCenter.sx,topCenter.sy-size*0.1,r,0,Math.PI*2);ctx.strokeStyle=`rgba(220,170,20,${0.2-r*0.006})`;ctx.lineWidth=0.6;ctx.setLineDash([2,4]);ctx.stroke();ctx.setLineDash([]);}
      ctx.restore();
      rotY+=0.012;
    };

    const loop=()=>{draw();raf=requestAnimationFrame(loop);};
    loop();
    return()=>cancelAnimationFrame(raf);
  },[size]);

  return <canvas ref={canvasRef} style={{display:"block",imageRendering:"crisp-edges"}}/>;
};

// ── OrbitingSatellite ─────────────────────────────────────────
const OrbitingSatellite=()=>{
  const[angle,setAngle]=useState(0);
  const rafRef=useRef<number>();
  const angleRef=useRef(0);
  const RX=360,RY=118;
  useEffect(()=>{const tick=()=>{angleRef.current+=0.005;setAngle(angleRef.current);rafRef.current=requestAnimationFrame(tick);};rafRef.current=requestAnimationFrame(tick);return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);};},[]);
  const ox=Math.cos(angle)*RX,oy=Math.sin(angle)*RY;
  const depth=(Math.sin(angle)+1)/2;
  const scale=0.55+depth*0.45,opacity=0.4+depth*0.6,tilt=Math.sin(angle)*12;
  return(
    <div className="absolute pointer-events-none" style={{top:"50%",left:"50%",transform:`translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) scale(${scale}) rotate(${tilt}deg)`,opacity,zIndex:depth>0.5?20:2,filter:`drop-shadow(0 0 ${12+depth*18}px rgba(220,168,20,${0.25+depth*0.35})) drop-shadow(0 4px 14px rgba(0,0,0,0.65))`}}>
      <CubeSat3D size={160}/>
    </div>
  );
};

// ── OrbitRing ─────────────────────────────────────────────────
const OrbitRing=()=>(
  <svg className="absolute pointer-events-none" style={{top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:1}} width="780" height="286" viewBox="0 0 780 286">
    <ellipse cx="390" cy="143" rx="358" ry="116" fill="none" stroke="rgba(200,160,30,0.1)" strokeWidth="1" strokeDasharray="5 9"/>
    {Array.from({length:32},(_,i)=>{const a=(i/32)*Math.PI*2;const ox=390+Math.cos(a)*358,oy=143+Math.sin(a)*116;const nx=Math.cos(a),ny=Math.sin(a);return<line key={i} x1={ox-nx*3} y1={oy-ny*3} x2={ox+nx*3} y2={oy+ny*3} stroke="rgba(200,160,30,0.18)" strokeWidth="0.8"/>;})}</svg>
);

// ── HeroSection ───────────────────────────────────────────────
const HeroSection = () => {
  const [morphStarted, setMorphStarted] = useState(false);
  const [showGreek, setShowGreek]       = useState(false);
  const [showGreekSub, setShowGreekSub] = useState(false);

  useEffect(() => {
    injectFont();

    const introTimer = setTimeout(() => {
      setMorphStarted(true);

      const runCycle = () => {
        // morph → Greek
        setShowGreek(true);
        setShowGreekSub(true);
        // after hold, morph back → Latin
        return setTimeout(() => {
          setShowGreek(false);
          setShowGreekSub(false);
        }, HOLD_MS);
      };

      let backTimer = runCycle();
      const interval = setInterval(() => {
        clearTimeout(backTimer);
        backTimer = runCycle();
      }, FULL_CYCLE_MS);

      return () => { clearTimeout(backTimer); clearInterval(interval); };
    }, INTRO_DONE_MS);

    return () => clearTimeout(introTimer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <SolarSystemBg/>
      <OrbitRing/>
      <OrbitingSatellite/>

      <motion.div
        initial={{opacity:0,scale:0.6,rotate:-90}} animate={{opacity:1,scale:1,rotate:0}}
        transition={{duration:1.5,ease:[0.16,1,0.3,1]}}
        className="absolute w-[320px] h-[320px] md:w-[460px] md:h-[460px] rounded-full"
        style={{border:"1px solid rgba(200,160,30,0.06)",zIndex:1}}>
        <motion.div animate={{rotate:360}} transition={{duration:55,repeat:Infinity,ease:"linear"}} className="absolute inset-0 rounded-full" style={{border:"1px dashed rgba(200,160,30,0.04)"}}/>
      </motion.div>

      {/* Dark radial backdrop */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 9,
          width: "600px",
          height: "260px",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.60) 40%, rgba(0,0,0,0.0) 100%)",
          borderRadius: "50%",
        }}
      />

      {/* ── ICARUS / ΙΚΑΡΟΣ morphing title ── */}
      <div className="relative flex items-center gap-[2px] md:gap-1" style={{ zIndex: 10 }}>
        {LATIN_LETTERS.map((letter, i) => (
          <MorphLetter
            key={i}
            latin={letter}
            greek={GREEK_LETTERS[i]}
            index={i}
            showGreek={showGreek}
            introVisible={true}
            morphStarted={morphStarted}
          />
        ))}
      </div>

      {/* ── Subtitle: crossfades between Latin and Greek ── */}
      <div
  style={{
    position: "relative",
    zIndex: 10,
    height: "2em", // FIXED
    marginTop: "clamp(1.5rem, 3vw, 2.5rem)", // FIXED
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
        {/* English subtitle */}
        <motion.p
          className="font-mono text-xs md:text-sm tracking-[0.28em] uppercase text-center"
          style={{
            color: "rgba(200,165,55,0.9)",
            textShadow: "0 1px 8px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)",
            position: "absolute",
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={
            morphStarted
              ? showGreekSub
                ? { opacity: 0, filter: "blur(8px)", y: -10 }
                : { opacity: 1, filter: "blur(0px)", y: 0 }
              : { opacity: 1, filter: "blur(0px)", y: 0 }
          }
          transition={
            morphStarted
              ? { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
              : { delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }
        >
          Student-Led Major Project
        </motion.p>

        {/* Greek subtitle — Φοιτητικό Έργο Εξαμήνου */}
        <motion.p
          className="text-xs md:text-sm tracking-[0.16em] text-center"
          style={{
            fontFamily: "'GFS Didot', serif",
            color: "rgba(200,165,55,0.9)",
            textShadow: "0 1px 8px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)",
            position: "absolute",
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
          animate={
            morphStarted
              ? showGreekSub
                ? { opacity: 1, filter: "blur(0px)", y: 0 }
                : { opacity: 0, filter: "blur(8px)", y: 10 }
              : { opacity: 0, filter: "blur(8px)", y: 10 }
          }
          transition={{ duration: 0.5, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
        >
          Φοιτητικό Έργο Εξαμήνου
        </motion.p>
      </div>

      <motion.p
        initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
        transition={{delay:1.25,duration:0.8,ease:[0.16,1,0.3,1]}}
        className="hud-label mt-2 text-center"
        style={{ position:"relative", zIndex:10, textShadow:"0 1px 8px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)" }}>
        MIT BENGALURU &mdash; CUBESAT MISSION ARCHITECTURE
      </motion.p>

      <motion.div
        initial={{scaleX:0}} animate={{scaleX:1}}
        transition={{delay:1.5,duration:1.5,ease:[0.16,1,0.3,1]}}
        className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-10 origin-center"
        style={{position:"relative",zIndex:10}}
      />

      <motion.div
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={{zIndex:10}}>
        <span className="hud-label" style={{textShadow:"0 1px 6px rgba(0,0,0,0.9)"}}>SCROLL TO ASSEMBLE</span>
        <motion.div animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:2,ease:"easeInOut"}} className="w-px h-6 bg-primary/50"/>
      </motion.div>
    </section>
  );
};

export default HeroSection;