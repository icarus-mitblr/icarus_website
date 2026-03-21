import { useEffect, useState } from "react";

const sections = ["HOME", "COMM", "OBC", "ADCS", "PAYLOAD", "EPS", "STM", "MGMT", "TEAM", "WORK"];

const MissionProgress = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sectionEls = sections.map((_, i) => {
      const ids = ["home", "comm", "obc", "adcs", "payload", "eps", "stm", "mgmt", "team", "work"];
      return document.getElementById(ids[i]);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionEls.findIndex((el) => el === entry.target);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionEls.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
      {sections.map((label, i) => (
        <div key={label} className="group flex items-center gap-2">
          <span className={`hud-label opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-right whitespace-nowrap`}>
            {label}
          </span>
          <div className={i === active ? "progress-dot-active" : "progress-dot"} />
        </div>
      ))}
      <div className="mt-2 hud-label writing-mode-vertical" style={{ writingMode: "vertical-rl" }}>
        MISSION PROGRESS
      </div>
    </div>
  );
};

export default MissionProgress;
