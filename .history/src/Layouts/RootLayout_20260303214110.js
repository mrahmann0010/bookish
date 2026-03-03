import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

// ── Footer ───────────────────────────────────────────────────
export function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        background: "#1C1612",
        borderTop: "1px solid rgba(201,129,58,0.15)",
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          color: "rgba(245,240,232,0.35)",
          letterSpacing: "0.06em",
        }}
      >
        Bookish
        <span style={{ color: "#C9813A", margin: "0 10px" }}>·</span>
        Built with{" "}
        <a
          href="https://openlibrary.org"
          target="_blank"
          rel="noreferrer"
          style={{ color: "rgba(245,240,232,0.45)", textDecoration: "underline" }}
        >
          OpenLibrary
        </a>
        <span style={{ color: "#C9813A", margin: "0 10px" }}>·</span>
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}

// ── Root Layout (for Outlet-based routing) ────────────────────
export default function RootLayout() {
  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "100vh", background: "#F5F0E8" }}
    >
      <Navbar />
      <main className="flex-1" style={{ paddingTop: "64px" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}