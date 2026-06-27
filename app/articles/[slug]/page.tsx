import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { categoryLabel } from "@/components/ArticleCard";
import { ArticleGate } from "@/components/sharpen/ArticleGate";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SD, SD_ACCESS_COOKIE } from "@/lib/sd";

export const revalidate = 60;

// Inline markdown → React nodes: `code`, **bold**, [text](url). No HTML injection.
const INLINE_RE = /(`[^`]+`)|(**[^*]+**)|([^]]+]([^)]+))/g;
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      out.push(<code key={k++}>{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("**")) {
      out.push(<strong key={k++}>{tok.slice(2, -2)}</strong>);
    } else {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
      const ext = /^https?:\/\//.test(lm[2]);
      out.push(
        <a key={k++} href={lm[2]} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {lm[1]}
        </a>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Split the body into atomic blocks, keeping ```fenced code``` (which may contain
// blank lines) intact instead of letting the paragraph split shred it.
type Block = { type: "code" | "text"; content: string };
function tokenizeBlocks(body: string): Block[] {
  const out: Block[] = [];
  const lines = body.split("\n");
  let buf: string[] = [];
  const flush = () => {
    if (!buf.length) return;
    buf
      .join("\n")
      .split(/\n{2,}/)
      .forEach((p) => p.trim() && out.push({ type: "text", content: p }));
    buf = [];
  };
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith("```")) {
      flush();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++; // skip closing fence
      out.push({ type: "code", content: code.join("\n") });
    } else {
      buf.push(lines[i++]);
    }
  }
  flush();
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("title, excerpt, cover_image")
    .eq("slug", slug)
    .single();
  // Root layout's title template appends " | SharpenDaily" — return the bare title.
  const title = data?.title ?? "How-to";
  const description = data?.excerpt ?? undefined;
  const images = data?.cover_image ? [{ url: data.cover_image }] : undefined;
  return {
    title,
    description,
    openGraph: { type: "article", title, description, images, url: `${SD.url}/articles/${slug}` },
    twitter: { card: "summary_large_image", title, description, images: data?.cover_image ? [data.cover_image] : undefined },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getSessionUser();
  const supabase = await createClient();
  const { data: a } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!a || (a.status !== "published" && !user?.isAdmin)) notFound();

  const date = a.published_at
    ? new Date(a.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Gate: logged-in users + anyone who has submitted their email read in full.
  const c = await cookies();
  const unlocked = !!user || c.get(SD_ACCESS_COOKIE)?.value === "1";

  const blocks = tokenizeBlocks(String(a.body || ""));
  // A block is a table if every line is a | row. First row = header,
  // an optional |---|---| separator row is skipped.
  const isTableBlock = (block: string) => {
    const lines = block.split("\n").filter((l) => l.trim());
    return lines.length >= 2 && lines.every((l) => l.trim().startsWith("|"));
  };
  const splitRow = (row: string) =>
    row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  const renderTable = (block: string, i: number) => {
    const rows = block.split("\n").filter((l) => l.trim());
    const head = splitRow(rows[0]);
    const bodyRows = rows
      .slice(1)
      .filter((r) => !/^[\s|:-]+$/.test(r)) // drop a |---|---| separator row
      .map(splitRow);
    return (
      <div className="article-table-wrap" key={i}>
        <table className="article-table">
          <thead>
            <tr>{head.map((h, k) => <th key={k}>{inline(h)}</th>)}</tr>
          </thead>
          <tbody>
            {bodyRows.map((r, k) => (
              <tr key={k}>{r.map((c, m) => <td key={m}>{inline(c)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  const lines = (block: string) => block.split("\n").filter((l) => l.trim());
  const isBulletBlock = (b: string) => lines(b).every((l) => /^[-*]\s+/.test(l.trim()));
  const isNumberBlock = (b: string) => lines(b).every((l) => /^\d+[.)]\s+/.test(l.trim()));
  // bold the leading "Label:" in a list item so lists read as a scannable spec
  const renderItem = (text: string, key: number) => {
    const m = text.match(/^([^:]{1,40}):\s+(.*)$/);
    // only bold a real "Label:" — not a colon that belongs to inline markup / a URL
    return m && !/[[\]()`]/.test(m[1]) ? (
      <li key={key}><strong>{m[1]}:</strong> {inline(m[2])}</li>
    ) : (
      <li key={key}>{inline(text)}</li>
    );
  };
  const renderPara = (para: string, i: number) => {
    // [!BUTTON: text](url) — prominent in-body CTA button (e.g. giveaway download)
    const btnMatch = para.trim().match(/^\[!BUTTON:\s*([^\]]+)\]\(([^)]+)\)$/);
    if (btnMatch) {
      const ext = /^https?:\/\//.test(btnMatch[2]);
      return (
        <a key={i} href={btnMatch[2]} className="article-cta-btn"
           {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {btnMatch[1]}
        </a>
      );
    }
    if (isTableBlock(para)) return renderTable(para, i);
    // peel a leading "## heading" line even if body text is glued to it with
    // a single newline, so a whole section never renders as one big heading
    if (para.startsWith("## ")) {
      const nl = para.indexOf("\n");
      const heading = (nl === -1 ? para : para.slice(0, nl)).slice(3).trim();
      const rest = nl === -1 ? "" : para.slice(nl + 1).trim();
      return (
        <div key={i}>
          <h2>{heading}</h2>
          {rest && renderPara(rest, i * 1000 + 1)}
        </div>
      );
    }
    if (lines(para).length >= 2 && isBulletBlock(para))
      return (
        <ul className="article-list" key={i}>
          {lines(para).map((l, j) => renderItem(l.trim().replace(/^[-*]\s+/, ""), j))}
        </ul>
      );
    if (lines(para).length >= 2 && isNumberBlock(para))
      return (
        <ol className="article-list" key={i}>
          {lines(para).map((l, j) => renderItem(l.trim().replace(/^\d+[.)]\s+/, ""), j))}
        </ol>
      );
    return (
      <p key={i}>
        {para.split("\n").map((line, j, arr) => (
          <span key={j}>
            {inline(line)}
            {j < arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  };
  const renderBlock = (b: Block, i: number) =>
    b.type === "code" ? (
      <pre className="article-code" key={i}><code>{b.content}</code></pre>
    ) : (
      renderPara(b.content, i)
    );

  return (
    <>
      <SiteHeader user={user} />
      <main className="page article-detail">
        <Link href="/articles" className="acard-more" style={{ display: "inline-block", marginBottom: 20 }}>
          ← Back to how-tos
        </Link>
        <div className="cat">
          <span className="pill">{categoryLabel(a.category)}</span>
          {a.status !== "published" && (
            <span className="pill" style={{ marginInlineStart: 8 }}>Draft</span>
          )}
        </div>
        <h1>{a.title}</h1>
        <div className="meta">{date}</div>
        {a.video_url && (
          <a className="watch-btn" href={a.video_url} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch the video
          </a>
        )}
        {a.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="cover" src={a.cover_image} alt={a.title} />
        )}
        <div className="article-body">
          {unlocked ? (
            blocks.map(renderBlock)
          ) : (
            <>
              {blocks.slice(0, 1).map(renderBlock)}
              <ArticleGate sourceVideo={slug} />
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
