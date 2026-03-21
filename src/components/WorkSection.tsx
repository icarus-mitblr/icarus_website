import { motion } from "framer-motion";

const WorkSection = () => {
  return (
    <section id="work" className="py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="section-title">RESEARCH & DEVELOPMENT</span>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em] mt-3">
            Our Work
          </h2>
          <div className="w-20 h-px bg-primary/40 mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["Research Papers", "Projects", "Competitions", "Collaborations"].map((title, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="subsystem-card min-h-[200px] flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs tabular-nums text-primary/60">0{i + 1}</span>
                <h3 className="font-mono text-lg font-semibold text-foreground mt-2">{title}</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground mt-4">
                Content to be added — details about {title.toLowerCase()} will appear here.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
