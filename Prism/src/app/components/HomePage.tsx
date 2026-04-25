import { useState, useEffect } from "react";
import { Wind, Heart, BookOpen, ArrowUpRight } from "lucide-react";
import Spline from "@splinetool/react-spline";
import {
  getStreak,
  getTotalBreathingSessions,
  getTotalMoodsLogged,
  getRecentJournals,
} from "../storage";

type Page = "home" | "breathe" | "mood" | "journal" | "colors";

export function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const [stats, setStats] = useState({
    streak: 0,
    sessions: 0,
    moods: 0,
    hasData: false,
  });

  useEffect(() => {
    const streak = getStreak();
    const sessions = getTotalBreathingSessions();
    const moods = getTotalMoodsLogged();
    const journals = getRecentJournals(1);
    const hasData = streak > 0 || sessions > 0 || moods > 0 || journals.length > 0;
    setStats({ streak, sessions, moods, hasData });
  }, []);

  const features = [
    { icon: <Wind size={26} />, title: "Breathe", desc: "Guided rhythms to slow the day down.", page: "breathe" as Page },
    { icon: <Heart size={26} />, title: "Track Mood", desc: "Plot how you feel on a gentle grid.", page: "mood" as Page },
    { icon: <BookOpen size={26} />, title: "Journal", desc: "A few words. A growing streak.", page: "journal" as Page },
  ];

  return (
    <section className="relative">
      <div className="relative grid lg:grid-cols-2 items-center min-h-[70vh] overflow-hidden">
        <div className="px-8 lg:px-16 py-14 z-10">
          <p className="text-[#0E1A0E]/70 mb-5" style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.85rem' }}>
            Daily Wellness Companion
          </p>
          <h1 className="text-[#0E1A0E]" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Immerse Yourself <br />
            in the Refracted <br />
            Elegance.
          </h1>
          <p className="mt-7 text-[#0E1A0E]/75 max-w-md" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            {stats.hasData
              ? `Welcome back! You're on a ${stats.streak > 0 ? `${stats.streak}-day streak 🔥` : 'fresh start ✨'}. Keep reflecting, breathing, and growing.`
              : "Elevate your wellness with Prism's 3D magic. Unlock a world of brilliance — breathe, reflect, and grow."}
          </p>
          <div className="mt-9 flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setPage("breathe")}
              className="px-7 py-4 rounded-full bg-[#0E1A0E] text-[#B6FF54] hover:bg-[#1A3A1A] transition-all flex items-center gap-2 shadow-lg active:scale-95"
              style={{ fontWeight: 700 }}
            >
              Explore technology <ArrowUpRight size={18} />
            </button>
            <span className="px-5 py-3 rounded-full bg-[#0E1A0E]/80 text-white/90" style={{ fontSize: '0.85rem' }}>
              Press on the canvas to focus and interact
            </span>
          </div>
        </div>

        <div className="relative h-[520px] lg:h-[640px] w-full">
          <Spline scene="https://prod.spline.design/4imElqK2nx1QVFRF/scene.splinecode" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20 grid md:grid-cols-3 gap-6">
        {features.map(f => (
          <button
            key={f.title}
            onClick={() => setPage(f.page)}
            className="text-left p-7 rounded-3xl bg-[#0E1A0E]/5 backdrop-blur border border-[#0E1A0E]/15 hover:bg-[#0E1A0E] hover:text-[#B6FF54] hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#0E1A0E] text-[#B6FF54] group-hover:bg-[#B6FF54] group-hover:text-[#0E1A0E] transition">
              {f.icon}
            </div>
            <h3 className="mt-5" style={{ fontWeight: 800, fontSize: '1.4rem' }}>{f.title}</h3>
            <p className="mt-2 opacity-75">{f.desc}</p>
          </button>
        ))}
      </div>

      {/* Dynamic Stats - only show when user has data */}
      {stats.hasData && (
        <div className="max-w-7xl mx-auto px-8 lg:px-16 pb-16">
          <div className="rounded-3xl bg-[#0E1A0E]/5 backdrop-blur border border-[#0E1A0E]/10 p-8">
            <h2 className="text-[#0E1A0E] text-center mb-6" style={{ fontWeight: 800, fontSize: '1.5rem' }}>Your Wellness Journey</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-white/50 border border-[#4A7C2A]/15">
                <div className="text-[#0E1A0E]" style={{ fontSize: '2rem', fontWeight: 800 }}>
                  {stats.streak > 0 ? `${stats.streak}` : '—'}
                </div>
                <div className="text-[#0E1A0E]/60 mt-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {stats.streak > 0 ? '🔥 Day Streak' : 'Start a streak'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/50 border border-[#4A7C2A]/15">
                <div className="text-[#0E1A0E]" style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.sessions}</div>
                <div className="text-[#0E1A0E]/60 mt-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>🌿 Breath Sessions</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/50 border border-[#4A7C2A]/15">
                <div className="text-[#0E1A0E]" style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.moods}</div>
                <div className="text-[#0E1A0E]/60 mt-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>💚 Moods Logged</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
