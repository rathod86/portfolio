import { a as logoutAdmin, c as verifyPassword, d as savePortfolioData, f as uid, i as loginAdmin, n as isPasswordSetUp, o as setAdminPassword, r as isPasswordValid, t as isAdminLoggedIn, u as loadPortfolioData } from "./auth-store-CiJyPd21.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/index.tsx?tsr-split=component
function usePortfolioData() {
	const [data, setData] = useState(() => loadPortfolioData());
	const update = (next) => {
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
	return {
		data,
		update
	};
}
function useTyping(words, speed = 110, pause = 1400) {
	const [text, setText] = useState("");
	const [i, setI] = useState(0);
	const [del, setDel] = useState(false);
	useEffect(() => {
		if (!words.length) return;
		const w = words[i % words.length];
		const t = setTimeout(() => {
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
		}, del ? speed / 2 : speed);
		return () => clearTimeout(t);
	}, [
		text,
		del,
		i,
		words,
		speed,
		pause
	]);
	return text;
}
function useReveal() {
	useEffect(() => {
		const els = document.querySelectorAll(".reveal");
		const io = new IntersectionObserver((es) => es.forEach((e) => {
			if (e.isIntersecting) {
				e.target.classList.add("in");
				io.unobserve(e.target);
			}
		}), { threshold: .12 });
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	});
}
var EditBtn = ({ onClick, children }) => /* @__PURE__ */ jsx("button", {
	onClick,
	style: {
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
		whiteSpace: "nowrap"
	},
	children: children ?? "✏️ Edit"
});
var DelBtn = ({ onClick }) => /* @__PURE__ */ jsx("button", {
	onClick,
	style: {
		background: "rgba(239,68,68,0.12)",
		border: "1px solid rgba(239,68,68,0.3)",
		color: "#f87171",
		borderRadius: "8px",
		padding: "4px 10px",
		fontSize: "12px",
		cursor: "pointer",
		fontWeight: 600
	},
	children: "🗑️"
});
var AddBtn = ({ onClick, label }) => /* @__PURE__ */ jsxs("button", {
	onClick,
	style: {
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
		gap: "6px"
	},
	children: ["+ ", label]
});
function Modal({ title, onClose, children }) {
	return /* @__PURE__ */ jsx("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 9999,
			background: "rgba(0,0,0,0.7)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "20px"
		},
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				background: "#1a1a2e",
				border: "1px solid rgba(255,255,255,0.1)",
				borderRadius: "20px",
				padding: "28px",
				width: "100%",
				maxWidth: "520px",
				maxHeight: "90vh",
				overflowY: "auto"
			},
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "20px"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontWeight: 700,
						fontSize: "18px",
						color: "#e2e8f0"
					},
					children: title
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					style: {
						background: "none",
						border: "none",
						color: "#64748b",
						fontSize: "22px",
						cursor: "pointer",
						lineHeight: 1
					},
					children: "×"
				})]
			}), children]
		})
	});
}
var inp = {
	width: "100%",
	padding: "10px 14px",
	borderRadius: "10px",
	border: "1px solid rgba(255,255,255,0.1)",
	background: "rgba(255,255,255,0.05)",
	color: "#e2e8f0",
	fontSize: "14px",
	outline: "none",
	boxSizing: "border-box"
};
var lbl = {
	display: "block",
	fontSize: "11px",
	fontWeight: 600,
	color: "#94a3b8",
	marginBottom: "6px",
	textTransform: "uppercase",
	letterSpacing: "0.06em"
};
var fg = { marginBottom: "14px" };
function Toast({ msg }) {
	return /* @__PURE__ */ jsxs("div", {
		style: {
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
			zIndex: 1e4,
			boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
			pointerEvents: "none"
		},
		children: ["✅ ", msg]
	});
}
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
		setTheme(localStorage.getItem("theme") || "dark");
	}, []);
	useEffect(() => {
		if (theme === "light") document.documentElement.classList.add("light");
		else document.documentElement.classList.remove("light");
		localStorage.setItem("theme", theme);
	}, [theme]);
	const showToast = (msg) => {
		setToast(msg);
		setTimeout(() => setToast(""), 2200);
	};
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
		{
			href: "#about",
			label: "About"
		},
		{
			href: "#skills",
			label: "Skills"
		},
		{
			href: "#projects",
			label: "Projects"
		},
		{
			href: "#education",
			label: "Education"
		},
		{
			href: "#contact",
			label: "Contact"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "relative min-h-screen overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 99999,
					background: "var(--color-background)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					animation: "splash-fade 2.5s ease forwards"
				},
				children: /* @__PURE__ */ jsxs("h1", {
					className: "typing-text",
					style: {},
					children: ["Welcome to ", /* @__PURE__ */ jsx("span", {
						className: "text-gradient",
						children: " MY Portfolio."
					})]
				})
			}),
			/* @__PURE__ */ jsx("header", {
				className: `fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`,
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto max-w-6xl px-5 sm:px-8",
					children: [/* @__PURE__ */ jsxs("nav", {
						className: `glass flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-300 ${scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.15)]" : ""}`,
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#about",
								className: "flex shrink-0 items-center gap-2 group transition-all duration-300",
								children: adminAuthed ? /* @__PURE__ */ jsx("span", {
									className: "animate-shimmer grid h-9 w-auto px-4 place-items-center rounded-xl font-display text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.6)]",
									style: {
										background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)",
										backgroundSize: "200% auto"
									},
									children: "👑 Admin Mode"
								}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent font-display text-base font-bold text-primary-foreground shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform duration-300",
									children: data.profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2)
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-display text-sm font-semibold tracking-wide",
									children: [data.profile.name.split(" ")[0], /* @__PURE__ */ jsx("span", {
										className: "text-gradient",
										children: "."
									})]
								})] })
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "hidden items-center gap-1 md:flex",
								children: NAV.map((n) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: n.href,
									className: "rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground font-medium hover:-translate-y-0.5 inline-block",
									children: n.label
								}) }, n.href))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("button", {
										onClick: () => setTheme((t) => t === "dark" ? "light" : "dark"),
										className: "grid h-9 w-9 place-items-center rounded-full glass transition-all hover:scale-105 hover:bg-white/10",
										title: "Toggle Theme",
										style: {
											border: "1px solid rgba(255,255,255,0.1)",
											cursor: "pointer",
											fontSize: "14px",
											padding: 0
										},
										children: theme === "dark" ? "☀️" : "🌙"
									}),
									adminAuthed ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
										onClick: () => setEditMode((v) => !v),
										style: {
											background: editMode ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.05)",
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
											transition: "all 0.3s"
										},
										title: "Toggle Edit Mode",
										children: editMode ? "✅ Editing" : "✏️ Edit"
									}), /* @__PURE__ */ jsx("button", {
										onClick: handleAdminLogout,
										style: {
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
											transition: "all 0.2s"
										},
										title: "Logout",
										children: "🔓 Logout"
									})] }) : /* @__PURE__ */ jsx("button", {
										onClick: () => setShowLoginModal(true),
										style: {
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
											transition: "all 0.2s"
										},
										title: "Admin Login",
										children: "🔒 Admin"
									}),
									data.profile.resumeUrl && data.profile.resumeUrl !== "#" && /* @__PURE__ */ jsxs("a", {
										href: data.profile.resumeUrl,
										target: "_blank",
										rel: "noreferrer",
										className: "btn-primary hidden text-sm sm:inline-flex",
										children: ["Download Resume", /* @__PURE__ */ jsxs("svg", {
											width: "14",
											height: "14",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2.5",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: [
												/* @__PURE__ */ jsx("path", { d: "M12 3v12" }),
												/* @__PURE__ */ jsx("path", { d: "m7 10 5 5 5-5" }),
												/* @__PURE__ */ jsx("path", { d: "M5 21h14" })
											]
										})]
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => setMenuOpen((v) => !v),
										className: "grid h-10 w-10 place-items-center rounded-full border border-white/10 md:hidden",
										children: /* @__PURE__ */ jsxs("span", {
											className: "relative block h-3 w-4",
											children: [/* @__PURE__ */ jsx("span", { className: `absolute inset-x-0 top-0 h-0.5 bg-foreground transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}` }), /* @__PURE__ */ jsx("span", { className: `absolute inset-x-0 bottom-0 h-0.5 bg-foreground transition-transform ${menuOpen ? "-translate-y-1 -rotate-45" : ""}` })]
										})
									})
								]
							})
						]
					}), menuOpen && /* @__PURE__ */ jsx("div", {
						className: "glass mt-2 rounded-2xl p-3 md:hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)]",
						children: /* @__PURE__ */ jsx("ul", {
							className: "flex flex-col",
							children: NAV.map((n) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: n.href,
								onClick: () => setMenuOpen(false),
								className: "block rounded-xl px-4 py-3 text-sm hover:bg-white/10",
								children: n.label
							}) }, n.href))
						})
					})]
				})
			}),
			showLoginModal && /* @__PURE__ */ jsx(LoginModal, {
				onClose: () => setShowLoginModal(false),
				onSuccess: () => {
					setShowLoginModal(false);
					setAdminAuthed(true);
					setEditMode(true);
					showToast("Login successful!");
				}
			}),
			editMode && /* @__PURE__ */ jsx("div", {
				style: {
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
					animation: "slideDown 0.3s ease-out"
				},
				children: "✏️ EDIT MODE — Click any ✏️ Edit or ➕ Add button to update your portfolio instantly"
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto w-full max-w-6xl px-5 pt-28 sm:px-8",
				style: { paddingTop: editMode ? "88px" : void 0 },
				children: [
					/* @__PURE__ */ jsx(HeroSection, {
						data,
						update,
						editMode,
						typed,
						showToast
					}),
					/* @__PURE__ */ jsx(SkillsSection, {
						data,
						update,
						editMode,
						showToast
					}),
					/* @__PURE__ */ jsx(ProjectsSection, {
						data,
						update,
						editMode,
						showToast
					}),
					/* @__PURE__ */ jsx(EducationSection, {
						data,
						update,
						editMode,
						showToast
					}),
					/* @__PURE__ */ jsx(CTASection, { data }),
					/* @__PURE__ */ jsx(ContactSection, {
						data,
						update,
						editMode,
						showToast
					})
				]
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "mt-20 border-t border-white/10 py-10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground sm:flex-row sm:px-8",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" ",
						data.profile.name,
						". Crafted with care."
					] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: data.profile.github,
								target: "_blank",
								rel: "noreferrer",
								className: "hover:text-foreground transition-colors",
								children: "GitHub"
							}),
							/* @__PURE__ */ jsx("a", {
								href: data.profile.linkedin,
								target: "_blank",
								rel: "noreferrer",
								className: "hover:text-foreground transition-colors",
								children: "LinkedIn"
							}),
							/* @__PURE__ */ jsx("a", {
								href: `mailto:${data.profile.email}`,
								className: "hover:text-foreground transition-colors",
								children: "Email"
							})
						]
					})]
				})
			}),
			toast && /* @__PURE__ */ jsx(Toast, { msg: toast })
		]
	});
}
function LoginModal({ onClose, onSuccess }) {
	const [pwd, setPwd] = useState("");
	const [err, setErr] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPwd, setShowPwd] = useState(false);
	const [needsSetup] = useState(!isPasswordSetUp());
	async function handleLogin(e) {
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
			} else setErr("Incorrect password");
		}
	}
	return /* @__PURE__ */ jsx(Modal, {
		title: needsSetup ? "Set Admin Password" : "Admin Login",
		onClose,
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleLogin,
			children: [/* @__PURE__ */ jsxs("div", {
				style: fg,
				children: [
					/* @__PURE__ */ jsx("label", {
						style: lbl,
						children: "Password"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: { position: "relative" },
						children: [/* @__PURE__ */ jsx("input", {
							type: showPwd ? "text" : "password",
							value: pwd,
							onChange: (e) => {
								setPwd(e.target.value);
								setErr("");
							},
							style: {
								...inp,
								borderColor: err ? "rgba(239,68,68,0.5)" : void 0,
								paddingRight: "40px"
							},
							placeholder: needsSetup ? "Create a strong password" : "Enter your password",
							autoFocus: true
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setShowPwd(!showPwd),
							style: {
								position: "absolute",
								right: "10px",
								top: "50%",
								transform: "translateY(-50%)",
								background: "none",
								border: "none",
								color: "#64748b",
								cursor: "pointer",
								fontSize: "16px"
							},
							children: showPwd ? "🙈" : "👁️"
						})]
					}),
					err && /* @__PURE__ */ jsx("div", {
						style: {
							color: "#f87171",
							fontSize: "12px",
							marginTop: "6px"
						},
						children: err
					}),
					needsSetup && /* @__PURE__ */ jsx("div", {
						style: {
							color: "#94a3b8",
							fontSize: "11px",
							marginTop: "6px"
						},
						children: "Req: >6 chars, 1 number, 1 letter, 1 special char (!@#$)"
					})
				]
			}), /* @__PURE__ */ jsx("button", {
				type: "submit",
				disabled: loading,
				style: {
					width: "100%",
					background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
					border: "none",
					color: "#fff",
					borderRadius: "10px",
					padding: "12px",
					fontWeight: 700,
					cursor: "pointer",
					fontSize: "14px",
					opacity: loading ? .7 : 1
				},
				children: loading ? "Verifying..." : needsSetup ? "Set Password & Login" : "Login"
			})]
		})
	});
}
function HeroSection({ data, update, editMode, typed, showToast }) {
	const [open, setOpen] = useState(false);
	const p = data.profile;
	const nameParts = p.name.split(" ");
	const [form, setForm] = useState({
		...p,
		typingWordsStr: p.typingWords.join(", ")
	});
	const fileInputRef = useRef(null);
	function save() {
		const updated = {
			...form,
			typingWords: form.typingWordsStr.split(",").map((w) => w.trim()).filter(Boolean)
		};
		const { typingWordsStr: _, ...profileData } = updated;
		update({
			...data,
			profile: {
				...profileData,
				typingWords: updated.typingWords
			}
		});
		showToast("Profile updated!");
		setOpen(false);
	}
	const handleImageUpload = (e) => {
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
					} else if (height > MAX_SIZE) {
						width *= MAX_SIZE / height;
						height = MAX_SIZE;
					}
					canvas.width = width;
					canvas.height = height;
					canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
					const dataUrl = canvas.toDataURL("image/jpeg", .7);
					setForm((f) => ({
						...f,
						profileImageUrl: dataUrl
					}));
				};
				if (event.target?.result) img.src = event.target.result;
			};
			reader.readAsDataURL(file);
			e.target.value = "";
		}
	};
	return /* @__PURE__ */ jsxs("section", {
		id: "about",
		className: "relative grid items-center gap-12 py-12 sm:py-20 md:grid-cols-[1.2fr_1fr]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "reveal",
				children: [
					p.availableForWork && /* @__PURE__ */ jsxs("div", {
						className: "glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground shadow-[0_0_10px_rgba(34,197,94,0.15)]",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "relative flex h-2 w-2",
							children: [/* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })]
						}), "Open for opportunities"]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginTop: "20px"
						},
						children: [/* @__PURE__ */ jsxs("h1", {
							className: "text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl",
							style: { margin: 0 },
							children: [
								"Hi, I'm ",
								/* @__PURE__ */ jsx("span", {
									className: "text-gradient drop-shadow-md",
									children: nameParts[0]
								}),
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-muted-foreground drop-shadow-md",
									children: [nameParts.slice(1).join(" "), "."]
								})
							]
						}), editMode && /* @__PURE__ */ jsx(EditBtn, {
							onClick: () => {
								setForm({
									...p,
									typingWordsStr: p.typingWords.join(", ")
								});
								setOpen(true);
							},
							children: "✏️ Edit Profile"
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-5 text-xl text-muted-foreground sm:text-2xl font-light",
						children: [
							"I build as a ",
							/* @__PURE__ */ jsx("span", {
								className: "text-gradient font-semibold tracking-wide",
								children: typed
							}),
							/* @__PURE__ */ jsx("span", { className: "caret ml-0.5 inline-block h-6 w-[2px] translate-y-1 bg-primary sm:h-7 shadow-[0_0_8px_var(--color-primary)]" })
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-5 max-w-xl text-base text-muted-foreground leading-relaxed",
						children: p.bio1
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ jsx("a", {
							href: "#projects",
							className: "btn-primary text-sm shadow-[0_4px_15px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(99,102,241,0.6)]",
							children: "View My Work"
						}), /* @__PURE__ */ jsx("a", {
							href: "#contact",
							className: "btn-ghost text-sm transition-all hover:bg-white/10",
							children: "Get in Touch"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: p.linkedin,
								target: "_blank",
								rel: "noreferrer",
								className: "glass grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-all hover:-translate-y-1 hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]",
								children: /* @__PURE__ */ jsx("svg", {
									width: "16",
									height: "16",
									viewBox: "0 0 24 24",
									fill: "currentColor",
									children: /* @__PURE__ */ jsx("path", { d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V21h-4v-5.3c0-1.27-.03-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21h-4V9Z" })
								})
							}),
							/* @__PURE__ */ jsx("a", {
								href: p.github,
								target: "_blank",
								rel: "noreferrer",
								className: "glass grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-all hover:-translate-y-1 hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]",
								children: /* @__PURE__ */ jsx("svg", {
									width: "16",
									height: "16",
									viewBox: "0 0 24 24",
									fill: "currentColor",
									children: /* @__PURE__ */ jsx("path", { d: "M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.19 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.89.12 3.19.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" })
								})
							}),
							/* @__PURE__ */ jsx("a", {
								href: `mailto:${p.email}`,
								className: "glass grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-all hover:-translate-y-1 hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]",
								children: /* @__PURE__ */ jsxs("svg", {
									width: "16",
									height: "16",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									children: [/* @__PURE__ */ jsx("rect", {
										x: "3",
										y: "5",
										width: "18",
										height: "14",
										rx: "2"
									}), /* @__PURE__ */ jsx("path", { d: "m3 7 9 6 9-6" })]
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "reveal relative mx-auto aspect-square w-full max-w-sm group",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-primary/20 blur-[60px] opacity-70 transition-opacity duration-700 group-hover:opacity-100 group-hover:blur-[80px]" }),
					/* @__PURE__ */ jsx("div", {
						className: "float-y glow-ring relative h-full w-full overflow-hidden rounded-full border-[2px] border-primary/20 p-1.5 bg-background/50 backdrop-blur-sm transition-all duration-500 group-hover:border-primary/40",
						children: /* @__PURE__ */ jsx("img", {
							src: p.profileImageUrl,
							alt: p.name,
							className: "h-full w-full rounded-full object-cover transition-transform duration-700 group-hover:scale-105"
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "glass absolute -bottom-4 -left-4 rounded-2xl px-5 py-3.5 text-xs shadow-xl transition-transform duration-500 hover:scale-105 hover:-translate-y-1",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-muted-foreground font-medium mb-0.5 uppercase tracking-wider text-[10px]",
							children: "Based in"
						}), /* @__PURE__ */ jsx("div", {
							className: "font-bold tracking-wide",
							children: p.location
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "glass absolute -right-4 top-6 rounded-2xl px-5 py-3.5 text-xs shadow-xl transition-transform duration-500 hover:scale-105 hover:-translate-y-1",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-muted-foreground font-medium mb-0.5 uppercase tracking-wider text-[10px]",
							children: "Domain"
						}), /* @__PURE__ */ jsx("div", {
							className: "font-bold tracking-wide",
							children: p.domain
						})]
					})
				]
			}),
			open && /* @__PURE__ */ jsxs(Modal, {
				title: "✏️ Edit Profile",
				onClose: () => setOpen(false),
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "Full Name"
						}), /* @__PURE__ */ jsx("input", {
							style: inp,
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "12px"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: fg,
							children: [/* @__PURE__ */ jsx("label", {
								style: lbl,
								children: "Location"
							}), /* @__PURE__ */ jsx("input", {
								style: inp,
								value: form.location,
								onChange: (e) => setForm((f) => ({
									...f,
									location: e.target.value
								}))
							})]
						}), /* @__PURE__ */ jsxs("div", {
							style: fg,
							children: [/* @__PURE__ */ jsx("label", {
								style: lbl,
								children: "Domain"
							}), /* @__PURE__ */ jsx("input", {
								style: inp,
								value: form.domain,
								onChange: (e) => setForm((f) => ({
									...f,
									domain: e.target.value
								}))
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "Short Bio"
						}), /* @__PURE__ */ jsx("textarea", {
							style: {
								...inp,
								minHeight: "80px",
								resize: "vertical"
							},
							value: form.bio1,
							onChange: (e) => setForm((f) => ({
								...f,
								bio1: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "Email"
						}), /* @__PURE__ */ jsx("input", {
							style: inp,
							value: form.email,
							onChange: (e) => setForm((f) => ({
								...f,
								email: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "12px"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: fg,
							children: [/* @__PURE__ */ jsx("label", {
								style: lbl,
								children: "GitHub URL"
							}), /* @__PURE__ */ jsx("input", {
								style: inp,
								value: form.github,
								onChange: (e) => setForm((f) => ({
									...f,
									github: e.target.value
								}))
							})]
						}), /* @__PURE__ */ jsxs("div", {
							style: fg,
							children: [/* @__PURE__ */ jsx("label", {
								style: lbl,
								children: "LinkedIn URL"
							}), /* @__PURE__ */ jsx("input", {
								style: inp,
								value: form.linkedin,
								onChange: (e) => setForm((f) => ({
									...f,
									linkedin: e.target.value
								}))
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "Resume URL"
						}), /* @__PURE__ */ jsx("input", {
							style: inp,
							value: form.resumeUrl,
							onChange: (e) => setForm((f) => ({
								...f,
								resumeUrl: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "Profile Photo"
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "10px",
								alignItems: "flex-start"
							},
							children: [form.profileImageUrl && /* @__PURE__ */ jsx("img", {
								src: form.profileImageUrl,
								alt: "Preview",
								style: {
									width: "40px",
									height: "40px",
									borderRadius: "50%",
									objectFit: "cover",
									flexShrink: 0,
									border: "1px solid rgba(255,255,255,0.2)"
								}
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									flex: 1,
									display: "flex",
									flexDirection: "column",
									gap: "8px"
								},
								children: [/* @__PURE__ */ jsx("input", {
									style: {
										...inp,
										padding: "8px 12px",
										fontSize: "13px"
									},
									value: form.profileImageUrl,
									onChange: (e) => setForm((f) => ({
										...f,
										profileImageUrl: e.target.value
									})),
									placeholder: "https://... OR upload below"
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "10px"
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "file",
										accept: "image/*",
										ref: fileInputRef,
										onChange: handleImageUpload,
										style: { display: "none" }
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => fileInputRef.current?.click(),
										style: {
											background: "rgba(255,255,255,0.08)",
											border: "1px dashed rgba(255,255,255,0.2)",
											color: "#e2e8f0",
											padding: "6px 12px",
											borderRadius: "6px",
											fontSize: "12px",
											cursor: "pointer",
											transition: "all 0.2s"
										},
										onMouseOver: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)",
										onMouseOut: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)",
										children: "📁 Upload Image File"
									})]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "Typing Words (comma separated)"
						}), /* @__PURE__ */ jsx("input", {
							style: inp,
							value: form.typingWordsStr,
							onChange: (e) => setForm((f) => ({
								...f,
								typingWordsStr: e.target.value
							})),
							placeholder: "Developer, Designer, Problem Solver"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "10px",
							marginTop: "16px"
						},
						children: [/* @__PURE__ */ jsx("button", {
							onClick: save,
							style: {
								flex: 1,
								background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
								border: "none",
								color: "#fff",
								borderRadius: "10px",
								padding: "12px",
								fontWeight: 700,
								cursor: "pointer",
								fontSize: "14px"
							},
							children: "💾 Save Profile"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setOpen(false),
							style: {
								padding: "12px 20px",
								borderRadius: "10px",
								background: "rgba(255,255,255,0.05)",
								border: "1px solid rgba(255,255,255,0.1)",
								color: "#94a3b8",
								cursor: "pointer",
								fontWeight: 600
							},
							children: "Cancel"
						})]
					})
				]
			})
		]
	});
}
function SkillsSection({ data, update, editMode, showToast }) {
	const [addCatOpen, setAddCatOpen] = useState(false);
	const [newCat, setNewCat] = useState("");
	const [skillInputs, setSkillInputs] = useState({});
	const [editCat, setEditCat] = useState(null);
	function saveSkills(skills) {
		update({
			...data,
			skills
		});
	}
	function addCategory() {
		if (!newCat.trim()) return;
		saveSkills([...data.skills, {
			id: uid(),
			category: newCat.trim(),
			items: []
		}]);
		setNewCat("");
		setAddCatOpen(false);
		showToast("Skill category added!");
	}
	function deleteCategory(id) {
		if (!confirm("Delete this category?")) return;
		saveSkills(data.skills.filter((s) => s.id !== id));
		showToast("Category removed!");
	}
	function addSkill(id) {
		const val = skillInputs[id]?.trim();
		if (!val) return;
		saveSkills(data.skills.map((s) => s.id === id ? {
			...s,
			items: [...s.items, val]
		} : s));
		setSkillInputs((prev) => ({
			...prev,
			[id]: ""
		}));
		showToast(`"${val}" added!`);
	}
	function removeSkill(id, item) {
		saveSkills(data.skills.map((s) => s.id === id ? {
			...s,
			items: s.items.filter((i) => i !== item)
		} : s));
		showToast(`"${item}" removed!`);
	}
	function saveCatName() {
		if (!editCat) return;
		saveSkills(data.skills.map((s) => s.id === editCat.id ? {
			...s,
			category: editCat.category
		} : s));
		setEditCat(null);
		showToast("Category renamed!");
	}
	return /* @__PURE__ */ jsxs("section", {
		id: "skills",
		className: "py-20",
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "40px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
						children: "Skills"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-2 text-3xl font-bold sm:text-4xl md:text-5xl",
						children: "Tools I work with"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-muted-foreground",
						children: "A growing toolkit across the full stack."
					})
				] }), editMode && /* @__PURE__ */ jsx(AddBtn, {
					onClick: () => setAddCatOpen(true),
					label: "Add Skill Category"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: [data.skills.map((sk) => /* @__PURE__ */ jsxs("div", {
					className: "reveal glass group rounded-3xl p-6 transition-all hover:-translate-y-1 hover:border-primary/40",
					style: { position: "relative" },
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-4 flex items-center gap-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 text-primary",
									children: /* @__PURE__ */ jsx("span", {
										className: "text-sm font-bold",
										children: sk.category[0]
									})
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-lg font-semibold flex-1",
									children: sk.category
								}),
								editMode && /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "6px"
									},
									children: [/* @__PURE__ */ jsx(EditBtn, {
										onClick: () => setEditCat({ ...sk }),
										children: "✏️"
									}), /* @__PURE__ */ jsx(DelBtn, { onClick: () => deleteCategory(sk.id) })]
								})
							]
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "flex flex-wrap gap-2",
							children: sk.items.map((item) => /* @__PURE__ */ jsxs("li", {
								style: {
									display: "inline-flex",
									alignItems: "center",
									gap: "4px"
								},
								className: "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-muted-foreground",
								children: [item, editMode && /* @__PURE__ */ jsx("button", {
									onClick: () => removeSkill(sk.id, item),
									style: {
										background: "none",
										border: "none",
										color: "#f87171",
										cursor: "pointer",
										fontSize: "14px",
										lineHeight: 1,
										paddingLeft: "2px"
									},
									title: "Remove",
									children: "×"
								})]
							}, item))
						}),
						editMode && /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "6px",
								marginTop: "12px"
							},
							children: [/* @__PURE__ */ jsx("input", {
								style: {
									...inp,
									flex: 1,
									padding: "7px 12px",
									fontSize: "13px"
								},
								value: skillInputs[sk.id] ?? "",
								onChange: (e) => setSkillInputs((prev) => ({
									...prev,
									[sk.id]: e.target.value
								})),
								placeholder: "Add skill…",
								onKeyDown: (e) => e.key === "Enter" && addSkill(sk.id)
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => addSkill(sk.id),
								style: {
									background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
									border: "none",
									color: "#fff",
									borderRadius: "8px",
									padding: "7px 12px",
									fontSize: "13px",
									cursor: "pointer",
									fontWeight: 700
								},
								children: "Add"
							})]
						})
					]
				}, sk.id)), data.skills.length === 0 && editMode && /* @__PURE__ */ jsx("div", {
					style: {
						gridColumn: "1/-1",
						textAlign: "center",
						color: "#64748b",
						padding: "40px",
						border: "2px dashed rgba(99,102,241,0.3)",
						borderRadius: "20px"
					},
					children: "No skill categories yet. Click \"+ Add Skill Category\" above to get started!"
				})]
			}),
			addCatOpen && /* @__PURE__ */ jsxs(Modal, {
				title: "➕ Add Skill Category",
				onClose: () => setAddCatOpen(false),
				children: [/* @__PURE__ */ jsxs("div", {
					style: fg,
					children: [/* @__PURE__ */ jsx("label", {
						style: lbl,
						children: "Category Name"
					}), /* @__PURE__ */ jsx("input", {
						style: inp,
						value: newCat,
						onChange: (e) => setNewCat(e.target.value),
						placeholder: "e.g. DevOps, Mobile, Cloud",
						autoFocus: true,
						onKeyDown: (e) => e.key === "Enter" && addCategory()
					})]
				}), /* @__PURE__ */ jsx("button", {
					onClick: addCategory,
					style: {
						width: "100%",
						background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
						border: "none",
						color: "#fff",
						borderRadius: "10px",
						padding: "12px",
						fontWeight: 700,
						cursor: "pointer",
						fontSize: "14px"
					},
					children: "Add Category"
				})]
			}),
			editCat && /* @__PURE__ */ jsxs(Modal, {
				title: "✏️ Rename Category",
				onClose: () => setEditCat(null),
				children: [/* @__PURE__ */ jsxs("div", {
					style: fg,
					children: [/* @__PURE__ */ jsx("label", {
						style: lbl,
						children: "Category Name"
					}), /* @__PURE__ */ jsx("input", {
						style: inp,
						value: editCat.category,
						onChange: (e) => setEditCat({
							...editCat,
							category: e.target.value
						}),
						autoFocus: true,
						onKeyDown: (e) => e.key === "Enter" && saveCatName()
					})]
				}), /* @__PURE__ */ jsx("button", {
					onClick: saveCatName,
					style: {
						width: "100%",
						background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
						border: "none",
						color: "#fff",
						borderRadius: "10px",
						padding: "12px",
						fontWeight: 700,
						cursor: "pointer",
						fontSize: "14px"
					},
					children: "Save"
				})]
			})
		]
	});
}
var emptyProject = () => ({
	id: uid(),
	title: "",
	status: "In Progress",
	category: "Full Stack",
	tags: [],
	description: "",
	stack: [],
	demo: "",
	github: ""
});
function ProjectForm({ initial, onSave, onClose }) {
	const [p, setP] = useState({
		...initial,
		tagsStr: initial.tags.join(", "),
		stackStr: initial.stack.join(", ")
	});
	function save() {
		const { tagsStr, stackStr, ...rest } = p;
		onSave({
			...rest,
			tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
			stack: stackStr.split(",").map((t) => t.trim()).filter(Boolean)
		});
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("div", {
			style: fg,
			children: [/* @__PURE__ */ jsx("label", {
				style: lbl,
				children: "Project Title *"
			}), /* @__PURE__ */ jsx("input", {
				style: inp,
				value: p.title,
				onChange: (e) => setP((f) => ({
					...f,
					title: e.target.value
				})),
				placeholder: "My Awesome Project"
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "12px"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				style: fg,
				children: [/* @__PURE__ */ jsx("label", {
					style: lbl,
					children: "Status"
				}), /* @__PURE__ */ jsxs("select", {
					style: inp,
					value: p.status,
					onChange: (e) => setP((f) => ({
						...f,
						status: e.target.value
					})),
					children: [
						/* @__PURE__ */ jsx("option", { children: "Completed" }),
						/* @__PURE__ */ jsx("option", { children: "In Progress" }),
						/* @__PURE__ */ jsx("option", { children: "Open Source" }),
						/* @__PURE__ */ jsx("option", { children: "Archived" })
					]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				style: fg,
				children: [/* @__PURE__ */ jsx("label", {
					style: lbl,
					children: "Category"
				}), /* @__PURE__ */ jsx("input", {
					style: inp,
					value: p.category,
					onChange: (e) => setP((f) => ({
						...f,
						category: e.target.value
					}))
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: fg,
			children: [/* @__PURE__ */ jsx("label", {
				style: lbl,
				children: "Description *"
			}), /* @__PURE__ */ jsx("textarea", {
				style: {
					...inp,
					minHeight: "80px",
					resize: "vertical"
				},
				value: p.description,
				onChange: (e) => setP((f) => ({
					...f,
					description: e.target.value
				}))
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: fg,
			children: [/* @__PURE__ */ jsx("label", {
				style: lbl,
				children: "Tech Stack (comma separated)"
			}), /* @__PURE__ */ jsx("input", {
				style: inp,
				value: p.stackStr,
				onChange: (e) => setP((f) => ({
					...f,
					stackStr: e.target.value
				})),
				placeholder: "React.js, Node.js, MySQL"
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: fg,
			children: [/* @__PURE__ */ jsx("label", {
				style: lbl,
				children: "Tags for Filter (comma separated)"
			}), /* @__PURE__ */ jsx("input", {
				style: inp,
				value: p.tagsStr,
				onChange: (e) => setP((f) => ({
					...f,
					tagsStr: e.target.value
				})),
				placeholder: "Full Stack, AI, Mobile"
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "12px"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				style: fg,
				children: [/* @__PURE__ */ jsx("label", {
					style: lbl,
					children: "GitHub URL"
				}), /* @__PURE__ */ jsx("input", {
					style: inp,
					value: p.github ?? "",
					onChange: (e) => setP((f) => ({
						...f,
						github: e.target.value
					}))
				})]
			}), /* @__PURE__ */ jsxs("div", {
				style: fg,
				children: [/* @__PURE__ */ jsx("label", {
					style: lbl,
					children: "Live Demo URL"
				}), /* @__PURE__ */ jsx("input", {
					style: inp,
					value: p.demo ?? "",
					onChange: (e) => setP((f) => ({
						...f,
						demo: e.target.value
					}))
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				gap: "10px"
			},
			children: [/* @__PURE__ */ jsx("button", {
				onClick: save,
				style: {
					flex: 1,
					background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
					border: "none",
					color: "#fff",
					borderRadius: "10px",
					padding: "12px",
					fontWeight: 700,
					cursor: "pointer",
					fontSize: "14px"
				},
				children: "💾 Save Project"
			}), /* @__PURE__ */ jsx("button", {
				onClick: onClose,
				style: {
					padding: "12px 20px",
					borderRadius: "10px",
					background: "rgba(255,255,255,0.05)",
					border: "1px solid rgba(255,255,255,0.1)",
					color: "#94a3b8",
					cursor: "pointer",
					fontWeight: 600
				},
				children: "Cancel"
			})]
		})
	] });
}
function ProjectsSection({ data, update, editMode, showToast }) {
	const cats = useMemo(() => ["All", ...Array.from(new Set(data.projects.flatMap((p) => p.tags)))], [data.projects]);
	const [filter, setFilter] = useState("All");
	const [addOpen, setAddOpen] = useState(false);
	const [editProj, setEditProj] = useState(null);
	const list = filter === "All" ? data.projects : data.projects.filter((p) => p.tags.includes(filter));
	function saveProjects(projects) {
		update({
			...data,
			projects
		});
	}
	function handleAdd(p) {
		saveProjects([...data.projects, p]);
		setAddOpen(false);
		showToast("Project added!");
	}
	function handleEdit(p) {
		saveProjects(data.projects.map((x) => x.id === p.id ? p : x));
		setEditProj(null);
		showToast("Project updated!");
	}
	function handleDelete(id) {
		if (!confirm("Delete this project?")) return;
		saveProjects(data.projects.filter((p) => p.id !== id));
		showToast("Project deleted!");
	}
	return /* @__PURE__ */ jsxs("section", {
		id: "projects",
		className: "py-20",
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "40px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
						children: "Projects"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-2 text-3xl font-bold sm:text-4xl md:text-5xl",
						children: "Selected work"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-muted-foreground",
						children: "Things I've built recently."
					})
				] }), editMode && /* @__PURE__ */ jsx(AddBtn, {
					onClick: () => setAddOpen(true),
					label: "Add Project"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "reveal mb-8 flex flex-wrap gap-2",
				children: cats.map((c) => /* @__PURE__ */ jsx("button", {
					onClick: () => setFilter(c),
					className: `rounded-full px-4 py-2 text-sm font-medium transition-all ${filter === c ? "btn-primary" : "btn-ghost"}`,
					children: c
				}, c))
			}),
			list.length === 0 ? /* @__PURE__ */ jsx("div", {
				style: {
					textAlign: "center",
					color: "#64748b",
					padding: "40px",
					border: "2px dashed rgba(99,102,241,0.3)",
					borderRadius: "20px"
				},
				children: editMode ? "No projects yet — click \"+ Add Project\" above!" : "No projects found."
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: list.map((p) => /* @__PURE__ */ jsxs("article", {
					className: "reveal glass group relative overflow-hidden rounded-3xl p-7 transition-all hover:-translate-y-1 hover:border-primary/40",
					children: [
						/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" }),
						editMode && /* @__PURE__ */ jsxs("div", {
							style: {
								position: "absolute",
								top: "16px",
								right: "16px",
								display: "flex",
								gap: "6px",
								zIndex: 5
							},
							children: [/* @__PURE__ */ jsx(EditBtn, {
								onClick: () => setEditProj({ ...p }),
								children: "✏️ Edit"
							}), /* @__PURE__ */ jsx(DelBtn, { onClick: () => handleDelete(p.id) })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-primary",
								children: p.status
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs text-muted-foreground",
								children: p.category
							})]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "mt-4 text-xl font-semibold leading-snug",
							children: p.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: p.description
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-5 flex flex-wrap gap-2",
							children: p.stack.map((s) => /* @__PURE__ */ jsx("li", {
								className: "rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground",
								children: s
							}, s))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex items-center gap-3",
							children: [p.github && /* @__PURE__ */ jsx("a", {
								href: p.github,
								target: "_blank",
								rel: "noreferrer",
								className: "btn-ghost text-sm",
								children: "GitHub →"
							}), p.demo && /* @__PURE__ */ jsx("a", {
								href: p.demo,
								target: "_blank",
								rel: "noreferrer",
								className: "btn-primary text-sm",
								children: "Live Demo →"
							})]
						})
					]
				}, p.id))
			}),
			addOpen && /* @__PURE__ */ jsx(Modal, {
				title: "➕ Add New Project",
				onClose: () => setAddOpen(false),
				children: /* @__PURE__ */ jsx(ProjectForm, {
					initial: emptyProject(),
					onSave: handleAdd,
					onClose: () => setAddOpen(false)
				})
			}),
			editProj && /* @__PURE__ */ jsx(Modal, {
				title: "✏️ Edit Project",
				onClose: () => setEditProj(null),
				children: /* @__PURE__ */ jsx(ProjectForm, {
					initial: editProj,
					onSave: handleEdit,
					onClose: () => setEditProj(null)
				})
			})
		]
	});
}
var emptyEdu = () => ({
	id: uid(),
	degree: "",
	institute: "",
	location: "",
	period: "",
	note: ""
});
function EducationSection({ data, update, editMode, showToast }) {
	const [addOpen, setAddOpen] = useState(false);
	const [editItem, setEditItem] = useState(null);
	function saveEdu(education) {
		update({
			...data,
			education
		});
	}
	function handleAdd(e) {
		saveEdu([...data.education, e]);
		setAddOpen(false);
		showToast("Education added!");
	}
	function handleEdit(e) {
		saveEdu(data.education.map((x) => x.id === e.id ? e : x));
		setEditItem(null);
		showToast("Education updated!");
	}
	function handleDelete(id) {
		if (!confirm("Delete this entry?")) return;
		saveEdu(data.education.filter((e) => e.id !== id));
		showToast("Entry deleted!");
	}
	function EduForm({ initial, onSave, onClose }) {
		const [f, setF] = useState({ ...initial });
		return /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsxs("div", {
				style: fg,
				children: [/* @__PURE__ */ jsx("label", {
					style: lbl,
					children: "Degree / Program"
				}), /* @__PURE__ */ jsx("input", {
					style: inp,
					value: f.degree,
					onChange: (e) => setF((v) => ({
						...v,
						degree: e.target.value
					})),
					placeholder: "B.E. in Computer Science"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "12px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: fg,
					children: [/* @__PURE__ */ jsx("label", {
						style: lbl,
						children: "Institution"
					}), /* @__PURE__ */ jsx("input", {
						style: inp,
						value: f.institute,
						onChange: (e) => setF((v) => ({
							...v,
							institute: e.target.value
						}))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: fg,
					children: [/* @__PURE__ */ jsx("label", {
						style: lbl,
						children: "Location"
					}), /* @__PURE__ */ jsx("input", {
						style: inp,
						value: f.location,
						onChange: (e) => setF((v) => ({
							...v,
							location: e.target.value
						}))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "12px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: fg,
					children: [/* @__PURE__ */ jsx("label", {
						style: lbl,
						children: "Period"
					}), /* @__PURE__ */ jsx("input", {
						style: inp,
						value: f.period,
						onChange: (e) => setF((v) => ({
							...v,
							period: e.target.value
						})),
						placeholder: "2020 — 2024"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: fg,
					children: [/* @__PURE__ */ jsx("label", {
						style: lbl,
						children: "Grade / Note"
					}), /* @__PURE__ */ jsx("input", {
						style: inp,
						value: f.note,
						onChange: (e) => setF((v) => ({
							...v,
							note: e.target.value
						})),
						placeholder: "CGPA: 9.0 / 10"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					gap: "10px"
				},
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => onSave(f),
					style: {
						flex: 1,
						background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
						border: "none",
						color: "#fff",
						borderRadius: "10px",
						padding: "12px",
						fontWeight: 700,
						cursor: "pointer",
						fontSize: "14px"
					},
					children: "💾 Save"
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					style: {
						padding: "12px 20px",
						borderRadius: "10px",
						background: "rgba(255,255,255,0.05)",
						border: "1px solid rgba(255,255,255,0.1)",
						color: "#94a3b8",
						cursor: "pointer",
						fontWeight: 600
					},
					children: "Cancel"
				})]
			})
		] });
	}
	return /* @__PURE__ */ jsxs("section", {
		id: "education",
		className: "py-20",
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "40px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
					children: "Education"
				}), /* @__PURE__ */ jsx("h2", {
					className: "mt-2 text-3xl font-bold sm:text-4xl md:text-5xl",
					children: "Academic journey"
				})] }), editMode && /* @__PURE__ */ jsx(AddBtn, {
					onClick: () => setAddOpen(true),
					label: "Add Education"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-accent to-transparent sm:block" }), /* @__PURE__ */ jsx("ul", {
					className: "space-y-5",
					children: data.education.map((e) => /* @__PURE__ */ jsxs("li", {
						className: "reveal relative sm:pl-12",
						children: [/* @__PURE__ */ jsx("span", { className: "absolute left-1 top-6 hidden h-4 w-4 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent sm:block" }), /* @__PURE__ */ jsxs("div", {
							className: "glass rounded-3xl p-6 transition-transform hover:-translate-y-1",
							style: { position: "relative" },
							children: [
								editMode && /* @__PURE__ */ jsxs("div", {
									style: {
										position: "absolute",
										top: "16px",
										right: "16px",
										display: "flex",
										gap: "6px"
									},
									children: [/* @__PURE__ */ jsx(EditBtn, {
										onClick: () => setEditItem({ ...e }),
										children: "✏️ Edit"
									}), /* @__PURE__ */ jsx(DelBtn, { onClick: () => handleDelete(e.id) })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-start justify-between gap-3",
									style: { paddingRight: editMode ? "120px" : 0 },
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
										className: "text-lg font-semibold",
										children: e.degree
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-sm text-muted-foreground",
										children: [
											e.institute,
											" · ",
											e.location
										]
									})] }), /* @__PURE__ */ jsx("span", {
										className: "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground",
										children: e.period
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-3 text-sm text-primary",
									children: e.note
								})
							]
						})]
					}, e.id))
				})]
			}),
			addOpen && /* @__PURE__ */ jsx(Modal, {
				title: "➕ Add Education",
				onClose: () => setAddOpen(false),
				children: /* @__PURE__ */ jsx(EduForm, {
					initial: emptyEdu(),
					onSave: handleAdd,
					onClose: () => setAddOpen(false)
				})
			}),
			editItem && /* @__PURE__ */ jsx(Modal, {
				title: "✏️ Edit Education",
				onClose: () => setEditItem(null),
				children: /* @__PURE__ */ jsx(EduForm, {
					initial: editItem,
					onSave: handleEdit,
					onClose: () => setEditItem(null)
				})
			})
		]
	});
}
function CTASection({ data }) {
	return /* @__PURE__ */ jsx("section", {
		className: "py-20",
		children: /* @__PURE__ */ jsxs("div", {
			className: "reveal glass relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-16",
			children: [
				/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--glow)_30%,transparent),transparent_60%),radial-gradient(ellipse_at_bottom,color-mix(in_oklab,var(--glow-2)_30%,transparent),transparent_60%)]" }),
				/* @__PURE__ */ jsxs("h2", {
					className: "relative text-3xl font-bold sm:text-5xl",
					children: [
						"Let's work ",
						/* @__PURE__ */ jsx("span", {
							className: "text-gradient",
							children: "together"
						}),
						"!"
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "relative mx-auto mt-4 max-w-xl text-muted-foreground",
					children: "Have a project in mind? I'd love to hear from you."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative mt-7 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ jsx("a", {
						href: "#contact",
						className: "btn-primary text-sm",
						children: "Start a Conversation"
					}), data.profile.resumeUrl && data.profile.resumeUrl !== "#" && /* @__PURE__ */ jsx("a", {
						href: data.profile.resumeUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "btn-ghost text-sm",
						children: "Download Resume"
					})]
				})
			]
		})
	});
}
function ContactSection({ data, update, editMode, showToast }) {
	const [sent, setSent] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const formRef = useRef(null);
	const { profile: p } = data;
	const [form, setForm] = useState({
		email: p.email,
		location: p.location,
		linkedin: p.linkedin,
		github: p.github
	});
	useEffect(() => {
		setForm({
			email: p.email,
			location: p.location,
			linkedin: p.linkedin,
			github: p.github
		});
	}, [p]);
	function onSubmit(e) {
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
				github: form.github
			}
		});
		showToast("Contact info updated!");
		setEditOpen(false);
	}
	return /* @__PURE__ */ jsxs("section", {
		id: "contact",
		className: "py-20 relative",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "reveal mb-10 max-w-2xl flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
						children: "Contact"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-2 text-3xl font-bold sm:text-4xl md:text-5xl",
						children: "Get in touch"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-muted-foreground",
						children: "Drop a message — I usually respond within a day."
					})
				] }), editMode && /* @__PURE__ */ jsx(EditBtn, {
					onClick: () => setEditOpen(true),
					children: "✏️ Edit Contact Info"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 md:grid-cols-[1fr_1.2fr]",
				children: [/* @__PURE__ */ jsx("div", {
					className: "reveal grid gap-4",
					children: [
						{
							k: "Email",
							v: p.email,
							href: `mailto:${p.email}`
						},
						{
							k: "Location",
							v: p.location
						},
						{
							k: "LinkedIn",
							v: p.linkedin.replace("https://www.", "").replace("https://", ""),
							href: p.linkedin
						},
						{
							k: "GitHub",
							v: p.github.replace("https://", ""),
							href: p.github
						}
					].map((c) => /* @__PURE__ */ jsxs("a", {
						href: c.href ?? "#",
						target: c.href?.startsWith("http") ? "_blank" : void 0,
						rel: "noreferrer",
						className: "glass block rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)] group relative overflow-hidden",
						children: [
							/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
							/* @__PURE__ */ jsx("div", {
								className: "text-xs uppercase tracking-widest text-primary font-medium",
								children: c.k
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 break-all text-sm font-medium text-foreground group-hover:text-primary transition-colors",
								children: c.v
							})
						]
					}, c.k))
				}), /* @__PURE__ */ jsxs("form", {
					ref: formRef,
					onSubmit,
					className: "reveal glass space-y-5 rounded-3xl p-8 relative overflow-hidden",
					children: [
						/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" }),
						/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" }),
						/* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-5 sm:grid-cols-2 mb-5",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
										children: "Name"
									}), /* @__PURE__ */ jsx("input", {
										required: true,
										name: "name",
										placeholder: "Your name",
										className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
										children: "Email"
									}), /* @__PURE__ */ jsx("input", {
										required: true,
										name: "email",
										type: "email",
										placeholder: "you@email.com",
										className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
										children: "Subject"
									}), /* @__PURE__ */ jsx("input", {
										required: true,
										name: "subject",
										placeholder: "What is this about?",
										className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-6",
									children: [/* @__PURE__ */ jsx("label", {
										className: "mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
										children: "Message"
									}), /* @__PURE__ */ jsx("textarea", {
										required: true,
										name: "message",
										rows: 5,
										placeholder: "Tell me about your project...",
										className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 resize-y min-h-[120px]"
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "btn-primary w-full py-3.5 text-sm font-bold shadow-[0_4px_15px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]",
									children: sent ? "Message sent ✓" : "Send Message"
								})
							]
						})
					]
				})]
			}),
			editOpen && /* @__PURE__ */ jsxs(Modal, {
				title: "✏️ Edit Contact Info",
				onClose: () => setEditOpen(false),
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "Email Address"
						}), /* @__PURE__ */ jsx("input", {
							style: inp,
							value: form.email,
							onChange: (e) => setForm((f) => ({
								...f,
								email: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "Location"
						}), /* @__PURE__ */ jsx("input", {
							style: inp,
							value: form.location,
							onChange: (e) => setForm((f) => ({
								...f,
								location: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "LinkedIn URL"
						}), /* @__PURE__ */ jsx("input", {
							style: inp,
							value: form.linkedin,
							onChange: (e) => setForm((f) => ({
								...f,
								linkedin: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: fg,
						children: [/* @__PURE__ */ jsx("label", {
							style: lbl,
							children: "GitHub URL"
						}), /* @__PURE__ */ jsx("input", {
							style: inp,
							value: form.github,
							onChange: (e) => setForm((f) => ({
								...f,
								github: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "10px",
							marginTop: "16px"
						},
						children: [/* @__PURE__ */ jsx("button", {
							onClick: saveContact,
							style: {
								flex: 1,
								background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
								border: "none",
								color: "#fff",
								borderRadius: "10px",
								padding: "12px",
								fontWeight: 700,
								cursor: "pointer",
								fontSize: "14px"
							},
							children: "💾 Save Contact Info"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setEditOpen(false),
							style: {
								padding: "12px 20px",
								borderRadius: "10px",
								background: "rgba(255,255,255,0.05)",
								border: "1px solid rgba(255,255,255,0.1)",
								color: "#94a3b8",
								cursor: "pointer",
								fontWeight: 600
							},
							children: "Cancel"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { Portfolio as component };
