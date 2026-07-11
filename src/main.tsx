import { StrictMode, useState, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const AdminDashboard = lazy(() => import("./AdminDashboard"));

// ── Scroll Progress Bar Component ────────────────────────────────────────────
function ScrollProgress() {
  const [width, setWidth] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(total > 0 ? (window.scrollY / total) * 100 : 0);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${width / 100})` }} />
      <button
        className={`back-to-top ${showTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}

// ── Router ───────────────────────────────────────────────────────────────────

function Router() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route === "#admin" || route === "#/admin") {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#11120f]">
            <div className="text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-2 border-[#c9ff3d] border-t-transparent" />
              <p className="mt-4 text-sm text-white/50">Loading dashboard...</p>
            </div>
          </div>
        }
      >
        <AdminDashboard />
      </Suspense>
    );
  }

  return (
    <>
      <ScrollProgress />
      <App />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
