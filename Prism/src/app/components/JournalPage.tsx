import { useState } from "react";
import Spline from "@splinetool/react-spline";

const MAX = 200;
const week = [
  { day: "Mon", x: 2, y: 1 },
  { day: "Tue", x: -1, y: -2 },
  { day: "Wed", x: 3, y: 2 },
  { day: "Thu", x: 1, y: -1 },
  { day: "Fri", x: 4, y: 3 },
  { day: "Sat", x: 2.5, y: 0 },
  { day: "Sun", x: 3.5, y: 2.5 },
];

export function JournalPage() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

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
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#4A7C2A] to-[#1A3A1A] text-white shadow hover:shadow-xl transition"
              style={{ fontWeight: 700 }}
            >
              {saved ? "Saved ✓" : "Save Entry"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl border border-[#4A7C2A]/20 bg-[#DFFFA8]/40" style={{ width: 220, height: 300 }}>
          <Spline scene="https://prod.spline.design/QewK-lzZEqth7F9A/scene.splinecode" />
        </div>
      </div>

      <div className="mt-12 rounded-3xl bg-white/70 border border-[#4A7C2A]/20 shadow-sm p-6">
        <h2 className="text-[#0E1A0E]" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Weekly Mood</h2>
        <div className="mt-4 w-full">
          <svg viewBox="0 0 600 320" className="w-full" style={{ height: 320 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`h${i}`} x1={40} x2={580} y1={20 + i * 70} y2={20 + i * 70} stroke="#4A7C2A" strokeOpacity={0.15} />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <line key={`v${i}`} y1={20} y2={300} x1={40 + i * 67.5} x2={40 + i * 67.5} stroke="#4A7C2A" strokeOpacity={0.15} />
            ))}
            <line x1={40} x2={580} y1={160} y2={160} stroke="#0E1A0E" strokeOpacity={0.3} />
            <line x1={310} x2={310} y1={20} y2={300} stroke="#0E1A0E" strokeOpacity={0.3} />
            <text x={20} y={25} fill="#0E1A0E" fontSize={11}>⚡</text>
            <text x={20} y={300} fill="#0E1A0E" fontSize={11}>😌</text>
            <text x={42} y={315} fill="#0E1A0E" fontSize={11}>😢</text>
            <text x={565} y={315} fill="#0E1A0E" fontSize={11}>😊</text>
            {week.map(d => {
              const cx = 40 + ((d.x + 5) / 10) * 540;
              const cy = 20 + (1 - (d.y + 5) / 10) * 280;
              return (
                <g key={d.day}>
                  <circle cx={cx} cy={cy} r={10} fill="#1A3A1A" opacity={0.3} />
                  <circle cx={cx} cy={cy} r={6} fill="#1A3A1A" />
                  <text x={cx} y={cy - 14} textAnchor="middle" fill="#0E1A0E" fontSize={12} fontWeight={600}>{d.day}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-4 text-center px-5 py-3 inline-block rounded-full bg-gradient-to-r from-[#4A7C2A]/20 to-[#1A3A1A]/20 text-[#0E1A0E]" style={{ fontWeight: 700 }}>
          🔥 5-day streak
        </div>
      </div>
    </section>
  );
}
