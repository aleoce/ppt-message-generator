import { useState } from "react";

const platformConfig = {
  onlyfans: { accent: "#00AFEC", bg: "radial-gradient(ellipse at top, #001e30 0%, #000d18 60%, #000 100%)", label: "🔥 OnlyFans" },
  playboy:  { accent: "#FFD700", bg: "radial-gradient(ellipse at top, #2a1f00 0%, #0f0900 60%, #000 100%)", label: "🐰 Playboy" },
};

const contentTypes = [
  { key: "photo_tease",   label: "📸 Photo Tease",   sub: "Hinting at a photo set" },
  { key: "video_drop",    label: "🎬 Video Drop",    sub: "New video available" },
  { key: "exclusive",     label: "✨ Exclusive",      sub: "Limited / special content" },
  { key: "good_morning",  label: "🌅 Good Morning",  sub: "Morning engagement" },
  { key: "good_night",    label: "🌙 Good Night",    sub: "Late night message" },
  { key: "miss_you",      label: "💭 Miss You",      sub: "Re-engage cold fans" },
  { key: "behind_scenes", label: "🎭 Behind Scenes", sub: "BTS / personal peek" },
  { key: "spicy_hint",    label: "🌶️ Spicy Hint",   sub: "Build anticipation" },
];

const tones = [
  { key: "flirty",   label: "Flirty",      sub: "Teasing & playful" },
  { key: "sweet",    label: "Sweet",       sub: "Personal & warm" },
  { key: "bold",     label: "Bold",        sub: "Confident & direct" },
  { key: "mystery",  label: "Mysterious",  sub: "Intriguing & vague" },
];

