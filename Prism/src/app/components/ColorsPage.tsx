import { useState, useMemo, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { MoodGrid } from "./MoodGrid";
import { getLatestMood, getMoodQuadrant } from "../storage";

export function ColorsPage() {
  const [v, setV] = useState({ x: 2, y: 1 });

  // Sync with last saved mood on mount
  useEffect(() => {
    const latest = getLatestMood();
    if (latest) {
      setV({ x: latest.x, y: latest.y });
    }
  }, []);

  const color = useMemo(() => {
    const hue = Math.round(((v.x + 5) / 10) * 60 + 15);
    const sat = Math.round(60 + ((v.y + 5) / 10) * 30);
    const light = Math.round(55 + ((v.y + 5) / 10) * 15);
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  }, [v]);

  const { label, emoji } = getMoodQuadrant(v.x, v.y);

  return (
    <section
      className="min-h-[calc(100vh-80px)] py-12 px-6 transition-colors duration-700"
      style={{ background: `linear-gradient(135deg, ${color} 0%, #DFFFA8 100%)` }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[#0E1A0E] text-center" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800 }}>Magic Colors</h1>
        <p className="text-[#0E1A0E]/70 text-center mt-2">Move the orb. Watch the world shift.</p>

        <div className="grid lg:grid-cols-2 gap-10 items-center mt-10">
          <div className="flex justify-center">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#4A7C2A]/20 bg-[#DFFFA8]/40" style={{ width: 400, height: 500, maxWidth: '100%' }}>
              <Spline scene="https://prod.spline.design/JxgACl3LuqZYuQrX/scene.splinecode" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-3xl overflow-hidden -z-10 opacity-50 blur-lg">
                <div style={{ background: '#1A3A1A' }} />
                <div style={{ background: '#4A7C2A' }} />
                <div style={{ background: '#7B8FA1' }} />
                <div style={{ background: '#D4A373' }} />
              </div>
              <MoodGrid size={300} value={v} onChange={setV} />
            </div>

            <div className="mt-6 px-6 py-3 rounded-full bg-white/80 backdrop-blur border border-[#4A7C2A]/20 text-[#0E1A0E] flex items-center gap-3" style={{ fontWeight: 600 }}>
              <span className="w-5 h-5 rounded-full shadow" style={{ background: color, transition: 'background 0.7s ease' }} />
              Current Mood Color: {color}
            </div>

            {/* Mood label */}
            <div className="mt-3 px-5 py-2 rounded-full bg-[#0E1A0E]/10 text-[#0E1A0E]" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {emoji} You're feeling: {label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
