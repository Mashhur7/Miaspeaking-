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
      <section style={{ padding: "5rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: "3rem" }}>Barcha Funksiyalar</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.5rem" }}>
          {[
            ["🎭","Dual AI Personas","Angel Mode yoki Savage Mode — siz tanlaysiz!"],
            ["🏛️","IELTS & CEFR Exam","Haqiqiy imtihon formatida to'liq simulyatsiya"],
            ["🌱","First Steps (A0)","Umuman gapira olmasangiz ham, biz bilan boshlang"],
            ["🧠","MBTI Adaptation","AI sizning xarakter tipingizga moslashadi"],
            ["📖","Vocabulary Bank","So'zlar + O'zbekcha + Audio talaffuz"],
            ["🌙","Midnight Mode","Istalgan vaqt — bosimsiz, sokin suhbat"],
            ["🎮","Mini-Games","Taboo va Anti-Eee bilan o'ynab o'rganing"],
            ["🎙️","Ovozli Tahlil","AI xatolaringizni ovoz chiqarib tushuntiradi"],
            ["📱","PWA Ilova","Telefonga o'rnatib, offline ishlating"],
          ].map(([icon,title,desc],i) => (
            <Card key={i}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{icon}</div>
              <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", fontSize: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem", lineHeight: 1.6 }}>{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 2rem", textAlign: "center", position: "relative" }}>
        <FloatingOrb style={{ width: 600, height: 600, background: COLORS.green, top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.06 }} />
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Bugun Boshlang</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "2rem" }}>Bepul. Limitssiz. Hoziroq.</p>
        <Btn onClick={() => setAuthMode("register")} style={{ padding: "16px 48px", fontSize: "1.1rem", boxShadow: `0 0 60px ${COLORS.green}40` }}>Bepul Ro'yxatdan O'tish →</Btn>
        <div style={{ marginTop: "1rem", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>Google yoki Email • Kredit karta shart emas • Reklama yo'q</div>
      </section>
    </div>
  );
}