export default function MessageGenerator() {
  const [platform,    setPlatform]    = useState(null);
  const [contentType, setContentType] = useState(null);
  const [tone,        setTone]        = useState(null);
  const [message,     setMessage]     = useState("");
  const [loading,     setLoading]     = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [error,       setError]       = useState(null);

  const colors = platform
    ? platformConfig[platform]
    : { accent: "#ff6b9d", bg: "radial-gradient(ellipse at top, #1a001a 0%, #0a000a 60%, #000 100%)" };

  const canGenerate = platform && contentType && tone;

  const generate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setMessage("");
    setError(null);
    setCopied(false);

    const contentLabel  = contentTypes.find(c => c.key === contentType)?.label || contentType;
    const toneLabel     = tones.find(t => t.key === tone)?.label || tone;
    const platformLabel = platformConfig[platform].label;

    const prompt = `You are a content creator writing a mass message to fans on ${platformLabel}.

Write ONE short, punchy fan message with these specs:
- Content type: ${contentLabel}
- Tone: ${toneLabel}
- Platform: ${platformLabel}
- Length: 2–4 sentences max
- No price mentioned
- No placeholders like [name] or [link]
- Write as if you ARE the creator (first person, feminine voice)
- Make it feel personal and authentic, not copy-paste generic
- End with something that creates curiosity or desire
- Use 1–2 emojis max, naturally placed
- Do NOT use hashtags
- Just output the message, nothing else, no quotes around it`;

    try {
      const response = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data?.message) {
        setMessage(data.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch (e) {
      setError("Connection error. Try again.");
    }

    setLoading(false);
  };

  const copy = () => {
    if (!message) return;
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let n = 0;
  const s = () => String(++n).padStart(2, "0");

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "flex-start", padding: "40px 16px 60px",
      transition: "background 0.6s ease",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.35em", color: colors.accent, textTransform: "uppercase", marginBottom: "10px", opacity: 0.7, fontFamily: "'Courier New', monospace", transition: "color 0.4s" }}>
          Creator Tools
        </div>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: "400", color: "#fff", margin: 0, letterSpacing: "0.05em", lineHeight: 1.1 }}>
          PPV Message
        </h1>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: "700", color: colors.accent, margin: 0, letterSpacing: "0.05em", lineHeight: 1.1, transition: "color 0.4s" }}>
          Generator
        </h1>
      </div>

      <div style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* 01 Platform */}
        <Section label={`${s()} — Platform`} accent={colors.accent}>
          <Grid cols={2}>
            {Object.entries(platformConfig).map(([key, cfg]) => (
              <SelectButton key={key} selected={platform === key} accent={cfg.accent}
                onClick={() => { setPlatform(key); setMessage(""); setError(null); }}
                label={cfg.label} sub={key === "onlyfans" ? "Explicit / full" : "Solo / curated"} />
            ))}
          </Grid>
        </Section>

        {/* 02 Content Type */}
        {platform && (
          <Section label={`${s()} — Content Type`} accent={colors.accent}>
            <Grid cols={2}>
              {contentTypes.map(opt => (
                <SelectButton key={opt.key} selected={contentType === opt.key} accent={colors.accent}
                  onClick={() => { setContentType(opt.key); setMessage(""); setError(null); }}
                  label={opt.label} sub={opt.sub} />
              ))}
            </Grid>
          </Section>
        )}

        {/* 03 Tone */}
        {platform && contentType && (
          <Section label={`${s()} — Tone`} accent={colors.accent}>
            <Grid cols={2}>
              {tones.map(opt => (
                <SelectButton key={opt.key} selected={tone === opt.key} accent={colors.accent}
                  onClick={() => { setTone(opt.key); setMessage(""); setError(null); }}
                  label={opt.label} sub={opt.sub} />
              ))}
            </Grid>
          </Section>
        )}

        {/* Generate Button */}
        {canGenerate && (
          <button onClick={generate} disabled={loading} style={{
            background: loading ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${colors.accent}33, ${colors.accent}11)`,
            border: `1px solid ${colors.accent}${loading ? "30" : "80"}`,
            borderRadius: "12px", padding: "18px", cursor: loading ? "not-allowed" : "pointer",
            color: loading ? `${colors.accent}60` : colors.accent,
            fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase",
            fontFamily: "'Courier New', monospace", transition: "all 0.3s",
            width: "100%",
          }}>
            {loading ? "Writing..." : message ? "↻ Regenerate" : "✦ Generate Message"}
          </button>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: "center", color: "#ff6b6b", fontSize: "13px", fontFamily: "'Courier New', monospace" }}>
            {error}
          </div>
        )}

        {/* Result */}
        {message && (
          <div style={{
            background: `linear-gradient(135deg, ${colors.accent}18 0%, ${colors.accent}08 100%)`,
            border: `1px solid ${colors.accent}50`,
            borderRadius: "16px", padding: "24px",
            transition: "all 0.4s",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: colors.accent, textTransform: "uppercase", marginBottom: "16px", opacity: 0.8, fontFamily: "'Courier New', monospace" }}>
              Your Message
            </div>

            <p style={{ color: "#fff", fontSize: "15px", lineHeight: "1.7", margin: 0, fontFamily: "'Georgia', serif" }}>
              {message}
            </p>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button onClick={copy} style={{
                flex: 1,
                background: copied ? `${colors.accent}33` : "transparent",
                border: `1px solid ${colors.accent}${copied ? "80" : "40"}`,
                borderRadius: "8px", color: copied ? colors.accent : `${colors.accent}99`,
                padding: "10px", fontSize: "12px", letterSpacing: "0.15em",
                textTransform: "uppercase", cursor: "pointer",
                fontFamily: "'Courier New', monospace", transition: "all 0.2s",
              }}>
                {copied ? "✓ Copied" : "Copy"}
              </button>

              <button onClick={generate} disabled={loading} style={{
                flex: 1,
                background: "transparent",
                border: `1px solid ${colors.accent}40`,
                borderRadius: "8px", color: `${colors.accent}99`,
                padding: "10px", fontSize: "12px", letterSpacing: "0.15em",
                textTransform: "uppercase", cursor: "pointer",
                fontFamily: "'Courier New', monospace", transition: "all 0.2s",
              }}>
                {loading ? "..." : "↻ New"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function Section({ label, accent, children }) {
  return (
    <div>
      <div style={{ fontSize: "11px", letterSpacing: "0.25em", color: accent, textTransform: "uppercase", marginBottom: "10px", opacity: 0.7, fontFamily: "'Courier New', monospace", transition: "color 0.4s" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Grid({ cols, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "10px" }}>
      {children}
    </div>
  );
}

function SelectButton({ selected, accent, onClick, label, sub }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? `${accent}22` : "rgba(255,255,255,0.04)",
      border: `1px solid ${selected ? accent : "rgba(255,255,255,0.1)"}`,
      borderRadius: "12px", padding: "14px 12px", cursor: "pointer",
      textAlign: "left", transition: "all 0.2s",
      transform: selected ? "scale(1.02)" : "scale(1)",
    }}>
      <div style={{ fontSize: "14px", color: selected ? accent : "#fff", fontWeight: "600", fontFamily: "'Georgia', serif", transition: "color 0.2s" }}>
        {label}
      </div>
      <div style={{ fontSize: "11px", color: selected ? `${accent}cc` : "rgba(255,255,255,0.4)", marginTop: "3px", fontFamily: "'Courier New', monospace", transition: "color 0.2s" }}>
        {sub}
      </div>
    </button>
  );
}
