import { useState } from "react";
import { Navbar } from "./components/Navbar";
import type { Page } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { BreathePage } from "./components/BreathePage";
import { MoodPage } from "./components/MoodPage";
import { JournalPage } from "./components/JournalPage";
import { ColorsPage } from "./components/ColorsPage";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-screen w-full" style={{ background: 'linear-gradient(180deg, #B6FF54 0%, #DFFFA8 100%)', color: '#0E1A0E', fontFamily: 'var(--font-prism, Nunito, sans-serif)' }}>
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "breathe" && <BreathePage />}
      {page === "mood" && <MoodPage />}
      {page === "journal" && <JournalPage />}
      {page === "colors" && <ColorsPage />}
      <footer className="py-8 text-center text-[#0E1A0E]/60">
        Made with brightness · Prism ✦
      </footer>
    </div>
  );
}
