import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import CubeSatSVG, { PART_COLORS } from "./CubeSatSVG";

const injectFont = () => {
  if (document.getElementById("icarus-subsys-font")) return;
  const link = document.createElement("link");
  link.id = "icarus-subsys-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Share+Tech+Mono&display=swap";
  document.head.appendChild(link);
};

/// ─────────────────────────────────────────────────────────────
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
      const w = canvas.width, h = canvas.height;

      // ── Blue-tinted deep space fill (matches HeroSection) ──
      ctx.fillStyle = "#00000f";
      ctx.fillRect(0, 0, w, h);

      // Subtle blue nebula glow at center
      const nebula = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.55);
      nebula.addColorStop(0,   "rgba(30, 60, 120, 0.18)");
      nebula.addColorStop(0.5, "rgba(10, 25,  70, 0.10)");
      nebula.addColorStop(1,   "rgba(0,   0,   0, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      // Twinkling stars — warm white like HeroSection
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

interface SubsystemData {
  id: string;
  code: string;
  name: string;
  description: string;
  components: string[];
  index: string;
  cardPos: { top?: string; bottom?: string; left?: string; right?: string };
}

const subsystems: SubsystemData[] = [
  {
    id: "comm", code: "COMM", index: "01",
    name: "Communications",
    description: "Uplink and downlink of telemetry and payload data to ground stations — reliable communication over orbital distances with constrained power budgets.",
    components: ["UHF/VHF + S-band transceivers", "Yagi & patch antenna", "RF amplifiers", "Modulation hardware"],
    cardPos: { top: "8%", right: "2%" },
  },
  {
    id: "obc", code: "OBC", index: "02",
    name: "On-Board Computer",
    description: "Central controller coordinating all subsystems, executing mission software, and managing telemetry, command processing, and onboard data storage.",
    components: ["ARM microprocessor", "RAM / Flash memory", "Watchdog timers", "I²C / SPI / CAN buses", "Real-time OS"],
    cardPos: { top: "36%", left: "2%" },
  },
  {
    id: "adcs", code: "ADCS", index: "03",
    name: "Attitude & Control",
    description: "Determines and controls satellite orientation for precise pointing of antennas, solar panels, and payload instruments throughout the mission.",
    components: ["Gyroscopes", "Magnetometers", "Sun & star sensors", "Magnetorquers", "Reaction wheels"],
    cardPos: { top: "6%", left: "2%" },
  },
  {
    id: "payload", code: "PLD", index: "04",
    name: "Payload",
    description: "Primary mission instrument. Collects high-resolution imaging, spectral, or communication data from orbit — the reason the satellite exists.",
    components: ["CMOS / CCD imager", "Optical filters", "Radiation detectors", "Data compression hardware"],
    cardPos: { top: "38%", right: "2%" },
  },
  {
    id: "eps", code: "EPS", index: "05",
    name: "Electrical Power",
    description: "Generates, stores, and distributes electrical power to all subsystems — maintaining stable regulated voltage across all operating modes and eclipse periods.",
    components: ["GaAs solar panels", "Li-ion battery pack", "BMS", "DC-DC converters", "Power distribution unit"],
    cardPos: { bottom: "18%", left: "2%" },
  },
  {
    id: "stm", code: "STM", index: "06",
    name: "Structures & Thermal",
    description: "Provides structural integrity, mounts all hardware on PC-104 stacking rails, and manages the thermal environment throughout the mission lifecycle.",
    components: ["Al-6061 frame", "PC-104 rails", "Deployable mechanisms", "MLI blankets", "Thermal coatings"],
    cardPos: { bottom: "8%", right: "2%" },
  },
  {
    id: "mgmt", code: "MGMT", index: "07",
    name: "Management",
    description: "Project coordination, resource allocation, budgeting, outreach, and stakeholder relations — ensuring all mission deliverables are met on schedule.",
    components: ["Project timelines", "Gantt charts", "Financial planning", "Sponsor management", "Documentation"],
    cardPos: { bottom: "8%", left: "2%" },
  },
];

// ─────────────────────────────────────────────────────────────
// SUBSYSTEM CARD
// ─────────────────────────────────────────────────────────────
const SubsystemCard = ({ data }: { data: SubsystemData }) => {
  const col = PART_COLORS[data.id];
  const isRight = !!data.cardPos.right;

  return (
    <motion.div
      key={data.id}
      initial={{ opacity: 0, x: isRight ? 24 : -24, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: isRight ? 16 : -16, filter: "blur(4px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute pointer-events-auto z-20"
      style={{ ...data.cardPos, width: "clamp(240px, 24vw, 320px)" }}
    >
      {/* Index rule */}
      <div
        className="flex items-center gap-3 mb-3"
        style={{ flexDirection: isRight ? "row-reverse" : "row" }}
      >
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(${isRight ? "to left" : "to right"}, ${col}55, transparent)`,
          }}
        />
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            color: `${col}88`,
            textTransform: "uppercase",
          }}
        >
          {data.index} / 07
        </span>
      </div>

      {/* Card body */}
      <div
        style={{
          background: "rgba(3,3,7,0.92)",
          backdropFilter: "blur(24px)",
          borderLeft: isRight ? "none" : `1px solid ${col}33`,
          borderRight: isRight ? `1px solid ${col}33` : "none",
          borderTop: `1px solid ${col}22`,
          borderBottom: `1px solid ${col}11`,
          paddingLeft: isRight ? "1.1rem" : "1.25rem",
          paddingRight: isRight ? "1.25rem" : "1.1rem",
          paddingTop: "1.2rem",
          paddingBottom: "1.2rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            color: col,
            textTransform: "uppercase",
            display: "block",
            marginBottom: "0.5rem",
            textAlign: isRight ? "right" : "left",
          }}
        >
          {data.code}
        </span>

        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "clamp(1.4rem, 1.9vw, 1.75rem)",
            letterSpacing: "0.04em",
            color: "rgba(220,200,155,0.96)",
            lineHeight: 1.2,
            marginBottom: "0.75rem",
            textAlign: isRight ? "right" : "left",
          }}
        >
          {data.name}
        </h3>

        <div
          className="mb-3"
          style={{
            height: "1px",
            background: `linear-gradient(${isRight ? "to left" : "to right"}, ${col}30, transparent)`,
          }}
        />

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.15vw, 1.08rem)",
            color: "rgba(185,170,140,0.72)",
            lineHeight: 1.75,
            marginBottom: "0.9rem",
            textAlign: isRight ? "right" : "left",
          }}
        >
          {data.description}
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            alignItems: isRight ? "flex-end" : "flex-start",
          }}
        >
          {data.components.map((c, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexDirection: isRight ? "row-reverse" : "row",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: col,
                  flexShrink: 0,
                  opacity: 0.7,
                }}
              />
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  color: "rgba(170,158,135,0.65)",
                }}
              >
                {c}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN SubsystemSection
// ─────────────────────────────────────────────────────────────
const SubsystemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => { injectFont(); }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const mapped = (v - 0.05) / 0.86;
    if (mapped < 0 || mapped > 1) { setActiveId(null); return; }
    const idx = Math.min(Math.floor(mapped * subsystems.length), subsystems.length - 1);
    setActiveId(subsystems[idx].id);
  });

  const activeData = subsystems.find(s => s.id === activeId) ?? null;

  return (
    <section
      id="subsystems"
      ref={sectionRef}
      className="relative"
      style={{ height: "720vh" }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col"
        style={{ background: "#000000" }}
      >
        {/* Layer 0 — twinkling starfield, same as HeroSection */}
        <StarsBg />

        {/* Layer 1 — subtle blue ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(56,189,248,0.05) 0%, transparent 70%)",
          }}
        />

        {/* Header */}
        <div
          className="pt-10 pb-2 px-8 flex-shrink-0 relative"
          style={{ zIndex: 2 }}
        >
          <div className="flex items-end gap-6">
            <div>
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.32em",
                  color: "rgba(200,165,55,0.4)",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Technical Specifications
              </span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                  letterSpacing: "0.07em",
                  color: "rgba(220,195,130,0.92)",
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                Mission Subsystems
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {activeId && (
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="pb-1 hidden md:block"
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontWeight: 300,
                      fontSize: "clamp(1rem, 1.4vw, 1.3rem)",
                      color: `${PART_COLORS[activeId]}bb`,
                      letterSpacing: "0.04em",
                    }}
                  >
                    — {activeData?.name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="mt-4"
            style={{
              height: "1px",
              background: "linear-gradient(to right, rgba(200,165,55,0.25), transparent 60%)",
            }}
          />
        </div>

        {/* Main area */}
        <div
          className="relative flex-1 flex items-center justify-center"
          style={{ zIndex: 2 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "min(72vh, 72vw)",
              height: "min(72vh, 72vw)",
              border: "1px dashed rgba(200,165,55,0.06)",
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "min(90vh, 90vw)",
              height: "min(90vh, 90vw)",
              border: "1px solid rgba(200,165,55,0.025)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 pointer-events-none select-none"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              style={{
                filter: `drop-shadow(0 0 60px rgba(200,160,50,0.28)) drop-shadow(0 0 24px rgba(200,160,50,0.18))`,
              }}
            >
              <CubeSatSVG activeSubsystem={activeId} />
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeData && <SubsystemCard key={activeData.id} data={activeData} />}
          </AnimatePresence>

          <AnimatePresence>
            {!activeId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none text-center"
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(200,165,55,0.22)",
                  }}
                >
                  Scroll to inspect subsystems
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div
          className="flex-shrink-0 pb-8 px-8 relative"
          style={{ zIndex: 2 }}
        >
          <div
            className="h-px w-full mb-5"
            style={{ background: "linear-gradient(to right, rgba(200,165,55,0.12), transparent)" }}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center flex-wrap">
              {subsystems.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className="focus:outline-none"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: activeId === s.id ? PART_COLORS[s.id] : "rgba(200,165,55,0.22)",
                    transition: "color 0.3s ease",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  {s.code}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeId && (
                <motion.span
                  key={activeId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
                    color: "rgba(200,165,55,0.3)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {activeData?.index} <span style={{ opacity: 0.4 }}>/</span> 07
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsystemSection;