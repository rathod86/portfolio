import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  loadPortfolioData,
  savePortfolioData,
  uid,
  DEFAULT_DATA,
  type PortfolioData,
  type Project,
  type SkillCategory,
  type EducationEntry,
  type ProfileData,
} from "../lib/portfolio-store";
import {
  isPasswordSetUp,
  setAdminPassword,
  verifyPassword,
  isAdminLoggedIn,
  loginAdmin,
  logoutAdmin,
  validatePassword,
  isPasswordValid,
} from "../lib/auth-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Panel — Portfolio" }],
  }),
  component: AdminPanel,
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
    color: "#e2e8f0",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "0",
  } as React.CSSProperties,
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px 20px",
  } as React.CSSProperties,
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  } as React.CSSProperties,
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as React.CSSProperties,
  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  } as React.CSSProperties,
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
  } as React.CSSProperties,
  cardTitle: {
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#818cf8",
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
    resize: "vertical" as const,
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "500",
    color: "#94a3b8",
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  } as React.CSSProperties,
  btnPrimary: {
    padding: "10px 20px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "opacity 0.2s",
  } as React.CSSProperties,
  btnDanger: {
    padding: "8px 14px",
    borderRadius: "8px",
    background: "rgba(239,68,68,0.15)",
    color: "#f87171",
    border: "1px solid rgba(239,68,68,0.3)",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  } as React.CSSProperties,
  btnGhost: {
    padding: "10px 20px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    color: "#94a3b8",
    border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  } as React.CSSProperties,
  btnSuccess: {
    padding: "8px 14px",
    borderRadius: "8px",
    background: "rgba(34,197,94,0.15)",
    color: "#4ade80",
    border: "1px solid rgba(34,197,94,0.3)",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  } as React.CSSProperties,
  tab: (active: boolean): React.CSSProperties => ({
    padding: "8px 18px",
    borderRadius: "10px",
    background: active ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.04)",
    color: active ? "#fff" : "#94a3b8",
    border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
  }),
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  } as React.CSSProperties,
  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "14px",
  } as React.CSSProperties,
  fieldGroup: { marginBottom: "14px" } as React.CSSProperties,
  projectCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "12px",
  } as React.CSSProperties,
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "3px 10px",
    borderRadius: "20px",
    background: "rgba(99,102,241,0.15)",
    color: "#a5b4fc",
    fontSize: "12px",
    border: "1px solid rgba(99,102,241,0.25)",
    marginRight: "6px",
    marginBottom: "6px",
  } as React.CSSProperties,
  chipRemove: {
    background: "none",
    border: "none",
    color: "#a5b4fc",
    cursor: "pointer",
    padding: "0 0 0 2px",
    fontSize: "14px",
    lineHeight: "1",
  } as React.CSSProperties,
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  } as React.CSSProperties,
  successBanner: {
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.25)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#4ade80",
    fontSize: "13px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as React.CSSProperties,
};

