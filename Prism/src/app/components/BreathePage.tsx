import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import { toast } from "sonner";
import {
  saveBreathingSession,
  getTotalBreathingSessions,
  getTotalBreathingMinutes,
} from "../storage";

type Phase = "Breathe In" | "Hold" | "Breathe Out";

export function BreathePage() {
  const [inhale, setInhale] = useState(4);
  const [hold, setHold] = useState(4);
  const [exhale, setExhale] = useState(6);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("Breathe In");
  const [remaining, setRemaining] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [totalSessions, setTotalSessions] = useState(getTotalBreathingSessions());
  const [totalMinutes, setTotalMinutes] = useState(getTotalBreathingMinutes());

  const phaseRef = useRef<Phase>("Breathe In");
  const remRef = useRef(4);
  const cyclesRef = useRef(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      remRef.current -= 1;
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);

      if (remRef.current <= 0) {
        const next: Phase =
          phaseRef.current === "Breathe In" ? "Hold" :
          phaseRef.current === "Hold" ? "Breathe Out" : "Breathe In";

        // Count a completed cycle when we finish "Breathe Out"
        if (phaseRef.current === "Breathe Out") {
          cyclesRef.current += 1;
          setCycles(cyclesRef.current);
        }

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
    cyclesRef.current = 0;
    elapsedRef.current = 0;
    setPhase("Breathe In");
    setRemaining(inhale);
    setCycles(0);
    setElapsed(0);
    setRunning(true);
    toast("🌿 Breathing session started", { description: "Find your rhythm..." });
  };

  const stop = () => {
    setRunning(false);
    // Save session if ran for at least 5 seconds
    if (elapsedRef.current >= 5) {
      saveBreathingSession(inhale, hold, exhale, elapsedRef.current, cyclesRef.current);
      setTotalSessions(getTotalBreathingSessions());
      setTotalMinutes(getTotalBreathingMinutes());
      const mins = Math.floor(elapsedRef.current / 60);
      const secs = elapsedRef.current % 60;
      const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      toast.success("Session complete!", {
        description: `${timeStr} · ${cyclesRef.current} cycle${cyclesRef.current !== 1 ? 's' : ''} completed`,
      });
    }
  };

  const total = phase === "Breathe In" ? inhale : phase === "Hold" ? hold : exhale;
  const progress = ((total - remaining) / total) * 100;
  const circumference = 2 * Math.PI * 240;
  const offset = circumference - (progress / 100) * circumference;

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

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
        {running && (
          <div className="flex items-center justify-center gap-4 mt-2 text-[#0E1A0E]/60" style={{ fontSize: '0.9rem' }}>
            <span>⏱ {formatElapsed(elapsed)}</span>
            <span>·</span>
            <span>🔄 {cycles} cycle{cycles !== 1 ? 's' : ''}</span>
          </div>
        )}
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
              disabled={running}
              className="w-16 bg-transparent text-right text-[#1A3A1A] outline-none disabled:opacity-50"
              style={{ fontWeight: 700 }}
            />
            <span className="text-[#0E1A0E]/50">s</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={start}
          disabled={running}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-[#4A7C2A] to-[#1A3A1A] text-white shadow-lg hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontWeight: 700 }}
        >
          Start
        </button>
        <button
          onClick={stop}
          disabled={!running}
          className="px-10 py-4 rounded-full bg-white/70 text-[#0E1A0E] border border-[#4A7C2A]/30 hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontWeight: 700 }}
        >
          Stop
        </button>
      </div>

      {/* Session Stats */}
      {totalSessions > 0 && (
        <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
          <div className="px-6 py-4 rounded-2xl bg-white/60 backdrop-blur border border-[#4A7C2A]/15 shadow-sm text-center">
            <div className="text-[#0E1A0E]" style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalSessions}</div>
            <div className="text-[#0E1A0E]/60 mt-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sessions</div>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-white/60 backdrop-blur border border-[#4A7C2A]/15 shadow-sm text-center">
            <div className="text-[#0E1A0E]" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {totalMinutes < 1 ? '<1' : totalMinutes}
            </div>
            <div className="text-[#0E1A0E]/60 mt-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Minutes Breathed</div>
          </div>
        </div>
      )}
    </section>
  );
}
