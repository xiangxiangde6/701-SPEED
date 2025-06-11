import { useState } from "react";
import Link from "next/link";

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

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(
        `http://localhost:3001/articles/search?keyword=${encodeURIComponent(keyword)}`
      );
      if (!res.ok) {
        throw new Error("Search failed");
      }
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 32,
        border: "1px solid #eee",
        borderRadius: 16,
        boxShadow: "0 2px 16px #eee",
        background: "#fafbfc",
      }}
    >
      <h2>Article Search</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
          placeholder="Enter title, author, journal, or DOI"
          style={{
            width: "70%",
            fontSize: 16,
            padding: "10px 12px",
            border: "1px solid #ccc",
            borderRadius: 6,
            marginRight: 16,
            background: "#fff",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 24px",
            fontSize: 16,
            background: "#2263e5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && (
        <div style={{ color: "red", marginBottom: 20, fontWeight: 500 }}>{error}</div>
      )}
      {results.length > 0 && (
        <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Title</th>
              <th style={{ textAlign: "left", padding: 8 }}>Authors</th>
              <th style={{ textAlign: "left", padding: 8 }}>Journal</th>
              <th style={{ textAlign: "left", padding: 8 }}>Year</th>
              <th style={{ textAlign: "left", padding: 8 }}>DOI</th>
              <th style={{ textAlign: "left", padding: 8 }}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {results.map((article) => (
              <tr key={article._id}>
                <td style={{ padding: 8 }}>
                  <Link href={`/articles/${article._id}`} legacyBehavior>
                    <a style={{ color: "#2255bb", textDecoration: "underline" }}>{article.title}</a>
                  </Link>
                </td>
                <td style={{ padding: 8 }}>{article.authors}</td>
                <td style={{ padding: 8 }}>{article.journal || "-"}</td>
                <td style={{ padding: 8 }}>{article.year || "-"}</td>
                <td style={{ padding: 8 }}>{article.doi || "-"}</td>
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
      {results.length === 0 && !loading && <div>No results yet.</div>}
    </div>
  );
}