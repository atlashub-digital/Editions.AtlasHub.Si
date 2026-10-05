import { cn } from "@/lib/utils";
import type { FlagshipBook } from "@/lib/atlas-content";
import { AtlasLogo } from "./atlas-logo";

/**
 * BookCover — provisional cover for the flagship publication (brief §8).
 *
 * Built entirely in HTML/CSS/SVG so every line of text is real, selectable
 * text (brief §27: never rasterise important text). The cover presents as a
 * physical book object via a reliable 2.5D construction:
 *   - the whole book tilts in a strong perspective (rotateY + rotateX);
 *   - a SPINE strip fans out on the left (darker, vertical title, light-
 *     catching edge);
 *   - a PAGE-BLOCK strip fans out on the right (light, stacked-page texture);
 *   - a soft contact shadow grounds the object.
 * This reads clearly as a 3D book without depending on fiddly preserve-3d
 * panel orientation.
 */
export function BookCover({
  book,
  className,
  tilt = true,
  size = "lg",
}: {
  book: FlagshipBook;
  className?: string;
  tilt?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "lg"
      ? "w-[clamp(15rem,26vw,22rem)]"
      : size === "md"
        ? "w-[clamp(12rem,18vw,15rem)]"
        : "w-[clamp(9rem,12vw,11rem)]";

  const spineW = size === "lg" ? 26 : size === "md" ? 20 : 15;
  const pagesW = size === "lg" ? 16 : size === "md" ? 12 : 9;

  return (
    <div
      className={cn("book-scene relative font-sans", className)}
      style={{ perspective: "1100px" }}
    >
      <div
        className={cn(
          "book-3d relative",
          tilt && "animate-float-soft",
          tilt && "group"
        )}
        style={{
          transform: tilt ? "rotateY(-26deg) rotateX(4deg)" : "none",
          transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* ---------- Page-block strip (right) — coplanar band ---------- */}
        <div
          aria-hidden
          className="absolute"
          style={{
            top: "3px",
            left: "100%",
            height: "calc(100% - 6px)",
            width: `${pagesW + 6}px`,
            marginLeft: "-3px",
            background:
              "repeating-linear-gradient(90deg,#F4F8FF 0 1px,#9aacc0 1px 2.5px), linear-gradient(180deg,#F4F8FF,#c2cfde)",
            boxShadow:
              "inset 0 0 6px rgba(20,32,46,0.4), inset -3px 0 6px rgba(20,32,46,0.6)",
            borderRadius: "1px",
          }}
        />

        {/* ---------- Spine strip (left) — coplanar band ---------- */}
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full overflow-hidden"
          style={{
            width: `${spineW + 4}px`,
            marginLeft: `-${spineW + 2}px`,
            background:
              "linear-gradient(90deg,#01040C 0%,#040A18 30%,#0A1D33 70%,#103049 100%)",
            borderLeft: "1px solid rgba(85,199,255,0.35)",
            borderTopLeftRadius: "2px",
            borderBottomLeftRadius: "2px",
          }}
        >
          {/* bright light-catching edge where the spine meets the cover */}
          <span
            className="absolute inset-y-0 right-0 w-[3px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(102,224,255,0.95) 0%, rgba(85,199,255,0.3) 20%, rgba(85,199,255,0.12) 50%, rgba(85,199,255,0.3) 80%, rgba(102,224,255,0.7) 100%)",
              boxShadow: "0 0 8px rgba(85,199,255,0.6)",
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.5rem] uppercase tracking-[0.32em] text-steel"
            style={{ writingMode: "vertical-rl" }}
          >
            {book.title} {book.titleAccent} · {book.author}
          </span>
        </div>

        {/* ---------- Front face ---------- */}
        <div
          className={cn(
            "book-face relative overflow-hidden rounded-r-sm rounded-l-[2px] border border-cloud/10",
            "shadow-[0_34px_90px_-28px_rgba(20,125,255,0.50),0_22px_50px_-18px_rgba(0,0,0,0.9)]",
            dims,
            "aspect-[2/3]",
            "relative z-10"
          )}
          style={{
            background:
              "linear-gradient(160deg, #071A2D 0%, #050B14 55%, #040914 100%)",
          }}
        >
          {/* Skyline silhouette */}
          <svg
            className="absolute inset-x-0 bottom-[18%] h-1/3 w-full opacity-25"
            viewBox="0 0 600 200"
            preserveAspectRatio="xMidYMax slice"
            aria-hidden
          >
            <defs>
              <linearGradient id="skylineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#168CFF" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#040914" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#skylineFill)"
              d="M0,200 L0,150 L24,150 L24,120 L40,120 L40,140 L60,140 L60,90 L78,90 L78,128 L96,128 L96,108 L112,108 L112,132 L128,132 L128,96 L146,96 L146,120 L164,120 L164,84 L182,84 L182,114 L200,114 L200,72 L218,72 L218,104 L236,104 L236,128 L254,128 L254,96 L272,96 L272,120 L290,120 L290,80 L308,80 L308,112 L326,112 L326,128 L344,128 L344,88 L362,88 L362,116 L380,116 L380,100 L398,100 L398,132 L416,132 L416,96 L434,96 L434,120 L452,120 L452,84 L470,84 L470,112 L488,112 L488,128 L506,128 L506,100 L524,100 L524,124 L542,124 L542,92 L560,92 L560,120 L578,120 L578,150 L600,150 L600,200 Z"
            />
            <g fill="#66E0FF" opacity="0.5">
              <rect x="64" y="100" width="3" height="3" />
              <rect x="70" y="106" width="3" height="3" />
              <rect x="206" y="80" width="3" height="3" />
              <rect x="212" y="86" width="3" height="3" />
              <rect x="296" y="88" width="3" height="3" />
              <rect x="302" y="94" width="3" height="3" />
              <rect x="460" y="92" width="3" height="3" />
              <rect x="466" y="98" width="3" height="3" />
            </g>
          </svg>

          {/* Electric glow */}
          <div
            className="pointer-events-none absolute -right-10 top-1/3 h-40 w-40 rounded-full blur-3xl animate-glow-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(85,199,255,0.45), rgba(20,125,255,0) 70%)",
            }}
            aria-hidden
          />
          {/* Top hairline */}
          <div className="absolute inset-x-0 top-0 h-px hairline" aria-hidden />

          {/* Content */}
          <div className="relative flex h-full flex-col p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-cyan-signal">
                {book.code}
              </span>
              <span className="text-[0.55rem] uppercase tracking-[0.3em] text-steel">
                AtlasHub
              </span>
            </div>

            <div className="mt-auto flex flex-col">
              <h3 className="text-balance text-2xl font-extrabold uppercase leading-[0.92] tracking-tight text-cloud sm:text-3xl">
                {book.title}
                <span className="block text-gradient-atlas">
                  {book.titleAccent}
                </span>
              </h3>
              <p className="mt-3 max-w-[22ch] text-[0.7rem] leading-relaxed text-steel sm:text-xs">
                {book.subtitle}
              </p>

              <div className="mt-4 h-px w-full bg-cloud/10" />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[0.6rem] font-medium uppercase tracking-[0.28em] text-cloud/80">
                  {book.author}
                </span>
                <AtlasLogo variant="mark" markSize={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ground shadow — stronger, softer */}
      <div
        className="pointer-events-none mx-auto mt-7 h-6 w-4/5 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20,125,255,0.38), rgba(4,9,20,0) 72%)",
        }}
        aria-hidden
      />
    </div>
  );
}
