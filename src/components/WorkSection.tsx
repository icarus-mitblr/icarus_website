import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import solidworksLogo from "@/assets/SolidWorks_Font_Logo.png";
import ansysLogo from "@/assets/ansys_part_of_synopsys_wht.png";
import kibocubeLogo from "@/assets/kibocube_logo.png";

const injectFont = () => {
  if (document.getElementById("icarus-work-font")) return;
  const link = document.createElement("link");
  link.id = "icarus-work-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Share+Tech+Mono&display=swap";
  document.head.appendChild(link);
};

const SPONSORS = [
  {
    id: "solidworks",
    name: "SOLIDWORKS",
    logo: solidworksLogo,
    tagline: "3D Design & Engineering Simulation",
    description:
      "Dassault Systèmes SOLIDWORKS provides industry-leading 3D CAD software powering ICARUS's structural design workflow — from chassis modelling to deployment mechanism tolerancing.",
    accent: "rgba(220, 40, 40, 0.85)",
    accentSoft: "rgba(220, 40, 40, 0.10)",
    accentBorder: "rgba(220, 40, 40, 0.25)",
  },
  {
    id: "ansys",
    name: "ANSYS",
    logo: ansysLogo,
    tagline: "Multiphysics Simulation & Analysis",
    description:
      "Ansys, part of Synopsys, delivers best-in-class FEA and thermal simulation tools — enabling ICARUS to validate structural integrity under launch loads and LEO thermal cycling.",
    accent: "rgba(240, 175, 20, 0.9)",
    accentSoft: "rgba(240, 175, 20, 0.10)",
    accentBorder: "rgba(240, 175, 20, 0.28)",
  },
];

const CYCLE_MS = 4800;

// ─────────────────────────────────────────────────────────────
// STARFIELD — blue-tinted space background + twinkling stars
// ─────────────────────────────────────────────────────────────
const StarsBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 320;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.7 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.025 + 0.006,
    }));

    let raf: number;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Blue-tinted deep space fill
      ctx.fillStyle = "#00000f";
      ctx.fillRect(0, 0, w, h);

      // Subtle blue nebula glow at center
      const nebula = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.55);
      nebula.addColorStop(0,   "rgba(30, 60, 120, 0.18)");
      nebula.addColorStop(0.5, "rgba(10, 25,  70, 0.10)");
      nebula.addColorStop(1,   "rgba(0,   0,   0, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      // Twinkling stars
      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        const alpha = s.a * (0.55 + 0.45 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,245,210,${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, width: "100%", height: "100%" }}
    />
  );
};

// ─────────────────────────────────────────────────────────────
// SPONSORS CAROUSEL inner starfield strip
// ─────────────────────────────────────────────────────────────
const StarfieldStrip = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + 0.2,
      a: Math.random() * 0.55 + 0.1, tw: Math.random() * Math.PI * 2, ts: Math.random() * 0.02 + 0.005,
    }));
    let raf: number;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.tw += s.ts;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,200,${s.a * (0.5 + 0.5 * Math.sin(s.tw))})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
};

const CornerTicks = ({ accent }: { accent: string }) => (
  <>
    {[{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }].map((pos, i) => (
      <div key={i} className="absolute w-3 h-3 pointer-events-none" style={{
        ...pos,
        borderColor: accent, borderStyle: "solid", borderWidth: 0,
        borderTopWidth: pos.top === 0 ? "1.5px" : 0,
        borderBottomWidth: (pos as any).bottom === 0 ? "1.5px" : 0,
        borderLeftWidth: pos.left === 0 ? "1.5px" : 0,
        borderRightWidth: (pos as any).right === 0 ? "1.5px" : 0,
      }} />
    ))}
  </>
);

