import { useState } from "react";
import { Menu, X } from "lucide-react";

type Page = "home" | "breathe" | "mood" | "journal" | "colors";

const links: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "breathe", label: "Breathe" },
  { id: "mood", label: "Mood" },
  { id: "journal", label: "Journal" },
  { id: "colors", label: "Colors" },
];

export function Navbar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#B6FF54]/70 border-b border-[#0E1A0E]/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="flex items-center gap-2">
          <span style={{ fontSize: '1.6rem' }}>🔮</span>
          <span className="text-[#0E1A0E]" style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.02em' }}>prism</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className={`px-5 py-2 rounded-full transition-all ${
                page === l.id
                  ? "bg-[#0E1A0E] text-[#B6FF54]"
                  : "text-[#0E1A0E] hover:bg-[#0E1A0E]/10"
              }`}
              style={{ fontWeight: 600 }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <button className="md:hidden text-[#0E1A0E]" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-2 bg-[#B6FF54]/95">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => { setPage(l.id); setOpen(false); }}
              className={`px-5 py-3 rounded-2xl text-left transition-all ${
                page === l.id
                  ? "bg-[#0E1A0E] text-[#B6FF54]"
                  : "text-[#0E1A0E] hover:bg-[#0E1A0E]/10"
              }`}
              style={{ fontWeight: 600 }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export type { Page };
