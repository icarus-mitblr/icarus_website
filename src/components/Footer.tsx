const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tracking-[0.1em] text-muted-foreground">
            ICARUS &mdash; MIT BENGALURU
          </span>
        </div>
        <div className="flex gap-6">
          {["HOME", "SUBSYSTEMS", "TEAM", "WORK"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
              {item}
            </a>
          ))}
        </div>
        <span className="hud-label">
          &copy; {new Date().getFullYear()} ICARUS
        </span>
      </div>
    </footer>
  );
};

export default Footer;