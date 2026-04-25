import { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { MoodGrid } from "./MoodGrid";
import { toast } from "sonner";
import {
  saveMood,
  getTodayMood,
  getRecentMoods,
  getMoodQuadrant,
  formatDate,
} from "../storage";
import type { MoodEntry } from "../storage";

export function MoodPage() {
  const [v, setV] = useState({ x: 2, y: 1 });
  const [hasTodayMood, setHasTodayMood] = useState(false);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);

  // Load today's mood and recent history on mount
  useEffect(() => {
    const todayMood = getTodayMood();
    if (todayMood) {
      setV({ x: todayMood.x, y: todayMood.y });
      setHasTodayMood(true);
    }
    setRecentMoods(getRecentMoods(5));
  }, []);

  const handleSave = () => {
    saveMood(v.x, v.y);
    setHasTodayMood(true);
    setRecentMoods(getRecentMoods(5));
    const { label, emoji } = getMoodQuadrant(v.x, v.y);
    toast.success(`${emoji} Mood saved!`, {
      description: `Feeling ${label} (${v.x >= 0 ? '+' : ''}${v.x}, ${v.y >= 0 ? '+' : ''}${v.y})`,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-[#0E1A0E] text-center" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800 }}>How are you feeling?</h1>
      <p className="text-[#0E1A0E]/70 text-center mt-2">Drag the glowing orb to where you are right now.</p>

      <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center mt-10 justify-items-center">
        <div className="flex flex-col items-center">
          <MoodGrid size={420} value={v} onChange={setV} />
          <div className="mt-6 px-6 py-3 rounded-full bg-white/70 border border-[#4A7C2A]/20 text-[#0E1A0E]" style={{ fontWeight: 600 }}>
            Valence: {v.x >= 0 ? '+' : ''}{v.x} &nbsp;|&nbsp; Arousal: {v.y >= 0 ? '+' : ''}{v.y}
          </div>
          <button
            onClick={handleSave}
            className="mt-5 px-8 py-3 rounded-full bg-gradient-to-r from-[#4A7C2A] to-[#1A3A1A] text-white shadow-lg hover:shadow-2xl transition active:scale-95"
            style={{ fontWeight: 700 }}
          >
            {hasTodayMood ? "Update Mood" : "Save Mood"}
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#4A7C2A]/20 bg-[#DFFFA8]/40" style={{ width: 300, height: 300 }}>
            <Spline scene="https://prod.spline.design/F0kdOXEJ6yUo2p7Z/scene.splinecode" />
          </div>

          {/* Recent Moods */}
          {recentMoods.length > 0 && (
            <div className="w-full max-w-[300px] rounded-2xl bg-white/60 backdrop-blur border border-[#4A7C2A]/15 p-4">
              <h3 className="text-[#0E1A0E]" style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Moods</h3>
              <div className="mt-3 flex flex-col gap-2">
                {recentMoods.map((m, i) => {
                  const { label, emoji } = getMoodQuadrant(m.x, m.y);
                  return (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#DFFFA8]/50 text-[#0E1A0E]" style={{ fontSize: '0.85rem' }}>
                      <span className="flex items-center gap-2">
                        <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
                        <span style={{ fontWeight: 600 }}>{label}</span>
                      </span>
                      <span className="text-[#0E1A0E]/50" style={{ fontSize: '0.75rem' }}>{formatDate(m.date)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
