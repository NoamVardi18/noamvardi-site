import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/auth";
import { BRAND } from "@/lib/constants";

export const metadata = { title: "תנאי שימוש ופרטיות | נועם ורדי" };

export default async function TermsPage() {
  const user = await getSessionUser();
  return (
    <>
      <SiteHeader user={user} />
      <main className="page page-narrow">
        <h1>תנאי שימוש ומדיניות פרטיות</h1>
        <p className="sub">עודכן לאחרונה: מאי 2026</p>

        <div className="card" style={{ lineHeight: 1.9 }}>
          <h3>1. כללי</h3>
          <p>
            השימוש באתר ובמרכז הנכסים האישי כפוף לתנאים שלהלן. עצם ההרשמה והשימוש
            מהווים הסכמה מלאה לתנאים אלה.
          </p>

          <h3>2. חשבון משתמש ואבטחה</h3>
          <p>
            הסיסמה שלך נשמרת בצורה מוצפנת (hashing) ואינה נגישה לאיש, כולל מנהל
            המערכת. כל משתמש אחראי לשמירת פרטי הגישה שלו. המידע הפיננסי שתזין נשמר
            בבידוד מלא ונגיש אך ורק לך.
          </p>

          <h3>3. מרכז הנכסים — הבהרה</h3>
          <p>
            הנתונים, השערים והגרפים המוצגים במרכז הנכסים הם לצורכי מעקב והמחשה
            בלבד, ואינם מהווים ייעוץ השקעות, המלצה או תחליף לייעוץ פיננסי מקצועי.
            מחירים מתקבלים מספקים חיצוניים ועשויים להתעדכן בעיכוב.
          </p>

          <h3>4. פרטיות ודיוור</h3>
          <p>
            אנו אוספים אך ורק את המידע הדרוש לתפעול השירות. הסכמה לקבלת דיוור היא
            אופציונלית וניתן לבטלה בכל עת. לא נעביר את פרטיך לצד שלישי ללא הסכמתך.
          </p>

          <h3>5. עוגיות (Cookies)</h3>
          <p>
            האתר משתמש בעוגיות חיוניות לצורך ניהול ההתחברות וזכירת החשבון שלך בעת
            חזרה לאתר.
          </p>

          <h3>6. יצירת קשר</h3>
          <p>
            בכל שאלה: <a href={`mailto:${BRAND.email}`} style={{ textDecoration: "underline" }}>{BRAND.email}</a>
            {" "}· {BRAND.phone}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
