export function AtlasMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="AtlasHub">
      <defs>
        <linearGradient id="atlasBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#66e0ff" />
          <stop offset=".52" stopColor="#168cff" />
          <stop offset="1" stopColor="#2440ff" />
        </linearGradient>
      </defs>
      <path d="M6 52 27 12l10 19-12 21Z" fill="#eef8ff" />
      <path d="M34 20 47 10l13 42H45Z" fill="url(#atlasBlue)" />
      <path d="m26 52 12-19 9 19Z" fill="#f5fbff" />
    </svg>
  );
}
