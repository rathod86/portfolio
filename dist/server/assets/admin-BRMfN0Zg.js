import { a as logoutAdmin, c as verifyPassword, d as savePortfolioData, f as uid, i as loginAdmin, l as DEFAULT_DATA, n as isPasswordSetUp, o as setAdminPassword, r as isPasswordValid, s as validatePassword, t as isAdminLoggedIn, u as loadPortfolioData } from "./auth-store-CiJyPd21.js";
import { useCallback, useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/admin.tsx?tsr-split=component
var s = {
	page: {
		minHeight: "100vh",
		background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
		color: "#e2e8f0",
		fontFamily: "'Inter', system-ui, sans-serif",
		padding: "0"
	},
	container: {
		maxWidth: "1100px",
		margin: "0 auto",
		padding: "24px 20px"
	},
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: "32px",
		paddingBottom: "20px",
		borderBottom: "1px solid rgba(255,255,255,0.08)"
	},
	logo: {
		display: "flex",
		alignItems: "center",
		gap: "12px"
	},
	logoIcon: {
		width: "40px",
		height: "40px",
		borderRadius: "12px",
		background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "18px"
	},
	card: {
		background: "rgba(255,255,255,0.04)",
		border: "1px solid rgba(255,255,255,0.08)",
		borderRadius: "20px",
		padding: "24px",
		marginBottom: "20px"
	},
	cardTitle: {
		fontSize: "14px",
		fontWeight: "600",
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		color: "#818cf8",
		marginBottom: "16px"
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
		boxSizing: "border-box"
	},
	textarea: {
		width: "100%",
		padding: "10px 14px",
		borderRadius: "10px",
		border: "1px solid rgba(255,255,255,0.1)",
		background: "rgba(255,255,255,0.05)",
		color: "#e2e8f0",
		fontSize: "14px",
		outline: "none",
		resize: "vertical",
		boxSizing: "border-box"
	},
	label: {
		display: "block",
		fontSize: "12px",
		fontWeight: "500",
		color: "#94a3b8",
		marginBottom: "6px",
		textTransform: "uppercase",
		letterSpacing: "0.05em"
	},
	btnPrimary: {
		padding: "10px 20px",
		borderRadius: "10px",
		background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
		color: "#fff",
		border: "none",
		cursor: "pointer",
		fontSize: "13px",
		fontWeight: "600",
		transition: "opacity 0.2s"
	},
	btnDanger: {
		padding: "8px 14px",
		borderRadius: "8px",
		background: "rgba(239,68,68,0.15)",
		color: "#f87171",
		border: "1px solid rgba(239,68,68,0.3)",
		cursor: "pointer",
		fontSize: "12px",
		fontWeight: "600"
	},
	btnGhost: {
		padding: "10px 20px",
		borderRadius: "10px",
		background: "rgba(255,255,255,0.05)",
		color: "#94a3b8",
		border: "1px solid rgba(255,255,255,0.08)",
		cursor: "pointer",
		fontSize: "13px",
		fontWeight: "600"
	},
	btnSuccess: {
		padding: "8px 14px",
		borderRadius: "8px",
		background: "rgba(34,197,94,0.15)",
		color: "#4ade80",
		border: "1px solid rgba(34,197,94,0.3)",
		cursor: "pointer",
		fontSize: "12px",
		fontWeight: "600"
	},
	tab: (active) => ({
		padding: "8px 18px",
		borderRadius: "10px",
		background: active ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.04)",
		color: active ? "#fff" : "#94a3b8",
		border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
		cursor: "pointer",
		fontSize: "13px",
		fontWeight: "600",
		transition: "all 0.2s"
	}),
	grid2: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: "14px"
	},
	grid3: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr 1fr",
		gap: "14px"
	},
	fieldGroup: { marginBottom: "14px" },
	projectCard: {
		background: "rgba(255,255,255,0.03)",
		border: "1px solid rgba(255,255,255,0.07)",
		borderRadius: "14px",
		padding: "18px",
		marginBottom: "12px"
	},
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
		marginBottom: "6px"
	},
	chipRemove: {
		background: "none",
		border: "none",
		color: "#a5b4fc",
		cursor: "pointer",
		padding: "0 0 0 2px",
		fontSize: "14px",
		lineHeight: "1"
	},
	row: {
		display: "flex",
		alignItems: "center",
		gap: "10px"
	},
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
		gap: "8px"
	}
};
function LoginScreen({ onLogin }) {
	const [needsSetup, setNeedsSetup] = useState(!isPasswordSetUp());
	const [pwd, setPwd] = useState("");
	const [confirmPwd, setConfirmPwd] = useState("");
	const [err, setErr] = useState("");
	const [showPwd, setShowPwd] = useState(false);
	const [loading, setLoading] = useState(false);
	const validation = validatePassword(pwd);
	async function handleSetup(e) {
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
	async function handleLogin(e) {
		e.preventDefault();
		setLoading(true);
		const ok = await verifyPassword(pwd);
		setLoading(false);
		if (ok) {
			loginAdmin();
			onLogin();
		} else {
			setErr("Incorrect password. Try again.");
			setTimeout(() => setErr(""), 2e3);
		}
	}
	const RuleDot = ({ ok }) => /* @__PURE__ */ jsx("span", {
		style: {
			color: ok ? "#4ade80" : "#64748b",
			fontSize: "14px",
			marginRight: "6px"
		},
		children: ok ? "✓" : "○"
	});
	return /* @__PURE__ */ jsx("div", {
		style: {
			...s.page,
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				...s.card,
				width: "100%",
				maxWidth: "420px",
				padding: "40px 32px"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						textAlign: "center",
						marginBottom: "28px"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								...s.logoIcon,
								margin: "0 auto 16px",
								width: "56px",
								height: "56px",
								fontSize: "24px"
							},
							children: "🔐"
						}),
						/* @__PURE__ */ jsx("h1", {
							style: {
								fontSize: "22px",
								fontWeight: "700",
								margin: "0 0 6px"
							},
							children: needsSetup ? "Create Admin Password" : "Admin Login"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								color: "#64748b",
								fontSize: "14px",
								margin: 0
							},
							children: needsSetup ? "Set a strong password to protect your portfolio" : "Enter your password to continue"
						})
					]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: needsSetup ? handleSetup : handleLogin,
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: s.fieldGroup,
							children: [/* @__PURE__ */ jsx("label", {
								style: s.label,
								children: "Password"
							}), /* @__PURE__ */ jsxs("div", {
								style: { position: "relative" },
								children: [/* @__PURE__ */ jsx("input", {
									type: showPwd ? "text" : "password",
									value: pwd,
									onChange: (e) => setPwd(e.target.value),
									style: {
										...s.input,
										borderColor: err ? "rgba(239,68,68,0.5)" : void 0,
										paddingRight: "44px"
									},
									placeholder: needsSetup ? "Create a strong password" : "Enter admin password",
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
										fontSize: "14px"
									},
									children: showPwd ? "🙈" : "👁️"
								})]
							})]
						}),
						needsSetup && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
							style: {
								marginBottom: "16px",
								padding: "12px",
								borderRadius: "10px",
								background: "rgba(255,255,255,0.03)",
								border: "1px solid rgba(255,255,255,0.06)"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "11px",
									fontWeight: "600",
									color: "#64748b",
									marginBottom: "8px",
									textTransform: "uppercase",
									letterSpacing: "0.05em"
								},
								children: "Password Requirements"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "13px",
									color: "#94a3b8",
									lineHeight: "1.8"
								},
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(RuleDot, { ok: validation.length }), "More than 6 characters"] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(RuleDot, { ok: validation.letter }), "At least one letter (a-z)"] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(RuleDot, { ok: validation.number }), "At least one number (0-9)"] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(RuleDot, { ok: validation.special }), "At least one special character (!@#$...)"] })
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							style: s.fieldGroup,
							children: [
								/* @__PURE__ */ jsx("label", {
									style: s.label,
									children: "Confirm Password"
								}),
								/* @__PURE__ */ jsx("input", {
									type: showPwd ? "text" : "password",
									value: confirmPwd,
									onChange: (e) => setConfirmPwd(e.target.value),
									style: {
										...s.input,
										borderColor: confirmPwd && pwd !== confirmPwd ? "rgba(239,68,68,0.5)" : confirmPwd && pwd === confirmPwd ? "rgba(34,197,94,0.5)" : void 0
									},
									placeholder: "Confirm your password"
								}),
								confirmPwd && pwd !== confirmPwd && /* @__PURE__ */ jsx("div", {
									style: {
										color: "#f87171",
										fontSize: "12px",
										marginTop: "4px"
									},
									children: "Passwords don't match"
								}),
								confirmPwd && pwd === confirmPwd && /* @__PURE__ */ jsx("div", {
									style: {
										color: "#4ade80",
										fontSize: "12px",
										marginTop: "4px"
									},
									children: "Passwords match ✓"
								})
							]
						})] }),
						err && /* @__PURE__ */ jsx("div", {
							style: {
								color: "#f87171",
								fontSize: "13px",
								marginBottom: "12px",
								textAlign: "center"
							},
							children: err
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: loading,
							style: {
								...s.btnPrimary,
								width: "100%",
								marginTop: "8px",
								padding: "13px",
								opacity: loading ? .7 : 1
							},
							children: loading ? "Please wait..." : needsSetup ? "Create Password & Login →" : "Login →"
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						textAlign: "center",
						marginTop: "16px"
					},
					children: /* @__PURE__ */ jsx("a", {
						href: "/",
						style: {
							color: "#64748b",
							fontSize: "13px",
							textDecoration: "none"
						},
						children: "← Back to Portfolio"
					})
				})
			]
		})
	});
}
function AdminPanel() {
	const [authed, setAuthed] = useState(false);
	const [data, setData] = useState(() => loadPortfolioData());
	const [activeTab, setActiveTab] = useState("profile");
	const [saved, setSaved] = useState(false);
	useEffect(() => {
		if (isAdminLoggedIn()) setAuthed(true);
	}, []);
	const handleSave = useCallback((newData) => {
		savePortfolioData(newData);
		setData(newData);
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
	}, []);
	const handleReset = useCallback(() => {
		if (confirm("Reset ALL data to defaults? This cannot be undone.")) {
			savePortfolioData(DEFAULT_DATA);
			setData(DEFAULT_DATA);
		}
	}, []);
	if (!authed) return /* @__PURE__ */ jsx(LoginScreen, { onLogin: () => setAuthed(true) });
	return /* @__PURE__ */ jsx("div", {
		style: s.page,
		children: /* @__PURE__ */ jsxs("div", {
			style: s.container,
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: s.header,
					children: [/* @__PURE__ */ jsxs("div", {
						style: s.logo,
						children: [/* @__PURE__ */ jsx("div", {
							style: s.logoIcon,
							children: "⚙️"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "18px",
								fontWeight: "700"
							},
							children: "Portfolio Admin"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "12px",
								color: "#64748b"
							},
							children: "Edit your portfolio live"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						style: s.row,
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "/",
								target: "_blank",
								rel: "noreferrer",
								style: {
									...s.btnGhost,
									textDecoration: "none",
									display: "inline-flex",
									alignItems: "center",
									gap: "6px"
								},
								children: "👁️ View Portfolio"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: handleReset,
								style: { ...s.btnDanger },
								children: "Reset All"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => {
									logoutAdmin();
									setAuthed(false);
								},
								style: s.btnGhost,
								children: "Logout"
							})
						]
					})]
				}),
				saved && /* @__PURE__ */ jsx("div", {
					style: s.successBanner,
					children: "✅ Changes saved! Your portfolio is updated."
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						...s.row,
						marginBottom: "24px",
						flexWrap: "wrap"
					},
					children: [
						"profile",
						"projects",
						"skills",
						"education"
					].map((t) => /* @__PURE__ */ jsx("button", {
						style: s.tab(activeTab === t),
						onClick: () => setActiveTab(t),
						children: {
							profile: "👤 Profile",
							projects: "🚀 Projects",
							skills: "🛠️ Skills",
							education: "🎓 Education"
						}[t]
					}, t))
				}),
				activeTab === "profile" && /* @__PURE__ */ jsx(ProfileTab, {
					data,
					onSave: handleSave
				}),
				activeTab === "projects" && /* @__PURE__ */ jsx(ProjectsTab, {
					data,
					onSave: handleSave
				}),
				activeTab === "skills" && /* @__PURE__ */ jsx(SkillsTab, {
					data,
					onSave: handleSave
				}),
				activeTab === "education" && /* @__PURE__ */ jsx(EducationTab, {
					data,
					onSave: handleSave
				})
			]
		})
	});
}
function ProfileTab({ data, onSave }) {
	const [p, setP] = useState({ ...data.profile });
	const [wordsInput, setWordsInput] = useState(data.profile.typingWords.join(", "));
	const set = (k, v) => setP((prev) => ({
		...prev,
		[k]: v
	}));
	function handleSave() {
		onSave({
			...data,
			profile: {
				...p,
				typingWords: wordsInput.split(",").map((w) => w.trim()).filter(Boolean)
			}
		});
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			style: s.card,
			children: [
				/* @__PURE__ */ jsx("div", {
					style: s.cardTitle,
					children: "🪪 Basic Info"
				}),
				/* @__PURE__ */ jsxs("div", {
					style: s.grid2,
					children: [/* @__PURE__ */ jsxs("div", {
						style: s.fieldGroup,
						children: [/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "Full Name"
						}), /* @__PURE__ */ jsx("input", {
							style: s.input,
							value: p.name,
							onChange: (e) => set("name", e.target.value),
							placeholder: "Your full name"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: s.fieldGroup,
						children: [/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "Location"
						}), /* @__PURE__ */ jsx("input", {
							style: s.input,
							value: p.location,
							onChange: (e) => set("location", e.target.value),
							placeholder: "City, Country"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: s.grid3,
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: s.fieldGroup,
							children: [/* @__PURE__ */ jsx("label", {
								style: s.label,
								children: "Domain"
							}), /* @__PURE__ */ jsx("input", {
								style: s.input,
								value: p.domain,
								onChange: (e) => set("domain", e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.fieldGroup,
							children: [/* @__PURE__ */ jsx("label", {
								style: s.label,
								children: "Focus"
							}), /* @__PURE__ */ jsx("input", {
								style: s.input,
								value: p.focus,
								onChange: (e) => set("focus", e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.fieldGroup,
							children: [/* @__PURE__ */ jsx("label", {
								style: s.label,
								children: "Available for Work?"
							}), /* @__PURE__ */ jsxs("select", {
								style: s.input,
								value: p.availableForWork ? "yes" : "no",
								onChange: (e) => set("availableForWork", e.target.value === "yes"),
								children: [/* @__PURE__ */ jsx("option", {
									value: "yes",
									children: "Yes — Show badge"
								}), /* @__PURE__ */ jsx("option", {
									value: "no",
									children: "No — Hide badge"
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: s.fieldGroup,
					children: [
						/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "Typing Words (comma separated)"
						}),
						/* @__PURE__ */ jsx("input", {
							style: s.input,
							value: wordsInput,
							onChange: (e) => setWordsInput(e.target.value),
							placeholder: "Developer, Full Stack Developer, Problem Solver"
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								color: "#64748b",
								fontSize: "11px",
								marginTop: "4px"
							},
							children: "These words animate in your hero section"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: s.card,
			children: [
				/* @__PURE__ */ jsx("div", {
					style: s.cardTitle,
					children: "📝 Bio"
				}),
				/* @__PURE__ */ jsxs("div", {
					style: s.fieldGroup,
					children: [/* @__PURE__ */ jsx("label", {
						style: s.label,
						children: "Short Bio (shown in About section)"
					}), /* @__PURE__ */ jsx("textarea", {
						style: {
							...s.textarea,
							minHeight: "90px"
						},
						value: p.bio1,
						onChange: (e) => set("bio1", e.target.value)
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: s.fieldGroup,
					children: [/* @__PURE__ */ jsx("label", {
						style: s.label,
						children: "Second Bio Line"
					}), /* @__PURE__ */ jsx("textarea", {
						style: {
							...s.textarea,
							minHeight: "60px"
						},
						value: p.bio2,
						onChange: (e) => set("bio2", e.target.value)
					})]
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			style: s.card,
			children: [
				/* @__PURE__ */ jsx("div", {
					style: s.cardTitle,
					children: "🔗 Links & Contact"
				}),
				/* @__PURE__ */ jsxs("div", {
					style: s.grid2,
					children: [/* @__PURE__ */ jsxs("div", {
						style: s.fieldGroup,
						children: [/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "Email"
						}), /* @__PURE__ */ jsx("input", {
							style: s.input,
							value: p.email,
							onChange: (e) => set("email", e.target.value),
							placeholder: "you@email.com"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: s.fieldGroup,
						children: [/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "Resume URL"
						}), /* @__PURE__ */ jsx("input", {
							style: s.input,
							value: p.resumeUrl,
							onChange: (e) => set("resumeUrl", e.target.value),
							placeholder: "https://..."
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: s.grid2,
					children: [/* @__PURE__ */ jsxs("div", {
						style: s.fieldGroup,
						children: [/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "LinkedIn URL"
						}), /* @__PURE__ */ jsx("input", {
							style: s.input,
							value: p.linkedin,
							onChange: (e) => set("linkedin", e.target.value),
							placeholder: "https://linkedin.com/in/..."
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: s.fieldGroup,
						children: [/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "GitHub URL"
						}), /* @__PURE__ */ jsx("input", {
							style: s.input,
							value: p.github,
							onChange: (e) => set("github", e.target.value),
							placeholder: "https://github.com/..."
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: s.fieldGroup,
					children: [
						/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "Profile Photo URL"
						}),
						/* @__PURE__ */ jsx("input", {
							style: s.input,
							value: p.profileImageUrl,
							onChange: (e) => set("profileImageUrl", e.target.value),
							placeholder: "https://..."
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								color: "#64748b",
								fontSize: "11px",
								marginTop: "4px"
							},
							children: "Paste any direct image URL. Use sites like imgur.com or image2url.com to get a URL for your photo."
						})
					]
				}),
				p.profileImageUrl && /* @__PURE__ */ jsx("img", {
					src: p.profileImageUrl,
					alt: "Preview",
					style: {
						width: "80px",
						height: "80px",
						borderRadius: "50%",
						objectFit: "cover",
						border: "2px solid rgba(99,102,241,0.5)"
					}
				})
			]
		}),
		/* @__PURE__ */ jsx("button", {
			style: s.btnPrimary,
			onClick: handleSave,
			children: "💾 Save Profile"
		})
	] });
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
function ProjectsTab({ data, onSave }) {
	const [projects, setProjects] = useState(data.projects);
	const [editing, setEditing] = useState(null);
	const [tagInput, setTagInput] = useState("");
	const [stackInput, setStackInput] = useState("");
	const [showForm, setShowForm] = useState(false);
	function openNew() {
		setEditing(emptyProject());
		setTagInput("");
		setStackInput("");
		setShowForm(true);
	}
	function openEdit(p) {
		setEditing({ ...p });
		setTagInput("");
		setStackInput("");
		setShowForm(true);
	}
	function handleDelete(id) {
		if (!confirm("Delete this project?")) return;
		const updated = projects.filter((p) => p.id !== id);
		setProjects(updated);
		onSave({
			...data,
			projects: updated
		});
	}
	function handleSaveProject() {
		if (!editing) return;
		const updated = projects.find((p) => p.id === editing.id) ? projects.map((p) => p.id === editing.id ? editing : p) : [...projects, editing];
		setProjects(updated);
		onSave({
			...data,
			projects: updated
		});
		setShowForm(false);
		setEditing(null);
	}
	function addTag() {
		if (!editing || !tagInput.trim()) return;
		setEditing({
			...editing,
			tags: [...editing.tags, tagInput.trim()]
		});
		setTagInput("");
	}
	function removeTag(t) {
		if (editing) setEditing({
			...editing,
			tags: editing.tags.filter((x) => x !== t)
		});
	}
	function addStack() {
		if (!editing || !stackInput.trim()) return;
		setEditing({
			...editing,
			stack: [...editing.stack, stackInput.trim()]
		});
		setStackInput("");
	}
	function removeStack(t) {
		if (editing) setEditing({
			...editing,
			stack: editing.stack.filter((x) => x !== t)
		});
	}
	return /* @__PURE__ */ jsx("div", { children: !showForm ? /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("div", {
			style: {
				...s.row,
				justifyContent: "space-between",
				marginBottom: "16px"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					fontSize: "15px",
					fontWeight: "600"
				},
				children: [
					"All Projects (",
					projects.length,
					")"
				]
			}), /* @__PURE__ */ jsx("button", {
				style: s.btnPrimary,
				onClick: openNew,
				children: "+ Add Project"
			})]
		}),
		projects.length === 0 && /* @__PURE__ */ jsx("div", {
			style: {
				...s.card,
				textAlign: "center",
				color: "#64748b",
				padding: "40px"
			},
			children: "No projects yet. Click \"Add Project\" to get started!"
		}),
		projects.map((p) => /* @__PURE__ */ jsxs("div", {
			style: s.projectCard,
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						...s.row,
						justifyContent: "space-between",
						marginBottom: "8px"
					},
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontWeight: "600",
							fontSize: "15px"
						},
						children: p.title || "(Untitled)"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							color: "#64748b",
							fontSize: "12px",
							marginTop: "2px"
						},
						children: [
							p.category,
							" · ",
							p.status
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						style: s.row,
						children: [/* @__PURE__ */ jsx("button", {
							style: s.btnSuccess,
							onClick: () => openEdit(p),
							children: "✏️ Edit"
						}), /* @__PURE__ */ jsx("button", {
							style: s.btnDanger,
							onClick: () => handleDelete(p.id),
							children: "🗑️ Delete"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("p", {
					style: {
						color: "#94a3b8",
						fontSize: "13px",
						margin: "0 0 8px"
					},
					children: [p.description.slice(0, 120), p.description.length > 120 ? "…" : ""]
				}),
				/* @__PURE__ */ jsx("div", { children: p.stack.map((s) => /* @__PURE__ */ jsx("span", {
					style: s.chip,
					children: s
				}, s)) })
			]
		}, p.id))
	] }) : editing && /* @__PURE__ */ jsxs("div", {
		style: s.card,
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					...s.row,
					justifyContent: "space-between",
					marginBottom: "20px"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "16px",
						fontWeight: "700"
					},
					children: projects.find((p) => p.id === editing.id) ? "Edit Project" : "New Project"
				}), /* @__PURE__ */ jsx("button", {
					style: s.btnGhost,
					onClick: () => {
						setShowForm(false);
						setEditing(null);
					},
					children: "← Cancel"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.fieldGroup,
				children: [/* @__PURE__ */ jsx("label", {
					style: s.label,
					children: "Project Title *"
				}), /* @__PURE__ */ jsx("input", {
					style: s.input,
					value: editing.title,
					onChange: (e) => setEditing({
						...editing,
						title: e.target.value
					}),
					placeholder: "My Awesome Project"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.grid3,
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: s.fieldGroup,
						children: [/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "Status"
						}), /* @__PURE__ */ jsxs("select", {
							style: s.input,
							value: editing.status,
							onChange: (e) => setEditing({
								...editing,
								status: e.target.value
							}),
							children: [
								/* @__PURE__ */ jsx("option", { children: "Completed" }),
								/* @__PURE__ */ jsx("option", { children: "In Progress" }),
								/* @__PURE__ */ jsx("option", { children: "Open Source" }),
								/* @__PURE__ */ jsx("option", { children: "Archived" })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.fieldGroup,
						children: [/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "Category"
						}), /* @__PURE__ */ jsx("input", {
							style: s.input,
							value: editing.category,
							onChange: (e) => setEditing({
								...editing,
								category: e.target.value
							}),
							placeholder: "Full Stack"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.fieldGroup,
						children: [/* @__PURE__ */ jsx("label", {
							style: s.label,
							children: "GitHub URL"
						}), /* @__PURE__ */ jsx("input", {
							style: s.input,
							value: editing.github ?? "",
							onChange: (e) => setEditing({
								...editing,
								github: e.target.value
							}),
							placeholder: "https://github.com/..."
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.fieldGroup,
				children: [/* @__PURE__ */ jsx("label", {
					style: s.label,
					children: "Live Demo URL"
				}), /* @__PURE__ */ jsx("input", {
					style: s.input,
					value: editing.demo ?? "",
					onChange: (e) => setEditing({
						...editing,
						demo: e.target.value
					}),
					placeholder: "https://..."
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.fieldGroup,
				children: [/* @__PURE__ */ jsx("label", {
					style: s.label,
					children: "Description *"
				}), /* @__PURE__ */ jsx("textarea", {
					style: {
						...s.textarea,
						minHeight: "90px"
					},
					value: editing.description,
					onChange: (e) => setEditing({
						...editing,
						description: e.target.value
					}),
					placeholder: "Describe your project..."
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.fieldGroup,
				children: [
					/* @__PURE__ */ jsx("label", {
						style: s.label,
						children: "Tags (for filtering)"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.row,
						children: [/* @__PURE__ */ jsx("input", {
							style: {
								...s.input,
								flex: 1
							},
							value: tagInput,
							onChange: (e) => setTagInput(e.target.value),
							placeholder: "Full Stack, AI, etc.",
							onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addTag())
						}), /* @__PURE__ */ jsx("button", {
							style: s.btnPrimary,
							onClick: addTag,
							children: "Add"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						style: { marginTop: "8px" },
						children: editing.tags.map((t) => /* @__PURE__ */ jsxs("span", {
							style: s.chip,
							children: [
								t,
								" ",
								/* @__PURE__ */ jsx("button", {
									style: s.chipRemove,
									onClick: () => removeTag(t),
									children: "×"
								})
							]
						}, t))
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.fieldGroup,
				children: [
					/* @__PURE__ */ jsx("label", {
						style: s.label,
						children: "Tech Stack"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.row,
						children: [/* @__PURE__ */ jsx("input", {
							style: {
								...s.input,
								flex: 1
							},
							value: stackInput,
							onChange: (e) => setStackInput(e.target.value),
							placeholder: "React.js, Node.js, etc.",
							onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addStack())
						}), /* @__PURE__ */ jsx("button", {
							style: s.btnPrimary,
							onClick: addStack,
							children: "Add"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						style: { marginTop: "8px" },
						children: editing.stack.map((t) => /* @__PURE__ */ jsxs("span", {
							style: s.chip,
							children: [
								t,
								" ",
								/* @__PURE__ */ jsx("button", {
									style: s.chipRemove,
									onClick: () => removeStack(t),
									children: "×"
								})
							]
						}, t))
					})
				]
			}),
			/* @__PURE__ */ jsx("button", {
				style: {
					...s.btnPrimary,
					marginTop: "8px"
				},
				onClick: handleSaveProject,
				children: "💾 Save Project"
			})
		]
	}) });
}
function SkillsTab({ data, onSave }) {
	const [skills, setSkills] = useState(data.skills);
	const [newCat, setNewCat] = useState("");
	const [itemInputs, setItemInputs] = useState({});
	function save(updated) {
		setSkills(updated);
		onSave({
			...data,
			skills: updated
		});
	}
	function addCategory() {
		if (!newCat.trim()) return;
		save([...skills, {
			id: uid(),
			category: newCat.trim(),
			items: []
		}]);
		setNewCat("");
	}
	function deleteCategory(id) {
		if (!confirm("Delete this skill category?")) return;
		save(skills.filter((s) => s.id !== id));
	}
	function addItem(id) {
		const val = itemInputs[id]?.trim();
		if (!val) return;
		save(skills.map((s) => s.id === id ? {
			...s,
			items: [...s.items, val]
		} : s));
		setItemInputs((prev) => ({
			...prev,
			[id]: ""
		}));
	}
	function removeItem(id, item) {
		save(skills.map((s) => s.id === id ? {
			...s,
			items: s.items.filter((i) => i !== item)
		} : s));
	}
	function updateCategoryName(id, name) {
		save(skills.map((s) => s.id === id ? {
			...s,
			category: name
		} : s));
	}
	return /* @__PURE__ */ jsxs("div", { children: [skills.map((sk) => /* @__PURE__ */ jsxs("div", {
		style: s.card,
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					...s.row,
					justifyContent: "space-between",
					marginBottom: "14px"
				},
				children: [/* @__PURE__ */ jsx("input", {
					style: {
						...s.input,
						fontWeight: "600",
						fontSize: "15px",
						width: "auto",
						flex: 1
					},
					value: sk.category,
					onChange: (e) => updateCategoryName(sk.id, e.target.value),
					placeholder: "Category name"
				}), /* @__PURE__ */ jsx("button", {
					style: s.btnDanger,
					onClick: () => deleteCategory(sk.id),
					children: "🗑️ Delete Category"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				style: { marginBottom: "10px" },
				children: sk.items.map((item) => /* @__PURE__ */ jsxs("span", {
					style: s.chip,
					children: [
						item,
						" ",
						/* @__PURE__ */ jsx("button", {
							style: s.chipRemove,
							onClick: () => removeItem(sk.id, item),
							children: "×"
						})
					]
				}, item))
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.row,
				children: [/* @__PURE__ */ jsx("input", {
					style: {
						...s.input,
						flex: 1
					},
					value: itemInputs[sk.id] ?? "",
					onChange: (e) => setItemInputs((prev) => ({
						...prev,
						[sk.id]: e.target.value
					})),
					placeholder: "Add a skill…",
					onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addItem(sk.id))
				}), /* @__PURE__ */ jsx("button", {
					style: s.btnPrimary,
					onClick: () => addItem(sk.id),
					children: "Add Skill"
				})]
			})
		]
	}, sk.id)), /* @__PURE__ */ jsxs("div", {
		style: {
			...s.card,
			background: "rgba(99,102,241,0.05)",
			border: "1px dashed rgba(99,102,241,0.3)"
		},
		children: [/* @__PURE__ */ jsx("div", {
			style: s.cardTitle,
			children: "➕ Add New Skill Category"
		}), /* @__PURE__ */ jsxs("div", {
			style: s.row,
			children: [/* @__PURE__ */ jsx("input", {
				style: {
					...s.input,
					flex: 1
				},
				value: newCat,
				onChange: (e) => setNewCat(e.target.value),
				placeholder: "e.g. DevOps, Mobile, Cloud...",
				onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addCategory())
			}), /* @__PURE__ */ jsx("button", {
				style: s.btnPrimary,
				onClick: addCategory,
				children: "Add Category"
			})]
		})]
	})] });
}
var emptyEdu = () => ({
	id: uid(),
	degree: "",
	institute: "",
	location: "",
	period: "",
	note: ""
});
function EducationTab({ data, onSave }) {
	const [education, setEducation] = useState(data.education);
	const [editing, setEditing] = useState(null);
	const [showForm, setShowForm] = useState(false);
	function openNew() {
		setEditing(emptyEdu());
		setShowForm(true);
	}
	function openEdit(e) {
		setEditing({ ...e });
		setShowForm(true);
	}
	function handleDelete(id) {
		if (!confirm("Delete this education entry?")) return;
		const updated = education.filter((e) => e.id !== id);
		setEducation(updated);
		onSave({
			...data,
			education: updated
		});
	}
	function handleSave() {
		if (!editing) return;
		const updated = education.find((e) => e.id === editing.id) ? education.map((e) => e.id === editing.id ? editing : e) : [...education, editing];
		setEducation(updated);
		onSave({
			...data,
			education: updated
		});
		setShowForm(false);
		setEditing(null);
	}
	return /* @__PURE__ */ jsx("div", { children: !showForm ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		style: {
			...s.row,
			justifyContent: "space-between",
			marginBottom: "16px"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				fontSize: "15px",
				fontWeight: "600"
			},
			children: [
				"Education Entries (",
				education.length,
				")"
			]
		}), /* @__PURE__ */ jsx("button", {
			style: s.btnPrimary,
			onClick: openNew,
			children: "+ Add Education"
		})]
	}), education.map((e) => /* @__PURE__ */ jsx("div", {
		style: s.projectCard,
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				...s.row,
				justifyContent: "space-between"
			},
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("div", {
					style: {
						fontWeight: "600",
						fontSize: "15px"
					},
					children: e.degree || "(Untitled)"
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						color: "#64748b",
						fontSize: "12px",
						marginTop: "2px"
					},
					children: [
						e.institute,
						" · ",
						e.location
					]
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						color: "#818cf8",
						fontSize: "12px",
						marginTop: "2px"
					},
					children: e.note
				})
			] }), /* @__PURE__ */ jsxs("div", {
				style: s.row,
				children: [
					/* @__PURE__ */ jsx("span", {
						style: {
							color: "#64748b",
							fontSize: "12px"
						},
						children: e.period
					}),
					/* @__PURE__ */ jsx("button", {
						style: s.btnSuccess,
						onClick: () => openEdit(e),
						children: "✏️ Edit"
					}),
					/* @__PURE__ */ jsx("button", {
						style: s.btnDanger,
						onClick: () => handleDelete(e.id),
						children: "🗑️ Delete"
					})
				]
			})]
		})
	}, e.id))] }) : editing && /* @__PURE__ */ jsxs("div", {
		style: s.card,
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					...s.row,
					justifyContent: "space-between",
					marginBottom: "20px"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "16px",
						fontWeight: "700"
					},
					children: education.find((e) => e.id === editing.id) ? "Edit Education" : "New Education"
				}), /* @__PURE__ */ jsx("button", {
					style: s.btnGhost,
					onClick: () => {
						setShowForm(false);
						setEditing(null);
					},
					children: "← Cancel"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.fieldGroup,
				children: [/* @__PURE__ */ jsx("label", {
					style: s.label,
					children: "Degree / Program *"
				}), /* @__PURE__ */ jsx("input", {
					style: s.input,
					value: editing.degree,
					onChange: (e) => setEditing({
						...editing,
						degree: e.target.value
					}),
					placeholder: "B.E. in Computer Science..."
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.grid2,
				children: [/* @__PURE__ */ jsxs("div", {
					style: s.fieldGroup,
					children: [/* @__PURE__ */ jsx("label", {
						style: s.label,
						children: "Institution *"
					}), /* @__PURE__ */ jsx("input", {
						style: s.input,
						value: editing.institute,
						onChange: (e) => setEditing({
							...editing,
							institute: e.target.value
						}),
						placeholder: "University Name"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: s.fieldGroup,
					children: [/* @__PURE__ */ jsx("label", {
						style: s.label,
						children: "Location"
					}), /* @__PURE__ */ jsx("input", {
						style: s.input,
						value: editing.location,
						onChange: (e) => setEditing({
							...editing,
							location: e.target.value
						}),
						placeholder: "City, Country"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.grid2,
				children: [/* @__PURE__ */ jsxs("div", {
					style: s.fieldGroup,
					children: [/* @__PURE__ */ jsx("label", {
						style: s.label,
						children: "Period"
					}), /* @__PURE__ */ jsx("input", {
						style: s.input,
						value: editing.period,
						onChange: (e) => setEditing({
							...editing,
							period: e.target.value
						}),
						placeholder: "2020 — 2024"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: s.fieldGroup,
					children: [/* @__PURE__ */ jsx("label", {
						style: s.label,
						children: "Grade / Note"
					}), /* @__PURE__ */ jsx("input", {
						style: s.input,
						value: editing.note,
						onChange: (e) => setEditing({
							...editing,
							note: e.target.value
						}),
						placeholder: "CGPA: 9.0 / 10"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("button", {
				style: {
					...s.btnPrimary,
					marginTop: "8px"
				},
				onClick: handleSave,
				children: "💾 Save Education"
			})
		]
	}) });
}
//#endregion
export { AdminPanel as component };
