import { useState, useEffect, useRef } from "react";

// ============ CONSTANTS ============
const COLORS = {
  bg: "#0a0f1e",
  bgCard: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  green: "#00d4aa",
  blue: "#0099ff",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.5)",
  dim: "rgba(255,255,255,0.08)",
};

const IELTS_QUESTIONS = {
  part1: [
    "Tell me about your hometown. What do you like about it?",
    "Do you work or are you a student?",
    "What do you enjoy doing in your free time?",
    "How often do you use the internet?",
    "Do you prefer spending time indoors or outdoors?",
    "What kind of music do you like?",
    "Tell me about your family.",
    "Do you enjoy cooking? Why or why not?",
  ],
  part2: [
    "Describe a person who has influenced you a lot. You should say: who this person is, how you know them, what qualities they have, and explain how they have influenced you.",
    "Describe a memorable journey you have taken. You should say: where you went, when you went, who you went with, and explain why it was memorable.",
    "Describe a skill you would like to learn. You should say: what the skill is, why you want to learn it, how you would learn it, and explain how useful it would be.",
    "Describe a book or film that had a big impact on you. You should say: what it was about, when you read/watched it, why you chose it, and explain how it affected you.",
  ],
  part3: [
    "How important is it for young people to learn a foreign language?",
    "Do you think technology has changed the way people communicate?",
    "What are the advantages and disadvantages of living in a big city?",
    "How do you think education will change in the future?",
    "Do you think people today have a better work-life balance than in the past?",
  ],
};

const CEFR_QUESTIONS = {
  A1: ["What is your name?", "How old are you?", "Where do you live?", "Do you have a pet?"],
  A2: ["What do you do on weekends?", "Describe your home.", "What is your favorite food?", "Tell me about your family."],
  B1: ["What are your plans for the future?", "Describe a problem you solved recently.", "What are the benefits of learning English?", "How has technology changed daily life?"],
  B2: ["Discuss the pros and cons of social media.", "How does globalization affect local cultures?", "What role should governments play in environmental protection?", "How do you think AI will change the workplace?"],
  C1: ["Analyze the impact of mass media on public opinion.", "Discuss ethical dilemmas in modern medicine.", "How do cultural differences affect international business?", "What are the long-term consequences of urbanization?"],
  C2: ["Critically evaluate the relationship between economic growth and environmental sustainability.", "Discuss the philosophical implications of artificial consciousness.", "How might quantum computing revolutionize cryptography and data security?"],
};

const VOCAB_WORDS = [
  { word: "Perseverance", uz: "Qat'iyat, chidamlilik", example: "Her perseverance helped her pass the IELTS exam.", phonetic: "/ˌpɜːsɪˈvɪərəns/" },
  { word: "Eloquent", uz: "Notiqlik, ravon nutq", example: "He gave an eloquent speech at the conference.", phonetic: "/ˈɛləkwənt/" },
  { word: "Ambiguous", uz: "Noaniq, ikki ma'noli", example: "The question was ambiguous, so I asked for clarification.", phonetic: "/æmˈbɪɡjuəs/" },
  { word: "Substantial", uz: "Sezilarli, katta", example: "There has been substantial improvement in your speaking.", phonetic: "/səbˈstænʃəl/" },
  { word: "Inevitable", uz: "Muqarrar, oldini bo'lmas", example: "Change is inevitable in any growing city.", phonetic: "/ɪnˈɛvɪtəbl/" },
  { word: "Phenomenon", uz: "Hodisa, fenomen", example: "Social media is a global phenomenon.", phonetic: "/fɪˈnɒmɪnən/" },
  { word: "Skeptical", uz: "Shubhali, ishonchsiz", example: "I am skeptical about his claims.", phonetic: "/ˈskɛptɪkəl/" },
  { word: "Controversial", uz: "Bahsli, munozarali", example: "This is a very controversial topic.", phonetic: "/ˌkɒntrəˈvɜːʃəl/" },
  { word: "Eloquence", uz: "Notiqlik qobiliyati", example: "Her eloquence impressed the examiners.", phonetic: "/ˈɛləkwəns/" },
  { word: "Simultaneously", uz: "Bir vaqtda", example: "He can do two things simultaneously.", phonetic: "/ˌsɪməlˈteɪniəsli/" },
  { word: "Deteriorate", uz: "Yomonlashmoq", example: "Air quality continues to deteriorate in big cities.", phonetic: "/dɪˈtɪəriəreɪt/" },
  { word: "Collaborate", uz: "Hamkorlik qilmoq", example: "We need to collaborate to solve this problem.", phonetic: "/kəˈlæbəreɪt/" },
];

