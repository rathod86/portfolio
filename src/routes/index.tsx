import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  loadPortfolioData,
  savePortfolioData,
  uid,
  type PortfolioData,
  type Project,
  type SkillCategory,
  type EducationEntry,
  type ProfileData,
} from "../lib/portfolio-store";
import {
  isAdminLoggedIn,
  isPasswordSetUp,
  loginAdmin,
  logoutAdmin,
  verifyPassword,
  setAdminPassword,
  validatePassword,
  isPasswordValid,
} from "../lib/auth-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abhishek Rathod — Full Stack Developer" },
      {
        name: "description",
        content:
          "Portfolio of Abhishek Rathod, a Full Stack Developer specialising in Java, React, Node.js and MySQL.",
      },
      { property: "og:title", content: "Abhishek Rathod — Full Stack Developer" },
      {
        property: "og:description",
        content: "Portfolio of Abhishek Rathod, Full Stack Developer.",
      },
    ],
  }),
  component: Portfolio,
});

/* ─── data hook ─────────────────────────────────────────────────────────── */
function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(() => loadPortfolioData());
  const update = (next: PortfolioData) => {
    savePortfolioData(next); 
    setData(next);
  };
  useEffect(() => {
    const cb = () => setData(loadPortfolioData());
    window.addEventListener("portfolio-updated", cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener("portfolio-updated", cb);
      window.removeEventListener("storage", cb);
    };
  }, []);
  return { data, update };
}

/* ─── typing hook ───────────────────────────────────────────────────────── */
function useTyping(words: string[], speed = 110, pause = 1400) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (!words.length) return;
    const w = words[i % words.length];
    const t = setTimeout(
      () => {
        if (!del) {
          const n = w.slice(0, text.length + 1);
          setText(n);
          if (n === w) setTimeout(() => setDel(true), pause);
        } else {
          const n = w.slice(0, text.length - 1);
          setText(n);
          if (n === "") {
            setDel(false);
            setI((v) => v + 1);
          }
        }
      },
      del ? speed / 2 : speed,
    );
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);
  return text;
}

/* ─── reveal hook ───────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ─── small UI helpers ───────────────────────────────────────────────────── */
const EditBtn = ({ onClick, children }: { onClick: () => void; children?: React.ReactNode }) => (
  <button
    onClick={onClick}
    style={{
      background: "rgba(99,102,241,0.15)",
      border: "1px solid rgba(99,102,241,0.4)",
      color: "#a5b4fc",
      borderRadius: "8px",
      padding: "4px 10px",
      fontSize: "12px",
      cursor: "pointer",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      whiteSpace: "nowrap",
    }}
  >
    {children ?? "✏️ Edit"}
  </button>
);
const DelBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      background: "rgba(239,68,68,0.12)",
      border: "1px solid rgba(239,68,68,0.3)",
      color: "#f87171",
      borderRadius: "8px",
      padding: "4px 10px",
      fontSize: "12px",
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    🗑️
  </button>
);
const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    style={{
      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      border: "none",
      color: "#fff",
      borderRadius: "10px",
      padding: "8px 18px",
      fontSize: "13px",
      cursor: "pointer",
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    }}
  >
    + {label}
  </button>
);

/* ─── modal ──────────────────────────────────────────────────────────────── */
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1a1a2e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "28px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "18px", color: "#e2e8f0" }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "22px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "#e2e8f0",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};
const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#94a3b8",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};
const fg: React.CSSProperties = { marginBottom: "14px" };

