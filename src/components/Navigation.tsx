import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import icarusLogo from "@/assets/icarus-logo.jpg";

const navItems = [
  { label: "HOME",       href: "#home"       },
  { label: "SUBSYSTEMS", href: "#subsystems" },
  { label: "TEAM",       href: "#team"       },
  { label: "OUR WORK",   href: "#work"       },
  { label: "GALLERY",    href: "#gallery"    },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Left — ICARUS logo + wordmark */}
        <a href="#home" className="flex items-center gap-3">

          {/* ICARUS logo */}
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid rgba(200,165,55,0.35)",
              boxShadow: "0 0 10px rgba(200,165,55,0.15)",
              flexShrink: 0,
            }}
          >
            <img
              src={icarusLogo}
              alt="ICARUS"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* ICARUS wordmark */}
          <span
            className="font-mono text-sm font-bold tracking-[0.2em]"
            style={{
              color: "hsl(45 93% 55%)",
              textShadow: "0 0 12px hsl(45 93% 47% / 0.4)",
            }}
          >
            ICARUS
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => {}}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className="block w-5 h-px bg-foreground" />
          <span className="block w-5 h-px bg-foreground" />
          <span className="block w-5 h-px bg-foreground" />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navigation;