const MBTI_QUESTIONS = [
  { q: "Yangi odamlar bilan tanishish sizga...", a: ["Energiya beradi", "Charchatadi"], keys: ["E", "I"] },
  { q: "Muammo chiqsa avval...", a: ["Faktlarga qarayman", "His-tuyg'uga qarayman"], keys: ["T", "F"] },
  { q: "Siz odatda...", a: ["Reja tuzib harakat qilaman", "Vaziyatga qarab harakat qilaman"], keys: ["J", "P"] },
  { q: "Ma'lumot olishda...", a: ["Aniq faktlarga e'tibor beraman", "Umumiy rasmni ko'raman"], keys: ["S", "N"] },
];

const BADGES = [
  { icon: "🔥", name: "First Streak", desc: "7 kun ketma-ket" },
  { icon: "🎓", name: "IELTS Ready", desc: "Mock exam yakunlandi" },
  { icon: "💀", name: "Savage Survivor", desc: "Savage modeda 10 mashq" },
  { icon: "🦉", name: "Night Owl", desc: "Midnight mode ishlatildi" },
  { icon: "🤫", name: "Silent Hero", desc: "Silent modeda mashq" },
  { icon: "📚", name: "Word Collector", desc: "50 ta so'z saqlandi" },
];

// ============ UTILS ============
function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  }
}

function FloatingOrb({ style }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", opacity: 0.12, pointerEvents: "none", ...style }} />;
}

