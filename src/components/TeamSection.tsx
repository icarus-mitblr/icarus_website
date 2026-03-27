import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

const injectFont = () => {
  if (document.getElementById("icarus-team-font")) return;
  const link = document.createElement("link");
  link.id = "icarus-team-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Share+Tech+Mono&display=swap";
  document.head.appendChild(link);
};

const SUBSYSTEM_COLORS: Record<string, string> = {
  MGMT:    "#f472b6",
  COMM:    "#38bdf8",
  OBC:     "#a78bfa",
  ADCS:    "#34d399",
  PAYLOAD: "#fbbf24",
  EPS:     "#86efac",
  STM:     "#fb923c",
};

// ─────────────────────────────────────────────────────────────
// STARFIELD
// ─────────────────────────────────────────────────────────────
const StarsBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.7 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.025 + 0.006,
    }));
    let raf: number;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
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
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, width: "100%", height: "100%" }} />
  );
};

// ─────────────────────────────────────────────────────────────
// PROJECT LEAD
// ─────────────────────────────────────────────────────────────
const ProjectLead = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col items-center text-center mb-24"
  >
    <span style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "0.72rem",
      letterSpacing: "0.32em",
      color: "rgba(200,165,55,0.5)",
      textTransform: "uppercase",
      display: "block",
      marginBottom: "1.75rem",
    }}>
      Project Lead
    </span>

    <div style={{
      width: 90,
      height: 90,
      borderRadius: "50%",
      border: "1px solid rgba(200,165,55,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(200,165,55,0.05)",
      marginBottom: "1.5rem",
    }}>
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300,
        fontSize: "1.9rem",
        color: "rgba(200,165,55,0.85)",
        letterSpacing: "0.06em",
      }}>
        SP
      </span>
    </div>

    <h3 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 400,
      fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
      letterSpacing: "0.06em",
      color: "rgba(220,200,155,0.97)",
      lineHeight: 1.1,
      marginBottom: "0.5rem",
    }}>
      Sumedh P
    </h3>

    <div style={{
      width: 48,
      height: "1px",
      background: "rgba(200,165,55,0.35)",
      margin: "0.85rem auto",
    }} />

    <span style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "0.72rem",
      letterSpacing: "0.24em",
      color: "rgba(200,165,55,0.55)",
      textTransform: "uppercase",
    }}>
      Mission Director
    </span>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// SUBSYSTEM ROW
// ─────────────────────────────────────────────────────────────
const SubsystemRow = ({
  code, label, color, lead, members, index,
}: {
  code: string; label: string; color: string;
  lead: string; members: string[]; index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ delay: index * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    style={{
      borderBottom: "1px solid rgba(200,165,55,0.1)",
      padding: "1.6rem 0",
    }}
  >
    <div className="flex items-start gap-6 md:gap-12">

      {/* Code + label */}
      <div style={{ width: "clamp(110px, 15vw, 175px)", flexShrink: 0 }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.78rem",
          letterSpacing: "0.22em",
          color,
          textTransform: "uppercase",
          display: "block",
          marginBottom: "0.25rem",
          opacity: 0.95,
        }}>
          {code}
        </span>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "0.95rem",
          color: "rgba(185,170,140,0.55)",
          lineHeight: 1.3,
        }}>
          {label}
        </span>
      </div>

      {/* Lead */}
      <div style={{ width: "clamp(150px, 20vw, 230px)", flexShrink: 0 }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)",
          color: "rgba(220,200,155,0.95)",
          letterSpacing: "0.03em",
          display: "block",
          marginBottom: "0.15rem",
        }}>
          {lead}
        </span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.2em",
          color: `${color}80`,
          textTransform: "uppercase",
        }}>
          Lead
        </span>
      </div>

      {/* Members */}
      <div className="flex-1 flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
        {members.map((m, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
              color: "rgba(200,182,148,0.78)",
              letterSpacing: "0.02em",
            }}>
              {m}
            </span>
            {i < members.length - 1 && (
              <span style={{ color: `${color}35`, fontSize: "0.8rem" }}>·</span>
            )}
          </span>
        ))}
      </div>

      {/* Count */}
      <span className="hidden md:block flex-shrink-0 pt-1" style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.62rem",
        letterSpacing: "0.2em",
        color: "rgba(200,165,55,0.22)",
      }}>
        {members.length + 1}
      </span>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// MANAGEMENT ROW
// ─────────────────────────────────────────────────────────────
const MgmtRow = ({
  label, lead, leadRole, members, color, index,
}: {
  label: string; lead: string; leadRole: string;
  members: string[]; color: string; index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    style={{
      borderBottom: "1px solid rgba(200,165,55,0.1)",
      padding: "1.6rem 0",
    }}
  >
    <div className="flex items-start gap-6 md:gap-12">

      {/* Division label */}
      <div style={{ width: "clamp(110px, 15vw, 175px)", flexShrink: 0 }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "1.05rem",
          color: "rgba(185,170,140,0.65)",
          letterSpacing: "0.03em",
        }}>
          {label}
        </span>
      </div>

      {/* Lead */}
      <div style={{ width: "clamp(150px, 20vw, 230px)", flexShrink: 0 }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)",
          color: "rgba(220,200,155,0.95)",
          letterSpacing: "0.03em",
          display: "block",
          marginBottom: "0.15rem",
        }}>
          {lead}
        </span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.2em",
          color: `${color}80`,
          textTransform: "uppercase",
        }}>
          {leadRole}
        </span>
      </div>

      {/* Members */}
      <div className="flex-1 flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
        {members.map((m, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
              color: "rgba(200,182,148,0.78)",
              letterSpacing: "0.02em",
            }}>
              {m}
            </span>
            {i < members.length - 1 && (
              <span style={{ color: `${color}35`, fontSize: "0.8rem" }}>·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// SECTION LABEL
// ─────────────────────────────────────────────────────────────
const SectionLabel = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="flex items-center gap-4 mb-3 mt-16"
  >
    <span style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "0.68rem",
      letterSpacing: "0.32em",
      color: "rgba(200,165,55,0.5)",
      textTransform: "uppercase",
      flexShrink: 0,
    }}>
      {label}
    </span>
    <div className="flex-1 h-px"
      style={{ background: "linear-gradient(to right, rgba(200,165,55,0.2), transparent)" }} />
  </motion.div>
);

