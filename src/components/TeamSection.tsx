import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const SUBSYSTEM_COLORS: Record<string, string> = {
  MGMT:    "#f472b6",
  COMM:    "#38bdf8",
  OBC:     "#a78bfa",
  ADCS:    "#34d399",
  PAYLOAD: "#fbbf24",
  EPS:     "#86efac",
  STM:     "#fb923c",
};

/* ── Clean minimal subsystem icons ── */
const SubsystemIcon = ({ subsystem, color, size = 36 }: { subsystem: string; color: string; size?: number }) => {
  const s = size;
  const c = color;

  if (subsystem === "OBC") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <rect x="4" y="4" width="28" height="28" rx="4" stroke={c} strokeWidth="1.2" fill={`${c}10`}/>
      <rect x="9" y="9" width="18" height="12" rx="2" stroke={c} strokeWidth="0.9" fill={`${c}15`}/>
      <circle cx="13" cy="27" r="1.5" fill={c} opacity="0.7"/>
      <circle cx="18" cy="27" r="1.5" fill={c} opacity="0.7"/>
      <circle cx="23" cy="27" r="1.5" fill={c} opacity="0.7"/>
      <line x1="9" y1="15" x2="27" y2="15" stroke={c} strokeWidth="0.6" opacity="0.5"/>
    </svg>
  );

  if (subsystem === "EPS") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <rect x="4" y="10" width="12" height="16" rx="2" stroke={c} strokeWidth="1.1" fill={`${c}10`}/>
      <rect x="20" y="10" width="12" height="16" rx="2" stroke={c} strokeWidth="1.1" fill={`${c}10`}/>
      {[13,16,19,22].map(y=><line key={y} x1="4" y1={y} x2="16" y2={y} stroke={c} strokeWidth="0.5" opacity="0.45"/>)}
      {[13,16,19,22].map(y=><line key={y} x1="20" y1={y} x2="32" y2={y} stroke={c} strokeWidth="0.5" opacity="0.45"/>)}
      <line x1="16" y1="18" x2="20" y2="18" stroke={c} strokeWidth="1.2"/>
      <circle cx="18" cy="18" r="2.5" fill={`${c}30`} stroke={c} strokeWidth="0.8"/>
    </svg>
  );

  if (subsystem === "COMM") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <line x1="18" y1="32" x2="18" y2="8" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      {[[14,8],[11,13],[8,19]].map(([hw,y],i)=>(
        <line key={i} x1={18-hw} y1={y} x2={18+hw} y2={y} stroke={c} strokeWidth={1.4-i*0.2} strokeLinecap="round"/>
      ))}
      {[6,11,17].map((r,i)=>(
        <circle key={i} cx="18" cy="6" r={r} fill="none" stroke={c} strokeWidth="0.6" opacity={0.4-i*0.08} strokeDasharray="2 3"/>
      ))}
      <circle cx="18" cy="6" r="2.5" fill={c}/>
    </svg>
  );

  if (subsystem === "ADCS") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="14" fill="none" stroke={c} strokeWidth="1" opacity="0.4"/>
      <circle cx="18" cy="18" r="9"  fill={`${c}12`} stroke={c} strokeWidth="1.1"/>
      <circle cx="18" cy="18" r="4"  fill={`${c}25`} stroke={c} strokeWidth="0.8"/>
      <circle cx="18" cy="18" r="1.5" fill={c}/>
      {[0,90,180,270].map((deg,i)=>{
        const r=deg*Math.PI/180;
        return <line key={i} x1={18+9*Math.cos(r)} y1={18+9*Math.sin(r)} x2={18+14*Math.cos(r)} y2={18+14*Math.sin(r)} stroke={c} strokeWidth="1" opacity="0.6"/>;
      })}
    </svg>
  );

  if (subsystem === "PAYLOAD") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <rect x="6" y="8" width="24" height="20" rx="3" stroke={c} strokeWidth="1.1" fill={`${c}10`}/>
      <circle cx="18" cy="18" r="7" fill={`${c}12`} stroke={c} strokeWidth="1"/>
      <circle cx="18" cy="18" r="4" fill={`${c}20`} stroke={c} strokeWidth="0.8"/>
      <circle cx="18" cy="18" r="1.8" fill={c} opacity="0.8"/>
      <circle cx="14" cy="14" r="1.2" fill={c} opacity="0.3"/>
      <rect x="22" y="9" width="3" height="2" rx="0.5" fill={c} opacity="0.5"/>
      <rect x="26" y="9" width="3" height="2" rx="0.5" fill={c} opacity="0.5"/>
    </svg>
  );

  if (subsystem === "STM") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <path d="M18 4 L30 11 L30 25 L18 32 L6 25 L6 11Z" fill={`${c}10`} stroke={c} strokeWidth="1.1"/>
      <path d="M18 4 L30 11 L18 18Z" fill={`${c}20`} stroke={c} strokeWidth="0.7"/>
      <path d="M6 11 L18 18 L18 32 L6 25Z" fill={`${c}12`} stroke={c} strokeWidth="0.7"/>
      <path d="M30 11 L30 25 L18 32 L18 18Z" fill={`${c}16`} stroke={c} strokeWidth="0.7"/>
      {[[6,11],[30,11],[18,4],[6,25],[30,25],[18,32]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="2" fill={c} opacity="0.75"/>
      ))}
    </svg>
  );

  if (subsystem === "MGMT") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="12" r="5" fill={`${c}15`} stroke={c} strokeWidth="1.1"/>
      <circle cx="9"  cy="26" r="4" fill={`${c}15`} stroke={c} strokeWidth="1"/>
      <circle cx="27" cy="26" r="4" fill={`${c}15`} stroke={c} strokeWidth="1"/>
      <line x1="18" y1="17" x2="9"  y2="22" stroke={c} strokeWidth="0.9" opacity="0.6"/>
      <line x1="18" y1="17" x2="27" y2="22" stroke={c} strokeWidth="0.9" opacity="0.6"/>
    </svg>
  );

  return <svg width={s} height={s} viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="12" stroke={c} strokeWidth="1.1" fill={`${c}10`}/></svg>;
};