const SponsorCard = ({ sponsor }: { sponsor: typeof SPONSORS[0] }) => (
  <motion.div
    key={sponsor.id}
    initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, x: -40, filter: "blur(10px)" }}
    transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
    className="absolute inset-0 flex flex-col md:flex-row items-center gap-8 md:gap-12 px-6 md:px-10 py-8"
  >
    <div
      className="relative flex-shrink-0 flex items-center justify-center"
      style={{
        width: "clamp(160px,20vw,240px)",
        height: "clamp(90px,11vw,130px)",
        background: sponsor.accentSoft,
        border: `1px solid ${sponsor.accentBorder}`,
        borderRadius: "2px",
      }}
    >
      <CornerTicks accent={sponsor.accent} />
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        style={{ maxWidth: "78%", maxHeight: "70%", objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(0,0,0,0.9))" }}
      />
    </div>
    <div className="flex flex-col gap-3 text-center md:text-left flex-1">
      <div className="flex items-center gap-3 justify-center md:justify-start">
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: sponsor.accent, textTransform: "uppercase" }}>
          Technology Partner
        </span>
        <span className="block h-px flex-1 max-w-[50px]" style={{ background: sponsor.accentBorder }} />
      </div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1rem,2vw,1.45rem)", letterSpacing: "0.06em", color: "rgba(220,195,130,0.95)", lineHeight: 1.25 }}>
        {sponsor.tagline}
      </h3>
      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "clamp(0.62rem,1vw,0.75rem)", color: "rgba(185,170,130,0.7)", lineHeight: 1.8, maxWidth: "52ch" }}>
        {sponsor.description}
      </p>
    </div>
  </motion.div>
);

