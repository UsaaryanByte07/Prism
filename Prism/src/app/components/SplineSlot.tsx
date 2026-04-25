type Props = {
  label: string;
  width?: number | string;
  height?: number | string;
  rounded?: string;
  className?: string;
};

export function SplineSlot({ label, width = "100%", height = 400, rounded = "rounded-3xl", className = "" }: Props) {
  return (
    /* SPLINE 3D EMBED SLOT */
    <div
      className={`relative flex items-center justify-center border-2 border-dashed border-[#4A7C2A]/50 bg-gradient-to-br from-[#DFFFA8]/80 to-[#C8F582]/60 backdrop-blur-sm ${rounded} shadow-inner ${className}`}
      style={{ width, height, minWidth: typeof width === 'number' ? width : undefined, minHeight: typeof height === 'number' ? height : undefined }}
    >
      <div className="text-center px-4">
        <div className="text-[#1A3A1A]" style={{ fontSize: '2rem' }}>✦</div>
        <div className="text-[#0E1A0E]/70 mt-2" style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Spline 3D Slot
        </div>
        <div className="text-[#0E1A0E] mt-1" style={{ fontSize: '0.95rem' }}>{label}</div>
      </div>
    </div>
  );
}