/* ── Lead card ── */
const LeadCard = ({ name, role, subsystem, index }: { name: string; role: string; subsystem: string; index: number }) => {
  const col = SUBSYSTEM_COLORS[subsystem] ?? "#fbbf24";
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-xl overflow-hidden"
      style={{
        background: "rgba(6,4,12,0.88)",
        border: `1px solid ${col}38`,
        boxShadow: `0 0 0 1px ${col}10, 0 4px 24px rgba(0,0,0,0.4)`,
      }}
    >
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${col}, transparent)` }}/>
      <div className="p-4 flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `${col}14`, border: `1.5px solid ${col}45` }}
          >
            <span className="font-mono text-[11px] font-bold" style={{ color: col }}>{initials}</span>
          </div>
          <motion.div
            animate={{ scale: [1,1.5,1], opacity: [0.5,0,0.5] }}
            transition={{ duration: 2.5+index*0.2, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${col}50` }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[12px] font-semibold truncate" style={{ color: "rgba(255,248,230,0.95)" }}>{name}</p>
          <p className="font-mono text-[10px] tracking-wide truncate" style={{ color: `${col}90` }}>{role}</p>
        </div>
        <div className="flex-shrink-0">
          <SubsystemIcon subsystem={subsystem} color={col} size={28}/>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Member pill ── */
const MemberPill = ({ name, color, delay }: { name: string; color: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.45, ease: [0.16,1,0.3,1] }}
    className="font-mono text-[10px] px-2.5 py-1 rounded-full"
    style={{
      color: `${color}cc`,
      background: `${color}0e`,
      border: `1px solid ${color}22`,
    }}
  >
    {name.split(" ")[0]}
  </motion.div>
);

