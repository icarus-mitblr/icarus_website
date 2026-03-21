import { motion, AnimatePresence } from "framer-motion";

export const PART_COLORS: Record<string, string> = {
  comm:    "#38bdf8",
  obc:     "#a78bfa",
  adcs:    "#34d399",
  payload: "#fbbf24",
  eps:     "#86efac",
  stm:     "#fb923c",
  mgmt:    "#f472b6",
};

const dim = (id: string, a: string | null) => a && a !== id ? 0.22 : 1;

interface Props { activeSubsystem: string | null; }

const CubeSatSVG = ({ activeSubsystem: a }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 500 540"
    width="500"
    height="540"
    style={{ overflow: "visible", display: "block" }}
  >
    <defs>
      {/* Glow filters per subsystem */}
      {Object.entries(PART_COLORS).map(([id, col]) => (
        <filter key={id} id={`g_${id}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      ))}
      <filter id="glow_base" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="flame_blur" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="10" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>

      {/* Body face gradients */}
      <linearGradient id="top_face" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a3c18" stopOpacity="0.95"/>
        <stop offset="100%" stopColor="#2a2010" stopOpacity="1"/>
      </linearGradient>
      <linearGradient id="left_face" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1c1608" stopOpacity="1"/>
        <stop offset="100%" stopColor="#382c10" stopOpacity="0.95"/>
      </linearGradient>
      <linearGradient id="right_face" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#322812" stopOpacity="0.95"/>
        <stop offset="100%" stopColor="#1e1a08" stopOpacity="1"/>
      </linearGradient>
      <linearGradient id="solar_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e4080" stopOpacity="0.9"/>
        <stop offset="50%" stopColor="#1a3570" stopOpacity="0.85"/>
        <stop offset="100%" stopColor="#0e2050" stopOpacity="0.8"/>
      </linearGradient>
      <radialGradient id="flame_grad" cx="50%" cy="10%" r="90%">
        <stop offset="0%" stopColor="#fff7b0" stopOpacity="1"/>
        <stop offset="30%" stopColor="#ffb830" stopOpacity="0.85"/>
        <stop offset="70%" stopColor="#ff6010" stopOpacity="0.55"/>
        <stop offset="100%" stopColor="#ff3000" stopOpacity="0"/>
      </radialGradient>
    </defs>

    {/* ── Starfield ── */}
    {[[20,30],[45,12],[8,90],[460,25],[480,70],[472,140],[12,200],[30,310],[468,280],[440,340],[80,430],[450,420]].map(([cx,cy],i)=>(
      <circle key={i} cx={cx} cy={cy} r="1" fill="rgba(255,245,200,0.5)"/>
    ))}

    {/* ══════════════════════════════
        EPS — Solar Panels
    ══════════════════════════════ */}
    <motion.g animate={{ opacity: dim("eps", a) }} transition={{ duration: 0.4 }}
      filter={a==="eps" ? "url(#g_eps)" : undefined}>

      {/* Left arm connector */}
      <rect x="30" y="238" width="120" height="8" rx="3"
        fill={a==="eps" ? "rgba(134,239,172,0.6)" : "rgba(200,165,55,0.5)"}
        stroke={a==="eps" ? "#86efac" : "rgba(200,165,55,0.3)"} strokeWidth="1"/>

      {/* Left panel 1 */}
      <rect x="4" y="206" width="56" height="88" rx="4"
        fill={a==="eps" ? "rgba(134,239,172,0.15)" : "url(#solar_grad)"}
        stroke={a==="eps" ? "#86efac" : "rgba(56,130,200,0.55)"} strokeWidth="1.2"/>
      {[220,238,256,272].map(y=><line key={y} x1="4" y1={y} x2="60" y2={y} stroke="rgba(100,180,255,0.3)" strokeWidth="0.7"/>)}
      {[18,32,46].map(x=><line key={x} x1={x} y1="206" x2={x} y2="294" stroke="rgba(100,180,255,0.3)" strokeWidth="0.7"/>)}

      {/* Left panel 2 */}
      <rect x="68" y="206" width="56" height="88" rx="4"
        fill={a==="eps" ? "rgba(134,239,172,0.15)" : "url(#solar_grad)"}
        stroke={a==="eps" ? "#86efac" : "rgba(56,130,200,0.55)"} strokeWidth="1.2"/>
      {[220,238,256,272].map(y=><line key={y} x1="68" y1={y} x2="124" y2={y} stroke="rgba(100,180,255,0.3)" strokeWidth="0.7"/>)}
      {[82,96,110].map(x=><line key={x} x1={x} y1="206" x2={x} y2="294" stroke="rgba(100,180,255,0.3)" strokeWidth="0.7"/>)}

      {/* Right arm connector */}
      <rect x="350" y="238" width="120" height="8" rx="3"
        fill={a==="eps" ? "rgba(134,239,172,0.6)" : "rgba(200,165,55,0.5)"}
        stroke={a==="eps" ? "#86efac" : "rgba(200,165,55,0.3)"} strokeWidth="1"/>

      {/* Right panel 1 */}
      <rect x="374" y="206" width="56" height="88" rx="4"
        fill={a==="eps" ? "rgba(134,239,172,0.15)" : "url(#solar_grad)"}
        stroke={a==="eps" ? "#86efac" : "rgba(56,130,200,0.55)"} strokeWidth="1.2"/>
      {[220,238,256,272].map(y=><line key={y} x1="374" y1={y} x2="430" y2={y} stroke="rgba(100,180,255,0.3)" strokeWidth="0.7"/>)}
      {[388,402,416].map(x=><line key={x} x1={x} y1="206" x2={x} y2="294" stroke="rgba(100,180,255,0.3)" strokeWidth="0.7"/>)}

      {/* Right panel 2 */}
      <rect x="438" y="206" width="56" height="88" rx="4"
        fill={a==="eps" ? "rgba(134,239,172,0.15)" : "url(#solar_grad)"}
        stroke={a==="eps" ? "#86efac" : "rgba(56,130,200,0.55)"} strokeWidth="1.2"/>
      {[220,238,256,272].map(y=><line key={y} x1="438" y1={y} x2="494" y2={y} stroke="rgba(100,180,255,0.3)" strokeWidth="0.7"/>)}
      {[452,466,480].map(x=><line key={x} x1={x} y1="206" x2={x} y2="294" stroke="rgba(100,180,255,0.3)" strokeWidth="0.7"/>)}

      {/* Cell highlight overlays when active */}
      {a==="eps" && [4,68,374,438].map(x=>(
        <rect key={x} x={x} y="206" width="56" height="88" rx="4" fill="rgba(134,239,172,0.1)"/>
      ))}
    </motion.g>

    {/* ══════════════════════════════
        STM — Main Body Structure
    ══════════════════════════════ */}
    <motion.g animate={{ opacity: dim("stm", a) }} transition={{ duration: 0.4 }}
      filter={a==="stm" ? "url(#g_stm)" : undefined}>

      {/* Top face (isometric) */}
      <path d="M150 130 L250 88 L350 130 L250 172Z"
        fill={a==="stm" ? "rgba(251,146,60,0.25)" : "url(#top_face)"}
        stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.45)"} strokeWidth="1.5"/>

      {/* Left face */}
      <path d="M150 130 L150 330 L250 372 L250 172Z"
        fill={a==="stm" ? "rgba(251,146,60,0.18)" : "url(#left_face)"}
        stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.35)"} strokeWidth="1.5"/>

      {/* Right face */}
      <path d="M350 130 L350 330 L250 372 L250 172Z"
        fill={a==="stm" ? "rgba(251,146,60,0.18)" : "url(#right_face)"}
        stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.35)"} strokeWidth="1.5"/>

      {/* Panel subdivision lines — left face */}
      {[183,230,278].map(y=>(
        <line key={y} x1="150" y1={y} x2="250" y2={y+42} stroke="rgba(200,165,55,0.12)" strokeWidth="0.8"/>
      ))}
      {[170,190,210,230].map(x=>(
        <line key={x} x1={x} y1="132" x2={x} y2="330" stroke="rgba(200,165,55,0.08)" strokeWidth="0.7"/>
      ))}

      {/* Panel subdivision lines — right face */}
      {[183,230,278].map(y=>(
        <line key={y} x1="350" y1={y} x2="250" y2={y+42} stroke="rgba(200,165,55,0.1)" strokeWidth="0.8"/>
      ))}
      {[270,290,310,330].map(x=>(
        <line key={x} x1={x} y1="132" x2={x} y2="330" stroke="rgba(200,165,55,0.07)" strokeWidth="0.7"/>
      ))}

      {/* Mounting rails (thick edges) */}
      <line x1="150" y1="130" x2="150" y2="330" stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.55)"} strokeWidth="3"/>
      <line x1="350" y1="130" x2="350" y2="330" stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.55)"} strokeWidth="3"/>
      <line x1="250" y1="372" x2="150" y2="330" stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.55)"} strokeWidth="3"/>
      <line x1="250" y1="372" x2="350" y2="330" stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.55)"} strokeWidth="3"/>
      <line x1="150" y1="130" x2="250" y2="88"  stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.55)"} strokeWidth="3"/>
      <line x1="350" y1="130" x2="250" y2="88"  stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.55)"} strokeWidth="3"/>

      {/* Corner bolts */}
      {[[150,130],[350,130],[150,330],[350,330],[250,88],[250,372]].map(([cx,cy],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="6"
            fill={a==="stm" ? "rgba(251,146,60,0.5)" : "rgba(200,165,55,0.45)"}
            stroke={a==="stm" ? "#fb923c" : "rgba(200,165,55,0.6)"} strokeWidth="1"/>
          <circle cx={cx} cy={cy} r="2.5"
            fill={a==="stm" ? "#fb923c" : "rgba(220,185,70,0.8)"}/>
        </g>
      ))}
    </motion.g>

    {/* ══════════════════════════════
        ADCS — Attitude Control
    ══════════════════════════════ */}
    <motion.g animate={{ opacity: dim("adcs", a) }} transition={{ duration: 0.4 }}
      filter={a==="adcs" ? "url(#g_adcs)" : undefined}>

      {/* Magnetorquers on left-face edges */}
      {[[150,185,168,185],[150,230,168,230],[150,275,168,275]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={a==="adcs" ? "#34d399" : "rgba(52,211,153,0.35)"}
          strokeWidth="5" strokeLinecap="round"/>
      ))}
      {/* Magnetorquers on right-face edges */}
      {[[350,185,332,185],[350,230,332,230],[350,275,332,275]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={a==="adcs" ? "#34d399" : "rgba(52,211,153,0.35)"}
          strokeWidth="5" strokeLinecap="round"/>
      ))}

      {/* Sun sensors at body corners */}
      {[[150,130],[350,130],[250,88],[150,330],[350,330]].map(([cx,cy],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="10"
            fill={a==="adcs" ? "rgba(52,211,153,0.25)" : "rgba(52,211,153,0.08)"}
            stroke={a==="adcs" ? "#34d399" : "rgba(52,211,153,0.35)"} strokeWidth="1.2"/>
          <circle cx={cx} cy={cy} r="4"
            fill={a==="adcs" ? "#34d399" : "rgba(52,211,153,0.4)"}/>
        </g>
      ))}

      {/* Reaction wheel indicator on top face */}
      <circle cx="250" cy="130" r="20"
        fill={a==="adcs" ? "rgba(52,211,153,0.12)" : "rgba(52,211,153,0.04)"}
        stroke={a==="adcs" ? "#34d399" : "rgba(52,211,153,0.2)"} strokeWidth="1"/>
      <circle cx="250" cy="130" r="9"
        fill={a==="adcs" ? "rgba(52,211,153,0.2)" : "rgba(52,211,153,0.06)"}
        stroke={a==="adcs" ? "#34d399" : "rgba(52,211,153,0.15)"} strokeWidth="1"/>
    </motion.g>

    {/* ══════════════════════════════
        OBC — On-Board Computer (left face PCB)
    ══════════════════════════════ */}
    <motion.g animate={{ opacity: dim("obc", a) }} transition={{ duration: 0.4 }}
      filter={a==="obc" ? "url(#g_obc)" : undefined}>

      {/* PCB board */}
      <rect x="162" y="200" width="72" height="84" rx="4"
        fill={a==="obc" ? "rgba(167,139,250,0.2)" : "rgba(40,20,80,0.6)"}
        stroke={a==="obc" ? "#a78bfa" : "rgba(167,139,250,0.25)"} strokeWidth="1.2"/>

      {/* PCB traces */}
      {a==="obc" && [216,232,248,264].map(y=>(
        <line key={y} x1="168" y1={y} x2="228" y2={y} stroke="rgba(167,139,250,0.45)" strokeWidth="1"/>
      ))}

      {/* CPU chip */}
      <rect x="182" y="224" width="32" height="28" rx="3"
        fill={a==="obc" ? "rgba(167,139,250,0.35)" : "rgba(80,40,140,0.55)"}
        stroke={a==="obc" ? "#a78bfa" : "rgba(167,139,250,0.3)"} strokeWidth="1"/>
      {/* Chip pins */}
      {[228,236,244,252,260].map(y=>(
        <line key={`L${y}`} x1="180" y1={y} x2="183" y2={y} stroke={a==="obc" ? "#a78bfa" : "rgba(167,139,250,0.3)"} strokeWidth="1.5"/>
      ))}
      {[228,236,244,252,260].map(y=>(
        <line key={`R${y}`} x1="214" y1={y} x2="217" y2={y} stroke={a==="obc" ? "#a78bfa" : "rgba(167,139,250,0.3)"} strokeWidth="1.5"/>
      ))}

      {a==="obc" && (
        <text x="198" y="241" fill="rgba(220,210,255,0.9)" fontSize="9" fontFamily="monospace" fontWeight="bold">OBC</text>
      )}

      {/* Status LEDs */}
      {[[168,204],[174,204],[180,204]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="3"
          fill={a==="obc" ? ["#4ade80","#fbbf24","#38bdf8"][i] : "rgba(60,60,60,0.7)"}
          filter={a==="obc" ? "url(#glow_base)" : undefined}/>
      ))}
    </motion.g>

    {/* ══════════════════════════════
        PAYLOAD — Camera / Sensor (right face)
    ══════════════════════════════ */}
    <motion.g animate={{ opacity: dim("payload", a) }} transition={{ duration: 0.4 }}
      filter={a==="payload" ? "url(#g_payload)" : undefined}>

      {/* Housing */}
      <rect x="268" y="196" width="68" height="68" rx="6"
        fill={a==="payload" ? "rgba(251,191,36,0.18)" : "rgba(50,40,10,0.7)"}
        stroke={a==="payload" ? "#fbbf24" : "rgba(251,191,36,0.3)"} strokeWidth="1.4"/>

      {/* Lens outer ring */}
      <circle cx="302" cy="230" r="24"
        fill={a==="payload" ? "rgba(15,30,100,0.8)" : "rgba(10,20,60,0.9)"}
        stroke={a==="payload" ? "#fbbf24" : "rgba(251,191,36,0.3)"} strokeWidth="1.4"/>

      {/* Lens inner rings */}
      <circle cx="302" cy="230" r="16"
        fill={a==="payload" ? "rgba(20,50,160,0.7)" : "rgba(15,35,110,0.8)"}
        stroke={a==="payload" ? "rgba(251,191,36,0.65)" : "rgba(251,191,36,0.2)"} strokeWidth="1"/>
      <circle cx="302" cy="230" r="8"
        fill={a==="payload" ? "rgba(37,99,235,0.8)" : "rgba(25,65,190,0.7)"}/>
      <circle cx="302" cy="230" r="3"
        fill={a==="payload" ? "#93c5fd" : "rgba(147,197,253,0.5)"}/>

      {/* Specular highlight */}
      <circle cx="295" cy="222" r="4" fill="rgba(220,240,255,0.28)"/>

      {/* FOV projection lines */}
      {a==="payload" && <>
        <line x1="336" y1="214" x2="368" y2="192" stroke="rgba(251,191,36,0.25)" strokeWidth="1" strokeDasharray="3 4"/>
        <line x1="336" y1="246" x2="368" y2="268" stroke="rgba(251,191,36,0.25)" strokeWidth="1" strokeDasharray="3 4"/>
        <line x1="368" y1="192" x2="368" y2="268" stroke="rgba(251,191,36,0.15)" strokeWidth="0.8" strokeDasharray="2 5"/>
      </>}
    </motion.g>

    {/* ══════════════════════════════
        COMM — Antenna System
    ══════════════════════════════ */}
    <motion.g animate={{ opacity: dim("comm", a) }} transition={{ duration: 0.4 }}
      filter={a==="comm" ? "url(#g_comm)" : undefined}>

      {/* Main mast */}
      <line x1="250" y1="88" x2="250" y2="28"
        stroke={a==="comm" ? "#38bdf8" : "rgba(200,165,55,0.6)"} strokeWidth="3" strokeLinecap="round"/>

      {/* Yagi director elements (horizontal bars, widest at top) */}
      {[[76,28],[66,40],[54,54],[40,68]].map(([hw,y],i)=>(
        <line key={i} x1={250-hw} y1={y} x2={250+hw} y2={y}
          stroke={a==="comm" ? "#38bdf8" : "rgba(200,165,55,0.5)"}
          strokeWidth={3.5 - i * 0.5} strokeLinecap="round"/>
      ))}

      {/* Patch antenna panel on top face */}
      <rect x="220" y="148" width="60" height="36" rx="4"
        fill={a==="comm" ? "rgba(56,189,248,0.18)" : "rgba(10,50,80,0.6)"}
        stroke={a==="comm" ? "#38bdf8" : "rgba(56,189,248,0.3)"} strokeWidth="1.2"/>
      <rect x="228" y="154" width="44" height="24" rx="2"
        fill={a==="comm" ? "rgba(56,189,248,0.12)" : "rgba(8,40,65,0.6)"}
        stroke={a==="comm" ? "rgba(56,189,248,0.55)" : "rgba(56,189,248,0.2)"} strokeWidth="0.9"/>

      {/* Signal radiation rings */}
      {a==="comm" && [18,30,44,60].map((r,i)=>(
        <circle key={i} cx="250" cy="24" r={r}
          fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="4 6"
          opacity={0.8 - i*0.15}/>
      ))}

      {/* Antenna tip glow dot */}
      <circle cx="250" cy="24" r="5"
        fill={a==="comm" ? "#38bdf8" : "rgba(200,165,55,0.65)"}
        filter="url(#glow_base)"/>
      <circle cx="250" cy="24" r="2.5"
        fill={a==="comm" ? "white" : "rgba(255,240,180,0.8)"}/>
    </motion.g>

    {/* ══════════════════════════════
        MGMT — Mission Emblem + orbital ring
    ══════════════════════════════ */}
    <motion.g animate={{ opacity: dim("mgmt", a) }} transition={{ duration: 0.4 }}
      filter={a==="mgmt" ? "url(#g_mgmt)" : undefined}>

      {/* Mission emblem on left face */}
      <circle cx="196" cy="300" r="24"
        fill={a==="mgmt" ? "rgba(244,114,182,0.2)" : "rgba(80,15,50,0.55)"}
        stroke={a==="mgmt" ? "#f472b6" : "rgba(244,114,182,0.3)"} strokeWidth="1.4"/>
      <circle cx="196" cy="300" r="15"
        fill={a==="mgmt" ? "rgba(244,114,182,0.12)" : "rgba(60,10,40,0.55)"}
        stroke={a==="mgmt" ? "rgba(244,114,182,0.55)" : "rgba(244,114,182,0.2)"} strokeWidth="1"/>

      {a==="mgmt" && (
        <text x="196" y="304" textAnchor="middle" fill="rgba(253,186,214,0.95)"
          fontSize="9" fontFamily="monospace" fontWeight="bold">ICARUS</text>
      )}

      {/* Orbital ring when active */}
      {a==="mgmt" && (
        <ellipse cx="250" cy="230" rx="200" ry="62"
          fill="none" stroke="rgba(244,114,182,0.18)" strokeWidth="1.2" strokeDasharray="7 7"/>
      )}
    </motion.g>

    {/* ══════════════════════════════
        Thruster (always visible)
    ══════════════════════════════ */}
    <motion.g animate={{ opacity: a ? 0.5 : 0.85 }} transition={{ duration: 0.4 }}>
      {/* Nozzle bell */}
      <path d="M228 370 L220 398 L280 398 L272 370Z"
        fill="rgba(70,55,18,0.9)" stroke="rgba(180,140,40,0.4)" strokeWidth="1"/>
      <rect x="224" y="362" width="52" height="12" rx="3"
        fill="rgba(90,70,22,0.85)" stroke="rgba(200,160,50,0.4)" strokeWidth="1"/>
      {/* Flame */}
      <ellipse cx="250" cy="418" rx="16" ry="28" fill="url(#flame_grad)" filter="url(#flame_blur)"/>
      <ellipse cx="250" cy="406" rx="8" ry="14" fill="rgba(255,248,200,0.9)" filter="url(#glow_base)"/>
      <ellipse cx="250" cy="400" rx="4" ry="7" fill="white" opacity="0.7"/>
    </motion.g>

    {/* ══════════════════════════════
        Active pulse rings
    ══════════════════════════════ */}
    <AnimatePresence>
      {a && (
        <motion.g key={a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {a==="comm"    && [30,48].map((r,i)=><circle key={i} cx="250" cy="24" r={r} fill="none" stroke={PART_COLORS[a]} strokeWidth="1" opacity={0.45-i*0.15}/>)}
          {a==="obc"     && [28,44].map((r,i)=><circle key={i} cx="198" cy="242" r={r} fill="none" stroke={PART_COLORS[a]} strokeWidth="1" opacity={0.45-i*0.15}/>)}
          {a==="adcs"    && [28,44].map((r,i)=><circle key={i} cx="250" cy="130" r={r} fill="none" stroke={PART_COLORS[a]} strokeWidth="1" opacity={0.4-i*0.15}/>)}
          {a==="payload" && [28,44].map((r,i)=><circle key={i} cx="302" cy="230" r={r} fill="none" stroke={PART_COLORS[a]} strokeWidth="1" opacity={0.45-i*0.15}/>)}
          {a==="eps"     && <>
            <circle cx="44"  cy="250" r="52" fill="none" stroke={PART_COLORS[a]} strokeWidth="0.9" opacity="0.3"/>
            <circle cx="456" cy="250" r="52" fill="none" stroke={PART_COLORS[a]} strokeWidth="0.9" opacity="0.3"/>
          </>}
          {a==="stm"     && <circle cx="250" cy="230" r="130" fill="none" stroke={PART_COLORS[a]} strokeWidth="0.8" opacity="0.18"/>}
          {a==="mgmt"    && [28,44].map((r,i)=><circle key={i} cx="196" cy="300" r={r} fill="none" stroke={PART_COLORS[a]} strokeWidth="1" opacity={0.45-i*0.15}/>)}
        </motion.g>
      )}
    </AnimatePresence>
  </svg>
);

export default CubeSatSVG;