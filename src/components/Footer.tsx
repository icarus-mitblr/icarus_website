import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import React from "react";

const navItems = [
  { label: "HOME",       href: "#home"       },
  { label: "SUBSYSTEMS", href: "#subsystems" },
  { label: "TEAM",       href: "#team"       },
  { label: "OUR WORK",   href: "#work"       },
  { label: "GALLERY",    href: "#gallery"    },
];

/* ── Font injection (TeamSection style) ── */
const injectFont = () => {
  if (document.getElementById("icarus-team-font")) return;
  const link = document.createElement("link");
  link.id = "icarus-team-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Share+Tech+Mono&display=swap";
  document.head.appendChild(link);
};

const StarField = () => {
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
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.018 + 0.005,
    }));

    let raf: number;
    const draw = () => {
      const w = canvas.width, h = canvas.height;

      /* ── Nebula background (matches TeamSection / HeroSection) ── */
      ctx.fillStyle = "#00000f";
      ctx.fillRect(0, 0, w, h);
      const nebula = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.55);
      nebula.addColorStop(0,   "rgba(30, 60, 120, 0.18)");
      nebula.addColorStop(0.5, "rgba(10, 25,  70, 0.10)");
      nebula.addColorStop(1,   "rgba(0,   0,   0, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.twinkle += s.speed;
        const alpha = s.a * (0.5 + 0.5 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,245,210,${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

const HudCorner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const transforms: Record<string, string> = {
    tl: "rotate(0deg)", tr: "rotate(90deg)", br: "rotate(180deg)", bl: "rotate(270deg)",
  };
  const positions: Record<string, React.CSSProperties> = {
    tl: { top: 12, left: 12 }, tr: { top: 12, right: 12 },
    br: { bottom: 12, right: 12 }, bl: { bottom: 12, left: 12 },
  };
  return (
    <div className="absolute pointer-events-none" style={{ ...positions[pos], transform: transforms[pos], zIndex: 2 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M0 10 L0 0 L10 0" stroke="rgba(200,165,55,0.45)" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
};

const Footer = () => {
  useEffect(() => { injectFont(); }, []);

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{ borderColor: "rgba(200,165,55,0.15)", background: "#00000f" }}
    >
      {/* Star canvas */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <StarField />
      </div>

      {/* Ambient glow top */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(200,165,55,0.4), transparent)",
          zIndex: 1,
        }}
      />

      {/* Radial backdrop */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 1,
          inset: 0,
          background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,165,55,0.04) 0%, transparent 70%)",
        }}
      />

      <HudCorner pos="tl" />
      <HudCorner pos="tr" />
      <HudCorner pos="bl" />
      <HudCorner pos="br" />

      <div className="relative max-w-7xl mx-auto px-8 py-16" style={{ zIndex: 2 }}>

        {/* Top row — logo + tagline + nav */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-12">

          {/* Left — identity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2"
          >
            {/* ICARUS wordmark — Cormorant Garamond, large */}
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                letterSpacing: "0.18em",
                color: "rgba(220,195,130,0.94)",
                lineHeight: 1,
              }}
            >
              ICARUS
            </span>
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.3em",
                color: "rgba(200,165,55,0.45)",
                textTransform: "uppercase" as const,
              }}
            >
              MIT Bengaluru &mdash; CubeSat Mission Architecture
            </span>
          </motion.div>

          {/* Right — nav */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-x-8 gap-y-3"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.22em",
                  color: "rgba(200,165,55,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(200,165,55,0.95)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,165,55,0.5)")}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-px mb-10"
          style={{ background: "linear-gradient(90deg, rgba(200,165,55,0.35), rgba(56,189,248,0.2), transparent)" }}
        />

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { value: "1U",       label: "CubeSat Form Factor" },
            { value: "450km",    label: "Target Orbit (LEO)"  },
            { value: "7",        label: "Subsystems"          },
            { value: "ICARUS",   label: "Mission Designation" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 px-4 py-3 rounded-lg"
              style={{
                background: "rgba(6,4,12,0.6)",
                border: "1px solid rgba(200,165,55,0.1)",
              }}
            >
              {/* Stat value — Cormorant Garamond */}
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: "1.5rem",
                  letterSpacing: "0.06em",
                  color: "rgba(220,195,130,0.94)",
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  color: "rgba(255,248,230,0.3)",
                  textTransform: "uppercase" as const,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#34d399" }}
            />
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.26em",
                color: "rgba(52,211,153,0.6)",
              }}
            >
              MISSION ACTIVE
            </span>
          </motion.div>

          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              color: "rgba(200,165,55,0.25)",
            }}
          >
            &copy; {new Date().getFullYear()} ICARUS &mdash; MIT BENGALURU
          </span>

          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              color: "rgba(56,189,248,0.3)",
            }}
          >
            ICARUS / LEO / 450km
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;