/* ── Subsystem block ── */
const SubsystemBlock = ({
  code, label, color, lead, members, index,
}: {
  code: string; label: string; color: string;
  lead: string; members: string[]; index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay: index * 0.07, duration: 0.65, ease: [0.16,1,0.3,1] }}
    className="group relative rounded-xl overflow-hidden"
    style={{
      background: "rgba(6,4,12,0.82)",
      border: `1px solid ${color}22`,
    }}
  >
    {/* hover sweep */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}0e 0%, transparent 65%)` }}/>

    {/* top line */}
    <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}70, transparent)` }}/>

    <div className="p-4">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SubsystemIcon subsystem={code} color={color} size={32}/>
          <div>
            <span className="font-mono text-[10px] font-bold tracking-[0.2em]" style={{ color }}>{code}</span>
            <p className="font-mono text-[9px] tracking-wide" style={{ color: `${color}60` }}>{label}</p>
          </div>
        </div>
        <span className="font-mono text-[9px] tabular-nums px-2 py-0.5 rounded"
          style={{ color: `${color}80`, background: `${color}0e`, border: `1px solid ${color}18` }}>
          {members.length + 1} members
        </span>
      </div>

      {/* divider */}
      <div className="h-px mb-3" style={{ background: `${color}18` }}/>

      {/* lead */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1.5px solid ${color}50` }}>
          <span className="font-mono text-[9px] font-bold" style={{ color }}>
            {lead.split(" ")[0][0]}{lead.split(" ").slice(-1)[0][0]}
          </span>
        </div>
        <div>
          <p className="font-mono text-[11px] font-semibold" style={{ color: "rgba(255,248,230,0.92)" }}>{lead}</p>
          <p className="font-mono text-[9px]" style={{ color: `${color}70` }}>Lead</p>
        </div>
      </div>

      {/* member pills */}
      <div className="flex flex-wrap gap-1.5">
        {members.map((m, i) => (
          <MemberPill key={i} name={m} color={color} delay={index * 0.07 + i * 0.04}/>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ── Management group ── */
const MgmtGroup = ({
  label, lead, leadRole, members, color, index,
}: {
  label: string; lead: string; leadRole: string; members: string[]; color: string; index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16,1,0.3,1] }}
    className="group relative rounded-xl overflow-hidden"
    style={{
      background: "rgba(6,4,12,0.82)",
      border: `1px solid ${color}22`,
    }}
  >
    {/* hover sweep */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}0e 0%, transparent 65%)` }}/>

    <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}70, transparent)` }}/>

    <div className="p-4">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SubsystemIcon subsystem="MGMT" color={color} size={28}/>
          <p className="font-mono text-[11px] font-semibold" style={{ color: "rgba(255,248,230,0.9)" }}>{label}</p>
        </div>
        <span className="font-mono text-[9px] tabular-nums px-2 py-0.5 rounded"
          style={{ color: `${color}80`, background: `${color}0e`, border: `1px solid ${color}18` }}>
          {members.length + 1} members
        </span>
      </div>

      {/* divider */}
      <div className="h-px mb-3" style={{ background: `${color}18` }}/>

      {/* lead */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1.5px solid ${color}50` }}>
          <span className="font-mono text-[9px] font-bold" style={{ color }}>
            {lead.split(" ")[0][0]}{lead.split(" ").slice(-1)[0][0]}
          </span>
        </div>
        <div>
          <p className="font-mono text-[11px] font-semibold" style={{ color: "rgba(255,248,230,0.92)" }}>{lead}</p>
          <p className="font-mono text-[9px]" style={{ color: `${color}70` }}>{leadRole}</p>
        </div>
      </div>

      {/* member pills */}
      <div className="flex flex-wrap gap-1.5">
        {members.map((m, i) => (
          <MemberPill key={i} name={m} color={color} delay={index * 0.1 + i * 0.04}/>
        ))}
      </div>
    </div>
  </motion.div>
);

