import React, { useState, useEffect, useMemo } from "react";
import { Lock, Check, Star, Flame, Volume2, X, ChevronDown, ChevronUp } from "lucide-react";

/* ============================================================
   FONTS
   ============================================================ */
function useFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
}


function speak(text) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  } catch {
    // speech not supported
  }
}



const CURRICULUM = [
  {
    id: "m1",
    title: "First Words",
    blurb: "People, animals & things",
    icon: "🌳",
    steps: [
      { type: "vocab", word: "Tree", emoji: "🌳", bg: "#DDF3D8" },
      { type: "vocab", word: "House", emoji: "🏠", bg: "#FFE3D0" },
      { type: "vocab", word: "Horse", emoji: "🐴", bg: "#F4E3FF" },
      { type: "verb", word: "Jump", emoji: "🤸", caption: "The boy jumps.", bg: "#FFF0C2" },
      { type: "verb", word: "Run", emoji: "🏃", caption: "The girl runs.", bg: "#D6EEFF" },
      {
        type: "dragbuild",
        goal: "Move to the supermarket",
        words: ["I", "want", "to", "go", "to the supermarket"],
        sceneEmoji: "🧍",
        targetEmoji: "🏪",
      },
      {
        type: "scenecaption",
        emoji: "👨‍👦",
        caption: "A man hugs his son.",
        bg: "#FFE3EC",
      },
      {
        type: "quiz",
        promptEmojis: ["👧", "🏃"],
        expected: ["the girl is running", "a girl is running", "girl is running"],
        hint: "girl + run",
      },
      {
        type: "story",
        title: "The Little Tree",
        bg: "#DDF3D8",
        emoji: "🌳",
        text:
          "A small tree lives in a garden. Every day, the sun shines on the tree. A boy runs to the tree. He jumps and laughs. The tree is happy.",
        options: ["Family", "Nature", "Games", "Adventure"],
        answer: "Nature",
      },
    ],
  },
  { id: "m2", title: "Actions & Feelings", blurb: "Verbs and emotions", icon: "😊", steps: Array(8).fill(null) },
  { id: "m3", title: "Everyday Life", blurb: "Routines, food, places", icon: "🍽️", steps: Array(10).fill(null) },
  { id: "m4", title: "Family & People", blurb: "Describing people", icon: "👪", steps: Array(9).fill(null) },
  { id: "m5", title: "Simple Sentences", blurb: "Basic grammar begins", icon: "✏️", steps: Array(12).fill(null) },
  { id: "m6", title: "Telling Time & Numbers", blurb: "1–100, clock, days", icon: "⏰", steps: Array(10).fill(null) },
  { id: "m7", title: "Past & Future", blurb: "Tenses in context", icon: "🔄", steps: Array(14).fill(null) },
];

const PLACEMENT_QUESTIONS = [
  { emoji: "🐴", options: ["Horse", "House", "Tree"], answer: "Horse" },
  { emoji: "🏃", options: ["Jump", "Run", "Sleep"], answer: "Run" },
  { emoji: "🏠", options: ["Tree", "Horse", "House"], answer: "House" },
];

/* ============================================================
   SMALL UI ATOMS
   ============================================================ */

const Chip = ({ children }) => (
  <span
    style={{
      background: "#FFFFFF",
      border: "2px solid #F0DCC8",
      borderRadius: 999,
      padding: "4px 12px",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 800,
      fontSize: 13,
      color: "#7A5C3E",
    }}
  >
    {children}
  </span>
);

function PrimaryButton({ children, onClick, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#F0D8CC" : "#FF6F5E",
        color: "#fff",
        border: "none",
        borderRadius: 16,
        padding: "14px 28px",
        fontFamily: "'Baloo 2', sans-serif",
        fontWeight: 700,
        fontSize: 17,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 4px 0 #D9503F",
        transition: "transform 0.08s ease",
        ...style,
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "translateY(3px)")}
      onMouseUp={(e) => !disabled && (e.currentTarget.style.transform = "translateY(0px)")}
    >
      {children}
    </button>
  );
}

function TopBar({ xp, streak }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, padding: "14px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: "#E8871E" }}>
        <Flame size={18} fill="#FFC857" color="#E8871E" /> {streak}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: "#5FA85F" }}>
        <Star size={18} fill="#FFD166" color="#E8871E" /> {xp} XP
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN: LANDING
   ============================================================ */
