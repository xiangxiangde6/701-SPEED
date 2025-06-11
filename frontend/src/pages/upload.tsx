import { useState } from "react";
import { useUser } from "../contexts/UserContext";

function getYearOptions(start = 1950, end = new Date().getFullYear()) {
  const arr = [];
  for (let y = end; y >= start; y--) arr.push(y);
  return arr;
}

export default function UploadPage() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [journal, setJournal] = useState("");
  const [year, setYear] = useState("");
  const [volume, setVolume] = useState("");
  const [number, setNumber] = useState("");
  const [pages, setPages] = useState("");
  const [doi, setDoi] = useState("");
  const [bibtex, setBibtex] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const years = getYearOptions(1950, new Date().getFullYear());

  // Validate input fields
  const validate = () => {
    if (bibtex.trim() !== "") {
      return true;
    } else {
      if (!title.trim()) return false;
      if (!authors.trim()) return false;
      if (!journal.trim()) return false;
      if (!year.trim()) return false;
      return true;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validate input fields
    if (!validate()) {
      setError("Please fill all required fields or provide a valid BibTeX.");
      return;
    }

    // Reset previous results
    setLoading(true);

    // Prepare data for submission
    try {
      let bodyData: any;
      // If BibTeX is provided, use it directly
      if (bibtex.trim() !== "") {
        bodyData = { bibtex };
      } else {
        bodyData = {
          title,
          authors,
          journal,
          year,
        };
        if (volume.trim() !== "") bodyData.volume = volume;
        if (number.trim() !== "") bodyData.number = number;
        if (pages.trim() !== "") bodyData.pages = pages;
        if (doi.trim() !== "") bodyData.doi = doi;
      }

      // Include username if available
      if (user?.username) {
        bodyData.username = user.username;
      }

      // Send POST request to upload article
      const res = await fetch("http://localhost:3001/articles/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      });
      
      // Check for errors in response
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }

      const data = await res.json();
      setResult(`Upload successful, article title: ${data.title || "Unknown"}, ID: ${data._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 32,
        border: "1px solid #eee",
        borderRadius: 16,
        boxShadow: "0 2px 16px #eee",
        background: "#fafbfc"
      }}
    >
      <h2 style={{ marginBottom: 24, textAlign: "center"}}>Articles Upload </h2>
      <p style={{ marginBottom: 20, fontStyle: "italic", color: "#666" }}>
        You can fill all the fields below, or just paste a valid BibTeX entry in the last box to upload.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label>
            Title: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: "100%",
              fontSize: 16,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff"
            }}
            placeholder="Enter article title"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label>
            Authors: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={authors}
            onChange={e => setAuthors(e.target.value)}
            style={{
              width: "100%",
              fontSize: 16,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff"
            }}
            placeholder="Enter authors"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label>
            Journal: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={journal}
            onChange={e => setJournal(e.target.value)}
            style={{
              width: "100%",
              fontSize: 16,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff"
            }}
            placeholder="Enter journal"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label>
            Year of publication: <span style={{ color: "red" }}>*</span>
          </label>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            style={{
              width: "100%",
              fontSize: 16,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff"
            }}
          >
            <option value="">Select year</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label>Volume:</label>
          <input
            type="text"
            value={volume}
            onChange={e => setVolume(e.target.value)}
            style={{
              width: "100%",
              fontSize: 16,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff"
            }}
            placeholder="Enter volume"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label>Number:</label>
          <input
            type="text"
            value={number}
            onChange={e => setNumber(e.target.value)}
            style={{
              width: "100%",
              fontSize: 16,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff"
            }}
            placeholder="Enter number"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label>Pages:</label>
          <input
            type="text"
            value={pages}
            onChange={e => setPages(e.target.value)}
            style={{
              width: "100%",
              fontSize: 16,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff"
            }}
            placeholder="Enter pages"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label>DOI:</label>
          <input
            type="text"
            placeholder="e.g. 10.1234/example"
            value={doi}
            onChange={e => setDoi(e.target.value)}
            style={{
              width: "100%",
              fontSize: 16,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff"
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label>Paste raw BibTeX here (optional):</label>
          <textarea
            rows={5}
            style={{
              width: "100%",
              fontSize: 16,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff"
            }}
            placeholder="Paste BibTeX data..."
            value={bibtex}
            onChange={e => setBibtex(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: 17,
            background: "#2263e5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {result && <div style={{ color: "green", marginTop: 20, fontWeight: 500 }}>{result}</div>}
      {error && <div style={{ color: "red", marginTop: 20, fontWeight: 500 }}>{error}</div>}
    </div>
  );
}