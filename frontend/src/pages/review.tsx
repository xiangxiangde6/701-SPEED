import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../contexts/UserContext";

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
  approved?: boolean;
};

export default function ReviewPage() {
  const { user } = useUser();
  const router = useRouter();

  // Only mentors can access this page
  useEffect(() => {
    if (!user || !user.mentor) {
      router.replace("/login");
    }
  }, [user]);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // get pending articles for review
  useEffect(() => {
    if (!user || !user.mentor) return;
    async function fetchArticles() {
      try {
        const res = await fetch("http://localhost:3001/articles/pending");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setArticles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [user]);

  // review article (approve or reject)
  const handleReview = async (id: string, approve: boolean) => {
    try {
      const res = await fetch(`http://localhost:3001/articles/review/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve }),
      });
      if (!res.ok) throw new Error("Review failed");
      setArticles(articles.filter(a => a._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 32,
        border: "1px solid #eee",
        borderRadius: 16,
        background: "#fafbfc",
        boxShadow: "0 2px 16px #eee",
      }}
    >
      <h2>Pending Articles for Review</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {(!loading && articles.length === 0) && <div>No pending articles.</div>}
      {articles.length > 0 && (
        <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: 8 }}>Title</th>
              <th style={{ padding: 8 }}>Authors</th>
              <th style={{ padding: 8 }}>Year</th>
              <th style={{ padding: 8 }}>Journal</th>
              <th style={{ padding: 8 }}>Action</th>
              <th style={{ padding: 8 }}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article._id}>
                <td style={{ padding: 8 }}>
                  <Link href={`/articles/${article._id}`} legacyBehavior>
                    <a style={{ color: "#2255bb", textDecoration: "underline" }}>{article.title}</a>
                  </Link>
                </td>
                <td style={{ padding: 8 }}>{article.authors}</td>
                <td style={{ padding: 8 }}>{article.year || "-"}</td>
                <td style={{ padding: 8 }}>{article.journal || "-"}</td>
                <td style={{ padding: 8 }}>
                  <button
                    style={{
                      background: "#24b04b",
                      color: "#fff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 5,
                      marginRight: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => handleReview(article._id, true)}
                  >
                    Approve
                  </button>
                  <button
                    style={{
                      background: "#de3245",
                      color: "#fff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                    onClick={() => handleReview(article._id, false)}
                  >
                    Reject
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <Link href={`/articles/${article._id}`}>
                    <button style={{ padding: "3px 10px", borderRadius: 5, background: "#eef", border: "1px solid #ccd", cursor: "pointer" }}>View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}