function Btn({ children, onClick, variant = "primary", style = {} }) {
  const base = {
    padding: "10px 24px", borderRadius: "25px", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", border: "none",
    transition: "all 0.2s", ...style,
  };
  const styles = {
    primary: { background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.blue})`, color: "#0a0f1e" },
    outline: { background: "transparent", border: `1px solid ${COLORS.green}50`, color: COLORS.green },
    ghost: { background: "rgba(255,255,255,0.05)", color: COLORS.text },
    danger: { background: "linear-gradient(135deg, #ff4d4d, #ff8c00)", color: "#fff" },
  };
  return <button onClick={onClick} style={{ ...base, ...styles[variant] }}>{children}</button>;
}

function Card({ children, style = {}, hover = true }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        borderRadius: "16px", padding: "1.5rem",
        transition: "all 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
        ...style,
      }}
    >{children}</div>
  );
}

// ============ SIDEBAR ============
function Sidebar({ page, setPage, persona, setPersona, collapsed, setCollapsed }) {
  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "practice", icon: "💬", label: "AI Practice" },
    { id: "ielts", icon: "🇬🇧", label: "IELTS Exam" },
    { id: "cefr", icon: "🇺🇿", label: "CEFR Exam" },
    { id: "firststeps", icon: "🌱", label: "First Steps" },
    { id: "vocab", icon: "📖", label: "Vocabulary" },
    { id: "games", icon: "🎮", label: "Mini-Games" },
    { id: "midnight", icon: "🌙", label: "Midnight Mode" },
    { id: "stats", icon: "📈", label: "Analytics" },
  ];

  return (
    <div style={{
      width: collapsed ? 64 : 220, minHeight: "100vh",
      background: "rgba(0,0,0,0.4)", borderRight: `1px solid ${COLORS.border}`,
      display: "flex", flexDirection: "column", padding: "1rem 0",
      transition: "width 0.3s", flexShrink: 0,
      backdropFilter: "blur(20px)", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 1rem 1rem", borderBottom: `1px solid ${COLORS.border}`, marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => setCollapsed(!collapsed)}>
          <div style={{
            width: 36, height: 36, borderRadius: "10px",
            background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.blue})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: "bold", color: "#0a0f1e", flexShrink: 0,
          }}>M</div>
          {!collapsed && <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.1rem", fontWeight: 700, background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MiaSpeaking</span>}
        </div>
      </div>

      {/* Persona Toggle */}
      {!collapsed && (
        <div style={{ padding: "0 1rem 1rem", borderBottom: `1px solid ${COLORS.border}`, marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.7rem", color: COLORS.muted, marginBottom: "8px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px" }}>AI MODE</div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "3px" }}>
            {[{ id: "angel", label: "😇 Angel" }, { id: "savage", label: "💀 Savage" }].map(m => (
              <button key={m.id} onClick={() => setPersona(m.id)} style={{
                flex: 1, padding: "6px", borderRadius: "17px", border: "none", cursor: "pointer",
                background: persona === m.id ? (m.id === "savage" ? "linear-gradient(135deg,#ff4d4d,#ff8c00)" : `linear-gradient(135deg,${COLORS.green},${COLORS.blue})`) : "transparent",
                color: persona === m.id ? (m.id === "savage" ? "#fff" : "#0a0f1e") : COLORS.muted,
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, transition: "all 0.3s",
              }}>{m.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Nav */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {navItems.map(item => (
          <div key={item.id} onClick={() => setPage(item.id)} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: collapsed ? "12px" : "10px 1rem", margin: "2px 8px",
            borderRadius: "10px", cursor: "pointer",
            background: page === item.id ? `linear-gradient(135deg, ${COLORS.green}20, ${COLORS.blue}20)` : "transparent",
            borderLeft: page === item.id ? `2px solid ${COLORS.green}` : "2px solid transparent",
            transition: "all 0.2s",
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: page === item.id ? COLORS.green : COLORS.muted, fontWeight: page === item.id ? 600 : 400 }}>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* User */}
      <div style={{ padding: "1rem", borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>U</div>
        {!collapsed && <div><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: COLORS.text, fontWeight: 600 }}>Foydalanuvchi</div><div style={{ fontSize: "0.7rem", color: COLORS.green }}>B1 • 7 streak 🔥</div></div>}
      </div>
    </div>
  );
}

// ============ PAGES ============

// LANDING PAGE
function LandingPage({ setPage, setAuthMode }) {
  const [persona, setPersona] = useState("angel");
  const [typed, setTyped] = useState("");
  const msgs = {
    angel: "Great effort! You said 'I go yesterday' — let's gently fix that to 'I went yesterday'. You're doing wonderfully! 😇✨",
    savage: "POTATO ALERT! 🥔 'I go yesterday'?? Yesterday is PAST tense, my beautiful disaster! It's 'I WENT' — now say it like you mean it! 💀🔥",
  };

  useEffect(() => {
    const msg = msgs[persona]; let i = 0; setTyped("");
    const t = setInterval(() => { if (i < msg.length) { setTyped(msg.slice(0, ++i)); } else clearInterval(t); }, 25);
    return () => clearInterval(t);
  }, [persona]);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, overflowX: "hidden" }}>
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 3rem", borderBottom: `1px solid ${COLORS.border}`, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, background: "rgba(10,15,30,0.9)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "10px", background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", color: "#0a0f1e" }}>M</div>
          <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.3rem", fontWeight: 700, background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MiaSpeaking</span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Btn variant="ghost" onClick={() => setAuthMode("login")}>Kirish</Btn>
          <Btn onClick={() => setAuthMode("register")}>Bepul Boshlash →</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <FloatingOrb style={{ width: 500, height: 500, background: COLORS.green, top: "5%", left: "-10%" }} />
        <FloatingOrb style={{ width: 400, height: 400, background: COLORS.blue, bottom: "5%", right: "-5%" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 18px", borderRadius: "20px", border: `1px solid ${COLORS.green}40`, background: `${COLORS.green}08`, marginBottom: "2rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: COLORS.green }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, display: "inline-block" }} />
          Bepul · Limitssiz · O'zbekcha · PWA
        </div>

        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1.5rem" }}>
          <span style={{ color: "#fff" }}>Speak English.</span><br />
          <span style={{ background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Get Smarter.</span>
        </h1>

        <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "1.1rem", maxWidth: 600, marginBottom: "3rem", lineHeight: 1.7 }}>
          IELTS · CEFR · DTM · A0 dan C2 gacha. Angel yoki Savage AI bilan mashq qiling. Mutlaqo bepul, hech qanday cheklov yo'q.
        </p>

        {/* Persona Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem", background: "rgba(255,255,255,0.05)", padding: "8px 20px", borderRadius: "30px", border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", color: persona === "angel" ? COLORS.green : COLORS.muted, fontSize: "0.9rem", transition: "color 0.3s" }}>😇 Angel</span>
          <div onClick={() => setPersona(p => p === "angel" ? "savage" : "angel")} style={{ width: 52, height: 28, borderRadius: 14, cursor: "pointer", background: persona === "savage" ? "linear-gradient(90deg,#ff4d4d,#ff8c00)" : `linear-gradient(90deg,${COLORS.green},${COLORS.blue})`, position: "relative", transition: "background 0.3s" }}>
            <div style={{ position: "absolute", top: 3, left: persona === "savage" ? 27 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left 0.3s" }} />
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", color: persona === "savage" ? "#ff6b6b" : COLORS.muted, fontSize: "0.9rem", transition: "color 0.3s" }}>💀 Savage</span>
        </div>

        {/* Chat Preview */}
        <div style={{ maxWidth: 560, width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${persona === "savage" ? "#ff6b6b40" : `${COLORS.green}30`}`, borderRadius: "16px", padding: "1.5rem", marginBottom: "3rem", textAlign: "left", backdropFilter: "blur(10px)", transition: "border 0.3s" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: persona === "savage" ? "linear-gradient(135deg,#ff4d4d,#ff8c00)" : `linear-gradient(135deg,${COLORS.green},${COLORS.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{persona === "savage" ? "💀" : "😇"}</div>
            <div><div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#fff", fontSize: "0.9rem" }}>Mia AI — {persona === "savage" ? "Savage Mode" : "Angel Mode"}</div><div style={{ fontSize: "0.7rem", color: COLORS.green }}>● Online</div></div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px 14px", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: COLORS.muted }}>"Yesterday I go to the market and buyed some food..."</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: persona === "savage" ? "#ff8c8c" : COLORS.green, lineHeight: 1.6, minHeight: 60 }}>{typed}<span style={{ animation: "blink 1s infinite" }}>|</span></div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Btn onClick={() => setAuthMode("register")} style={{ padding: "14px 40px", fontSize: "1rem", boxShadow: `0 0 40px ${COLORS.green}40` }}>Bepul Boshlash →</Btn>
          <Btn variant="outline" onClick={() => setAuthMode("login")} style={{ padding: "14px 40px", fontSize: "1rem" }}>Kirish</Btn>
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", padding: "3rem", borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, maxWidth: 900, margin: "0 auto" }}>
        {[["A1→C2","Barcha darajalar"],["∞","Limitssiz mashq"],["0$","Mutlaqo bepul"],["16+","MBTI tip"]].map(([v,l],i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "2.5rem", fontWeight: 700, background: `linear-gradient(90deg,${COLORS.green},${COLORS.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem", marginTop: "4px" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      
