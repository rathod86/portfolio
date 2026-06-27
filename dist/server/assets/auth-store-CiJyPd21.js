//#region src/lib/portfolio-store.ts
var DEFAULT_DATA = {
	profile: {
		name: "Abhishek Rathod",
		tagline: "Hi, I'm",
		bio1: "I'm Abhishek Rathod, a Computer Science and Engineering student at RV University with a strong passion for software development and problem-solving. I specialize in Java, React.js, Node.js, JDBC and MySQL, with a growing interest in full-stack web development and modern software engineering practices.",
		bio2: "I love turning ideas into clean, performant products — from designing intuitive UIs to architecting reliable backends.",
		location: "Bengaluru, India",
		domain: "Software Development",
		focus: "Full Stack Web",
		email: "abhishekrathod59078@gmail.com",
		linkedin: "https://www.linkedin.com/in/abhishek-rathod-741a86333/",
		github: "https://github.com/rathod86",
		profileImageUrl: "https://www.image2url.com/r2/default/images/1782275156792-a633553d-d828-43b1-828f-d878b1d3f7ae.jpeg",
		resumeUrl: "#",
		typingWords: [
			"Developer",
			"Full Stack Developer",
			"Problem Solver"
		],
		availableForWork: true
	},
	projects: [{
		id: "proj-1",
		title: "Agrislove — AI-Powered Agriculture Platform",
		status: "Completed",
		category: "Full Stack",
		tags: ["Full Stack", "AI"],
		description: "AI-powered agriculture platform assisting farmers with crop recommendations, disease detection, weather forecasting and market analysis through an intuitive interface.",
		stack: [
			"React.js",
			"JavaScript",
			"MySQL",
			"HTML",
			"CSS"
		],
		github: "https://github.com/rathod86/agrislove"
	}],
	skills: [
		{
			id: "sk-1",
			category: "Frontend",
			items: [
				"React",
				"HTML",
				"CSS"
			]
		},
		{
			id: "sk-2",
			category: "Backend",
			items: [
				"Java",
				"Spring Boot",
				"Node.js"
			]
		},
		{
			id: "sk-3",
			category: "Databases",
			items: ["MySQL"]
		},
		{
			id: "sk-4",
			category: "Tools",
			items: ["Git"]
		},
		{
			id: "sk-5",
			category: "AI Tools",
			items: ["ChatGPT"]
		}
	],
	education: [
		{
			id: "edu-1",
			degree: "B.E. in Computer Science and Engineering",
			institute: "RV University",
			location: "Bengaluru, India",
			period: "2022 — 2026",
			note: "CGPA: 7.97 / 10"
		},
		{
			id: "edu-2",
			degree: "PUC",
			institute: "AKR Devi PU College",
			location: "Kalaburgi, India",
			period: "2020 — 2022",
			note: "Percentage: 81%"
		},
		{
			id: "edu-3",
			degree: "Secondary School Leaving Certificate",
			institute: "Shramjeevi Residential High School",
			location: "Bidar, India",
			period: "2018 — 2020",
			note: "Percentage: 75.84%"
		}
	]
};
var STORAGE_KEY = "abhishek_portfolio_data";
function loadPortfolioData() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_DATA;
		const parsed = JSON.parse(raw);
		return {
			profile: {
				...DEFAULT_DATA.profile,
				...parsed.profile
			},
			projects: parsed.projects ?? DEFAULT_DATA.projects,
			skills: parsed.skills ?? DEFAULT_DATA.skills,
			education: parsed.education ?? DEFAULT_DATA.education
		};
	} catch {
		return DEFAULT_DATA;
	}
}
function savePortfolioData(data) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		window.dispatchEvent(new CustomEvent("portfolio-updated", { detail: data }));
	} catch (err) {
		console.error("Failed to save data to localStorage:", err);
		alert("Failed to save changes. Your uploaded image might be too large for the browser to store. Please try a smaller image.");
	}
}
function uid() {
	return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
//#endregion
//#region src/lib/auth-store.ts
var AUTH_SESSION_KEY = "admin_auth";
/**
* Validates password strength.
* Returns an object indicating which rules pass (true = valid).
*/
function validatePassword(password) {
	return {
		length: password.length > 6,
		letter: /[a-zA-Z]/.test(password),
		number: /[0-9]/.test(password),
		special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)
	};
}
/**
* Returns true if all password rules pass.
*/
function isPasswordValid(password) {
	const v = validatePassword(password);
	return v.length && v.letter && v.number && v.special;
}
async function hashPassword(password) {
	const data = new TextEncoder().encode(password + "_portfolio_salt_2024");
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var ADMIN_AUTH_DATA_KEY = "abhishek_portfolio_admin_data";
/**
* Check if admin credentials have been set up.
*/
function isAuthSetUp() {
	return !!localStorage.getItem(ADMIN_AUTH_DATA_KEY);
}
/**
* Check if the admin is currently logged in (session-based).
*/
function isAdminLoggedIn() {
	return sessionStorage.getItem(AUTH_SESSION_KEY) === "1";
}
/**
* Mark the admin as logged in for this session.
*/
function loginAdmin() {
	sessionStorage.setItem(AUTH_SESSION_KEY, "1");
}
/**
* Log out the admin (clears session).
*/
function logoutAdmin() {
	sessionStorage.removeItem(AUTH_SESSION_KEY);
}
var isPasswordSetUp = isAuthSetUp;
async function setAdminPassword(pwd) {
	if (!isPasswordValid(pwd)) return false;
	const hashed = await hashPassword(pwd);
	const data = JSON.stringify({ hash: hashed });
	localStorage.setItem(ADMIN_AUTH_DATA_KEY, data);
	return true;
}
async function verifyPassword(pwd) {
	const storedStr = localStorage.getItem(ADMIN_AUTH_DATA_KEY);
	if (!storedStr) return false;
	const stored = JSON.parse(storedStr);
	return await hashPassword(pwd) === stored.hash;
}
//#endregion
export { logoutAdmin as a, verifyPassword as c, savePortfolioData as d, uid as f, loginAdmin as i, DEFAULT_DATA as l, isPasswordSetUp as n, setAdminPassword as o, isPasswordValid as r, validatePassword as s, isAdminLoggedIn as t, loadPortfolioData as u };
