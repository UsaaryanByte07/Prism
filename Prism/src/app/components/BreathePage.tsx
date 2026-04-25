import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";

type Phase = "Breathe In" | "Hold" | "Breathe Out";

export function BreathePage() {
  const [inhale, setInhale] = useState(4);
  const [hold, setHold] = useState(4);
  const [exhale, setExhale] = useState(6);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("Breathe In");
  const [remaining, setRemaining] = useState(4);
  const phaseRef = useRef<Phase>("Breathe In");
  const remRef = useRef(4);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      remRef.current -= 1;
      if (remRef.current <= 0) {
        const next: Phase =
          phaseRef.current === "Breathe In" ? "Hold" :
          phaseRef.current === "Hold" ? "Breathe Out" : "Breathe In";
        phaseRef.current = next;
        remRef.current = next === "Breathe In" ? inhale : next === "Hold" ? hold : exhale;
        setPhase(next);
      }
      setRemaining(remRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [running, inhale, hold, exhale]);

  const start = () => {
    phaseRef.current = "Breathe In";
    remRef.current = inhale;
    setPhase("Breathe In");
    setRemaining(inhale);
    setRunning(true);
  };
  const stop = () => setRunning(false);

  const total = phase === "Breathe In" ? inhale : phase === "Hold" ? hold : exhale;
  const progress = ((total - remaining) / total) * 100;
  const circumference = 2 * Math.PI * 240;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 text-center">
      <h1 className="text-[#0E1A0E]" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800 }}>Breathe</h1>
      <p className="text-[#0E1A0E]/70 mt-2">Find your rhythm. Inhale warmth, exhale tension.</p>

      <div className="relative mx-auto mt-10 flex items-center justify-center" style={{ width: 500, maxWidth: '100%', height: 500 }}>
        <svg className="absolute inset-0" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="240" fill="none" stroke="#C8F582" strokeWidth="8" />
          <circle
            cx="250" cy="250" r="240" fill="none"
            stroke="url(#grad)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            transform="rotate(-90 250 250)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4A7C2A" />
              <stop offset="100%" stopColor="#1A3A1A" />
            </linearGradient>
          </defs>
        </svg>
        <div className="rounded-full overflow-hidden shadow-xl border border-[#4A7C2A]/20 bg-[#DFFFA8]/40" style={{ width: 450, height: 450, maxWidth: '100%' }}>
          <Spline scene="https://prod.spline.design/qapLtFMyWA0VHV1K/scene.splinecode" />
        </div>
      </div>

      <div className="mt-8">
        <div className="text-[#1A3A1A]" style={{ fontSize: '2rem', fontWeight: 700 }}>{phase}</div>
        <div className="text-[#0E1A0E]" style={{ fontSize: '3rem', fontWeight: 800 }}>{remaining}s</div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[
          { label: "Inhale", val: inhale, set: setInhale },
          { label: "Hold", val: hold, set: setHold },
          { label: "Exhale", val: exhale, set: setExhale },
        ].map(f => (
          <div key={f.label} className="bg-white/70 rounded-full px-5 py-3 flex items-center justify-between border border-[#4A7C2A]/20 shadow-sm">
            <span className="text-[#0E1A0E]/70">{f.label}</span>
            <input
              type="number" min={1} max={20} value={f.val}
              onChange={(e) => f.set(parseInt(e.target.value) || 1)}
              className="w-16 bg-transparent text-right text-[#1A3A1A] outline-none"
              style={{ fontWeight: 700 }}
            />
            <span className="text-[#0E1A0E]/50">s</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <button onClick={start} className="px-10 py-4 rounded-full bg-gradient-to-r from-[#4A7C2A] to-[#1A3A1A] text-white shadow-lg hover:shadow-2xl transition" style={{ fontWeight: 700 }}>Start</button>
        <button onClick={stop} className="px-10 py-4 rounded-full bg-white/70 text-[#0E1A0E] border border-[#4A7C2A]/30 hover:bg-white transition" style={{ fontWeight: 700 }}>Stop</button>
      </div>
    </section>
  );
}