// ─── Login / Setup Screen ─────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [needsSetup, setNeedsSetup] = useState(!isPasswordSetUp());
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [err, setErr] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validation = validatePassword(pwd);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    if (!isPasswordValid(pwd)) {
      setErr("Password doesn't meet all requirements");
      setTimeout(() => setErr(""), 2500);
      return;
    }
    if (pwd !== confirmPwd) {
      setErr("Passwords don't match");
      setTimeout(() => setErr(""), 2500);
      return;
    }
    setLoading(true);
    const ok = await setAdminPassword(pwd);
    setLoading(false);
    if (ok) {
      loginAdmin();
      onLogin();
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const ok = await verifyPassword(pwd);
    setLoading(false);
    if (ok) {
      loginAdmin();
      onLogin();
    } else {
      setErr("Incorrect password. Try again.");
      setTimeout(() => setErr(""), 2000);
    }
  }

  const RuleDot = ({ ok }: { ok: boolean }) => (
    <span style={{ color: ok ? "#4ade80" : "#64748b", fontSize: "14px", marginRight: "6px" }}>
      {ok ? "✓" : "○"}
    </span>
  );

  return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...s.card, width: "100%", maxWidth: "420px", padding: "40px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              ...s.logoIcon,
              margin: "0 auto 16px",
              width: "56px",
              height: "56px",
              fontSize: "24px",
            }}
          >
            🔐
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 6px" }}>
            {needsSetup ? "Create Admin Password" : "Admin Login"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            {needsSetup
              ? "Set a strong password to protect your portfolio"
              : "Enter your password to continue"}
          </p>
        </div>

        <form onSubmit={needsSetup ? handleSetup : handleLogin}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                style={{
                  ...s.input,
                  borderColor: err ? "rgba(239,68,68,0.5)" : undefined,
                  paddingRight: "44px",
                }}
                placeholder={needsSetup ? "Create a strong password" : "Enter admin password"}
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
                  fontSize: "14px",
                }}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {needsSetup && (
            <>
              {/* Password strength rules */}
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#64748b",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Password Requirements
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.8" }}>
                  <div>
                    <RuleDot ok={validation.length} />
                    More than 6 characters
                  </div>
                  <div>
                    <RuleDot ok={validation.letter} />
                    At least one letter (a-z)
                  </div>
                  <div>
                    <RuleDot ok={validation.number} />
                    At least one number (0-9)
                  </div>
                  <div>
                    <RuleDot ok={validation.special} />
                    At least one special character (!@#$...)
                  </div>
                </div>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Confirm Password</label>
                <input
                  type={showPwd ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  style={{
                    ...s.input,
                    borderColor:
                      confirmPwd && pwd !== confirmPwd
                        ? "rgba(239,68,68,0.5)"
                        : confirmPwd && pwd === confirmPwd
                          ? "rgba(34,197,94,0.5)"
                          : undefined,
                  }}
                  placeholder="Confirm your password"
                />
                {confirmPwd && pwd !== confirmPwd && (
                  <div style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>
                    Passwords don't match
                  </div>
                )}
                {confirmPwd && pwd === confirmPwd && (
                  <div style={{ color: "#4ade80", fontSize: "12px", marginTop: "4px" }}>
                    Passwords match ✓
                  </div>
                )}
              </div>
            </>
          )}

          {err && (
            <div
              style={{
                color: "#f87171",
                fontSize: "13px",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...s.btnPrimary,
              width: "100%",
              marginTop: "8px",
              padding: "13px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : needsSetup ? "Create Password & Login →" : "Login →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <a href="/" style={{ color: "#64748b", fontSize: "13px", textDecoration: "none" }}>
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel ─────────────────────────────────────────────────────────────
type Tab = "profile" | "projects" | "skills" | "education";

function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<PortfolioData>(() => loadPortfolioData());
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) setAuthed(true);
  }, []);

  const handleSave = useCallback((newData: PortfolioData) => {
    savePortfolioData(newData);
    setData(newData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const handleReset = useCallback(() => {
    if (confirm("Reset ALL data to defaults? This cannot be undone.")) {
      savePortfolioData(DEFAULT_DATA);
      setData(DEFAULT_DATA);
    }
  }, []);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.logo}>
            <div style={s.logoIcon}>⚙️</div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "700" }}>Portfolio Admin</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Edit your portfolio live</div>
            </div>
          </div>
          <div style={s.row}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                ...s.btnGhost,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              👁️ View Portfolio
            </a>
            <button onClick={handleReset} style={{ ...s.btnDanger }}>
              Reset All
            </button>
            <button
              onClick={() => {
                logoutAdmin();
                setAuthed(false);
              }}
              style={s.btnGhost}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Save Banner */}
        {saved && <div style={s.successBanner}>✅ Changes saved! Your portfolio is updated.</div>}

        {/* Tabs */}
        <div style={{ ...s.row, marginBottom: "24px", flexWrap: "wrap" as const }}>
          {(["profile", "projects", "skills", "education"] as Tab[]).map((t) => (
            <button key={t} style={s.tab(activeTab === t)} onClick={() => setActiveTab(t)}>
              {
                {
                  profile: "👤 Profile",
                  projects: "🚀 Projects",
                  skills: "🛠️ Skills",
                  education: "🎓 Education",
                }[t]
              }
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && <ProfileTab data={data} onSave={handleSave} />}
        {activeTab === "projects" && <ProjectsTab data={data} onSave={handleSave} />}
        {activeTab === "skills" && <SkillsTab data={data} onSave={handleSave} />}
        {activeTab === "education" && <EducationTab data={data} onSave={handleSave} />}
      </div>
    </div>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────
function ProfileTab({ data, onSave }: { data: PortfolioData; onSave: (d: PortfolioData) => void }) {
  const [p, setP] = useState<ProfileData>({ ...data.profile });
  const [wordsInput, setWordsInput] = useState(data.profile.typingWords.join(", "));

  const set = (k: keyof ProfileData, v: string | boolean) => setP((prev) => ({ ...prev, [k]: v }));

  function handleSave() {
    onSave({
      ...data,
      profile: {
        ...p,
        typingWords: wordsInput
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean),
      },
    });
  }

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>🪪 Basic Info</div>
        <div style={s.grid2}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Full Name</label>
            <input
              style={s.input}
              value={p.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Location</label>
            <input
              style={s.input}
              value={p.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="City, Country"
            />
          </div>
        </div>
        <div style={s.grid3}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Domain</label>
            <input
              style={s.input}
              value={p.domain}
              onChange={(e) => set("domain", e.target.value)}
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Focus</label>
            <input style={s.input} value={p.focus} onChange={(e) => set("focus", e.target.value)} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Available for Work?</label>
            <select
              style={s.input}
              value={p.availableForWork ? "yes" : "no"}
              onChange={(e) => set("availableForWork", e.target.value === "yes")}
            >
              <option value="yes">Yes — Show badge</option>
              <option value="no">No — Hide badge</option>
            </select>
          </div>
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Typing Words (comma separated)</label>
          <input
            style={s.input}
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
            placeholder="Developer, Full Stack Developer, Problem Solver"
          />
          <div style={{ color: "#64748b", fontSize: "11px", marginTop: "4px" }}>
            These words animate in your hero section
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>📝 Bio</div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Short Bio (shown in About section)</label>
          <textarea
            style={{ ...s.textarea, minHeight: "90px" }}
            value={p.bio1}
            onChange={(e) => set("bio1", e.target.value)}
          />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Second Bio Line</label>
          <textarea
            style={{ ...s.textarea, minHeight: "60px" }}
            value={p.bio2}
            onChange={(e) => set("bio2", e.target.value)}
          />
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>🔗 Links & Contact</div>
        <div style={s.grid2}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              value={p.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Resume URL</label>
            <input
              style={s.input}
              value={p.resumeUrl}
              onChange={(e) => set("resumeUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
        <div style={s.grid2}>
          <div style={s.fieldGroup}>
            <label style={s.label}>LinkedIn URL</label>
            <input
              style={s.input}
              value={p.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>GitHub URL</label>
            <input
              style={s.input}
              value={p.github}
              onChange={(e) => set("github", e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Profile Photo URL</label>
          <input
            style={s.input}
            value={p.profileImageUrl}
            onChange={(e) => set("profileImageUrl", e.target.value)}
            placeholder="https://..."
          />
          <div style={{ color: "#64748b", fontSize: "11px", marginTop: "4px" }}>
            Paste any direct image URL. Use sites like imgur.com or image2url.com to get a URL for
            your photo.
          </div>
        </div>
        {p.profileImageUrl && (
          <img
            src={p.profileImageUrl}
            alt="Preview"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(99,102,241,0.5)",
            }}
          />
        )}
      </div>

      <button style={s.btnPrimary} onClick={handleSave}>
        💾 Save Profile
      </button>
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────
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

function ProjectsTab({
  data,
  onSave,
}: {
  data: PortfolioData;
  onSave: (d: PortfolioData) => void;
}) {
  const [projects, setProjects] = useState<Project[]>(data.projects);
  const [editing, setEditing] = useState<Project | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [showForm, setShowForm] = useState(false);

  function openNew() {
    setEditing(emptyProject());
    setTagInput("");
    setStackInput("");
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setEditing({ ...p });
    setTagInput("");
    setStackInput("");
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    onSave({ ...data, projects: updated });
  }

  function handleSaveProject() {
    if (!editing) return;
    const exists = projects.find((p) => p.id === editing.id);
    const updated = exists
      ? projects.map((p) => (p.id === editing.id ? editing : p))
      : [...projects, editing];
    setProjects(updated);
    onSave({ ...data, projects: updated });
    setShowForm(false);
    setEditing(null);
  }

  function addTag() {
    if (!editing || !tagInput.trim()) return;
    setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] });
    setTagInput("");
  }
  function removeTag(t: string) {
    if (editing) setEditing({ ...editing, tags: editing.tags.filter((x) => x !== t) });
  }
  function addStack() {
    if (!editing || !stackInput.trim()) return;
    setEditing({ ...editing, stack: [...editing.stack, stackInput.trim()] });
    setStackInput("");
  }
  function removeStack(t: string) {
    if (editing) setEditing({ ...editing, stack: editing.stack.filter((x) => x !== t) });
  }

  return (
    <div>
      {!showForm ? (
        <>
          <div style={{ ...s.row, justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "15px", fontWeight: "600" }}>
              All Projects ({projects.length})
            </div>
            <button style={s.btnPrimary} onClick={openNew}>
              + Add Project
            </button>
          </div>
          {projects.length === 0 && (
            <div style={{ ...s.card, textAlign: "center", color: "#64748b", padding: "40px" }}>
              No projects yet. Click "Add Project" to get started!
            </div>
          )}
          {projects.map((p) => (
            <div key={p.id} style={s.projectCard}>
              <div style={{ ...s.row, justifyContent: "space-between", marginBottom: "8px" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "15px" }}>
                    {p.title || "(Untitled)"}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                    {p.category} · {p.status}
                  </div>
                </div>
                <div style={s.row}>
                  <button style={s.btnSuccess} onClick={() => openEdit(p)}>
                    ✏️ Edit
                  </button>
                  <button style={s.btnDanger} onClick={() => handleDelete(p.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 8px" }}>
                {p.description.slice(0, 120)}
                {p.description.length > 120 ? "…" : ""}
              </p>
              <div>
                {p.stack.map((s) => (
                  <span key={s} style={s.chip}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        editing && (
          <div style={s.card}>
            <div style={{ ...s.row, justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ fontSize: "16px", fontWeight: "700" }}>
                {projects.find((p) => p.id === editing.id) ? "Edit Project" : "New Project"}
              </div>
              <button
                style={s.btnGhost}
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                ← Cancel
              </button>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Project Title *</label>
              <input
                style={s.input}
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="My Awesome Project"
              />
            </div>

            <div style={s.grid3}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Status</label>
                <select
                  style={s.input}
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Open Source</option>
                  <option>Archived</option>
                </select>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Category</label>
                <input
                  style={s.input}
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  placeholder="Full Stack"
                />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>GitHub URL</label>
                <input
                  style={s.input}
                  value={editing.github ?? ""}
                  onChange={(e) => setEditing({ ...editing, github: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Live Demo URL</label>
              <input
                style={s.input}
                value={editing.demo ?? ""}
                onChange={(e) => setEditing({ ...editing, demo: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Description *</label>
              <textarea
                style={{ ...s.textarea, minHeight: "90px" }}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Describe your project..."
              />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Tags (for filtering)</label>
              <div style={s.row}>
                <input
                  style={{ ...s.input, flex: 1 }}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Full Stack, AI, etc."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <button style={s.btnPrimary} onClick={addTag}>
                  Add
                </button>
              </div>
              <div style={{ marginTop: "8px" }}>
                {editing.tags.map((t) => (
                  <span key={t} style={s.chip}>
                    {t}{" "}
                    <button style={s.chipRemove} onClick={() => removeTag(t)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Tech Stack</label>
              <div style={s.row}>
                <input
                  style={{ ...s.input, flex: 1 }}
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  placeholder="React.js, Node.js, etc."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStack())}
                />
                <button style={s.btnPrimary} onClick={addStack}>
                  Add
                </button>
              </div>
              <div style={{ marginTop: "8px" }}>
                {editing.stack.map((t) => (
                  <span key={t} style={s.chip}>
                    {t}{" "}
                    <button style={s.chipRemove} onClick={() => removeStack(t)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button style={{ ...s.btnPrimary, marginTop: "8px" }} onClick={handleSaveProject}>
              💾 Save Project
            </button>
          </div>
        )
      )}
    </div>
  );
}

// ─── Skills Tab ───────────────────────────────────────────────────────────────
function SkillsTab({ data, onSave }: { data: PortfolioData; onSave: (d: PortfolioData) => void }) {
  const [skills, setSkills] = useState<SkillCategory[]>(data.skills);
  const [newCat, setNewCat] = useState("");
  const [itemInputs, setItemInputs] = useState<Record<string, string>>({});

  function save(updated: SkillCategory[]) {
    setSkills(updated);
    onSave({ ...data, skills: updated });
  }

  function addCategory() {
    if (!newCat.trim()) return;
    save([...skills, { id: uid(), category: newCat.trim(), items: [] }]);
    setNewCat("");
  }

  function deleteCategory(id: string) {
    if (!confirm("Delete this skill category?")) return;
    save(skills.filter((s) => s.id !== id));
  }

  function addItem(id: string) {
    const val = itemInputs[id]?.trim();
    if (!val) return;
    save(skills.map((s) => (s.id === id ? { ...s, items: [...s.items, val] } : s)));
    setItemInputs((prev) => ({ ...prev, [id]: "" }));
  }

  function removeItem(id: string, item: string) {
    save(skills.map((s) => (s.id === id ? { ...s, items: s.items.filter((i) => i !== item) } : s)));
  }

  function updateCategoryName(id: string, name: string) {
    save(skills.map((s) => (s.id === id ? { ...s, category: name } : s)));
  }

  return (
    <div>
      {skills.map((sk) => (
        <div key={sk.id} style={s.card}>
          <div style={{ ...s.row, justifyContent: "space-between", marginBottom: "14px" }}>
            <input
              style={{ ...s.input, fontWeight: "600", fontSize: "15px", width: "auto", flex: 1 }}
              value={sk.category}
              onChange={(e) => updateCategoryName(sk.id, e.target.value)}
              placeholder="Category name"
            />
            <button style={s.btnDanger} onClick={() => deleteCategory(sk.id)}>
              🗑️ Delete Category
            </button>
          </div>
          <div style={{ marginBottom: "10px" }}>
            {sk.items.map((item) => (
              <span key={item} style={s.chip}>
                {item}{" "}
                <button style={s.chipRemove} onClick={() => removeItem(sk.id, item)}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={s.row}>
            <input
              style={{ ...s.input, flex: 1 }}
              value={itemInputs[sk.id] ?? ""}
              onChange={(e) => setItemInputs((prev) => ({ ...prev, [sk.id]: e.target.value }))}
              placeholder="Add a skill…"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem(sk.id))}
            />
            <button style={s.btnPrimary} onClick={() => addItem(sk.id)}>
              Add Skill
            </button>
          </div>
        </div>
      ))}

      <div
        style={{
          ...s.card,
          background: "rgba(99,102,241,0.05)",
          border: "1px dashed rgba(99,102,241,0.3)",
        }}
      >
        <div style={s.cardTitle}>➕ Add New Skill Category</div>
        <div style={s.row}>
          <input
            style={{ ...s.input, flex: 1 }}
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="e.g. DevOps, Mobile, Cloud..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
          />
          <button style={s.btnPrimary} onClick={addCategory}>
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Education Tab ────────────────────────────────────────────────────────────
const emptyEdu = (): EducationEntry => ({
  id: uid(),
  degree: "",
  institute: "",
  location: "",
  period: "",
  note: "",
});

function EducationTab({
  data,
  onSave,
}: {
  data: PortfolioData;
  onSave: (d: PortfolioData) => void;
}) {
  const [education, setEducation] = useState<EducationEntry[]>(data.education);
  const [editing, setEditing] = useState<EducationEntry | null>(null);
  const [showForm, setShowForm] = useState(false);

  function openNew() {
    setEditing(emptyEdu());
    setShowForm(true);
  }
  function openEdit(e: EducationEntry) {
    setEditing({ ...e });
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this education entry?")) return;
    const updated = education.filter((e) => e.id !== id);
    setEducation(updated);
    onSave({ ...data, education: updated });
  }

  function handleSave() {
    if (!editing) return;
    const exists = education.find((e) => e.id === editing.id);
    const updated = exists
      ? education.map((e) => (e.id === editing.id ? editing : e))
      : [...education, editing];
    setEducation(updated);
    onSave({ ...data, education: updated });
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div>
      {!showForm ? (
        <>
          <div style={{ ...s.row, justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "15px", fontWeight: "600" }}>
              Education Entries ({education.length})
            </div>
            <button style={s.btnPrimary} onClick={openNew}>
              + Add Education
            </button>
          </div>
          {education.map((e) => (
            <div key={e.id} style={s.projectCard}>
              <div style={{ ...s.row, justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "15px" }}>
                    {e.degree || "(Untitled)"}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                    {e.institute} · {e.location}
                  </div>
                  <div style={{ color: "#818cf8", fontSize: "12px", marginTop: "2px" }}>
                    {e.note}
                  </div>
                </div>
                <div style={s.row}>
                  <span style={{ color: "#64748b", fontSize: "12px" }}>{e.period}</span>
                  <button style={s.btnSuccess} onClick={() => openEdit(e)}>
                    ✏️ Edit
                  </button>
                  <button style={s.btnDanger} onClick={() => handleDelete(e.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        editing && (
          <div style={s.card}>
            <div style={{ ...s.row, justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ fontSize: "16px", fontWeight: "700" }}>
                {education.find((e) => e.id === editing.id) ? "Edit Education" : "New Education"}
              </div>
              <button
                style={s.btnGhost}
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                ← Cancel
              </button>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Degree / Program *</label>
              <input
                style={s.input}
                value={editing.degree}
                onChange={(e) => setEditing({ ...editing, degree: e.target.value })}
                placeholder="B.E. in Computer Science..."
              />
            </div>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Institution *</label>
                <input
                  style={s.input}
                  value={editing.institute}
                  onChange={(e) => setEditing({ ...editing, institute: e.target.value })}
                  placeholder="University Name"
                />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Location</label>
                <input
                  style={s.input}
                  value={editing.location}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Period</label>
                <input
                  style={s.input}
                  value={editing.period}
                  onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                  placeholder="2020 — 2024"
                />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Grade / Note</label>
                <input
                  style={s.input}
                  value={editing.note}
                  onChange={(e) => setEditing({ ...editing, note: e.target.value })}
                  placeholder="CGPA: 9.0 / 10"
                />
              </div>
            </div>
            <button style={{ ...s.btnPrimary, marginTop: "8px" }} onClick={handleSave}>
              💾 Save Education
            </button>
          </div>
        )
      )}
    </div>
  );
}