const SectionLabel = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="flex items-center gap-3 mb-8"
  >
    <motion.div
      animate={{ scale:[1,1.6,1], opacity:[0.8,0.2,0.8] }}
      transition={{ duration: 2.2, repeat: Infinity }}
      className="w-1.5 h-1.5 rounded-full bg-primary"
    />
    <span className="font-mono text-[10px] tracking-[0.28em] uppercase"
      style={{ color: "rgba(200,165,55,0.45)" }}>
      {label}
    </span>
    <motion.div
      className="flex-1 h-px"
      initial={{ scaleX:0, originX:0 }}
      whileInView={{ scaleX:1 }}
      viewport={{ once: true }}
      transition={{ delay:0.2, duration:1, ease:[0.16,1,0.3,1] }}
      style={{ background:"linear-gradient(90deg, rgba(200,165,55,0.15), transparent)" }}
    />
  </motion.div>
);

const Particle = ({ x, y, delay, color }: { x:string; y:string; delay:number; color:string }) => (
  <motion.div
    className="absolute w-px h-px rounded-full pointer-events-none"
    style={{ left:x, top:y, backgroundColor:color }}
    animate={{ y:[0,-44,0], opacity:[0,0.5,0] }}
    transition={{ duration:4+delay, repeat:Infinity, delay, ease:"easeInOut" }}
  />
);

const TeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset:["start end","end start"] });
  const titleY       = useTransform(scrollYProgress, [0,0.4], [40,0]);
  const titleOpacity = useTransform(scrollYProgress, [0,0.2], [0,1]);

  const technicalSubsystems = [
    {
      code:"OBC",   label:"On-Board Computer",
      color: SUBSYSTEM_COLORS.OBC,
      lead:"Harshavardhan K",
      members:["Saksham G","Manya","Tanay"],
    },
    {
      code:"EPS",   label:"Electrical Power System",
      color: SUBSYSTEM_COLORS.EPS,
      lead:"Anirudh Nishtala",
      members:["Saanvi","Nysa","Anshul"],
    },
    {
      code:"COMM",  label:"Communications",
      color: SUBSYSTEM_COLORS.COMM,
      lead:"Shivaram Kumar",
      members:["Anirudh Menon","Rishikesh G","Kruthi","Apoorv Mathur"],
    },
    {
      code:"ADCS",  label:"Attitude Determination & Control",
      color: SUBSYSTEM_COLORS.ADCS,
      lead:"Rithesh Murarishetty",
      members:["Ruthvik","Amogh","Shreya"],
    },
    {
      code:"PAYLOAD", label:"Payload",
      color: SUBSYSTEM_COLORS.PAYLOAD,
      lead:"Abhinav Sundar Davala",
      members:["Sadanand","Akhil"],
    },
    {
      code:"STM",   label:"Structures & Thermal",
      color: SUBSYSTEM_COLORS.STM,
      lead:"Malhaar Jaachak",
      members:["Swaminath B","Krish","Rathnam"],
    },
  ];

  const mgmtGroups = [
    {
      label:"Finance",
      lead:"Sajal Agarwal",
      leadRole:"Finance Head",
      members:["Vignesh"],
      color:"#fb923c",
    },
    {
      label:"Sponsorships",
      lead:"Priyangshu Sutradhar",
      leadRole:"Sponsorships Head",
      members:["Preetham","Shreya",],
      color:"#c084fc",
    },
    {
      label:"Marketing & Social Media",
      lead:"Prisha Sharma",
      leadRole:"Social Media Head",
      members:["Ruhani","Rudraksha","Garima"],
      color:"#f472b6",
    },
  ];

  return (
    <section id="team" ref={sectionRef} className="relative py-24 md:py-36 px-6 overflow-hidden">

      {[
        {x:"8%", y:"12%", delay:0,   color:"#f472b644"},
        {x:"82%",y:"10%", delay:1.2, color:"#38bdf844"},
        {x:"55%",y:"60%", delay:0.6, color:"#a78bfa44"},
        {x:"90%",y:"70%", delay:2,   color:"#fbbf2444"},
        {x:"20%",y:"80%", delay:1.5, color:"#34d39944"},
        {x:"65%",y:"30%", delay:0.3, color:"#fb923c44"},
      ].map((p,i)=><Particle key={i} {...p}/>)}

      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 70% 50% at 50% 45%, rgba(244,114,182,0.03) 0%, transparent 70%)" }}/>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div style={{ y:titleY, opacity:titleOpacity }} className="mb-16">
          <motion.span
            initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.6 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-3"
            style={{ color:"rgba(200,165,55,0.5)" }}
          >
            Mission Specialists
          </motion.span>
          <div className="flex items-end gap-5 flex-wrap">
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.1, duration:0.75, ease:[0.16,1,0.3,1] }}
              className="font-mono text-3xl md:text-5xl font-bold tracking-tight"
              style={{ color:"rgba(255,248,230,0.97)" }}
            >
              The Team
            </motion.h2>
            <motion.div
              initial={{ opacity:0, scale:0.7 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
              transition={{ delay:0.35, duration:0.5 }}
              className="mb-1 font-mono text-[11px] px-3 py-1 rounded-full"
              style={{ color:"#f472b6", background:"rgba(244,114,182,0.1)", border:"1px solid rgba(244,114,182,0.25)" }}
            >
              {1 + technicalSubsystems.reduce((s,sub)=>s+1+sub.members.length,0) + mgmtGroups.reduce((s,g)=>s+1+g.members.length,0)} members
            </motion.div>
          </div>
          <motion.div
            initial={{ scaleX:0, originX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }}
            transition={{ delay:0.3, duration:1.2, ease:[0.16,1,0.3,1] }}
            className="w-24 h-px mt-6"
            style={{ background:"linear-gradient(90deg, rgba(244,114,182,0.7), transparent)" }}
          />
        </motion.div>

        {/* ── Project Lead ── */}
        <div className="mb-14">
          <SectionLabel label="Project Lead"/>
          <div className="max-w-xs">
            <motion.div
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
              className="relative rounded-xl overflow-hidden"
              style={{ background:"rgba(6,4,12,0.92)", border:"1px solid rgba(200,165,55,0.35)", boxShadow:"0 0 32px rgba(200,165,55,0.1), 0 0 1px rgba(200,165,55,0.4)" }}
            >
              <div className="h-[2px]" style={{ background:"linear-gradient(90deg, transparent, hsl(45 93% 55%), transparent)" }}/>
              <div className="p-5 flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background:"rgba(200,165,55,0.12)", border:"2px solid rgba(200,165,55,0.4)" }}>
                    <span className="font-mono text-sm font-bold" style={{ color:"hsl(45 93% 55%)" }}>SP</span>
                  </div>
                  <motion.div
                    animate={{ scale:[1,1.6,1], opacity:[0.5,0,0.5] }}
                    transition={{ duration:2.8, repeat:Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ border:"1px solid rgba(200,165,55,0.4)" }}
                  />
                </div>
                <div>
                  <p className="font-mono text-[14px] font-bold" style={{ color:"rgba(255,248,230,0.97)" }}>Sumedh P</p>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase mt-0.5" style={{ color:"rgba(200,165,55,0.6)" }}>Project Lead</p>
                </div>
                <div className="ml-auto">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="rgba(200,165,55,0.2)" stroke="rgba(200,165,55,0.7)" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Technical Subsystems ── */}
        <div className="mb-14">
          <SectionLabel label="Technical Subsystems"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalSubsystems.map((sub,i)=>(
              <SubsystemBlock key={sub.code} {...sub} index={i}/>
            ))}
          </div>
        </div>

        {/* ── Management ── */}
        <div>
          <SectionLabel label="Management Team"/>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mgmtGroups.map((g,i)=>(
              <MgmtGroup key={g.label} {...g} index={i}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;