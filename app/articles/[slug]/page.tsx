import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { categoryLabel } from "@/components/ArticleCard";
import { ArticleGate } from "@/components/sharpen/ArticleGate";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SD_ACCESS_COOKIE } from "@/lib/sd";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .single();
  return {
    title: data ? `${data.title} | SharpenDaily` : "How-to | SharpenDaily",
    description: data?.excerpt ?? undefined,
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

  const paras = String(a.body || "").split(/\n{2,}/);
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
            <tr>{head.map((h, k) => <th key={k}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {bodyRows.map((r, k) => (
              <tr key={k}>{r.map((c, m) => <td key={m}>{c}</td>)}</tr>
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
    const m = text.match(/^([^:]{1,40}):\s+(.*)$/s);
    return m ? (
      <li key={key}><strong>{m[1]}:</strong> {m[2]}</li>
    ) : (
      <li key={key}>{text}</li>
    );
  };
  const renderPara = (para: string, i: number) => {
    if (isTableBlock(para)) return renderTable(para, i);
    if (para.startsWith("## ")) return <h2 key={i}>{para.slice(3)}</h2>;
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
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  };

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
            paras.map(renderPara)
          ) : (
            <>
              {paras.slice(0, 1).map(renderPara)}
              <ArticleGate sourceVideo={slug} />
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