const CollaborationsCard = () => {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const start = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => setActive(p => (p + 1) % SPONSORS.length), CYCLE_MS);
    };
    start();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleSelect = (i: number) => {
    setActive(i);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActive(p => (p + 1) % SPONSORS.length), CYCLE_MS);
  };

  const current = SPONSORS[active];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "clamp(190px,26vw,260px)",
        border: "1px solid rgba(200,165,55,0.12)",
        background: "rgba(6,7,10,0.82)",
        backdropFilter: "blur(8px)",
      }}
    >
      <StarfieldStrip />
      <motion.div
        className="absolute top-0 left-0 h-[1.5px] w-full"
        animate={{ background: current.accent }}
        transition={{ duration: 0.6 }}
        style={{ opacity: 0.6 }}
      />
      <div
        className="absolute top-3 right-4 pointer-events-none"
        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "rgba(200,165,55,0.28)", textTransform: "uppercase" }}
      >
        ICARUS / COLLAB — {String(active + 1).padStart(2, "0")}/{String(SPONSORS.length).padStart(2, "0")}
      </div>
      <AnimatePresence mode="wait">
        <SponsorCard key={current.id} sponsor={current} />
      </AnimatePresence>
      <div className="absolute bottom-4 left-6 flex gap-3 items-center">
        {SPONSORS.map((s, i) => (
          <button key={s.id} onClick={() => handleSelect(i)} style={{
            width: i === active ? "26px" : "6px", height: "3px", borderRadius: "2px",
            background: i === active ? current.accent : "rgba(200,165,55,0.18)",
            transition: "all 0.4s ease", border: "none", cursor: "pointer", padding: 0,
          }} />
        ))}
      </div>
      <div className="absolute bottom-3 right-6 flex gap-4">
        {SPONSORS.map((s, i) => (
          <button key={s.id} onClick={() => handleSelect(i)} style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em",
            color: i === active ? "rgba(200,165,55,0.9)" : "rgba(200,165,55,0.25)",
            background: "none", border: "none", cursor: "pointer", transition: "color 0.3s", textTransform: "uppercase",
          }}>{s.name}</button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPETITIONS CARD
// ─────────────────────────────────────────────────────────────
const CompetitionsCard = () => (
  <div className="h-full">
    <div
      className="relative overflow-hidden p-7 h-full"
      style={{
        border: "1px solid rgba(200,165,55,0.15)",
        background: "rgba(6,7,10,0.75)",
        backdropFilter: "blur(8px)",
        minHeight: "220px",
      }}
    >
      <div
        className="absolute top-0 left-0 h-[1.5px] w-full"
        style={{ background: "linear-gradient(to right, rgba(200,165,55,0.6), transparent)" }}
      />
      <div className="flex items-start gap-6">
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: 88, height: 88, border: "1px solid rgba(200,165,55,0.2)", background: "rgba(200,165,55,0.06)", borderRadius: "2px" }}
        >
          <img
            src={kibocubeLogo}
            alt="KiboCUBE"
            style={{ maxWidth: "82%", maxHeight: "82%", objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(0,0,0,0.9))" }}
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(200,165,55,0.55)", textTransform: "uppercase" }}>
            UN / JAXA Programme
          </span>
          <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.45rem", color: "rgba(220,195,130,0.95)", letterSpacing: "0.04em" }}>
            KiboCUBE
          </h4>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem", color: "rgba(185,170,130,0.65)", lineHeight: 1.85, marginTop: 6 }}>
            Selected teams design, build, and integrate a 1U CubeSat launched from the ISS Kibō module in 2028 — ICARUS has proudly participated in the 9th edition of KiboCUBE, a global CubeSat development program organized by the United Nations Office for Outer Space Affairs and Japan Aerospace Exploration Agency.
            Our mission focuses on remote area mapping of under-mapped regions in India, aligned with the UN Sustainable Development Goals (SDGs), with scalable global impact. End-to-end satellite engineering following strict international standards.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// COMING SOON CARD
// ─────────────────────────────────────────────────────────────
const ComingSoonCard = ({ label, index }: { label: string; index: number }) => (
  <div
    className="relative overflow-hidden min-h-[200px] flex flex-col justify-between p-6"
    style={{ border: "1px solid rgba(200,165,55,0.1)", background: "rgba(6,7,10,0.6)" }}
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200,165,55,0.015) 3px, rgba(200,165,55,0.015) 4px)" }}
    />
    <div>
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(200,165,55,0.35)" }}>
        0{index}
      </span>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.25rem", color: "rgba(220,195,130,0.7)", letterSpacing: "0.06em", marginTop: 8 }}>
        {label}
      </h3>
    </div>
    <div className="flex items-center gap-3 mt-4">
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.28em", color: "rgba(200,165,55,0.4)", textTransform: "uppercase" }}>
        — Coming Soon
      </span>
      <span className="flex-1 h-px" style={{ background: "rgba(200,165,55,0.1)" }} />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN WorkSection
// ─────────────────────────────────────────────────────────────
const WorkSection = () => {
  useEffect(() => { injectFont(); }, []);

  return (
    <section
      id="work"
      className="relative py-20 md:py-32 px-6 overflow-hidden"
      style={{ background: "#00000f" }}
    >
      {/* Starfield — blue-tinted space background */}
      <StarsBg />

      {/* Content */}
      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span
            className="section-title"
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(200,165,55,0.55)", textTransform: "uppercase" }}
          >
            RESEARCH &amp; DEVELOPMENT
          </span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "rgba(220,195,130,0.92)", letterSpacing: "0.08em", marginTop: 12 }}>
            Our Work
          </h2>
          <div className="w-16 h-px mt-6" style={{ background: "rgba(200,165,55,0.3)" }} />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 01 — Research Papers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ComingSoonCard label="Research Papers" index={1} />
          </motion.div>

          {/* 02 — Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ComingSoonCard label="Projects" index={2} />
          </motion.div>

          {/* 03 — Competitions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(200,165,55,0.4)", display: "block", marginBottom: 10 }}>
                03 / COMPETITIONS
              </span>
              <CompetitionsCard />
            </div>
          </motion.div>

          {/* 04 — Collaborations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(200,165,55,0.4)", display: "block", marginBottom: 10 }}>
                04 / COLLABORATIONS
              </span>
              <CollaborationsCard />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default WorkSection;