function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>🌤️</div>
      <h1 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 40, color: "#362A3B", margin: "0 0 10px" }}>Learn English by seeing it</h1>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 17, color: "#7A6C74", maxWidth: 360, lineHeight: 1.5, margin: "0 0 28px" }}>
        No translation. No memorizing lists. Just pictures, sounds, and things you do — the way you learned your first words.
      </p>
      <PrimaryButton onClick={onStart}>Get started</PrimaryButton>
    </div>
  );
}

/* ============================================================
   SCREEN: AUTH (mock — real build wires to an auth provider)
   ============================================================ */
function Auth({ onDone }) {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ width: "100%", maxWidth: 340 }}>
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 26, color: "#362A3B", marginBottom: 4 }}>
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#9A8A93", marginTop: 0, marginBottom: 20, fontSize: 14 }}>
          We save your progress here so you can pick up anytime.
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px 16px",
            borderRadius: 14,
            border: "2px solid #F0DCC8",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
            marginBottom: 12,
            outline: "none",
          }}
        />
        <input
          placeholder="Email address"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px 16px",
            borderRadius: 14,
            border: "2px solid #F0DCC8",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
            marginBottom: 18,
            outline: "none",
          }}
        />
        <PrimaryButton onClick={() => onDone(name || "Learner")} style={{ width: "100%" }}>
          {mode === "signup" ? "Create account" : "Log in"}
        </PrimaryButton>
        <button
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          style={{ marginTop: 14, background: "none", border: "none", color: "#7A6C74", fontFamily: "'Nunito', sans-serif", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
        >
          {mode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN: PLACEMENT TEST
   ============================================================ */
function Placement({ onDone }) {
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const q = PLACEMENT_QUESTIONS[i];

  const pick = (opt) => {
    const isCorrect = opt === q.answer;
    if (isCorrect) setCorrect((c) => c + 1);
    setTimeout(() => {
      if (i + 1 < PLACEMENT_QUESTIONS.length) setI(i + 1);
      else onDone(correct + (isCorrect ? 1 : 0));
    }, 350);
  };

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 24px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {PLACEMENT_QUESTIONS.map((_, idx) => (
            <div key={idx} style={{ flex: 1, height: 8, borderRadius: 4, background: idx <= i ? "#5FB4E5" : "#EDE4DA" }} />
          ))}
        </div>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#9A8A93", fontSize: 13, letterSpacing: 0.2 }}>WHAT IS THIS?</p>
        <div style={{ fontSize: 100, textAlign: "center", margin: "16px 0 28px" }}>{q.emoji}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => pick(opt)}
              style={{
                padding: "16px 20px",
                borderRadius: 16,
                border: "2px solid #F0DCC8",
                background: "#fff",
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 600,
                fontSize: 18,
                color: "#362A3B",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          onClick={() => onDone(0)}
          style={{ marginTop: 26, background: "none", border: "none", color: "#9A8A93", fontFamily: "'Nunito', sans-serif", fontWeight: 700, cursor: "pointer", display: "block", marginLeft: "auto", marginRight: "auto" }}
        >
          Skip test — I want to start from zero
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN: LEARNING PATH
   ============================================================ */
function PathScreen({ modules, progress, onOpenModule, xp, streak }) {
  const [expanded, setExpanded] = useState(modules[0]?.id);

  return (
    <div style={{ minHeight: "100%" }}>
      <TopBar xp={xp} streak={streak} />
      <div style={{ padding: "0 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 26, color: "#362A3B", margin: "4px 0 22px" }}>Your path</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {modules.map((m, idx) => {
            const done = progress[m.id]?.done || 0;
            const total = m.steps.length;
            const isLocked = idx > 0 && !(progress[modules[idx - 1].id]?.done >= modules[idx - 1].steps.length);
            const isComplete = done >= total;
            const isOpen = expanded === m.id;
            return (
              <div
                key={m.id}
                style={{
                  borderRadius: 20,
                  border: "2px solid " + (isLocked ? "#EDE4DA" : "#F0DCC8"),
                  background: isLocked ? "#F7F2EC" : "#fff",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => !isLocked && setExpanded(isOpen ? null : m.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 18px",
                    background: "none",
                    border: "none",
                    cursor: isLocked ? "default" : "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: isLocked ? "#EDE4DA" : isComplete ? "#DDF3D8" : "#FFE9DC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {isLocked ? <Lock size={20} color="#B0A296" /> : isComplete ? <Check size={24} color="#5FA85F" /> : m.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 17, color: isLocked ? "#B0A296" : "#362A3B" }}>{m.title}</div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#9A8A93", marginTop: 2 }}>
                      {isLocked ? "Locked" : `${done} of ${total} steps complete`}
                    </div>
                  </div>
                  {!isLocked && (isOpen ? <ChevronUp size={18} color="#9A8A93" /> : <ChevronDown size={18} color="#9A8A93" />)}
                </button>
                {!isLocked && isOpen && (
                  <div style={{ padding: "0 18px 18px" }}>
                    <div style={{ height: 8, borderRadius: 4, background: "#EDE4DA", overflow: "hidden", marginBottom: 14 }}>
                      <div style={{ height: "100%", width: `${(done / total) * 100}%`, background: "#5FB4E5", borderRadius: 4 }} />
                    </div>
                    <PrimaryButton onClick={() => onOpenModule(m.id)} style={{ width: "100%" }}>
                      {done === 0 ? "Start" : isComplete ? "Review" : "Continue"}
                    </PrimaryButton>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LESSON STEP COMPONENTS
   ============================================================ */

function StepVocab({ step, onNext }) {
  const [tapped, setTapped] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#9A8A93", fontSize: 13 }}>TAP TO HEAR IT</p>
      <button
        onClick={() => {
          speak(step.word);
          setTapped(true);
        }}
        style={{
          width: 220,
          height: 220,
          borderRadius: 28,
          background: step.bg,
          border: "none",
          fontSize: 96,
          cursor: "pointer",
          margin: "20px 0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {step.emoji}
      </button>
      {tapped && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Baloo 2', sans-serif", fontSize: 30, fontWeight: 700, color: "#362A3B" }}>
          <Volume2 size={22} color="#5FB4E5" /> {step.word}
        </div>
      )}
      <PrimaryButton onClick={onNext} disabled={!tapped} style={{ marginTop: 30 }}>
        Continue
      </PrimaryButton>
    </div>
  );
}

function StepVerb({ step, onNext }) {
  const [played, setPlayed] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#9A8A93", fontSize: 13 }}>WATCH THE ACTION</p>
      <div
        onClick={() => {
          speak(step.word);
          setPlayed(true);
        }}
        style={{
          width: 240,
          height: 200,
          borderRadius: 24,
          background: step.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "20px 0 16px",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: 80,
            display: "inline-block",
            animation: played ? "bounceMove 0.9s ease" : "none",
          }}
        >
          {step.emoji}
        </span>
      </div>
      <style>{`@keyframes bounceMove { 0%{transform:translateY(0)} 30%{transform:translateY(-24px)} 60%{transform:translateY(0)} 80%{transform:translateY(-10px)} 100%{transform:translateY(0)} }`}</style>
      {played && (
        <>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 26, fontWeight: 700, color: "#362A3B" }}>{step.word}</div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#9A8A93", marginTop: 4 }}>{step.caption}</div>
        </>
      )}
      <PrimaryButton onClick={onNext} disabled={!played} style={{ marginTop: 26 }}>
        Continue
      </PrimaryButton>
    </div>
  );
}

function StepDragBuild({ step, onNext }) {
  const [wordIndex, setWordIndex] = useState(0);
  const done = wordIndex >= step.words.length;
  const advance = () => {
    if (done) return;
    speak(step.words[wordIndex]);
    setWordIndex((w) => w + 1);
  };
  const progressPct = (wordIndex / step.words.length) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#9A8A93", fontSize: 13 }}>TAP THE CHARACTER TO MOVE, STEP BY STEP</p>
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          height: 90,
          background: "#EAF6FF",
          borderRadius: 20,
          margin: "20px 0 10px",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ position: "absolute", left: 20, fontSize: 34 }}>{step.sceneEmoji}</div>
        <div style={{ position: "absolute", right: 20, fontSize: 34 }}>{step.targetEmoji}</div>
        <div
          onClick={advance}
          style={{
            position: "absolute",
            left: `calc(${10 + progressPct * 0.72}%)`,
            transition: "left 0.4s ease",
            fontSize: 40,
            cursor: done ? "default" : "pointer",
          }}
        >
          🚶
        </div>
      </div>
      <div style={{ minHeight: 40, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 360, margin: "10px 0 4px" }}>
        {step.words.slice(0, wordIndex).map((w, idx) => (
          <Chip key={idx}>{w}</Chip>
        ))}
      </div>
      {!done && (
        <button onClick={advance} style={{ marginTop: 14, background: "none", border: "none", color: "#5FB4E5", fontFamily: "'Nunito', sans-serif", fontWeight: 800, cursor: "pointer" }}>
          Tap to take a step →
        </button>
      )}
      <PrimaryButton onClick={onNext} disabled={!done} style={{ marginTop: 26 }}>
        Continue
      </PrimaryButton>
    </div>
  );
}

function StepSceneCaption({ step, onNext }) {
  const [played, setPlayed] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#9A8A93", fontSize: 13 }}>LISTEN, THEN SAY IT ALOUD</p>
      <div style={{ width: 240, height: 200, borderRadius: 24, background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0 18px", fontSize: 88 }}>
        {step.emoji}
      </div>
      <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, fontWeight: 700, color: "#362A3B", textAlign: "center", maxWidth: 300 }}>{step.caption}</div>
      <button
        onClick={() => {
          speak(step.caption);
          setPlayed(true);
        }}
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#EAF6FF",
          border: "none",
          borderRadius: 999,
          padding: "10px 20px",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          color: "#3B7FA5",
          cursor: "pointer",
        }}
      >
        <Volume2 size={18} /> Play sentence
      </button>
      <PrimaryButton onClick={onNext} disabled={!played} style={{ marginTop: 26 }}>
        I said it — Continue
      </PrimaryButton>
    </div>
  );
}

function StepQuiz({ step, onNext }) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const isCorrect = step.expected.includes(value.trim().toLowerCase());
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#9A8A93", fontSize: 13 }}>COMBINE THE PICTURES. TYPE THE SENTENCE.</p>
      <div style={{ display: "flex", gap: 14, alignItems: "center", margin: "20px 0 22px" }}>
        <div style={{ fontSize: 70 }}>{step.promptEmojis[0]}</div>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 30, color: "#D9C7B8" }}>+</div>
        <div style={{ fontSize: 70 }}>{step.promptEmojis[1]}</div>
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={checked}
        placeholder="Type the sentence..."
        style={{
          width: "100%",
          maxWidth: 320,
          boxSizing: "border-box",
          padding: "14px 16px",
          borderRadius: 14,
          border: `2px solid ${checked ? (isCorrect ? "#8FD19E" : "#F3A6A6") : "#F0DCC8"}`,
          fontFamily: "'Nunito', sans-serif",
          fontSize: 17,
          outline: "none",
          textAlign: "center",
        }}
      />
      {checked && (
        <div style={{ marginTop: 12, fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: isCorrect ? "#5FA85F" : "#D9503F" }}>
          {isCorrect ? "Correct! 🎉" : `Not quite — try: "${step.expected[0]}"`}
        </div>
      )}
      {!checked ? (
        <PrimaryButton onClick={() => setChecked(true)} disabled={!value.trim()} style={{ marginTop: 26 }}>
          Check
        </PrimaryButton>
      ) : (
        <PrimaryButton onClick={onNext} style={{ marginTop: 26 }}>
          Continue
        </PrimaryButton>
      )}
    </div>
  );
}

function StepStory({ step, onNext }) {
  const [answered, setAnswered] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ width: "100%", maxWidth: 360, background: step.bg, borderRadius: 22, padding: 22, boxSizing: "border-box" }}>
        <div style={{ fontSize: 46, marginBottom: 8, textAlign: "center" }}>{step.emoji}</div>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, color: "#362A3B", margin: "0 0 10px", textAlign: "center" }}>{step.title}</h3>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, lineHeight: 1.6, color: "#4A3F45", margin: 0 }}>{step.text}</p>
        <button
          onClick={() => speak(step.text)}
          style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.7)", border: "none", borderRadius: 999, padding: "8px 16px", fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#4A3F45", cursor: "pointer" }}
        >
          <Volume2 size={16} /> Read aloud
        </button>
      </div>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#9A8A93", fontSize: 13, marginTop: 22 }}>WHAT WAS THIS STORY ABOUT?</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 320, marginTop: 12 }}>
        {step.options.map((opt) => {
          const picked = answered === opt;
          const showRight = answered && opt === step.answer;
          return (
            <button
              key={opt}
              onClick={() => setAnswered(opt)}
              disabled={!!answered}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                border: `2px solid ${showRight ? "#8FD19E" : picked ? "#F3A6A6" : "#F0DCC8"}`,
                background: showRight ? "#EAF8EC" : picked ? "#FDECEC" : "#fff",
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: "#362A3B",
                cursor: answered ? "default" : "pointer",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <PrimaryButton onClick={onNext} disabled={!answered} style={{ marginTop: 26 }}>
        Finish module
      </PrimaryButton>
    </div>
  );
}

/* ============================================================
   SCREEN: LESSON RUNNER
   ============================================================ */
function LessonScreen({ module, startIndex, onExit, onStepComplete, onFinishModule }) {
  const [i, setI] = useState(startIndex);
  const step = module.steps[i];
  const pct = ((i) / module.steps.length) * 100;

  const goNext = () => {
    onStepComplete(module.id, i + 1);
    if (i + 1 >= module.steps.length) {
      onFinishModule();
    } else {
      setI(i + 1);
    }
  };

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px" }}>
        <button onClick={onExit} style={{ background: "none", border: "none", cursor: "pointer", color: "#B0A296" }}>
          <X size={22} />
        </button>
        <div style={{ flex: 1, height: 10, borderRadius: 5, background: "#EDE4DA", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#5FB4E5", borderRadius: 5, transition: "width 0.3s ease" }} />
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 24px 40px" }}>
        {step.type === "vocab" && <StepVocab step={step} onNext={goNext} />}
        {step.type === "verb" && <StepVerb step={step} onNext={goNext} />}
        {step.type === "dragbuild" && <StepDragBuild step={step} onNext={goNext} />}
        {step.type === "scenecaption" && <StepSceneCaption step={step} onNext={goNext} />}
        {step.type === "quiz" && <StepQuiz step={step} onNext={goNext} />}
        {step.type === "story" && <StepStory step={step} onNext={goNext} />}
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN: MODULE COMPLETE
   ============================================================ */
function CompleteScreen({ onContinue }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 4 }}>🏅</div>
      <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 28, color: "#362A3B", margin: "6px 0" }}>Module complete!</h2>
      <p style={{ fontFamily: "'Nunito', sans-serif", color: "#7A6C74", marginBottom: 26 }}>You earned a badge and unlocked the next module.</p>
      <PrimaryButton onClick={onContinue}>Back to path</PrimaryButton>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  useFonts();
  const [screen, setScreen] = useState("landing");
  const [, setUserName] = useState("");
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [progress, setProgress] = useState({}); // { moduleId: { done: n } }
  const [xp, setXp] = useState(0);
  const [streak] = useState(1);

  const modules = CURRICULUM;
  const activeModule = useMemo(() => modules.find((m) => m.id === activeModuleId), [activeModuleId, modules]);

  const openModule = (id) => {
    setActiveModuleId(id);
    setScreen("lesson");
  };

  const handleStepComplete = (moduleId, doneCount) => {
    setProgress((p) => ({ ...p, [moduleId]: { done: doneCount } }));
    setXp((x) => x + 10);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: 640,
        background: "#FFFBF2",
        fontFamily: "Nunito, sans-serif",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {screen === "landing" && <Landing onStart={() => setScreen("auth")} />}
      {screen === "auth" && (
        <Auth
          onDone={(name) => {
            setUserName(name);
            setScreen("placement");
          }}
        />
      )}
      {screen === "placement" && (
        <Placement
          onDone={() => {
            setScreen("path");
          }}
        />
      )}
      {screen === "path" && (
        <PathScreen modules={modules} progress={progress} onOpenModule={openModule} xp={xp} streak={streak} />
      )}
      {screen === "lesson" && activeModule && activeModule.steps[0] && (
        <LessonScreen
          module={activeModule}
          startIndex={progress[activeModule.id]?.done || 0}
          onExit={() => setScreen("path")}
          onStepComplete={handleStepComplete}
          onFinishModule={() => setScreen("complete")}
        />
      )}
      {screen === "complete" && <CompleteScreen onContinue={() => setScreen("path")} />}
    </div>
  );
}
