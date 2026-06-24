const BEFORE = [
  "A customer writes at 9:30 PM — gets a reply tomorrow afternoon, if at all",
  "A last-minute cancellation = an empty hour nobody fills",
  "Leads pile up in a sheet you'll \"get back to tomorrow\"",
  "Whole evenings on invoices, forms and copying between systems",
];

const AFTER = [
  "Every inquiry answered in seconds — any hour, any channel",
  "The calendar refills itself from the waitlist, automatically",
  "Every lead gets consistent follow-up until a call is booked",
  "The paperwork enters itself — and you get back to running the business",
];

const NUMBERS = [
  { n: "24/7", l: "Always on, no shifts" },
  { n: "< 1 min", l: "Response time to every inquiry" },
  { n: "0", l: "Leads falling through the cracks" },
  { n: "∞", l: "Patience, even for the tenth same question" },
];

export function BeforeAfter() {
  return (
    <section className="section" id="why" aria-label="Why agents">
      <div className="section-inner">
        <div className="section-head center fade-up">
          <span className="kicker">IMAGINE THE DIFFERENCE</span>
          <h2>
            Feel the difference of <span className="serif-accent">a team that never rests.</span>
          </h2>
          <p>
            Stop for a second and think how much of your week goes to repetitive tasks —
            and what you'd do if someone took them off your hands, for good.
          </p>
        </div>

        <div className="ba-grid">
          <div className="ba-col before fade-up">
            <h3>Today, without agents</h3>
            <ul>
              {BEFORE.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
          <div className="ba-col after fade-up d1">
            <h3>Tomorrow, with a digital workforce</h3>
            <ul>
              {AFTER.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>

        <div className="numbers-band fade-up" aria-label="Numbers">
          {NUMBERS.map((x) => (
            <div className="nb-cell" key={x.l}>
              <div className="n">{x.n}</div>
              <div className="l">{x.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