// AUTH PAGE
function AuthPage({ mode, setMode, onSuccess }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(mode === "register" ? 0 : -1);
  const [mbti, setMbti] = useState({});
  const [qIdx, setQIdx] = useState(0);
  const [fear, setFear] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");

  const handleAuth = () => {
    if (mode === "login") { onSuccess(); return; }
    if (step === 0) setStep(1); // MBTI
    else if (step === 1 && qIdx < MBTI_QUESTIONS.length - 1) setQIdx(q => q + 1);
    else if (step === 1) setStep(2); // Fear
    else if (step === 2) setStep(3); // Goal
    else if (step === 3) setStep(4); // Level
    else onSuccess();
  };

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative" }}>
      <FloatingOrb style={{ width: 400, height: 400, background: COLORS.green, top: "10%", left: "10%" }} />
      <FloatingOrb style={{ width: 300, height: 300, background: COLORS.blue, bottom: "10%", right: "10%" }} />

      <div style={{ width: "100%", maxWidth: 440, background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "2.5rem", backdropFilter: "blur(20px)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, background: `linear-gradient(90deg,${COLORS.green},${COLORS.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" }}>MiaSpeaking</div>

          {step === -1 && <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted }}>Hisobingizga kiring</div>}
          {step === 0 && <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted }}>Ro'yxatdan o'ting</div>}
          {step === 1 && <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted }}>Shaxsiyat testingiz — {qIdx + 1}/{MBTI_QUESTIONS.length}</div>}
          {step === 2 && <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted }}>Nimadan qo'rqasiz?</div>}
          {step === 3 && <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted }}>Maqsadingiz nima?</div>}
          {step === 4 && <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted }}>Hozirgi darajangiz?</div>}
        </div>

        {/* Login */}
        {step === -1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={inputStyle} type="password" placeholder="Parol" value={pass} onChange={e => setPass(e.target.value)} />
            <Btn onClick={handleAuth} style={{ width: "100%", padding: "12px" }}>Kirish</Btn>
            <button onClick={() => onSuccess()} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "12px", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>🔵 Google bilan kirish</button>
            <div style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem" }}>
              Hisob yo'qmi? <span onClick={() => { setMode("register"); setStep(0); }} style={{ color: COLORS.green, cursor: "pointer" }}>Ro'yxatdan o'ting</span>
            </div>
          </div>
        )}

        {/* Register step 0 */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input style={inputStyle} placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)} />
            <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={inputStyle} type="password" placeholder="Parol" value={pass} onChange={e => setPass(e.target.value)} />
            <Btn onClick={handleAuth} style={{ width: "100%", padding: "12px" }}>Davom etish →</Btn>
            <button onClick={() => onSuccess()} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "12px", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🔵 Google bilan kirish</button>
            <div style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem" }}>
              Hisobingiz bormi? <span onClick={() => { setMode("login"); setStep(-1); }} style={{ color: COLORS.green, cursor: "pointer" }}>Kirish</span>
            </div>
          </div>
        )}

        {/* MBTI */}
        {step === 1 && (
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#fff", fontSize: "1rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>{MBTI_QUESTIONS[qIdx].q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {MBTI_QUESTIONS[qIdx].a.map((a, i) => (
                <button key={i} onClick={() => { setMbti(m => ({ ...m, [MBTI_QUESTIONS[qIdx].keys[i]]: true })); handleAuth(); }} style={{ padding: "14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", textAlign: "left", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.borderColor = COLORS.green; e.target.style.background = `${COLORS.green}15`; }}
                  onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                >{a}</button>
              ))}
            </div>
          </div>
        )}

        {/* Fear */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["Og'iz ochishdan qo'rqaman","Xato qilishdan qo'rqaman","Aksent dan uyalaman","Imtihonda muzlayman","Hech qanday qo'rquvim yo'q"].map(f => (
              <button key={f} onClick={() => { setFear(f); setStep(3); }} style={{ padding: "12px 16px", borderRadius: "10px", background: fear === f ? `${COLORS.green}20` : "rgba(255,255,255,0.05)", border: `1px solid ${fear === f ? COLORS.green : COLORS.border}`, color: fear === f ? COLORS.green : "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", textAlign: "left", transition: "all 0.2s" }}>{f}</button>
            ))}
          </div>
        )}

        {/* Goal */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["IELTS 6.0+ olish","IELTS 7.0+ olish","CEFR B2 darajasi","CEFR C1 darajasi","Kundalik suhbat","Biznes ingliz tili"].map(g => (
              <button key={g} onClick={() => { setGoal(g); setStep(4); }} style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", textAlign: "left", transition: "all 0.2s" }}
                onMouseEnter={e => { e.target.style.borderColor = COLORS.green; }}
                onMouseLeave={e => { e.target.style.borderColor = COLORS.border; }}
              >{g}</button>
            ))}
          </div>
        )}

        {/* Level */}
        {step === 4 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {["A0 - Yangi boshlovchi","A1 - Boshlang'ich","A2 - Elementar","B1 - O'rta","B2 - O'rta-yuqori","C1 - Ilg'or","C2 - Profissional","Bilmayman"].map(l => (
              <button key={l} onClick={() => { setLevel(l); onSuccess(); }} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", transition: "all 0.2s" }}
                onMouseEnter={e => { e.target.style.borderColor = COLORS.green; e.target.style.background = `${COLORS.green}15`; }}
                onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.background = "rgba(255,255,255,0.05)"; }}
              >{l}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// DASHBOARD
function Dashboard({ setPage }) {
  const mistakes = [
    { type: "Past Simple", count: 23, color: "#ff6b6b" },
    { type: "Articles (a/an/the)", count: 18, color: "#ffa500" },
    { type: "Prepositions", count: 15, color: "#ffdd57" },
    { type: "Present Perfect", count: 12, color: COLORS.green },
    { type: "Conditionals", count: 8, color: COLORS.blue },
  ];
  const maxCount = Math.max(...mistakes.map(m => m.count));

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>Dashboard</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "2rem" }}>Xush kelibsiz! Bugungi maqsadingizga davom eting. 🚀</p>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { icon: "🔥", val: "7", label: "Kun streak", color: "#ff6b6b" },
          { icon: "⭐", val: "1,240", label: "XP ball", color: "#ffd700" },
          { icon: "📊", val: "B1", label: "CEFR daraja", color: COLORS.green },
          { icon: "🎯", val: "5.5", label: "IELTS taxmin", color: COLORS.blue },
          { icon: "📚", val: "47", label: "So'z saqlandi", color: "#a78bfa" },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "1.2rem" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.8rem" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Progress Ring */}
        <Card>
          <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "1.5rem" }}>Kunlik Maqsad</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <svg width={100} height={100} viewBox="0 0 100 100">
              <circle cx={50} cy={50} r={42} fill="none" stroke={COLORS.dim} strokeWidth={8} />
              <circle cx={50} cy={50} r={42} fill="none" stroke={COLORS.green} strokeWidth={8} strokeDasharray={`${2 * Math.PI * 42 * 0.65} ${2 * Math.PI * 42 * 0.35}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x={50} y={55} textAnchor="middle" fill="#fff" fontSize={18} fontFamily="sans-serif" fontWeight="bold">65%</text>
            </svg>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#fff", marginBottom: "0.5rem" }}>20/30 daqiqa</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem" }}>10 daqiqa qoldi</div>
              <Btn onClick={() => {}} style={{ marginTop: "1rem", padding: "8px 16px", fontSize: "0.8rem" }}>Davom etish</Btn>
            </div>
          </div>
        </Card>

        {/* Mistakes Analytics */}
        <Card>
          <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "1.5rem" }}>Xatolar Tahlili</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {mistakes.map((m, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.8rem" }}>{m.type}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", color: m.color, fontSize: "0.8rem", fontWeight: 600 }}>{m.count}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: COLORS.dim, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: m.color, width: `${(m.count / maxCount) * 100}%`, transition: "width 1s" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Badges */}
      <Card style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "1.5rem" }}>Medallari 🏆</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{ textAlign: "center", opacity: i < 3 ? 1 : 0.3 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: i < 3 ? `linear-gradient(135deg,${COLORS.green},${COLORS.blue})` : COLORS.dim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 0.5rem" }}>{b.icon}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: i < 3 ? "#fff" : COLORS.muted }}>{b.name}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "1rem" }}>Tezkor Kirish</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1rem" }}>
        {[
          { icon: "💬", label: "AI Practice", page: "practice", color: COLORS.green },
          { icon: "🇬🇧", label: "IELTS Exam", page: "ielts", color: COLORS.blue },
          { icon: "🇺🇿", label: "CEFR Exam", page: "cefr", color: "#a78bfa" },
          { icon: "🌱", label: "First Steps", page: "firststeps", color: "#ffa500" },
          { icon: "📖", label: "Vocabulary", page: "vocab", color: "#ff6b6b" },
          { icon: "🎮", label: "Mini-Games", page: "games", color: "#ffd700" },
        ].map((q, i) => (
          <div key={i} onClick={() => setPage(q.page)} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "1.2rem", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{q.icon}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#fff" }}>{q.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// AI PRACTICE
function PracticePage({ persona }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: persona === "savage" ? "Yooo, let's GET IT! 💀 Ready to embarrass yourself? Just kidding... maybe. Speak up, potato! 🥔" : "Hello! I'm so happy you're here today! 😇 Let's have a wonderful conversation. What would you like to talk about?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input; setInput(""); setLoading(true);
    setMessages(m => [...m, { role: "user", text: userMsg }]);

    const systemPrompt = persona === "savage"
      ? `You are Mia, a savage but loving English tutor. You roast the student's mistakes with funny insults like "potato", "beautiful disaster", "slacker", "donut" but ALWAYS teach the correct form right after. Use lots of emojis 😂💀🔥. If they write in Uzbek, respond with funny Uzbek pings too. Keep it fun and educational. Also provide grammar feedback.`
      : `You are Mia, a gentle and encouraging English tutor. You correct mistakes very softly and always praise the student. Be warm, supportive and motivating. 😇✨ Provide clear grammar explanations. If asked, explain in Uzbek too.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.filter(m => m.role !== "ai" || messages.indexOf(m) === 0).map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
            { role: "user", content: userMsg }
          ],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Hmm, something went wrong. Try again!";
      setMessages(m => [...m, { role: "ai", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Connection error! Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ height: "calc(100vh - 0px)", display: "flex", flexDirection: "column", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>AI Practice</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem" }}>{persona === "savage" ? "💀 Savage Mode — tayyor bo'ling!" : "😇 Angel Mode — xavfsiz muhit"}</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["en","uz"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "6px 14px", borderRadius: "15px", border: `1px solid ${lang===l?COLORS.green:COLORS.border}`, background: lang===l?`${COLORS.green}20`:"transparent", color: lang===l?COLORS.green:"#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem" }}>{l === "en" ? "🇬🇧 EN" : "🇺🇿 UZ"}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "1rem" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "10px", alignItems: "flex-start" }}>
            {m.role === "ai" && <div style={{ width: 36, height: 36, borderRadius: "50%", background: persona === "savage" ? "linear-gradient(135deg,#ff4d4d,#ff8c00)" : `linear-gradient(135deg,${COLORS.green},${COLORS.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{persona === "savage" ? "💀" : "😇"}</div>}
            <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? `linear-gradient(135deg,${COLORS.green},${COLORS.blue})` : "rgba(255,255,255,0.06)", border: m.role === "ai" ? `1px solid ${COLORS.border}` : "none", color: m.role === "user" ? "#0a0f1e" : "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {m.text}
              {m.role === "ai" && <button onClick={() => speak(m.text)} style={{ display: "block", marginTop: "8px", background: "none", border: "none", color: COLORS.green, cursor: "pointer", fontSize: "0.75rem" }}>🔊 Eshitish</button>}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${COLORS.green},${COLORS.blue})`, display: "flex", alignItems: "center", justifyContent: "center" }}>😇</div>
            <div style={{ padding: "12px 16px", borderRadius: "16px", background: "rgba(255,255,255,0.06)", border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", gap: "4px" }}>{[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, animation: `bounce 1s ${i*0.2}s infinite` }} />)}</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: `1px solid ${COLORS.border}` }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Inglizcha yozing..." style={{ flex: 1, padding: "12px 16px", borderRadius: "25px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", outline: "none", fontSize: "0.9rem" }} />
        <button onClick={sendMessage} disabled={loading} style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${COLORS.green},${COLORS.blue})`, border: "none", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
      </div>
    </div>
  );
}

