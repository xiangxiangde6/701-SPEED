import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Article = {
  _id: string;
  title: string;
  authors: string;
  journal?: string;
  year?: string;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
  bibtex?: string;
  approved?: boolean;
};

export default function ArticleDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchArticle() {
      try {
        const res = await fetch(`http://localhost:3001/articles/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setArticle(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 32,
        border: "1px solid #eee",
        borderRadius: 16,
        background: "#fafbfc",
        boxShadow: "0 2px 16px #eee",
      }}
    >
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {article && (
        <>
          <h2 style={{ marginBottom: 18 }}>Article Details</h2>
          <div style={{ marginBottom: 8 }}>
            <strong>Title:</strong> {article.title}
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>Authors:</strong> {article.authors}
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>Journal:</strong> {article.journal || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>Year:</strong> {article.year || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>Volume:</strong> {article.volume || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>Number:</strong> {article.number || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>Pages:</strong> {article.pages || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>DOI:</strong> {article.doi || "-"}
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>Approved:</strong> {article.approved ? "Yes" : "No"}
          </div>
          {article.bibtex && (
            <div style={{ marginTop: 20 }}>
              <strong>BibTeX:</strong>
              <pre
                style={{
                  background: "#eee",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 6,
                  fontSize: 14,
                  overflowX: "auto",
                }}
              >
                {article.bibtex}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}