import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../contexts/UserContext";

const navs = [
    { label: "Home", path: "/" },
    { label: "Upload", path: "/upload" },
    { label: "Search", path: "/search" },
    { label: "Review", path: "/review", mentorOnly: true },
    { label: "My Uploads", path: "/my", mentorOnly: false },
];

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useUser();

  return (
    <nav style={{
      width:"100%",padding:"14px 0",background:"#f4f8ff",borderBottom:"1px solid #dde6f7",
      marginBottom:30,boxShadow:"0 2px 8px #f3f4fb",
    }}>
      <div style={{
        maxWidth: 900,margin:"0 auto",display:"flex",alignItems:"center",gap:28,fontSize:19,
      }}>
        <span style={{
          fontWeight: 700,color: "#2255bb",fontSize: 24,marginRight: 40,letterSpacing: 1
        }}>SPEED</span>
        {navs.map(nav =>
          (!nav.mentorOnly || (user && user.mentor)) && (
            <Link key={nav.path} href={nav.path} legacyBehavior>
              <a
                style={{
                  color: router.pathname === nav.path ? "#2255bb" : "#333",
                  textDecoration: router.pathname === nav.path ? "underline" : "none",
                  fontWeight: router.pathname === nav.path ? 600 : 400,
                  padding: "6px 12px",borderRadius: 6,
                  background: router.pathname === nav.path ? "#eaf1ff" : "transparent"
                }}
              >{nav.label}</a>
            </Link>
          )
        )}
        <div style={{ marginLeft: "auto" }}>
          {user ? (
            <span style={{ fontSize:16 }}>
              <b>{user.username}</b> ({user.mentor ? "Mentor" : "User"})
              <button style={{marginLeft:16,padding:"4px 10px",borderRadius:5}}
                onClick={logout}>Logout</button>
            </span>
          ) : (
            <>
              <Link href="/login" legacyBehavior><a style={{marginRight:14}}>Login</a></Link>
              <Link href="/register" legacyBehavior><a>Register</a></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}