// IELTS PAGE
function IELTSPage({ persona }) {
  const [part, setPart] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [prepTimer, setPrepTimer] = useState(60);
  const [prepActive, setPrepActive] = useState(false);
  const [notes, setNotes] = useState("");
  const [phase, setPhase] = useState("question"); // question | prep | speaking | feedback

  useEffect(() => {
    if (!timerActive) return;
    const t = setInterval(() => setTimer(x => x > 0 ? x - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [timerActive]);

  useEffect(() => {
    if (!prepActive) return;
    const t = setInterval(() => setPrepTimer(x => { if (x <= 1) { setPrepActive(false); setPhase("speaking"); setTimer(120); setTimerActive(true); return 0; } return x - 1; }), 1000);
    return () => clearInterval(t);
  }, [prepActive]);

  const getQuestion = () => {
    const key = part === 1 ? "part1" : part === 2 ? "part2" : "part3";
    return IELTS_QUESTIONS[key][qIndex % IELTS_QUESTIONS[key].length];
  };

  const getFeedback = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const isSavage = persona === "savage";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `You are an IELTS examiner. ${isSavage ? "Be funny and roast mistakes like Gordon Ramsay but still be educational. Use emojis." : "Be professional and encouraging."} 
          
Question (Part ${part}): "${getQuestion()}"
Student answer: "${answer}"

Provide:
1. IELTS Band Score (estimate)
2. Grammar corrections
3. Vocabulary suggestions  
4. Fluency tips
5. ${isSavage ? "A funny roast of their mistakes 😂" : "Encouraging feedback"}
Also give O'zbek tili da qisqa izoh.` }],
        }),
      });
      const data = await res.json();
      setFeedback(data.content?.[0]?.text || "");
      setPhase("feedback");
    } catch { setFeedback("Error getting feedback. Try again!"); }
    setLoading(false);
  };

  if (!part) return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>🇬🇧 IELTS Speaking</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "3rem" }}>Haqiqiy IELTS imtihon formatida mashq qiling</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
        {[
          { part: 1, title: "Part 1 — Introduction", desc: "Shaxsiy savollar: oila, hobby, ish, uy...", time: "4-5 daqiqa", color: COLORS.green },
          { part: 2, title: "Part 2 — Long Turn", desc: "Cue card: 1 daqiqa tayyorgarlik + 2 daqiqa gapirish", time: "3-4 daqiqa", color: COLORS.blue },
          { part: 3, title: "Part 3 — Discussion", desc: "Chuqur muhokama va abstract savollar", time: "4-5 daqiqa", color: "#a78bfa" },
        ].map(p => (
          <Card key={p.part} style={{ cursor: "pointer", border: `1px solid ${p.color}30` }} onClick={() => { setPart(p.part); setPhase("question"); setQIndex(0); setAnswer(""); setFeedback(""); }}>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: p.color, marginBottom: "0.5rem" }}>{p.title}</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.875rem", marginBottom: "1rem" }}>{p.desc}</p>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: p.color }}>⏱ {p.time}</div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: 700 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button onClick={() => setPart(null)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "8px 14px", color: COLORS.muted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Orqaga</button>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", fontSize: "1.3rem" }}>IELTS Part {part}</h2>
        {timerActive && <div style={{ marginLeft: "auto", fontFamily: "'Clash Display', sans-serif", color: timer < 30 ? "#ff6b6b" : COLORS.green, fontSize: "1.5rem" }}>⏱ {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</div>}
      </div>

      {phase === "question" && (
        <div>
          <Card style={{ marginBottom: "1.5rem", border: `1px solid ${COLORS.green}30` }}>
            <div style={{ fontSize: "0.75rem", color: COLORS.green, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.75rem", letterSpacing: "1px" }}>SAVOL {qIndex + 1}</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#fff", fontSize: "1.05rem", lineHeight: 1.7 }}>{getQuestion()}</p>
            <button onClick={() => speak(getQuestion())} style={{ marginTop: "1rem", background: "none", border: "none", color: COLORS.green, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}>🔊 Savolni eshitish</button>
          </Card>

          {part === 2 && phase === "question" && (
            <Btn onClick={() => { setPhase("prep"); setPrepTimer(60); setPrepActive(true); }} style={{ marginBottom: "1rem" }}>⏱ 1 daqiqa tayyorgarlik boshlash</Btn>
          )}

          {part !== 2 && (
            <>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Javobingizni shu yerga yozing..." style={{ width: "100%", minHeight: 150, padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Btn onClick={getFeedback} style={{ flex: 1 }}>{loading ? "Tahlil qilinmoqda..." : "AI Feedback olish"}</Btn>
                <Btn variant="outline" onClick={() => { setQIndex(q => q + 1); setAnswer(""); setFeedback(""); }}>Keyingi savol →</Btn>
              </div>
            </>
          )}
        </div>
      )}

      {phase === "prep" && (
        <Card style={{ textAlign: "center", padding: "3rem", border: `1px solid ${COLORS.blue}30` }}>
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "4rem", fontWeight: 700, color: COLORS.blue, marginBottom: "1rem" }}>{prepTimer}s</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "1.5rem" }}>Tayyorgarlik vaqti — eslatmalar yozing</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Eslatmalar..." style={{ width: "100%", minHeight: 100, padding: "1rem", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: "1rem" }} />
          <Btn onClick={() => { setPrepActive(false); setPhase("speaking"); setTimer(120); setTimerActive(true); }}>Gapirish boshlash →</Btn>
        </Card>
      )}

      {phase === "speaking" && (
        <div>
          <Card style={{ marginBottom: "1.5rem", border: `1px solid ${COLORS.green}30` }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#fff", fontSize: "1.05rem", lineHeight: 1.7 }}>{getQuestion()}</p>
          </Card>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "3rem", color: timer < 30 ? "#ff6b6b" : COLORS.green }}>⏱ {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem" }}>Gapiring — 2 daqiqa</div>
          </div>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Gapirganlaringizni yozing (yoki mikrofon ishlatish)..." style={{ width: "100%", minHeight: 120, padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Btn onClick={() => { setTimerActive(false); getFeedback(); }} style={{ flex: 1 }}>Tugatish & Feedback olish</Btn>
          </div>
        </div>
      )}

      {phase === "feedback" && feedback && (
        <div>
          <Card style={{ border: `1px solid ${COLORS.green}30`, marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: COLORS.green, marginBottom: "1rem" }}>🎙️ AI Feedback</h3>
            <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#fff", fontSize: "0.9rem", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{feedback}</div>
            <button onClick={() => speak(feedback)} style={{ marginTop: "1rem", background: "none", border: `1px solid ${COLORS.green}`, borderRadius: "20px", padding: "6px 16px", color: COLORS.green, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🔊 Ovozli eshitish</button>
          </Card>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Btn variant="outline" onClick={() => { setPhase("question"); setQIndex(q => q + 1); setAnswer(""); setFeedback(""); }}>Keyingi savol →</Btn>
            <Btn onClick={() => setPart(null)}>Boshqa part tanlash</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// CEFR PAGE
function CEFRPage({ persona }) {
  const [level, setLevel] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const getFeedback = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          messages: [{ role: "user", content: `You are a CEFR ${level} level English examiner. ${persona === "savage" ? "Be funny but educational, roast mistakes gently. Use emojis." : "Be encouraging and professional."}

Level: ${level}
Question: "${CEFR_QUESTIONS[level][qIndex % CEFR_QUESTIONS[level].length]}"
Answer: "${answer}"

Give: 1) CEFR level assessment 2) Grammar corrections 3) Vocabulary tips 4) Overall feedback
Also add short O'zbek tili izoh.` }],
        }),
      });
      const data = await res.json();
      setFeedback(data.content?.[0]?.text || "");
    } catch { setFeedback("Error! Try again."); }
    setLoading(false);
  };

  if (!level) return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>🇺🇿 CEFR Practice</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "3rem" }}>DTM standarti bo'yicha CEFR darajangizni tanlang</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "1rem" }}>
        {Object.entries({ A1: ["Boshlang'ich", COLORS.green], A2: ["Elementar", "#5eead4"], B1: ["O'rta", COLORS.blue], B2: ["O'rta-yuqori", "#818cf8"], C1: ["Ilg'or", "#a78bfa"], C2: ["Professional", "#e879f9"] }).map(([l, [label, color]]) => (
          <Card key={l} style={{ textAlign: "center", cursor: "pointer", border: `1px solid ${color}40` }} onClick={() => { setLevel(l); setQIndex(0); setAnswer(""); setFeedback(""); }}>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "2rem", fontWeight: 700, color, marginBottom: "0.5rem" }}>{l}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.8rem" }}>{label}</div>
          </Card>
        ))}
      </div>
    </div>
  );

  const q = CEFR_QUESTIONS[level][qIndex % CEFR_QUESTIONS[level].length];
  return (
    <div style={{ padding: "2rem", maxWidth: 700 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button onClick={() => setLevel(null)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "8px 14px", color: COLORS.muted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Orqaga</button>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff" }}>CEFR {level}</h2>
      </div>
      <Card style={{ marginBottom: "1.5rem", border: `1px solid ${COLORS.blue}30` }}>
        <div style={{ fontSize: "0.75rem", color: COLORS.blue, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.75rem", letterSpacing: "1px" }}>SAVOL {qIndex + 1}</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#fff", fontSize: "1.05rem", lineHeight: 1.7 }}>{q}</p>
        <button onClick={() => speak(q)} style={{ marginTop: "1rem", background: "none", border: "none", color: COLORS.green, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🔊 Eshitish</button>
      </Card>
      <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Javobingizni yozing..." style={{ width: "100%", minHeight: 150, padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: "1rem" }} />
      <div style={{ display: "flex", gap: "1rem" }}>
        <Btn onClick={getFeedback} style={{ flex: 1 }}>{loading ? "Tahlil..." : "Feedback olish"}</Btn>
        <Btn variant="outline" onClick={() => { setQIndex(q => q + 1); setAnswer(""); setFeedback(""); }}>Keyingi →</Btn>
      </div>
      {feedback && (
        <Card style={{ marginTop: "1.5rem", border: `1px solid ${COLORS.green}30` }}>
          <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: COLORS.green, marginBottom: "1rem" }}>AI Feedback</h3>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#fff", fontSize: "0.9rem", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{feedback}</div>
          <button onClick={() => speak(feedback)} style={{ marginTop: "1rem", background: "none", border: `1px solid ${COLORS.green}`, borderRadius: "20px", padding: "6px 16px", color: COLORS.green, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🔊 Ovozli</button>
        </Card>
      )}
    </div>
  );
}

// FIRST STEPS
function FirstStepsPage() {
  const [mode, setMode] = useState(null);
  const [sentence, setSentence] = useState("");
  const [shuffled] = useState(["I", "am", "learning", "English", "every", "day"].sort(() => Math.random() - 0.5));
  const [built, setBuilt] = useState([]);
  const [remaining, setRemaining] = useState([...shuffled]);

  const addWord = (w, i) => {
    setBuilt(b => [...b, w]);
    setRemaining(r => r.filter((_, idx) => idx !== i));
  };

  if (!mode) return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>🌱 First Steps</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "3rem" }}>Ingliz tilini noldan boshlaydiganlar uchun maxsus modul</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5rem" }}>
        {[
          { id: "builder", icon: "🧩", title: "Sentence Builder", desc: "So'zlarni bosib gap quring, keyin o'qing", color: COLORS.green },
          { id: "listen", icon: "👂", title: "Listen & Repeat", desc: "AI gapiradi, siz qaytarasiz (Shadowing)", color: COLORS.blue },
          { id: "silent", icon: "✍️", title: "Silent Mode", desc: "Yozing → AI tuzatsin → keyin o'qing", color: "#a78bfa" },
          { id: "breathing", icon: "🌬️", title: "Breathing Exercise", desc: "Gapirish oldidan stress kamaytiradigan mashq", color: "#ffa500" },
        ].map(m => (
          <Card key={m.id} style={{ cursor: "pointer", border: `1px solid ${m.color}30` }} onClick={() => setMode(m.id)}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{m.icon}</div>
            <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "0.5rem" }}>{m.title}</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem" }}>{m.desc}</p>
          </Card>
        ))}
      </div>
      <Card style={{ marginTop: "1.5rem", border: `1px solid ${COLORS.green}20`, background: `${COLORS.green}05` }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.green, fontSize: "0.9rem", lineHeight: 1.7 }}>
          💚 Bu yerda hech qachon "Xato!" deyilmaydi. Siz xavfsiz muhitdasiz. Har kichik yutuq nishonlanadi!
        </div>
      </Card>
    </div>
  );

  if (mode === "builder") return (
    <div style={{ padding: "2rem", maxWidth: 600 }}>
      <button onClick={() => setMode(null)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "8px 14px", color: COLORS.muted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: "2rem" }}>← Orqaga</button>
      <h2 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "0.5rem" }}>🧩 Sentence Builder</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "2rem" }}>So'zlarni to'g'ri tartibda bosib gap quring</p>
      <Card style={{ marginBottom: "1.5rem", minHeight: 60, display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
        {built.length === 0 ? <span style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted }}>So'zlarni bosing...</span> : built.map((w, i) => (
          <span key={i} style={{ padding: "6px 14px", borderRadius: "20px", background: `${COLORS.green}20`, border: `1px solid ${COLORS.green}50`, color: COLORS.green, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem" }}>{w}</span>
        ))}
      </Card>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.5rem" }}>
        {remaining.map((w, i) => (
          <button key={i} onClick={() => addWord(w, i)} style={{ padding: "8px 16px", borderRadius: "20px", background: "rgba(255,255,255,0.08)", border: `1px solid ${COLORS.border}`, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", transition: "all 0.2s" }}>{w}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Btn onClick={() => speak(built.join(" "))} variant="outline">🔊 O'qib ko'rish</Btn>
        <Btn onClick={() => { setBuilt([]); setRemaining([...shuffled]); }} variant="ghost">Qayta boshlash</Btn>
      </div>
      {built.length === shuffled.length && <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "12px", background: `${COLORS.green}15`, border: `1px solid ${COLORS.green}40`, fontFamily: "'DM Sans', sans-serif", color: COLORS.green }}>🎉 Zo'r! Gap to'g'ri qurildi! Endi ovoz chiqarib o'qing!</div>}
    </div>
  );

  if (mode === "listen") {
    const phrases = ["Hello, how are you?", "My name is Mia.", "I love learning English.", "Today is a beautiful day.", "Practice makes perfect."];
    const [idx, setIdx] = useState(0);
    return (
      <div style={{ padding: "2rem", maxWidth: 600, textAlign: "center" }}>
        <button onClick={() => setMode(null)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "8px 14px", color: COLORS.muted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: "2rem" }}>← Orqaga</button>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "2rem" }}>👂 Listen & Repeat</h2>
        <Card style={{ padding: "3rem", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", color: "#fff", marginBottom: "2rem" }}>{phrases[idx]}</div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Btn onClick={() => speak(phrases[idx])}>🔊 Eshitish</Btn>
            <Btn variant="outline" onClick={() => setIdx(i => (i + 1) % phrases.length)}>Keyingi →</Btn>
          </div>
        </Card>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted }}>Eshiting → Qaytaring → Takrorlang. Bosim yo'q! 💚</p>
      </div>
    );
  }

  if (mode === "breathing") return (
    <div style={{ padding: "2rem", maxWidth: 500, textAlign: "center" }}>
      <button onClick={() => setMode(null)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "8px 14px", color: COLORS.muted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: "2rem" }}>← Orqaga</button>
      <h2 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "2rem" }}>🌬️ Breathing Exercise</h2>
      <div style={{ width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.green}30, ${COLORS.blue}20)`, border: `2px solid ${COLORS.green}50`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", animation: "breathe 4s ease-in-out infinite" }}>
        <div style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", fontSize: "1.2rem", textAlign: "center" }}>Nafas<br/>oling</div>
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, lineHeight: 1.7 }}>4 soniya nafas oling → 4 soniya ushlab turing → 4 soniya chiqaring<br /><br />Gapirish oldidan 3 marta takrorlang. Siz tayyor! 💚</p>
      <style>{`@keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }`}</style>
    </div>
  );

  return null;
}

// VOCABULARY PAGE
function VocabPage() {
  const [saved, setSaved] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = VOCAB_WORDS.filter(w => w.word.toLowerCase().includes(search.toLowerCase()) || w.uz.includes(search));

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>📖 Vocabulary Bank</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "2rem" }}>{saved.length} ta so'z saqlangan</p>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="So'z qidirish..." style={{ width: "100%", maxWidth: 400, padding: "12px 16px", borderRadius: "25px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: "2rem", boxSizing: "border-box" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
        {filtered.map((w, i) => (
          <Card key={i} style={{ cursor: "pointer", border: selected === i ? `1px solid ${COLORS.green}` : `1px solid ${COLORS.border}` }} onClick={() => setSelected(selected === i ? null : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.2rem", color: "#fff", marginBottom: "2px" }}>{w.word}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.8rem" }}>{w.phonetic}</div>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={e => { e.stopPropagation(); speak(w.word); }} style={{ background: "none", border: `1px solid ${COLORS.green}40`, borderRadius: "8px", padding: "4px 8px", color: COLORS.green, cursor: "pointer", fontSize: "0.8rem" }}>🔊</button>
                <button onClick={e => { e.stopPropagation(); setSaved(s => s.includes(w.word) ? s.filter(x => x !== w.word) : [...s, w.word]); }} style={{ background: "none", border: `1px solid ${COLORS.blue}40`, borderRadius: "8px", padding: "4px 8px", color: saved.includes(w.word) ? "#ffd700" : COLORS.muted, cursor: "pointer", fontSize: "0.8rem" }}>{saved.includes(w.word) ? "★" : "☆"}</button>
              </div>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.green, fontSize: "0.9rem", marginTop: "0.75rem" }}>🇺🇿 {w.uz}</div>
            {selected === i && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem", fontStyle: "italic" }}>"{w.example}"</div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// MINI GAMES
function GamesPage() {
  const [game, setGame] = useState(null);
  const [tabooWord] = useState("Computer");
  const [tabooInput, setTabooInput] = useState("");
  const [tabooResult, setTabooResult] = useState("");
  const [eeeText, setEeeText] = useState("");
  const [eeeCount, setEeeCount] = useState(0);
  const [eeeActive, setEeeActive] = useState(false);

  const checkTaboo = async () => {
    if (!tabooInput.trim()) return;
    if (tabooInput.toLowerCase().includes(tabooWord.toLowerCase())) {
      setTabooResult("❌ Noto'g'ri! So'zning o'zini aytdingiz!");
    } else {
      setTabooResult("✅ Zo'r! So'zni ishlatmasdan tushuntirdingiz!");
    }
  };

  const countEee = (text) => {
    const matches = text.match(/\b(um|uh|er|erm|eee|hmm)\b/gi) || [];
    setEeeCount(matches.length);
    setEeeText(text);
  };

  if (!game) return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>🎮 Mini-Games</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "3rem" }}>O'ynab ingliz tilini rivojlantiring</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
        {[
          { id: "taboo", icon: "🎯", title: "Taboo Game", desc: "Berilgan so'zning o'zini aytmasdan tushuntiring. Leksikangizni rivojlantiring!", color: COLORS.green },
          { id: "eee", icon: "🚫", title: "Anti-Eee Challenge", desc: "'Um', 'uh', 'er' kabi to'ldiruvchi so'zlarsiz gapiring!", color: "#ffa500" },
        ].map(g => (
          <Card key={g.id} style={{ cursor: "pointer", border: `1px solid ${g.color}30` }} onClick={() => setGame(g.id)}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{g.icon}</div>
            <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", fontSize: "1.2rem", marginBottom: "0.5rem" }}>{g.title}</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem" }}>{g.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );

  if (game === "taboo") return (
    <div style={{ padding: "2rem", maxWidth: 600 }}>
      <button onClick={() => setGame(null)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "8px 14px", color: COLORS.muted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: "2rem" }}>← Orqaga</button>
      <h2 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "2rem" }}>🎯 Taboo Game</h2>
      <Card style={{ textAlign: "center", marginBottom: "1.5rem", border: `1px solid #ff6b6b50` }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "0.5rem" }}>Bu so'zni ISHLATMANG:</div>
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "3rem", color: "#ff6b6b" }}>{tabooWord}</div>
      </Card>
      <textarea value={tabooInput} onChange={e => setTabooInput(e.target.value)} placeholder="Bu so'zni aytmasdan tushuntiring..." style={{ width: "100%", minHeight: 120, padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: "1rem" }} />
      <Btn onClick={checkTaboo} style={{ width: "100%" }}>Tekshirish</Btn>
      {tabooResult && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "10px", background: tabooResult.includes("✅") ? `${COLORS.green}15` : "#ff6b6b15", border: `1px solid ${tabooResult.includes("✅") ? COLORS.green : "#ff6b6b"}50`, fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>{tabooResult}</div>}
    </div>
  );

  if (game === "eee") return (
    <div style={{ padding: "2rem", maxWidth: 600 }}>
      <button onClick={() => setGame(null)} style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "8px 14px", color: COLORS.muted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: "2rem" }}>← Orqaga</button>
      <h2 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "2rem" }}>🚫 Anti-Eee Challenge</h2>
      <Card style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, marginBottom: "0.5rem" }}>Aniqlangan "eee" lar soni:</div>
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "4rem", color: eeeCount === 0 ? COLORS.green : "#ff6b6b" }}>{eeeCount}</div>
        {eeeCount === 0 && eeeText && <div style={{ color: COLORS.green, fontFamily: "'DM Sans', sans-serif" }}>🎉 Ajoyib! Hech qanday to'ldiruvchi so'z yo'q!</div>}
      </Card>
      <textarea value={eeeText} onChange={e => countEee(e.target.value)} placeholder="Biror mavzu haqida yozing (um, uh, er, eee ishlatmang)..." style={{ width: "100%", minHeight: 150, padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
      <div style={{ marginTop: "1rem", fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.85rem" }}>Aytilgan so'zlar: um, uh, er, erm, eee, hmm</div>
    </div>
  );
}

// MIDNIGHT MODE
function MidnightPage({ persona }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "🌙 Xush kelibsiz, Midnight Confessions ga... Hech qanday bosim yo'q. Inglizcha gaplashaylik — hayot, orzular, savol-javoblar. Nima haqida gaplashmoqchisiz?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input; setInput(""); setLoading(true);
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          system: "You are a calm, philosophical midnight companion for English learners. Have deep, meaningful conversations about life, dreams, fears, and thoughts. Be warm and introspective. Gently correct major English errors without breaking the flow. Keep the atmosphere peaceful and safe. If they write in Uzbek, respond in both Uzbek and English. No pressure, just connection.",
          messages: [...messages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })), { role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "ai", text: data.content?.[0]?.text || "" }]);
    } catch { setMessages(m => [...m, { role: "ai", text: "..." }]); }
    setLoading(false);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #050810 0%, #0a0f1e 100%)", position: "relative", overflow: "hidden" }}>
      {/* Stars */}
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{ position: "absolute", width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, borderRadius: "50%", background: "#fff", top: `${Math.random() * 60}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.7 + 0.1, animation: `twinkle ${Math.random() * 3 + 2}s infinite` }} />
      ))}
      <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: `1px solid rgba(255,255,255,0.05)`, display: "flex", alignItems: "center", gap: "1rem", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "1.5rem" }}>🌙</div>
        <div><div style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", fontSize: "1.1rem" }}>Midnight Confessions</div><div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Bosimsiz · Sokin · Istalgan vaqt</div></div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative", zIndex: 1 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: "16px", background: m.role === "user" ? "rgba(0,212,170,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${m.role === "user" ? `${COLORS.green}40` : "rgba(255,255,255,0.08)"}`, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>{m.text}</div>
          </div>
        ))}
        {loading && <div style={{ display: "flex" }}><div style={{ padding: "12px 16px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>...</div></div>}
      </div>
      <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "0.75rem", position: "relative", zIndex: 1 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Fikrlaringizni baham ko'ring..." style={{ flex: 1, padding: "12px 18px", borderRadius: "25px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'DM Sans', sans-serif", outline: "none", fontSize: "0.9rem" }} />
        <button onClick={send} style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(0,212,170,0.3)", border: `1px solid ${COLORS.green}50`, cursor: "pointer", fontSize: "1.2rem" }}>→</button>
      </div>
      <style>{`@keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.8} }`}</style>
    </div>
  );
}

// ANALYTICS
function StatsPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "2rem" }}>📈 Analytics</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[["📅","Bu hafta","145 daqiqa"],["📊","Umumiy","1,240 daqiqa"],["🎯","O'rtalama ball","6.2 / 9"],["📈","Progress","+0.5 band"]].map(([icon,label,val],i) => (
          <Card key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.8rem", marginBottom: "0.25rem" }}>{label}</div>
            <div style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", fontSize: "1.3rem", fontWeight: 700 }}>{val}</div>
          </Card>
        ))}
      </div>
      <Card>
        <h3 style={{ fontFamily: "'Clash Display', sans-serif", color: "#fff", marginBottom: "1.5rem" }}>Haftalik Faollik</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: 120 }}>
          {[45,30,60,25,75,50,40].map((h,i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "100%", height: `${h}%`, background: `linear-gradient(180deg,${COLORS.green},${COLORS.blue})`, borderRadius: "4px 4px 0 0", opacity: 0.8 }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.muted, fontSize: "0.7rem" }}>{["Du","Se","Ch","Pa","Ju","Sh","Ya"][i]}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============ MAIN APP ============
