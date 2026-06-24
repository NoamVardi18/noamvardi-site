const STEPS = [
  {
    no: "01",
    title: "Diagnose",
    desc: "We map the tasks eating the most time in your business — and mark the ones an agent can take over tomorrow morning.",
  },
  {
    no: "02",
    title: "Build",
    desc: "A custom agent for your business: connected to your calendar, CRM and WhatsApp — the systems you already use.",
  },
  {
    no: "03",
    title: "Launch",
    desc: "The agent starts working on real tasks, closely supervised, until it's accurate in every scenario.",
  },
  {
    no: "04",
    title: "Scale",
    desc: "Ongoing monitoring, improvements and more agents — your digital workforce grows with the business.",
  },
];

export function ProcessSection() {
  return (
    <section className="section" id="process" aria-label="How it works">
      <div className="section-inner">
        <div className="section-head fade-up">
          <span className="kicker">FROM IDEA TO WORKFORCE</span>
          <h2>
            How it <span className="serif-accent">actually happens.</span>
          </h2>
          <p>A short, focused process — from the first conversation to an agent working in your business.</p>
        </div>
        <div className="process-grid">
          {STEPS.map((s, i) => (
            <div className={`step-card glass-panel fade-up ${i ? `d${i}` : ""}`} key={s.no}>
              <span className="step-no">{s.no}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
