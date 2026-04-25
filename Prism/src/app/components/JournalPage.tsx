import { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { toast } from "sonner";
import {
  saveJournal,
  getTodayJournal,
  getRecentJournals,
  getWeekMoods,
  getStreak,
  getShortDay,
  formatDate,
} from "../storage";
import type { JournalEntry, MoodEntry } from "../storage";

const MAX = 200;

export function JournalPage() {
  const [text, setText] = useState("");
  const [hasTodayEntry, setHasTodayEntry] = useState(false);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [weekMoods, setWeekMoods] = useState<MoodEntry[]>([]);
  const [streak, setStreak] = useState(0);

  // Load data on mount
  useEffect(() => {
    const todayEntry = getTodayJournal();
    if (todayEntry) {
      setText(todayEntry.text);
      setHasTodayEntry(true);
    }
    setRecentEntries(getRecentJournals(7));
    setWeekMoods(getWeekMoods());
    setStreak(getStreak());
  }, []);

  const handleSave = () => {
    if (text.trim().length === 0) {
      toast.error("Write something first!", {
        description: "Even a few words will do ✨",
      });
      return;
    }
    saveJournal(text.trim());
    setHasTodayEntry(true);
    setRecentEntries(getRecentJournals(7));
    setStreak(getStreak());
    toast.success("📝 Journal saved!", {
      description: hasTodayEntry ? "Today's entry updated" : "Keep the streak going!",
    });
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-[#0E1A0E] text-center" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800 }}>Today's Journal</h1>
      <p className="text-[#0E1A0E]/70 text-center mt-2">A few words is enough.</p>

      <div className="grid lg:grid-cols-[1fr_auto] gap-8 mt-10">
        <div className="rounded-3xl p-8 shadow-md border border-[#4A7C2A]/20" style={{ background: 'repeating-linear-gradient(180deg, #F4FFD9 0px, #F4FFD9 30px, #C8F582 31px)' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            placeholder="Three words. A sentence. How was today?"
            className="w-full bg-transparent outline-none resize-none text-[#0E1A0E] placeholder:text-[#0E1A0E]/40"
            style={{ minHeight: 180, fontSize: '1.15rem', lineHeight: '30px' }}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-[#0E1A0E]/60" style={{ fontSize: '0.9rem' }}>{text.length} / {MAX} characters</span>
            <button
              onClick={handleSave}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#4A7C2A] to-[#1A3A1A] text-white shadow hover:shadow-xl transition active:scale-95"
              style={{ fontWeight: 700 }}
            >
              {hasTodayEntry ? "Update Entry" : "Save Entry"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl border border-[#4A7C2A]/20 bg-[#DFFFA8]/40" style={{ width: 220, height: 300 }}>
          <Spline scene="https://prod.spline.design/QewK-lzZEqth7F9A/scene.splinecode" />
        </div>
      </div>

      {/* Weekly Mood Chart */}
      <div className="mt-12 rounded-3xl bg-white/70 border border-[#4A7C2A]/20 shadow-sm p-6">
        <h2 className="text-[#0E1A0E]" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Weekly Mood</h2>
        <div className="mt-4 w-full">
          {weekMoods.length > 0 ? (
            <svg viewBox="0 0 600 320" className="w-full" style={{ height: 320 }}>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={`h${i}`} x1={40} x2={580} y1={20 + i * 70} y2={20 + i * 70} stroke="#4A7C2A" strokeOpacity={0.15} />
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <line key={`v${i}`} y1={20} y2={300} x1={40 + i * 67.5} x2={40 + i * 67.5} stroke="#4A7C2A" strokeOpacity={0.15} />
              ))}
              {/* Axes */}
              <line x1={40} x2={580} y1={160} y2={160} stroke="#0E1A0E" strokeOpacity={0.3} />
              <line x1={310} x2={310} y1={20} y2={300} stroke="#0E1A0E" strokeOpacity={0.3} />
              {/* Axis labels */}
              <text x={20} y={25} fill="#0E1A0E" fontSize={11}>⚡</text>
              <text x={20} y={300} fill="#0E1A0E" fontSize={11}>😌</text>
              <text x={42} y={315} fill="#0E1A0E" fontSize={11}>😢</text>
              <text x={565} y={315} fill="#0E1A0E" fontSize={11}>😊</text>
              {/* Connecting line */}
              {weekMoods.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#4A7C2A"
                  strokeWidth={2}
                  strokeOpacity={0.4}
                  strokeLinejoin="round"
                  points={weekMoods.map(d => {
                    const cx = 40 + ((d.x + 5) / 10) * 540;
                    const cy = 20 + (1 - (d.y + 5) / 10) * 280;
                    return `${cx},${cy}`;
                  }).join(' ')}
                />
              )}
              {/* Data points */}
              {weekMoods.map((d, i) => {
                const cx = 40 + ((d.x + 5) / 10) * 540;
                const cy = 20 + (1 - (d.y + 5) / 10) * 280;
                const dayLabel = getShortDay(d.date);
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r={10} fill="#1A3A1A" opacity={0.3} />
                    <circle cx={cx} cy={cy} r={6} fill="#1A3A1A" />
                    <text x={cx} y={cy - 14} textAnchor="middle" fill="#0E1A0E" fontSize={12} fontWeight={600}>{dayLabel}</text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-[#0E1A0E]/50">
              <span style={{ fontSize: '2.5rem' }}>📊</span>
              <p className="mt-3" style={{ fontWeight: 600 }}>No mood data yet</p>
              <p className="mt-1" style={{ fontSize: '0.9rem' }}>Save your mood on the Mood page to see your weekly chart</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <span
            className="px-5 py-3 inline-block rounded-full text-[#0E1A0E]"
            style={{
              fontWeight: 700,
              background: streak > 0
                ? 'linear-gradient(135deg, rgba(74,124,42,0.2), rgba(26,58,26,0.2))'
                : 'rgba(14,26,14,0.05)',
            }}
          >
            {streak > 0 ? `🔥 ${streak}-day streak` : '✨ Start your streak today!'}
          </span>
        </div>
      </div>

      {/* Past Entries */}
      {recentEntries.length > 0 && (
        <div className="mt-8 rounded-3xl bg-white/60 backdrop-blur border border-[#4A7C2A]/15 p-6">
          <h2 className="text-[#0E1A0E]" style={{ fontWeight: 700, fontSize: '1.3rem' }}>Recent Entries</h2>
          <div className="mt-4 flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            {recentEntries.map((entry, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#F4FFD9]/80 border border-[#C8F582]/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#0E1A0E]/50" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {formatDate(entry.date)}
                  </span>
                </div>
                <p className="text-[#0E1A0E]" style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {entry.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
