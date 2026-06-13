const BEFORE = [
  "לקוח כותב ב־21:30 — מקבל תשובה רק מחר בצהריים, אם בכלל",
  "ביטול של הרגע האחרון = שעה ריקה שאף אחד לא ממלא",
  "לידים נערמים בטבלה ש\"נחזור אליהם מחר\"",
  "ערבים שלמים על חשבוניות, טפסים והעתקות בין מערכות",
];

const AFTER = [
  "כל פנייה נענית תוך שניות — בכל שעה, בכל ערוץ",
  "היומן ממלא את עצמו מרשימת ההמתנה, אוטומטית",
  "כל ליד מקבל מעקב עקבי עד שנקבעת שיחה",
  "הניירת מזינה את עצמה — ואתם חוזרים לנהל את העסק",
];

const NUMBERS = [
  { n: "24/7", l: "זמינות מלאה, בלי משמרות" },
  { n: "< 1 דק׳", l: "זמן תגובה לכל פנייה" },
  { n: "0", l: "לידים שנופלים בין הכיסאות" },
  { n: "∞", l: "סבלנות, גם ללקוח העשירי באותה שאלה" },
];

export function BeforeAfter() {
  return (
    <section className="section" id="why" aria-label="למה סוכנים">
      <div className="section-inner">
        <div className="section-head center fade-up">
          <span className="kicker">IMAGINE THE DIFFERENCE</span>
          <h2>
            תרגישו את ההבדל של <span className="serif-accent">צוות שלא נח.</span>
          </h2>
          <p>
            עצרו רגע וחשבו כמה מהשבוע שלכם הולך על משימות שחוזרות על עצמן —
            ומה הייתם עושים אם מישהו היה לוקח אותן מכם, לתמיד.
          </p>
        </div>

        <div className="ba-grid">
          <div className="ba-col before fade-up">
            <h3>היום, בלי סוכנים</h3>
            <ul>
              {BEFORE.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
          <div className="ba-col after fade-up d1">
            <h3>מחר, עם כוח עבודה דיגיטלי</h3>
            <ul>
              {AFTER.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>

        <div className="numbers-band fade-up" aria-label="מספרים">
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
