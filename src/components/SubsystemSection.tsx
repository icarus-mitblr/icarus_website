import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import CubeSatSVG, { PART_COLORS } from "./CubeSatSVG";

interface SubsystemData {
  id: string;
  code: string;
  name: string;
  description: string;
  components: string;
  index: string;
  cardPos: { top?: string; bottom?: string; left?: string; right?: string };
}

const subsystems: SubsystemData[] = [
  {
    id: "comm", code: "COMM", index: "01",
    name: "Communications Subsystem",
    description: "Enables uplink and downlink of telemetry and payload data to ground stations. Ensures reliable communication over orbital distances with constrained power budgets.",
    components: "UHF/VHF + S-band transceivers, Yagi antenna, patch antenna, RF amplifiers, modulation hardware",
    cardPos: { top: "8%", right: "2%" },
  },
  {
    id: "obc", code: "OBC", index: "02",
    name: "On-Board Computer",
    description: "Central controller coordinating all subsystems, executing mission software, and managing telemetry, command processing and onboard data storage.",
    components: "ARM microprocessor, RAM/Flash memory, watchdog timers, I²C/SPI/CAN buses, real-time OS",
    cardPos: { top: "36%", left: "2%" },
  },
  {
    id: "adcs", code: "ADCS", index: "03",
    name: "Attitude Determination & Control",
    description: "Determines and controls satellite orientation for precise pointing of antennas, solar panels, and payload instruments throughout the mission.",
    components: "Gyroscopes, magnetometers, sun sensors, star trackers, magnetorquers, reaction wheels",
    cardPos: { top: "6%", left: "2%" },
  },
  {
    id: "payload", code: "PAYLOAD", index: "04",
    name: "Payload",
    description: "Primary mission instrument defining the satellite's scientific purpose. Collects high-resolution imaging, spectral, or communication data from orbit.",
    components: "CMOS/CCD imager, optical filters, radiation detectors, data compression hardware",
    cardPos: { top: "38%", right: "2%" },
  },
  {
    id: "eps", code: "EPS", index: "05",
    name: "Electrical Power System",
    description: "Generates, stores, and distributes electrical power to all subsystems while maintaining stable regulated voltage across all operating modes and eclipse periods.",
    components: "GaAs solar panels, Li-ion battery pack, BMS, DC-DC converters, power distribution unit",
    cardPos: { bottom: "18%", left: "2%" },
  },
  {
    id: "stm", code: "STM", index: "06",
    name: "Structures, Mechanisms & Thermal",
    description: "Provides structural integrity, mounts all hardware on PC-104 stacking rails, and manages the thermal environment throughout the mission lifecycle.",
    components: "Al-6061 frame, PC-104 rails, deployable mechanisms, MLI blankets, thermal coatings",
    cardPos: { bottom: "8%", right: "2%" },
  },
  {
    id: "mgmt", code: "MGMT", index: "07",
    name: "Management Subsystem",
    description: "Handles project coordination, resource allocation, budgeting, outreach, and stakeholder relations to ensure all mission deliverables are met on schedule.",
    components: "Project timelines, Gantt charts, financial planning, sponsor management, documentation",
    cardPos: { bottom: "8%", left: "2%" },
  },
];

const SubsystemCard = ({ data }: { data: SubsystemData }) => {
  const col = PART_COLORS[data.id];
  return (
    <motion.div
      key={data.id}
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -16 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="absolute w-80 pointer-events-auto z-20"
      style={{ ...data.cardPos }}
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(4,4,8,0.88)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${col}44`,
          boxShadow: `0 0 0 1px ${col}18, 0 8px 40px ${col}1a, 0 2px 8px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Top gradient line */}
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent 0%, ${col} 40%, ${col} 60%, transparent 100%)` }}/>

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Color dot */}
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: col, boxShadow: `0 0 8px ${col}` }}/>
              <span className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase"
                style={{ color: col }}>
                {data.code}
              </span>
            </div>
            <span className="font-mono text-[10px] tabular-nums"
              style={{ color: "rgba(200,165,55,0.35)" }}>
              {data.index}/07
            </span>
          </div>

          {/* Name */}
          <h3 className="font-mono text-[15px] font-semibold leading-snug mb-3"
            style={{ color: "rgba(255,248,230,0.95)" }}>
            {data.name}
          </h3>

          {/* Description */}
          <p className="text-[12px] leading-relaxed mb-4"
            style={{ color: "rgba(200,188,165,0.72)" }}>
            {data.description}
          </p>

          {/* Components block */}
          <div
            className="rounded-lg px-3.5 py-3"
            style={{
              background: `${col}0c`,
              border: `1px solid ${col}1e`,
            }}
          >
            <span className="font-mono text-[9px] tracking-[0.24em] uppercase block mb-1.5"
              style={{ color: `${col}88` }}>
              Key Components
            </span>
            <p className="text-[11px] leading-relaxed"
              style={{ color: "rgba(180,168,148,0.7)" }}>
              {data.components}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SubsystemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

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
    <section id="subsystems" ref={sectionRef} className="relative" style={{ height: "720vh" }}>

      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">

        {/* Header */}
        <div className="text-center pt-8 pb-2 px-6 z-10 relative flex-shrink-0">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(200,165,55,0.4)" }}>
            Technical Specifications
          </span>
          <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-tight mt-1"
            style={{ color: "rgba(255,248,230,0.95)" }}>
            Mission Subsystems
          </h2>
          <div className="h-px w-20 mx-auto mt-3"
            style={{ background: "linear-gradient(90deg,transparent,rgba(200,165,55,0.45),transparent)" }}/>
        </div>

        {/* Main area */}
        <div className="relative flex-1 flex items-center justify-center">

          {/* Orbit rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "min(72vh, 72vw)", height: "min(72vh, 72vw)",
              border: "1px dashed rgba(200,165,55,0.07)",
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "min(90vh, 90vw)", height: "min(90vh, 90vw)",
              border: "1px solid rgba(200,165,55,0.035)",
            }}
          />

          {/* ── The CubeSat ── */}
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

          {/* Floating card */}
          <AnimatePresence mode="wait">
            {activeData && <SubsystemCard key={activeData.id} data={activeData} />}
          </AnimatePresence>

          {/* Idle hint */}
          <AnimatePresence>
            {!activeId && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none text-center"
              >
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: "rgba(200,165,55,0.28)" }}>
                  Scroll to inspect subsystems
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div className="flex-shrink-0 pb-7 px-6">
          <div className="flex flex-col items-center gap-2.5">
            <AnimatePresence mode="wait">
              {activeId && (
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: PART_COLORS[activeId], boxShadow: `0 0 6px ${PART_COLORS[activeId]}` }}/>
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase"
                    style={{ color: PART_COLORS[activeId] }}>
                    {subsystems.find(s=>s.id===activeId)?.code} — {subsystems.find(s=>s.id===activeId)?.index}/07
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex gap-2.5 items-center">
              {subsystems.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className="focus:outline-none transition-all duration-300 rounded-full"
                  style={{
                    width: activeId===s.id ? "8px" : "6px",
                    height: activeId===s.id ? "8px" : "6px",
                    backgroundColor: activeId===s.id ? PART_COLORS[s.id] : "rgba(200,165,55,0.2)",
                    boxShadow: activeId===s.id ? `0 0 8px ${PART_COLORS[s.id]}` : "none",
                    transform: activeId===s.id ? "scale(1.4)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsystemSection;