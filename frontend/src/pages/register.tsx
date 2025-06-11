import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Register failed");
      setMessage("Register successful! You can now login.");
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 420, margin: "40px auto", padding: 32,
      border: "1px solid #eee", borderRadius: 16, background: "#f9fafc", boxShadow: "0 2px 16px #eee"
    }}>
      <h2 style={{ marginBottom: 30 }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>Username:</label>
          <input
            type="text" value={username} onChange={e => setUsername(e.target.value)} required
            style={{
              width: "100%", padding: "11px 14px", fontSize: 16,
              border: "1.5px solid #b2bac5", borderRadius: 7, background: "#fff",
              outline: "none", transition: "border 0.2s"
            }}
            placeholder="Enter username"
            onFocus={e => (e.target.style.border = "1.5px solid #2255bb")}
            onBlur={e => (e.target.style.border = "1.5px solid #b2bac5")}
          />
        </div>
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>Password:</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{
              width: "100%", padding: "11px 14px", fontSize: 16,
              border: "1.5px solid #b2bac5", borderRadius: 7, background: "#fff",
              outline: "none", transition: "border 0.2s"
            }}
            placeholder="Enter password"
            onFocus={e => (e.target.style.border = "1.5px solid #2255bb")}
            onBlur={e => (e.target.style.border = "1.5px solid #b2bac5")}
          />
        </div>
        <button
          type="submit" disabled={loading}
          style={{
            width: "100%", padding: "12px 0", fontSize: 18,
            background: "#2255bb", color: "#fff", border: "none",
            borderRadius: 8, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: 1, boxShadow: "0 2px 8px #e7eaf1"
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {message &&
          <div style={{
            marginTop: 18, color: message.includes("success") ? "green" : "red",
            fontWeight: 500, textAlign: "center"
          }}>
            {message}
          </div>
        }
      </form>
    </div>
  );
}