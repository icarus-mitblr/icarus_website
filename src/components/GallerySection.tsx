import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import img1 from "@/assets/1.jpeg";
import img2 from "@/assets/2.jpeg";
import img3 from "@/assets/3.jpeg";
import img4 from "@/assets/4.jpeg";
import img5 from "@/assets/5.jpeg";

const SLIDES = [img1, img2, img3, img4, img5];

/* ── HUD corner bracket ── */
const HudCorner = ({ pos, color }: { pos: "tl" | "tr" | "bl" | "br"; color: string }) => {
  const transforms: Record<string, string> = {
    tl: "rotate(0deg)", tr: "rotate(90deg)", br: "rotate(180deg)", bl: "rotate(270deg)",
  };
  const positions: Record<string, object> = {
    tl: { top: 10, left: 10 }, tr: { top: 10, right: 10 },
    br: { bottom: 10, right: 10 }, bl: { bottom: 10, left: 10 },
  };
  return (
    <div className="absolute pointer-events-none z-20" style={{ ...positions[pos], transform: transforms[pos] }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M0 11 L0 0 L11 0" stroke={color} strokeWidth="1.5" fill="none"/>
      </svg>
    </div>
  );
};

/* ── Orbit ring ── */
const OrbitRing = ({ size, duration, color, delay }: { size: number; duration: number; color: string; delay: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size, height: size, border: `1px solid ${color}`,
      top: "50%", left: "50%", marginTop: -size / 2, marginLeft: -size / 2,
    }}
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear", delay }}
  >
    <div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: color, top: -3, left: "50%", marginLeft: -3 }} />
  </motion.div>
);

