// SD monogram — bronze "SD" with a spark. Logo slot until a real asset drops in.
export function SDMark({ size = 40 }: { size?: number }) {
  return (
    <span className="sd-mark" style={{ height: size }} aria-label="SharpenDaily">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="rgba(200,134,43,0.12)" stroke="rgba(200,134,43,0.34)" />
        <text
          x="32"
          y="42"
          textAnchor="middle"
          fontFamily="var(--font-sd-display), sans-serif"
          fontWeight="800"
          fontSize="28"
          fill="#C8862B"
        >
          SD
        </text>
        <path d="M50 12 l2.2 5.3 5.3 2.2 -5.3 2.2 -2.2 5.3 -2.2 -5.3 -5.3 -2.2 5.3 -2.2 z" fill="#E0A14A" />
      </svg>
    </span>
  );
}
