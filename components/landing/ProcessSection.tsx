const STEPS = [
  {
    no: "01",
    title: "אבחון",
    desc: "ממפים יחד את המשימות שגוזלות הכי הרבה זמן בעסק — ומסמנים את אלה שסוכן יכול לקחת מחר בבוקר.",
  },
  {
    no: "02",
    title: "בנייה",
    desc: "סוכן מותאם אישית לעסק שלכם: מחובר ליומן, ל־CRM, לוואטסאפ — למערכות שכבר יש לכם.",
  },
  {
    no: "03",
    title: "השקה",
    desc: "הסוכן מתחיל לעבוד על משימות אמיתיות, תחת השגחה צמודה, עד שהוא מדויק בכל תרחיש.",
  },
  {
    no: "04",
    title: "ליווי",
    desc: "ניטור שוטף, שיפורים והרחבה לסוכנים נוספים — כוח העבודה הדיגיטלי גדל עם העסק.",
  },
];

export function ProcessSection() {
  return (
    <section className="section" id="process" aria-label="איך זה עובד">
      <div className="section-inner">
        <div className="section-head fade-up">
          <span className="kicker">FROM IDEA TO WORKFORCE</span>
          <h2>
            איך זה <span className="serif-accent">קורה בפועל.</span>
          </h2>
          <p>תהליך קצר וממוקד — מהשיחה הראשונה ועד סוכן שעובד אצלכם בעסק.</p>
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