export default function MiaSpeaking() {
  const [screen, setScreen] = useState("landing"); // landing | auth | app
  const [authMode, setAuthMode] = useState("register");
  const [page, setPage] = useState("dashboard");
  const [persona, setPersona] = useState("angel");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleAuthMode = (mode) => { setAuthMode(mode); setScreen("auth"); };
  const handleAuthSuccess = () => setScreen("app");

  if (screen === "landing") return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0a0f1e; color:#fff; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:#00d4aa30; border-radius:2px; }
      `}</style>
      <LandingPage setPage={setPage} setAuthMode={handleAuthMode} />
    </>
  );

  if (screen === "auth") return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{background:#0a0f1e;color:#fff;}`}</style>
      <AuthPage mode={authMode} setMode={setAuthMode} onSuccess={handleAuthSuccess} />
    </>
  );

  const sidebarWidth = sidebarCollapsed ? 64 : 220;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0a0f1e; color:#fff; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:#00d4aa30; border-radius:2px; }
      `}</style>
      <Sidebar page={page} setPage={setPage} persona={persona} setPersona={setPersona} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div style={{ marginLeft: sidebarWidth, flex: 1, minHeight: "100vh", transition: "margin-left 0.3s", overflow: "auto" }}>
        {page === "dashboard" && <Dashboard setPage={setPage} />}
        {page === "practice" && <PracticePage persona={persona} />}
        {page === "ielts" && <IELTSPage persona={persona} />}
        {page === "cefr" && <CEFRPage persona={persona} />}
        {page === "firststeps" && <FirstStepsPage />}
        {page === "vocab" && <VocabPage />}
        {page === "games" && <GamesPage />}
        {page === "midnight" && <MidnightPage persona={persona} />}
        {page === "stats" && <StatsPage />}
      </div>
    </div>
  );
}
