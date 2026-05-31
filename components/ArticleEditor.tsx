import { ARTICLE_CATEGORIES } from "@/lib/constants";
import { createArticleAction, updateArticleAction } from "@/app/admin/actions";

type Article = {
  id: string;
  title: string;
  category: string;
  excerpt: string | null;
  body: string | null;
  status: string;
  cover_image: string | null;
};

export function ArticleEditor({ article }: { article?: Article }) {
  const isEdit = !!article;
  return (
    <form
      action={isEdit ? updateArticleAction : createArticleAction}
      className="lform"
      encType="multipart/form-data"
    >
      {isEdit && <input type="hidden" name="id" value={article!.id} />}

      <div className="lfg">
        <label htmlFor="title">כותרת *</label>
        <input id="title" name="title" defaultValue={article?.title} required />
      </div>

      <div className="lfg">
        <label htmlFor="category">קטגוריה</label>
        <select id="category" name="category" defaultValue={article?.category ?? "ai_tech"}>
          {ARTICLE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="lfg">
        <label htmlFor="excerpt">תקציר (יוצג בכרטיס)</label>
        <input id="excerpt" name="excerpt" defaultValue={article?.excerpt ?? ""} />
      </div>

      <div className="lfg">
        <label htmlFor="body">תוכן המאמר</label>
        <textarea
          id="body"
          name="body"
          defaultValue={article?.body ?? ""}
          rows={16}
          placeholder={"כתוב כאן את המאמר.\n\nשורה ריקה = פסקה חדשה.\nשורה שמתחילה ב-## תהפוך לכותרת משנה."}
        />
        <span className="form-note">טיפ: שורה ריקה פותחת פסקה. שורה עם &quot;## &quot; הופכת לכותרת.</span>
      </div>

      <div className="lfg">
        <label htmlFor="cover">תמונת כותרת {isEdit && "(השאר ריק כדי לא לשנות)"}</label>
        <input id="cover" name="cover" type="file" accept="image/*" />
        {article?.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.cover_image} alt="" style={{ marginTop: 8, maxWidth: 220, borderRadius: 8 }} />
        )}
      </div>

      <div className="lfg">
        <label htmlFor="status">סטטוס</label>
        <select id="status" name="status" defaultValue={article?.status ?? "draft"}>
          <option value="draft">טיוטה</option>
          <option value="published">מפורסם</option>
        </select>
      </div>

      <button className="btn-blk" type="submit">
        {isEdit ? "שמירת שינויים" : "יצירת מאמר"}
      </button>
    </form>
  );
}
