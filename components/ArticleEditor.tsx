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
  video_url: string | null;
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
        <label htmlFor="title">Title *</label>
        <input id="title" name="title" defaultValue={article?.title} required />
      </div>

      <div className="lfg">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" defaultValue={article?.category ?? "ai_tech"}>
          {ARTICLE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="lfg">
        <label htmlFor="excerpt">Excerpt (shown on the card)</label>
        <input id="excerpt" name="excerpt" defaultValue={article?.excerpt ?? ""} />
      </div>

      <div className="lfg">
        <label htmlFor="body">Article body</label>
        <textarea
          id="body"
          name="body"
          defaultValue={article?.body ?? ""}
          rows={16}
          placeholder={"Write the article here.\n\nA blank line = a new paragraph.\nA line starting with ## becomes a subheading."}
        />
        <span className="form-note">Tip: a blank line starts a paragraph. A line with &quot;## &quot; becomes a heading.</span>
      </div>

      <div className="lfg">
        <label htmlFor="video_url">Video URL (YouTube/Reel — shows a ▶ badge + Watch button)</label>
        <input id="video_url" name="video_url" type="url" defaultValue={article?.video_url ?? ""} placeholder="https://youtube.com/shorts/..." />
      </div>

      <div className="lfg">
        <label htmlFor="cover">Cover image {isEdit && "(leave empty to keep current)"}</label>
        <input id="cover" name="cover" type="file" accept="image/*" />
        {article?.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.cover_image} alt="" style={{ marginTop: 8, maxWidth: 220, borderRadius: 8 }} />
        )}
      </div>

      <div className="lfg">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={article?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button className="btn-blk" type="submit">
        {isEdit ? "Save changes" : "Create article"}
      </button>
    </form>
  );
}