// Column header row
const ColHeaders = ({ col1, col2 }: { col1: string; col2: string }) => (
  <div
    className="flex items-center gap-6 md:gap-12 mb-1"
    style={{ borderBottom: "1px solid rgba(200,165,55,0.18)", paddingBottom: "0.7rem" }}
  >
    {[
      { label: col1, width: "clamp(110px, 15vw, 175px)" },
      { label: col2, width: "clamp(150px, 20vw, 230px)" },
      { label: "Members", width: "auto" },
    ].map(({ label, width }, i) => (
      <span
        key={i}
        style={{
          width: width === "auto" ? undefined : width,
          flex: width === "auto" ? 1 : undefined,
          flexShrink: width === "auto" ? undefined : 0,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.26em",
          color: "rgba(200,165,55,0.35)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN TeamSection
// ─────────────────────────────────────────────────────────────
const TeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const titleY       = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  useEffect(() => { injectFont(); }, []);

  const technicalSubsystems = [
    { code: "OBC",     label: "On-Board Computer",                color: SUBSYSTEM_COLORS.OBC,     lead: "Harshavardhan K",       members: ["Saksham G", "Manya", "Tanay"] },
    { code: "EPS",     label: "Electrical Power System",          color: SUBSYSTEM_COLORS.EPS,     lead: "Anirudh Nishtala",      members: ["Saanvi", "Nysa", "Anshul"] },
    { code: "COMM",    label: "Communications",                   color: SUBSYSTEM_COLORS.COMM,    lead: "Shivaram Kumar",        members: ["Anirudh Menon", "Rishikesh G", "Kruthi", "Apoorv Mathur"] },
    { code: "ADCS",    label: "Attitude Determination & Control", color: SUBSYSTEM_COLORS.ADCS,    lead: "Rithesh Murarishetty",  members: ["Ruthvik", "Amogh", "Shreya"] },
    { code: "PAYLOAD", label: "Payload",                          color: SUBSYSTEM_COLORS.PAYLOAD, lead: "Abhinav Sundar Davala", members: ["Sadanand", "Akhil"] },
    { code: "STM",     label: "Structures & Thermal",             color: SUBSYSTEM_COLORS.STM,     lead: "Malhaar Jaachak",       members: ["Swaminath B", "Krish", "Rathnam"] },
  ];

  const mgmtGroups = [
    { label: "Finance",            lead: "Sajal Agarwal",        leadRole: "Finance Head",      members: ["Vignesh"],                      color: "#fb923c" },
    { label: "Sponsorships",       lead: "Priyangshu Sutradhar", leadRole: "Sponsorships Head", members: ["Preetham", "Shreya"],            color: "#c084fc" },
    { label: "Marketing & Social", lead: "Prisha Sharma",        leadRole: "Social Media Head", members: ["Ruhani", "Rudraksha", "Garima"], color: "#f472b6" },
  ];

  const totalMembers =
    1 +
    technicalSubsystems.reduce((s, sub) => s + 1 + sub.members.length, 0) +
    mgmtGroups.reduce((s, g) => s + 1 + g.members.length, 0);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 overflow-hidden"
      style={{ background: "#00000f" }}
    >
      <StarsBg />

      <div className="max-w-5xl mx-auto relative" style={{ zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="mb-20">
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.32em",
            color: "rgba(200,165,55,0.45)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "0.85rem",
          }}>
            Mission Specialists
          </span>

          <div className="flex items-end gap-6 flex-wrap">
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              letterSpacing: "0.07em",
              color: "rgba(220,195,130,0.94)",
              lineHeight: 1,
              margin: 0,
            }}>
              The Team
            </h2>

            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "rgba(200,165,55,0.38)",
              paddingBottom: "0.5rem",
            }}>
              {totalMembers} members
            </span>
          </div>

          <div className="mt-6" style={{
            height: "1px",
            background: "linear-gradient(to right, rgba(200,165,55,0.28), transparent 60%)",
          }} />
        </motion.div>

        {/* ── Project Lead ── */}
        <ProjectLead />

        {/* ── Technical Subsystems ── */}
        <div>
          <SectionLabel label="Technical Subsystems" />
          <ColHeaders col1="Subsystem" col2="Lead" />
          {technicalSubsystems.map((sub, i) => (
            <SubsystemRow key={sub.code} {...sub} index={i} />
          ))}
        </div>

        {/* ── Management ── */}
        <div className="mt-4">
          <SectionLabel label="Management" />
          <ColHeaders col1="Division" col2="Head" />
          {mgmtGroups.map((g, i) => (
            <MgmtRow key={g.label} {...g} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TeamSection;