/* ─── TOAST ──────────────────────────────────────────────────────────────── */
function Toast({ msg }: { msg: string }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(34,197,94,0.9)",
        color: "#fff",
        padding: "10px 24px",
        borderRadius: "12px",
        fontWeight: 600,
        fontSize: "14px",
        zIndex: 10000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        pointerEvents: "none",
      }}
    >
      ✅ {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PORTFOLIO
═══════════════════════════════════════════════════════════════════════════ */
function Portfolio() {
  useReveal();
  const { data, update } = usePortfolioData();
  const typed = useTyping(data.profile.typingWords ?? ["Developer"]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const t = localStorage.getItem("theme") || "dark";
    setTheme(t);
  }, []);

  useEffect(() => {
    if (theme === "light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // Check admin session on mount
  useEffect(() => {
    if (isAdminLoggedIn()) setAdminAuthed(true);
  }, []);

  const handleAdminLogout = useCallback(() => {
    logoutAdmin();
    setAdminAuthed(false);
    setEditMode(false);
    showToast("Logged out");
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ── Splash Screen ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "var(--color-background)", display: "flex", alignItems: "center", justifyContent: "center", animation: "splash-fade 2.5s ease forwards" }}>
        <h1 className="typing-text" style={{ }}>
          Welcome to <span className="text-gradient"> MY Portfolio.</span>
        </h1>
      </div>

      {/* ── Navbar ── */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <nav
            className={`glass flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-300 ${scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.15)]" : ""}`}
          >
            <a href="#about" className="flex shrink-0 items-center gap-2 group transition-all duration-300">
              {adminAuthed ? (
                <span className="animate-shimmer grid h-9 w-auto px-4 place-items-center rounded-xl font-display text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.6)]" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)", backgroundSize: "200% auto" }}>
                  👑 Admin Mode
                </span>
              ) : (
                <>
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent font-display text-base font-bold text-primary-foreground shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform duration-300">
                    {data.profile.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </span>
                  <span className="font-display text-sm font-semibold tracking-wide">{data.profile.name.split(" ")[0]}<span className="text-gradient">.</span></span>
                </>
              )}
            </a>
            <ul className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground font-medium hover:-translate-y-0.5 inline-block"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="grid h-9 w-9 place-items-center rounded-full glass transition-all hover:scale-105 hover:bg-white/10" title="Toggle Theme" style={{ border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontSize: "14px", padding: 0 }}>
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* Admin Auth Buttons */}
              {adminAuthed ? (
                <>
                  <button
                    onClick={() => setEditMode((v) => !v)}
                    style={{
                      background: editMode
                        ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                        : "rgba(255,255,255,0.05)",
                      border: editMode ? "none" : "1px solid rgba(255,255,255,0.12)",
                      color: editMode ? "#fff" : "#94a3b8",
                      borderRadius: "10px",
                      padding: "7px 14px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      boxShadow: editMode ? "0 4px 15px rgba(99,102,241,0.4)" : "none",
                      transition: "all 0.3s",
                    }}
                    title="Toggle Edit Mode"
                  >
                    {editMode ? "✅ Editing" : "✏️ Edit"}
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      color: "#f87171",
                      borderRadius: "10px",
                      padding: "7px 14px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "all 0.2s",
                    }}
                    title="Logout"
                  >
                    🔓 Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#94a3b8",
                    borderRadius: "10px",
                    padding: "7px 14px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "all 0.2s",
                  }}
                  title="Admin Login"
                >
                  🔒 Admin
                </button>
              )}
              {data.profile.resumeUrl && data.profile.resumeUrl !== "#" && (
                <a
                  href={data.profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary hidden text-sm sm:inline-flex"
                >
                  Download Resume
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                </a>
              )}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 md:hidden"
              >
                <span className="relative block h-3 w-4">
                  <span
                    className={`absolute inset-x-0 top-0 h-0.5 bg-foreground transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
                  />
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 bg-foreground transition-transform ${menuOpen ? "-translate-y-1 -rotate-45" : ""}`}
                  />
                </span>
              </button>
            </div>
          </nav>
          {menuOpen && (
            <div className="glass mt-2 rounded-2xl p-3 md:hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
              <ul className="flex flex-col">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* ── Login Modal ── */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            setAdminAuthed(true);
            setEditMode(true);
            showToast("Login successful!");
          }}
        />
      )}

      {/* ── Edit Mode Banner ── */}
      {editMode && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
            color: "#fff",
            textAlign: "center",
            padding: "6px",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 2px 10px rgba(99,102,241,0.5)",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          ✏️ EDIT MODE — Click any ✏️ Edit or ➕ Add button to update your portfolio instantly
        </div>
      )}

      <main
        className="mx-auto w-full max-w-6xl px-5 pt-28 sm:px-8"
        style={{ paddingTop: editMode ? "88px" : undefined }}
      >
        <HeroSection
          data={data}
          update={update}
          editMode={editMode}
          typed={typed}
          showToast={showToast}
        />
        <SkillsSection data={data} update={update} editMode={editMode} showToast={showToast} />
        <ProjectsSection data={data} update={update} editMode={editMode} showToast={showToast} />
        <EducationSection data={data} update={update} editMode={editMode} showToast={showToast} />
        <CTASection data={data} />
        <ContactSection data={data} update={update} editMode={editMode} showToast={showToast} />
      </main>

      <footer className="mt-20 border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground sm:flex-row sm:px-8">
          <div>
            © {new Date().getFullYear()} {data.profile.name}. Crafted with care.
          </div>
          <div className="flex items-center gap-4">
            <a
              href={data.profile.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href={data.profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${data.profile.email}`}
              className="hover:text-foreground transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </footer>

      {toast && <Toast msg={toast} />}
    </div>
  );
}

/* ─── Login Modal Component ─────────────────────────────────────────────── */
function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [needsSetup] = useState(!isPasswordSetUp());

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (needsSetup) {
      if (!isPasswordValid(pwd)) {
        setErr("Password must be >6 chars, with a number, letter & special char");
        setLoading(false);
        return;
      }
      await setAdminPassword(pwd);
      loginAdmin();
      onSuccess();
    } else {
      const ok = await verifyPassword(pwd);
      setLoading(false);
      if (ok) {
        loginAdmin();
        onSuccess();
      } else {
        setErr("Incorrect password");
      }
    }
  }

  return (
    <Modal title={needsSetup ? "Set Admin Password" : "Admin Login"} onClose={onClose}>
      <form onSubmit={handleLogin}>
        <div style={fg}>
          <label style={lbl}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setErr("");
              }}
              style={{
                ...inp,
                borderColor: err ? "rgba(239,68,68,0.5)" : undefined,
                paddingRight: "40px",
              }}
              placeholder={needsSetup ? "Create a strong password" : "Enter your password"}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {showPwd ? "🙈" : "👁️"}
            </button>
          </div>
          {err && <div style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>{err}</div>}
          {needsSetup && (
            <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "6px" }}>
              Req: &gt;6 chars, 1 number, 1 letter, 1 special char (!@#$)
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "14px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Verifying..." : needsSetup ? "Set Password & Login" : "Login"}
        </button>
      </form>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════ */
function HeroSection({
  data,
  update,
  editMode,
  typed,
  showToast,
}: {
  data: PortfolioData;
  update: (d: PortfolioData) => void;
  editMode: boolean;
  typed: string;
  showToast: (m: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const p = data.profile;
  const nameParts = p.name.split(" ");
  const [form, setForm] = useState({ ...p, typingWordsStr: p.typingWords.join(", ") });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function save() {
    const updated = {
      ...form,
      typingWords: form.typingWordsStr
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean),
    };
    const { typingWordsStr: _, ...profileData } = updated;
    update({ ...data, profile: { ...profileData, typingWords: updated.typingWords } });
    showToast("Profile updated!");
    setOpen(false);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG to ensure small size for localStorage
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setForm((f) => ({ ...f, profileImageUrl: dataUrl }));
        };
        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <section
      id="about"
      className="relative grid items-center gap-12 py-12 sm:py-20 md:grid-cols-[1.2fr_1fr]"
    >
      <div className="reveal">
        {p.availableForWork && (
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground shadow-[0_0_10px_rgba(34,197,94,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Open for opportunities
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px" }}>
          <h1
            className="text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl"
            style={{ margin: 0 }}
          >
            Hi, I'm <span className="text-gradient drop-shadow-md">{nameParts[0]}</span>
            <br />
            <span className="text-muted-foreground drop-shadow-md">
              {nameParts.slice(1).join(" ")}.
            </span>
          </h1>
          {editMode && (
            <EditBtn
              onClick={() => {
                setForm({ ...p, typingWordsStr: p.typingWords.join(", ") });
                setOpen(true);
              }}
            >
              ✏️ Edit Profile
            </EditBtn>
          )}
        </div>
        <p className="mt-5 text-xl text-muted-foreground sm:text-2xl font-light">
          I build as a <span className="text-gradient font-semibold tracking-wide">{typed}</span>
          <span className="caret ml-0.5 inline-block h-6 w-[2px] translate-y-1 bg-primary sm:h-7 shadow-[0_0_8px_var(--color-primary)]" />
        </p>
        <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed">{p.bio1}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="btn-primary text-sm shadow-[0_4px_15px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(99,102,241,0.6)]"
          >
            View My Work
          </a>
          <a href="#contact" className="btn-ghost text-sm transition-all hover:bg-white/10">
            Get in Touch
          </a>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <a
            href={p.linkedin}
            target="_blank"
            rel="noreferrer"
            className="glass grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-all hover:-translate-y-1 hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V21h-4v-5.3c0-1.27-.03-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21h-4V9Z" />
            </svg>
          </a>
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="glass grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-all hover:-translate-y-1 hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.19 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.89.12 3.19.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
            </svg>
          </a>
          <a
            href={`mailto:${p.email}`}
            className="glass grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-all hover:-translate-y-1 hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
        </div>
      </div>
      <div className="reveal relative mx-auto aspect-square w-full max-w-sm group">
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-primary/20 blur-[60px] opacity-70 transition-opacity duration-700 group-hover:opacity-100 group-hover:blur-[80px]" />
        <div className="float-y glow-ring relative h-full w-full overflow-hidden rounded-full border-[2px] border-primary/20 p-1.5 bg-background/50 backdrop-blur-sm transition-all duration-500 group-hover:border-primary/40">
          <img
            src={p.profileImageUrl}
            alt={p.name}
            className="h-full w-full rounded-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="glass absolute -bottom-4 -left-4 rounded-2xl px-5 py-3.5 text-xs shadow-xl transition-transform duration-500 hover:scale-105 hover:-translate-y-1">
          <div className="text-muted-foreground font-medium mb-0.5 uppercase tracking-wider text-[10px]">
            Based in
          </div>
          <div className="font-bold tracking-wide">{p.location}</div>
        </div>
        <div className="glass absolute -right-4 top-6 rounded-2xl px-5 py-3.5 text-xs shadow-xl transition-transform duration-500 hover:scale-105 hover:-translate-y-1">
          <div className="text-muted-foreground font-medium mb-0.5 uppercase tracking-wider text-[10px]">
            Domain
          </div>
          <div className="font-bold tracking-wide">{p.domain}</div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {open && (
        <Modal title="✏️ Edit Profile" onClose={() => setOpen(false)}>
          <div style={fg}>
            <label style={lbl}>Full Name</label>
            <input
              style={inp}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={fg}>
              <label style={lbl}>Location</label>
              <input
                style={inp}
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div style={fg}>
              <label style={lbl}>Domain</label>
              <input
                style={inp}
                value={form.domain}
                onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
              />
            </div>
          </div>
          <div style={fg}>
            <label style={lbl}>Short Bio</label>
            <textarea
              style={{ ...inp, minHeight: "80px", resize: "vertical" }}
              value={form.bio1}
              onChange={(e) => setForm((f) => ({ ...f, bio1: e.target.value }))}
            />
          </div>
          <div style={fg}>
            <label style={lbl}>Email</label>
            <input
              style={inp}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={fg}>
              <label style={lbl}>GitHub URL</label>
              <input
                style={inp}
                value={form.github}
                onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
              />
            </div>
            <div style={fg}>
              <label style={lbl}>LinkedIn URL</label>
              <input
                style={inp}
                value={form.linkedin}
                onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
              />
            </div>
          </div>
          <div style={fg}>
            <label style={lbl}>Resume URL</label>
            <input
              style={inp}
              value={form.resumeUrl}
              onChange={(e) => setForm((f) => ({ ...f, resumeUrl: e.target.value }))}
            />
          </div>

          {/* Image Upload section */}
          <div style={fg}>
            <label style={lbl}>Profile Photo</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              {form.profileImageUrl && (
                <img
                  src={form.profileImageUrl}
                  alt="Preview"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
              )}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                <input
                  style={{ ...inp, padding: "8px 12px", fontSize: "13px" }}
                  value={form.profileImageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, profileImageUrl: e.target.value }))}
                  placeholder="https://... OR upload below"
                />
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px dashed rgba(255,255,255,0.2)",
                      color: "#e2e8f0",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                    }
                  >
                    📁 Upload Image File
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={fg}>
            <label style={lbl}>Typing Words (comma separated)</label>
            <input
              style={inp}
              value={form.typingWordsStr}
              onChange={(e) => setForm((f) => ({ ...f, typingWordsStr: e.target.value }))}
              placeholder="Developer, Designer, Problem Solver"
            />
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button
              onClick={save}
              style={{
                flex: 1,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              💾 Save Profile
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKILLS  — inline add/remove/edit
═══════════════════════════════════════════════════════════════════════════ */
function SkillsSection({
  data,
  update,
  editMode,
  showToast,
}: {
  data: PortfolioData;
  update: (d: PortfolioData) => void;
  editMode: boolean;
  showToast: (m: string) => void;
}) {
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({});
  const [editCat, setEditCat] = useState<SkillCategory | null>(null);

  function saveSkills(skills: SkillCategory[]) {
    update({ ...data, skills });
  }

  function addCategory() {
    if (!newCat.trim()) return;
    saveSkills([...data.skills, { id: uid(), category: newCat.trim(), items: [] }]);
    setNewCat("");
    setAddCatOpen(false);
    showToast("Skill category added!");
  }
  function deleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    saveSkills(data.skills.filter((s) => s.id !== id));
    showToast("Category removed!");
  }
  function addSkill(id: string) {
    const val = skillInputs[id]?.trim();
    if (!val) return;
    saveSkills(data.skills.map((s) => (s.id === id ? { ...s, items: [...s.items, val] } : s)));
    setSkillInputs((prev) => ({ ...prev, [id]: "" }));
    showToast(`"${val}" added!`);
  }
  function removeSkill(id: string, item: string) {
    saveSkills(
      data.skills.map((s) =>
        s.id === id ? { ...s, items: s.items.filter((i) => i !== item) } : s,
      ),
    );
    showToast(`"${item}" removed!`);
  }
  function saveCatName() {
    if (!editCat) return;
    saveSkills(
      data.skills.map((s) => (s.id === editCat.id ? { ...s, category: editCat.category } : s)),
    );
    setEditCat(null);
    showToast("Category renamed!");
  }

  return (
    <section id="skills" className="py-20">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Skills
          </div>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl md:text-5xl">Tools I work with</h2>
          <p className="mt-3 text-muted-foreground">A growing toolkit across the full stack.</p>
        </div>
        {editMode && <AddBtn onClick={() => setAddCatOpen(true)} label="Add Skill Category" />}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.skills.map((sk) => (
          <div
            key={sk.id}
            className="reveal glass group rounded-3xl p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
            style={{ position: "relative" }}
          >
            {/* Category header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 text-primary">
                <span className="text-sm font-bold">{sk.category[0]}</span>
              </div>
              <h3 className="text-lg font-semibold flex-1">{sk.category}</h3>
              {editMode && (
                <div style={{ display: "flex", gap: "6px" }}>
                  <EditBtn onClick={() => setEditCat({ ...sk })}>✏️</EditBtn>
                  <DelBtn onClick={() => deleteCategory(sk.id)} />
                </div>
              )}
            </div>

            {/* Skill chips */}
            <ul className="flex flex-wrap gap-2">
              {sk.items.map((item) => (
                <li
                  key={item}
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-muted-foreground"
                >
                  {item}
                  {editMode && (
                    <button
                      onClick={() => removeSkill(sk.id, item)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#f87171",
                        cursor: "pointer",
                        fontSize: "14px",
                        lineHeight: 1,
                        paddingLeft: "2px",
                      }}
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* Add skill inline */}
            {editMode && (
              <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
                <input
                  style={{ ...inp, flex: 1, padding: "7px 12px", fontSize: "13px" }}
                  value={skillInputs[sk.id] ?? ""}
                  onChange={(e) => setSkillInputs((prev) => ({ ...prev, [sk.id]: e.target.value }))}
                  placeholder="Add skill…"
                  onKeyDown={(e) => e.key === "Enter" && addSkill(sk.id)}
                />
                <button
                  onClick={() => addSkill(sk.id)}
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    border: "none",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "7px 12px",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Empty state when no skills */}
        {data.skills.length === 0 && editMode && (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              color: "#64748b",
              padding: "40px",
              border: "2px dashed rgba(99,102,241,0.3)",
              borderRadius: "20px",
            }}
          >
            No skill categories yet. Click "+ Add Skill Category" above to get started!
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {addCatOpen && (
        <Modal title="➕ Add Skill Category" onClose={() => setAddCatOpen(false)}>
          <div style={fg}>
            <label style={lbl}>Category Name</label>
            <input
              style={inp}
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="e.g. DevOps, Mobile, Cloud"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
          </div>
          <button
            onClick={addCategory}
            style={{
              width: "100%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Add Category
          </button>
        </Modal>
      )}

      {/* Edit Category Name Modal */}
      {editCat && (
        <Modal title="✏️ Rename Category" onClose={() => setEditCat(null)}>
          <div style={fg}>
            <label style={lbl}>Category Name</label>
            <input
              style={inp}
              value={editCat.category}
              onChange={(e) => setEditCat({ ...editCat, category: e.target.value })}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveCatName()}
            />
          </div>
          <button
            onClick={saveCatName}
            style={{
              width: "100%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Save
          </button>
        </Modal>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECTS  — inline add/remove/edit
═══════════════════════════════════════════════════════════════════════════ */
const emptyProject = (): Project => ({
  id: uid(),
  title: "",
  status: "In Progress",
  category: "Full Stack",
  tags: [],
  description: "",
  stack: [],
  demo: "",
  github: "",
});

function ProjectForm({
  initial,
  onSave,
  onClose,
}: {
  initial: Project;
  onSave: (p: Project) => void;
  onClose: () => void;
}) {
  const [p, setP] = useState({
    ...initial,
    tagsStr: initial.tags.join(", "),
    stackStr: initial.stack.join(", "),
  });
  function save() {
    const { tagsStr, stackStr, ...rest } = p;
    onSave({
      ...rest,
      tags: tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      stack: stackStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }
  return (
    <>
      <div style={fg}>
        <label style={lbl}>Project Title *</label>
        <input
          style={inp}
          value={p.title}
          onChange={(e) => setP((f) => ({ ...f, title: e.target.value }))}
          placeholder="My Awesome Project"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={fg}>
          <label style={lbl}>Status</label>
          <select
            style={inp}
            value={p.status}
            onChange={(e) => setP((f) => ({ ...f, status: e.target.value }))}
          >
            <option>Completed</option>
            <option>In Progress</option>
            <option>Open Source</option>
            <option>Archived</option>
          </select>
        </div>
        <div style={fg}>
          <label style={lbl}>Category</label>
          <input
            style={inp}
            value={p.category}
            onChange={(e) => setP((f) => ({ ...f, category: e.target.value }))}
          />
        </div>
      </div>
      <div style={fg}>
        <label style={lbl}>Description *</label>
        <textarea
          style={{ ...inp, minHeight: "80px", resize: "vertical" }}
          value={p.description}
          onChange={(e) => setP((f) => ({ ...f, description: e.target.value }))}
        />
      </div>
      <div style={fg}>
        <label style={lbl}>Tech Stack (comma separated)</label>
        <input
          style={inp}
          value={p.stackStr}
          onChange={(e) => setP((f) => ({ ...f, stackStr: e.target.value }))}
          placeholder="React.js, Node.js, MySQL"
        />
      </div>
      <div style={fg}>
        <label style={lbl}>Tags for Filter (comma separated)</label>
        <input
          style={inp}
          value={p.tagsStr}
          onChange={(e) => setP((f) => ({ ...f, tagsStr: e.target.value }))}
          placeholder="Full Stack, AI, Mobile"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={fg}>
          <label style={lbl}>GitHub URL</label>
          <input
            style={inp}
            value={p.github ?? ""}
            onChange={(e) => setP((f) => ({ ...f, github: e.target.value }))}
          />
        </div>
        <div style={fg}>
          <label style={lbl}>Live Demo URL</label>
          <input
            style={inp}
            value={p.demo ?? ""}
            onChange={(e) => setP((f) => ({ ...f, demo: e.target.value }))}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={save}
          style={{
            flex: 1,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          💾 Save Project
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

function ProjectsSection({
  data,
  update,
  editMode,
  showToast,
}: {
  data: PortfolioData;
  update: (d: PortfolioData) => void;
  editMode: boolean;
  showToast: (m: string) => void;
}) {
  const cats = useMemo(
    () => ["All", ...Array.from(new Set(data.projects.flatMap((p) => p.tags)))],
    [data.projects],
  );
  const [filter, setFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [editProj, setEditProj] = useState<Project | null>(null);
  const list =
    filter === "All" ? data.projects : data.projects.filter((p) => p.tags.includes(filter));

  function saveProjects(projects: Project[]) {
    update({ ...data, projects });
  }

  function handleAdd(p: Project) {
    saveProjects([...data.projects, p]);
    setAddOpen(false);
    showToast("Project added!");
  }
  function handleEdit(p: Project) {
    saveProjects(data.projects.map((x) => (x.id === p.id ? p : x)));
    setEditProj(null);
    showToast("Project updated!");
  }
  function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    saveProjects(data.projects.filter((p) => p.id !== id));
    showToast("Project deleted!");
  }

  return (
    <section id="projects" className="py-20">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Projects
          </div>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl md:text-5xl">Selected work</h2>
          <p className="mt-3 text-muted-foreground">Things I've built recently.</p>
        </div>
        {editMode && <AddBtn onClick={() => setAddOpen(true)} label="Add Project" />}
      </div>

      <div className="reveal mb-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${filter === c ? "btn-primary" : "btn-ghost"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#64748b",
            padding: "40px",
            border: "2px dashed rgba(99,102,241,0.3)",
            borderRadius: "20px",
          }}
        >
          {editMode ? 'No projects yet — click "+ Add Project" above!' : "No projects found."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {list.map((p) => (
            <article
              key={p.id}
              className="reveal glass group relative overflow-hidden rounded-3xl p-7 transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
              {editMode && (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    display: "flex",
                    gap: "6px",
                    zIndex: 5,
                  }}
                >
                  <EditBtn onClick={() => setEditProj({ ...p })}>✏️ Edit</EditBtn>
                  <DelBtn onClick={() => handleDelete(p.id)} />
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                  {p.status}
                </span>
                <span className="text-xs text-muted-foreground">{p.category}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-snug">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-3">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer" className="btn-ghost text-sm">
                    GitHub →
                  </a>
                )}
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                    Live Demo →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {addOpen && (
        <Modal title="➕ Add New Project" onClose={() => setAddOpen(false)}>
          <ProjectForm
            initial={emptyProject()}
            onSave={handleAdd}
            onClose={() => setAddOpen(false)}
          />
        </Modal>
      )}
      {editProj && (
        <Modal title="✏️ Edit Project" onClose={() => setEditProj(null)}>
          <ProjectForm initial={editProj} onSave={handleEdit} onClose={() => setEditProj(null)} />
        </Modal>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EDUCATION  — inline add/remove/edit
═══════════════════════════════════════════════════════════════════════════ */
const emptyEdu = (): EducationEntry => ({
  id: uid(),
  degree: "",
  institute: "",
  location: "",
  period: "",
  note: "",
});

function EducationSection({
  data,
  update,
  editMode,
  showToast,
}: {
  data: PortfolioData;
  update: (d: PortfolioData) => void;
  editMode: boolean;
  showToast: (m: string) => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<EducationEntry | null>(null);

  function saveEdu(education: EducationEntry[]) {
    update({ ...data, education });
  }
  function handleAdd(e: EducationEntry) {
    saveEdu([...data.education, e]);
    setAddOpen(false);
    showToast("Education added!");
  }
  function handleEdit(e: EducationEntry) {
    saveEdu(data.education.map((x) => (x.id === e.id ? e : x)));
    setEditItem(null);
    showToast("Education updated!");
  }
  function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    saveEdu(data.education.filter((e) => e.id !== id));
    showToast("Entry deleted!");
  }

  function EduForm({
    initial,
    onSave,
    onClose,
  }: {
    initial: EducationEntry;
    onSave: (e: EducationEntry) => void;
    onClose: () => void;
  }) {
    const [f, setF] = useState({ ...initial });
    return (
      <>
        <div style={fg}>
          <label style={lbl}>Degree / Program</label>
          <input
            style={inp}
            value={f.degree}
            onChange={(e) => setF((v) => ({ ...v, degree: e.target.value }))}
            placeholder="B.E. in Computer Science"
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={fg}>
            <label style={lbl}>Institution</label>
            <input
              style={inp}
              value={f.institute}
              onChange={(e) => setF((v) => ({ ...v, institute: e.target.value }))}
            />
          </div>
          <div style={fg}>
            <label style={lbl}>Location</label>
            <input
              style={inp}
              value={f.location}
              onChange={(e) => setF((v) => ({ ...v, location: e.target.value }))}
            />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={fg}>
            <label style={lbl}>Period</label>
            <input
              style={inp}
              value={f.period}
              onChange={(e) => setF((v) => ({ ...v, period: e.target.value }))}
              placeholder="2020 — 2024"
            />
          </div>
          <div style={fg}>
            <label style={lbl}>Grade / Note</label>
            <input
              style={inp}
              value={f.note}
              onChange={(e) => setF((v) => ({ ...v, note: e.target.value }))}
              placeholder="CGPA: 9.0 / 10"
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onSave(f)}
            style={{
              flex: 1,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            💾 Save
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        </div>
      </>
    );
  }

  return (
    <section id="education" className="py-20">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Education
          </div>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl md:text-5xl">Academic journey</h2>
        </div>
        {editMode && <AddBtn onClick={() => setAddOpen(true)} label="Add Education" />}
      </div>

      <div className="relative">
        <div className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-accent to-transparent sm:block" />
        <ul className="space-y-5">
          {data.education.map((e) => (
            <li key={e.id} className="reveal relative sm:pl-12">
              <span className="absolute left-1 top-6 hidden h-4 w-4 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent sm:block" />
              <div
                className="glass rounded-3xl p-6 transition-transform hover:-translate-y-1"
                style={{ position: "relative" }}
              >
                {editMode && (
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    <EditBtn onClick={() => setEditItem({ ...e })}>✏️ Edit</EditBtn>
                    <DelBtn onClick={() => handleDelete(e.id)} />
                  </div>
                )}
                <div
                  className="flex flex-wrap items-start justify-between gap-3"
                  style={{ paddingRight: editMode ? "120px" : 0 }}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{e.degree}</h3>
                    <div className="text-sm text-muted-foreground">
                      {e.institute} · {e.location}
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                    {e.period}
                  </span>
                </div>
                <p className="mt-3 text-sm text-primary">{e.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {addOpen && (
        <Modal title="➕ Add Education" onClose={() => setAddOpen(false)}>
          <EduForm initial={emptyEdu()} onSave={handleAdd} onClose={() => setAddOpen(false)} />
        </Modal>
      )}
      {editItem && (
        <Modal title="✏️ Edit Education" onClose={() => setEditItem(null)}>
          <EduForm initial={editItem} onSave={handleEdit} onClose={() => setEditItem(null)} />
        </Modal>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CTA & CONTACT
═══════════════════════════════════════════════════════════════════════════ */
function CTASection({ data }: { data: PortfolioData }) {
  return (
    <section className="py-20">
      <div className="reveal glass relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-16">
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--glow)_30%,transparent),transparent_60%),radial-gradient(ellipse_at_bottom,color-mix(in_oklab,var(--glow-2)_30%,transparent),transparent_60%)]" />
        <h2 className="relative text-3xl font-bold sm:text-5xl">
          Let's work <span className="text-gradient">together</span>!
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
          Have a project in mind? I'd love to hear from you.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <a href="#contact" className="btn-primary text-sm">
            Start a Conversation
          </a>
          {data.profile.resumeUrl && data.profile.resumeUrl !== "#" && (
            <a
              href={data.profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost text-sm"
            >
              Download Resume
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  data,
  update,
  editMode,
  showToast,
}: {
  data: PortfolioData;
  update: (d: PortfolioData) => void;
  editMode: boolean;
  showToast: (m: string) => void;
}) {
  const [sent, setSent] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { profile: p } = data;

  const [form, setForm] = useState({
    email: p.email,
    location: p.location,
    linkedin: p.linkedin,
    github: p.github,
  });

  useEffect(() => {
    setForm({ email: p.email, location: p.location, linkedin: p.linkedin, github: p.github });
  }, [p]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      formRef.current?.reset();
    }, 2500);
  }

  function saveContact() {
    update({
      ...data,
      profile: {
        ...p,
        email: form.email,
        location: form.location,
        linkedin: form.linkedin,
        github: form.github,
      },
    });
    showToast("Contact info updated!");
    setEditOpen(false);
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="reveal mb-10 max-w-2xl flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Contact
          </div>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl md:text-5xl">Get in touch</h2>
          <p className="mt-3 text-muted-foreground">
            Drop a message — I usually respond within a day.
          </p>
        </div>
        {editMode && <EditBtn onClick={() => setEditOpen(true)}>✏️ Edit Contact Info</EditBtn>}
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="reveal grid gap-4">
          {[
            { k: "Email", v: p.email, href: `mailto:${p.email}` },
            { k: "Location", v: p.location },
            {
              k: "LinkedIn",
              v: p.linkedin.replace("https://www.", "").replace("https://", ""),
              href: p.linkedin,
            },
            { k: "GitHub", v: p.github.replace("https://", ""), href: p.github },
          ].map((c) => (
            <a
              key={c.k}
              href={c.href ?? "#"}
              target={c.href?.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="glass block rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="text-xs uppercase tracking-widest text-primary font-medium">
                {c.k}
              </div>
              <div className="mt-1 break-all text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {c.v}
              </div>
            </a>
          ))}
        </div>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="reveal glass space-y-5 rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="grid gap-5 sm:grid-cols-2 mb-5">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Name
                </label>
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Email
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Subject
              </label>
              <input
                required
                name="subject"
                placeholder="What is this about?"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Message
              </label>
              <textarea
                required
                name="message"
                rows={5}
                placeholder="Tell me about your project..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 resize-y min-h-[120px]"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-[0_4px_15px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]"
            >
              {sent ? "Message sent ✓" : "Send Message"}
            </button>
          </div>
        </form>
      </div>

      {editOpen && (
        <Modal title="✏️ Edit Contact Info" onClose={() => setEditOpen(false)}>
          <div style={fg}>
            <label style={lbl}>Email Address</label>
            <input
              style={inp}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div style={fg}>
            <label style={lbl}>Location</label>
            <input
              style={inp}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </div>
          <div style={fg}>
            <label style={lbl}>LinkedIn URL</label>
            <input
              style={inp}
              value={form.linkedin}
              onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
            />
          </div>
          <div style={fg}>
            <label style={lbl}>GitHub URL</label>
            <input
              style={inp}
              value={form.github}
              onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button
              onClick={saveContact}
              style={{
                flex: 1,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              💾 Save Contact Info
            </button>
            <button
              onClick={() => setEditOpen(false)}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
