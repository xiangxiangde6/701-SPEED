import Link from "next/link";
import { useUser } from "../contexts/UserContext";

export default function Home() {
  const { user } = useUser();

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "60px auto",
        padding: 32,
        border: "1px solid #e7eaf0",
        borderRadius: 16,
        background: "#f8fafc",
        boxShadow: "0 2px 24px #e5e9f5",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 18, color: "#2255bb" }}>SPEED System</h1>
      <p style={{ fontSize: 19, marginBottom: 40, color: "#333", lineHeight: 1.6 }}>
        Welcome to SPEED{user ? `! ${user.username}` : "!"} <br />
        Submit, search, and review research articles easily.<br />
        <span style={{ color: "#3367d6", fontWeight: 500 }}>
          Your research management starts here.
        </span>
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 24 }}>
        <Link href="/upload">
          <button
            style={{
              background: "#2263e5",
              color: "#fff",
              padding: "14px 36px",
              fontSize: 19,
              borderRadius: 8,
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 10px #e3e8fd",
            }}
          >
            Upload Article
          </button>
        </Link>
        <Link href="/search">
          <button
            style={{
              background: "#1ab39f",
              color: "#fff",
              padding: "14px 36px",
              fontSize: 19,
              borderRadius: 8,
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 10px #dbf4ee",
            }}
          >
            Search
          </button>
        </Link>
      </div>
      <div style={{ fontSize: 15, color: "#888" }}>
        <em>Built for ENSE701 Project – 2025</em>
      </div>
    </div>
  );
}