const GallerySection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 0.3], [30, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const total = SLIDES.length;

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + total) % total);
  };

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [isPaused, current]);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.98 }),
  };

  return (
    <section id="gallery" ref={sectionRef} className="relative py-24 md:py-36 px-6 overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(56,189,248,0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="mb-12">
          <motion.span
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-3"
            style={{ color: "rgba(200,165,55,0.5)" }}
          >
            Mission Archive
          </motion.span>
          <div className="flex items-end gap-5 flex-wrap">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-3xl md:text-5xl font-bold tracking-tight"
              style={{ color: "rgba(255,248,230,0.97)" }}
            >
              Gallery
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mb-1 font-mono text-[11px] px-3 py-1 rounded-full"
              style={{ color: "#38bdf8", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)" }}
            >
              {total} frames
            </motion.div>
          </div>
          <motion.div
            initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 h-px mt-6"
            style={{ background: "linear-gradient(90deg, rgba(56,189,248,0.7), transparent)" }}
          />
        </motion.div>

        {/* ── Main layout ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Featured image ── */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(6,4,12,0.95)",
              border: "1px solid rgba(56,189,248,0.18)",
              boxShadow: "0 0 0 1px rgba(56,189,248,0.06), 0 24px 80px rgba(0,0,0,0.7)",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <HudCorner pos="tl" color="rgba(56,189,248,0.7)" />
            <HudCorner pos="tr" color="rgba(56,189,248,0.7)" />
            <HudCorner pos="bl" color="rgba(56,189,248,0.3)" />
            <HudCorner pos="br" color="rgba(56,189,248,0.3)" />

            {/* Full image — no crop */}
            <div className="relative w-full overflow-hidden">
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.img
                  key={current}
                  src={SLIDES[current]}
                  alt={`Frame ${current + 1}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-auto block"
                  style={{ maxHeight: "68vh", objectFit: "contain", background: "rgba(6,4,12,0.95)" }}
                />
              </AnimatePresence>
            </div>

            {/* Bottom HUD bar */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: "1px solid rgba(56,189,248,0.1)", background: "rgba(6,4,12,0.85)" }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: isPaused ? 0.4 : [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: isPaused ? "#fb923c" : "#34d399" }}
                />
                <span className="font-mono text-[9px] tracking-widest"
                  style={{ color: isPaused ? "rgba(251,146,60,0.6)" : "rgba(52,211,153,0.6)" }}>
                  {isPaused ? "PAUSED" : "LIVE FEED"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className="transition-all duration-300"
                    style={{
                      width: i === current ? 22 : 6, height: 6, borderRadius: 3,
                      background: i === current ? "rgba(56,189,248,0.85)" : "rgba(56,189,248,0.2)",
                    }}
                  />
                ))}
              </div>

              <span className="font-mono text-[10px] tabular-nums" style={{ color: "rgba(56,189,248,0.5)" }}>
                {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>

            {/* Arrow buttons */}
            <button
              onClick={() => go(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
              style={{ background: "rgba(6,4,12,0.65)", border: "1px solid rgba(56,189,248,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)")}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6L8 10" stroke="rgba(56,189,248,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
              style={{ background: "rgba(6,4,12,0.65)", border: "1px solid rgba(56,189,248,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)")}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2L8 6L4 10" stroke="rgba(56,189,248,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-[45px] left-0 right-0 h-[2px]" style={{ background: "rgba(56,189,248,0.07)" }}>
              <motion.div
                key={`prog-${current}-${isPaused}`}
                className="h-full"
                style={{ background: "linear-gradient(90deg, rgba(56,189,248,0.7), rgba(167,139,250,0.7))" }}
                initial={{ width: "0%" }}
                animate={{ width: isPaused ? undefined : "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
          </div>

          {/* ── Filmstrip + orbit widget row ── */}
          <div className="flex gap-4 mt-4 items-stretch">

            {/* Filmstrip */}
            <div className="flex gap-3 flex-1 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {SLIDES.map((src, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex-shrink-0 rounded-lg overflow-hidden"
                  style={{
                    width: 130, height: 86,
                    border: `1.5px solid ${i === current ? "rgba(56,189,248,0.7)" : "rgba(56,189,248,0.1)"}`,
                    boxShadow: i === current ? "0 0 16px rgba(56,189,248,0.2)" : "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  {i !== current && (
                    <div className="absolute inset-0" style={{ background: "rgba(6,4,12,0.45)" }} />
                  )}
                  <div className="absolute bottom-1.5 right-1.5">
                    <span className="font-mono text-[8px] px-1 py-0.5 rounded"
                      style={{
                        color: i === current ? "rgba(56,189,248,0.9)" : "rgba(255,255,255,0.4)",
                        background: "rgba(6,4,12,0.7)",
                      }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {i === current && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: "rgba(56,189,248,0.8)" }} />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Orbit widget */}
            <div
              className="relative rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
              style={{
                width: 130, height: 86,
                background: "rgba(6,4,12,0.88)",
                border: "1px solid rgba(56,189,248,0.12)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)" }} />
              <OrbitRing size={72} duration={10} color="rgba(56,189,248,0.15)" delay={0} />
              <OrbitRing size={46} duration={6}  color="rgba(167,139,250,0.18)" delay={0.3} />
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                  <rect x="4" y="4" width="20" height="20" rx="3" fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.6)" strokeWidth="1"/>
                  <rect x="1" y="10" width="3" height="8" rx="1" fill="rgba(56,189,248,0.3)" stroke="rgba(56,189,248,0.5)" strokeWidth="0.7"/>
                  <rect x="24" y="10" width="3" height="8" rx="1" fill="rgba(56,189,248,0.3)" stroke="rgba(56,189,248,0.5)" strokeWidth="0.7"/>
                  <circle cx="14" cy="14" r="3" fill="rgba(167,139,250,0.3)" stroke="rgba(167,139,250,0.6)" strokeWidth="0.8"/>
                </svg>
                <span className="font-mono text-[6px] tracking-[0.15em]" style={{ color: "rgba(56,189,248,0.45)" }}>ICARUS-1</span>
              </div>
              <div className="absolute bottom-1.5 left-0 right-0 flex justify-between px-2">
                <span className="font-mono text-[6px]" style={{ color: "rgba(56,189,248,0.3)" }}>450km</span>
                <span className="font-mono text-[6px]" style={{ color: "rgba(56,189,248,0.3)" }}>LEO</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;