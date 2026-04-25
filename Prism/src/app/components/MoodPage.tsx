import { useState } from "react";
import Spline from "@splinetool/react-spline";
import { MoodGrid } from "./MoodGrid";

export function MoodPage() {
  const [v, setV] = useState({ x: 2, y: 1 });
  const [saved, setSaved] = useState(false);

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
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}
            className="mt-5 px-8 py-3 rounded-full bg-gradient-to-r from-[#4A7C2A] to-[#1A3A1A] text-white shadow-lg hover:shadow-2xl transition"
            style={{ fontWeight: 700 }}
          >
            {saved ? "Saved ✓" : "Save Mood"}
          </button>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl border border-[#4A7C2A]/20 bg-[#DFFFA8]/40" style={{ width: 300, height: 300 }}>
          <Spline scene="https://prod.spline.design/F0kdOXEJ6yUo2p7Z/scene.splinecode" />
        </div>
      </div>
    </section>
  );
}
