import { useRef, useState, useEffect } from "react";

export function MoodGrid({
  size = 400,
  value,
  onChange,
}: {
  size?: number;
  value: { x: number; y: number };
  onChange: (v: { x: number; y: number }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);

  const handleMove = (clientX: number, clientY: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const py = Math.max(0, Math.min(1, (clientY - r.top) / r.height));
    onChange({ x: Math.round((px * 2 - 1) * 5), y: Math.round((1 - py * 2) * 5) });
  };

  useEffect(() => {
    if (!drag) return;
    const m = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const u = () => setDrag(false);
    window.addEventListener("mousemove", m);
    window.addEventListener("mouseup", u);
    return () => { window.removeEventListener("mousemove", m); window.removeEventListener("mouseup", u); };
  }, [drag]);

  const dotX = ((value.x + 5) / 10) * 100;
  const dotY = (1 - (value.y + 5) / 10) * 100;

  return (
    <div
      ref={ref}
      onMouseDown={(e) => { setDrag(true); handleMove(e.clientX, e.clientY); }}
      onTouchMove={(e) => { const t = e.touches[0]; handleMove(t.clientX, t.clientY); }}
      className="relative rounded-3xl overflow-hidden border border-[#4A7C2A]/30 shadow-inner cursor-crosshair select-none"
      style={{ width: size, height: size, maxWidth: '100%', aspectRatio: '1/1',
        background: 'linear-gradient(135deg, #DFFFA8 0%, #B6FF54 50%, #C8F582 100%)' }}
    >
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
        <div className="border-r border-b border-[#4A7C2A]/20 flex items-start justify-start p-3 text-[#0E1A0E]/70" style={{ fontSize: '0.8rem' }}>Stressed 😤</div>
        <div className="border-b border-[#4A7C2A]/20 flex items-start justify-end p-3 text-[#0E1A0E]/70" style={{ fontSize: '0.8rem' }}>Happy & Excited 🤩</div>
        <div className="border-r border-[#4A7C2A]/20 flex items-end justify-start p-3 text-[#0E1A0E]/70" style={{ fontSize: '0.8rem' }}>Tired 😴</div>
        <div className="flex items-end justify-end p-3 text-[#0E1A0E]/70" style={{ fontSize: '0.8rem' }}>Content 😊</div>
      </div>

      <div className="absolute left-2 top-1/2 -translate-y-1/2" style={{ fontSize: '1.2rem' }}>😢</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2" style={{ fontSize: '1.2rem' }}>😊</div>
      <div className="absolute top-2 left-1/2 -translate-x-1/2" style={{ fontSize: '1.2rem' }}>⚡</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2" style={{ fontSize: '1.2rem' }}>😌</div>

      <div
        className="absolute w-7 h-7 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg"
        style={{
          left: `${dotX}%`, top: `${dotY}%`,
          background: 'radial-gradient(circle, #DFFFA8 0%, #4A7C2A 60%, #1A3A1A 100%)',
          boxShadow: '0 0 20px rgba(232, 145, 90, 0.7), 0 0 40px rgba(193, 102, 107, 0.4)',
          transition: drag ? 'none' : 'left 0.2s, top 0.2s'
        }}
      />
    </div>
  );
}
