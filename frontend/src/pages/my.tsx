import { useUser } from "../contexts/UserContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

type Article = {
  _id: string;
  title: string;
  authors: string;
  journal?: string;
  year?: string;
  approved?: boolean;
  rejected?: boolean;
};

export default function MyArticlesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user]);

  useEffect(() => {
    if (!user) return;
    async function fetchArticles() {
      try {
        const res = await fetch(`http://localhost:3001/articles/my?username=${user!.username}`);
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

  return (
    <div style={{
      maxWidth: 800, margin: "40px auto", padding: 32,
      border: "1px solid #eee", borderRadius: 16, background: "#fafbfc", boxShadow: "0 2px 16px #eee"
    }}>
      <h2 style={{ marginBottom: 20 }}>My Uploads</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && articles.length === 0 && <div>You have not submitted any articles yet.</div>}
      {articles.length > 0 && (
        <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: 8 }}>Title</th>
              <th style={{ padding: 8 }}>Year</th>
              <th style={{ padding: 8 }}>Journal</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a._id}>
                <td style={{ padding: 8 }}>{a.title}</td>
                <td style={{ padding: 8 }}>{a.year || "-"}</td>
                <td style={{ padding: 8 }}>{a.journal || "-"}</td>
                <td style={{ padding: 8 }}>
                  {a.rejected
                    ? <span style={{ color: "red" }}>Rejected</span>
                    : a.approved
                    ? <span style={{ color: "green" }}>Approved</span>
                    : "Pending"}
                </td>
                <td style={{ padding: 8 }}>
                  <Link href={`/articles/${a._id}`}>
                    <button style={{
                      padding: "4px 12px", borderRadius: 5, background: "#eef",
                      border: "1px solid #ccd", cursor: "pointer"
                    }}>View</button>
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