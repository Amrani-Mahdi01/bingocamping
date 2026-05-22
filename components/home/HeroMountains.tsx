"use client";

import * as React from "react";
import {
  ArrowDown,
  Axe,
  Backpack,
  Compass,
  Flame,
  Map,
  Pickaxe,
  Tent,
  TreePine,
} from "lucide-react";

import { Mono } from "@/components/ui/typography";
import { useLanguage, useT } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Homepage hero — filled-silhouette Atlas horizon, continuously breathing.
 *
 * Layered z-stack from back to front:
 *   z-0  : sun (HTML), gear icons (HTML)
 *   z-5  : birds (HTML SVGs spread across the FULL hero width)
 *   z-10 : foreground text content (eyebrow / BINGO / lead / slogan)
 *   z-15 : mountain SVG (silhouettes always above text and birds)
 *   z-20 : scroll indicator
 *
 * The birds intentionally live BELOW the foreground text so they look
 * like they're passing behind the wordmark, not over it.
 *
 * All keyframes live in this component's local <style> block. The
 * existing prefers-reduced-motion rule in app/globals.css disables them
 * for users who request reduced motion.
 */
export function HeroMountains() {
  const t = useT();
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const letters = "BINGO".split("");

  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        "relative isolate overflow-hidden bg-gradient-to-b from-cream via-wood-100/50 to-wood-200/70",
        mounted && "hero-mounted"
      )}
    >
      {/* ───── Local keyframes — all looping/entry animation ───── */}
      <style>{`
        /* ── RTL mirror flag ──
           Every x-axis translation and rotation in this hero multiplies
           by var(--hero-mirror, 1). LTR keeps 1, RTL flips to -1 so the
           same keyframes produce a perfectly mirrored animation —
           birds fly right-to-left, gear icons arc the other way,
           mountains slide in from the right, drifts oscillate the
           opposite direction. No duplicated keyframes. */
        .hero-mounted { --hero-mirror: 1; }
        [dir="rtl"] .hero-mounted,
        :where(html[lang="ar"]) .hero-mounted { --hero-mirror: -1; }

        /* Letter wave on the BINGO mark */
        @keyframes hero-bingo-wave {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        /* Sun halo + core perpetual pulse */
        @keyframes hero-sun-halo {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%      { transform: scale(1.10); opacity: 1;    }
        }
        @keyframes hero-sun-core {
          0%, 100% { transform: scale(1);    }
          50%      { transform: scale(1.04); }
        }
        /* Sun shine — rays rotate slowly + pulse opacity */
        @keyframes hero-sun-rays-spin  { to { transform: rotate(360deg); } }
        @keyframes hero-sun-rays-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1;    }
        }
        .hero-mounted .hero-sun-halo     { animation: hero-sun-halo 4.5s ease-in-out infinite; }
        .hero-mounted .hero-sun-core     { animation: hero-sun-core 3.6s ease-in-out infinite; }
        .hero-mounted .hero-sun-rays     { animation: hero-sun-rays-spin 20s linear infinite; }
        .hero-mounted .hero-sun-rays > g { animation: hero-sun-rays-pulse 3.6s ease-in-out infinite; }

        /* Mountain entry slide-ins — LTR comes from the left, RTL
           comes from the right (mirror flips the sign). */
        @keyframes hero-mount-entry-back  { from { transform: translateX(calc(-90px  * var(--hero-mirror, 1))); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes hero-mount-entry-mid   { from { transform: translateX(calc(-120px * var(--hero-mirror, 1))); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes hero-mount-entry-front { from { transform: translateX(calc(-160px * var(--hero-mirror, 1))); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        /* Mountain perpetual drift — oscillation direction also mirrors. */
        @keyframes hero-mount-drift-back  { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(calc(-6px * var(--hero-mirror, 1))); } }
        @keyframes hero-mount-drift-mid   { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(calc(4px  * var(--hero-mirror, 1))); } }
        @keyframes hero-mount-drift-front { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(calc(-3px * var(--hero-mirror, 1))); } }
        .hero-mount-entry-back,
        .hero-mount-entry-mid,
        .hero-mount-entry-front { opacity: 0; }
        .hero-mounted .hero-mount-entry-back  { animation: hero-mount-entry-back  1300ms cubic-bezier(0.16, 1, 0.3, 1) 100ms forwards; }
        .hero-mounted .hero-mount-entry-mid   { animation: hero-mount-entry-mid   1200ms cubic-bezier(0.16, 1, 0.3, 1) 350ms forwards; }
        .hero-mounted .hero-mount-entry-front { animation: hero-mount-entry-front 1100ms cubic-bezier(0.16, 1, 0.3, 1) 600ms forwards; }
        .hero-mounted .hero-mount-back   { animation: hero-mount-drift-back  14s ease-in-out 1500ms infinite; }
        .hero-mounted .hero-mount-mid    { animation: hero-mount-drift-mid   12s ease-in-out 1500ms infinite; }
        .hero-mounted .hero-mount-front  { animation: hero-mount-drift-front 10s ease-in-out 1500ms infinite; }

        /* BINGO letter wave */
        .hero-bingo-letter { display: inline-block; will-change: transform; }
        .hero-bingo-mounted .hero-bingo-letter { animation: hero-bingo-wave 2.6s ease-in-out infinite; }

        /* Birds — full-hero-width crossing.
           Each bird is its own absolutely-positioned SVG.

           Anchor swap: LTR pins left:0 (birds emerge from the left
           edge); RTL pins right:0 (birds emerge from the right). The
           translateX values then get multiplied by --hero-mirror so
           the SAME keyframe produces a left-to-right glide in LTR and
           a right-to-left glide in RTL. Negative delays start birds
           mid-flight so the sky is never empty. */
        @keyframes hero-bird-fly {
          0%   { transform: translateX(calc(-120px * var(--hero-mirror, 1))); opacity: 0; }
          6%   { opacity: 0.8; }
          94%  { opacity: 0.8; }
          100% { transform: translateX(calc((100vw + 120px) * var(--hero-mirror, 1))); opacity: 0; }
        }
        .hero-bird {
          position: absolute;
          left: 0;
          z-index: 5;
          pointer-events: none;
          opacity: 0;
          color: #3D341F;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          will-change: transform;
        }
        [dir="rtl"] .hero-bird,
        :where(html[lang="ar"]) .hero-bird { left: auto; right: 0; }
        .hero-bird-1 { top: 10%; width: 32px; stroke-width: 1.8; }
        .hero-bird-2 { top: 18%; width: 42px; stroke-width: 1.7; }
        .hero-bird-3 { top: 26%; width: 28px; stroke-width: 1.5; }
        .hero-bird-4 { top: 14%; width: 36px; stroke-width: 1.6; }
        .hero-bird-5 { top: 32%; width: 32px; stroke-width: 1.6; }
        .hero-bird-6 { top:  8%; width: 26px; stroke-width: 1.4; }
        .hero-bird-7 { top: 40%; width: 24px; stroke-width: 1.3; }
        .hero-bird-8 { top: 22%; width: 38px; stroke-width: 1.7; }
        .hero-mounted .hero-bird-1 { animation: hero-bird-fly 26s linear  -2s infinite; }
        .hero-mounted .hero-bird-2 { animation: hero-bird-fly 32s linear  -8s infinite; }
        .hero-mounted .hero-bird-3 { animation: hero-bird-fly 24s linear -16s infinite; }
        .hero-mounted .hero-bird-4 { animation: hero-bird-fly 28s linear  -6s infinite; }
        .hero-mounted .hero-bird-5 { animation: hero-bird-fly 30s linear -14s infinite; }
        .hero-mounted .hero-bird-6 { animation: hero-bird-fly 22s linear -20s infinite; }
        .hero-mounted .hero-bird-7 { animation: hero-bird-fly 27s linear  -1s infinite; }
        .hero-mounted .hero-bird-8 { animation: hero-bird-fly 33s linear -11s infinite; }

        /* Camping gear — eight icons thrown one at a time, four
           trajectory variants (A/B/C/D) for randomness. Each owns
           1/8 of the 12 s cycle (1.5 s active = 12.5 %).

           Trajectories are LONGER on x (~240 px) and land DEEP into
           the mountain silhouettes (close to launch level) so the
           icon clearly meets the ridge before fading. Opacity holds
           at 1 throughout the entire arc; the snap to 0 happens
           well past landing (12.55 %), inside the dead zone where
           the silhouette already occludes the icon. */

        /* Variant A — standard arc, +360°.   peak -250, land (120, -30) */
        @keyframes hero-gear-throw-a {
          0%       { transform: translateX(-50%) translate(-120px,    0)        rotate(0deg);   opacity: 0; }
          1.5625%  { transform: translateX(-50%) translate(-90px,    -109.4px)  rotate(45deg);  opacity: 1; }
          3.125%   { transform: translateX(-50%) translate(-60px,    -187.5px)  rotate(90deg);  opacity: 1; }
          4.6875%  { transform: translateX(-50%) translate(-30px,    -234.4px)  rotate(135deg); opacity: 1; }
          6.25%    { transform: translateX(-50%) translate(0,        -250px)    rotate(180deg); opacity: 1; }
          7.8125%  { transform: translateX(-50%) translate(30px,     -236.25px) rotate(225deg); opacity: 1; }
          9.375%   { transform: translateX(-50%) translate(60px,     -195px)    rotate(270deg); opacity: 1; }
          10.9375% { transform: translateX(-50%) translate(90px,     -126.25px) rotate(315deg); opacity: 1; }
          12.5%    { transform: translateX(-50%) translate(120px,    -30px)     rotate(360deg); opacity: 1; }
          12.55%   { opacity: 0; }
          100%     { transform: translateX(-50%) translate(120px,    -30px)     rotate(360deg); opacity: 0; }
        }

        /* Variant B — high jumper, +360°.    peak -310, land (110, -25) */
        @keyframes hero-gear-throw-b {
          0%       { transform: translateX(-50%) translate(-100px,    0)        rotate(0deg);   opacity: 0; }
          1.5625%  { transform: translateX(-50%) translate(-73.75px, -135.6px)  rotate(45deg);  opacity: 1; }
          3.125%   { transform: translateX(-50%) translate(-47.5px,  -232.5px)  rotate(90deg);  opacity: 1; }
          4.6875%  { transform: translateX(-50%) translate(-21.25px, -290.6px)  rotate(135deg); opacity: 1; }
          6.25%    { transform: translateX(-50%) translate(5px,      -310px)    rotate(180deg); opacity: 1; }
          7.8125%  { transform: translateX(-50%) translate(31.25px,  -292.19px) rotate(225deg); opacity: 1; }
          9.375%   { transform: translateX(-50%) translate(57.5px,   -238.75px) rotate(270deg); opacity: 1; }
          10.9375% { transform: translateX(-50%) translate(83.75px,  -149.69px) rotate(315deg); opacity: 1; }
          12.5%    { transform: translateX(-50%) translate(110px,    -25px)     rotate(360deg); opacity: 1; }
          12.55%   { opacity: 0; }
          100%     { transform: translateX(-50%) translate(110px,    -25px)     rotate(360deg); opacity: 0; }
        }

        /* Variant C — low + wide, counter-clockwise. peak -210, land (130, -50) */
        @keyframes hero-gear-throw-c {
          0%       { transform: translateX(-50%) translate(-130px,    0)        rotate(0deg);    opacity: 0; }
          1.5625%  { transform: translateX(-50%) translate(-97.5px,  -91.88px)  rotate(-45deg);  opacity: 1; }
          3.125%   { transform: translateX(-50%) translate(-65px,    -157.5px)  rotate(-90deg);  opacity: 1; }
          4.6875%  { transform: translateX(-50%) translate(-32.5px,  -196.88px) rotate(-135deg); opacity: 1; }
          6.25%    { transform: translateX(-50%) translate(0,        -210px)    rotate(-180deg); opacity: 1; }
          7.8125%  { transform: translateX(-50%) translate(32.5px,   -200px)    rotate(-225deg); opacity: 1; }
          9.375%   { transform: translateX(-50%) translate(65px,     -170px)    rotate(-270deg); opacity: 1; }
          10.9375% { transform: translateX(-50%) translate(97.5px,   -120px)    rotate(-315deg); opacity: 1; }
          12.5%    { transform: translateX(-50%) translate(130px,    -50px)     rotate(-360deg); opacity: 1; }
          12.55%   { opacity: 0; }
          100%     { transform: translateX(-50%) translate(130px,    -50px)     rotate(-360deg); opacity: 0; }
        }

        /* Variant D — off-centre, double spin. peak -280, land (140, -20), +720° */
        @keyframes hero-gear-throw-d {
          0%       { transform: translateX(-50%) translate(-110px,    0)        rotate(0deg);   opacity: 0; }
          1.5625%  { transform: translateX(-50%) translate(-78.75px, -122.5px)  rotate(90deg);  opacity: 1; }
          3.125%   { transform: translateX(-50%) translate(-47.5px,  -210px)    rotate(180deg); opacity: 1; }
          4.6875%  { transform: translateX(-50%) translate(-16.25px, -262.5px)  rotate(270deg); opacity: 1; }
          6.25%    { transform: translateX(-50%) translate(15px,     -280px)    rotate(360deg); opacity: 1; }
          7.8125%  { transform: translateX(-50%) translate(46.25px,  -263.75px) rotate(450deg); opacity: 1; }
          9.375%   { transform: translateX(-50%) translate(77.5px,   -215px)    rotate(540deg); opacity: 1; }
          10.9375% { transform: translateX(-50%) translate(108.75px, -133.75px) rotate(630deg); opacity: 1; }
          12.5%    { transform: translateX(-50%) translate(140px,    -20px)     rotate(720deg); opacity: 1; }
          12.55%   { opacity: 0; }
          100%     { transform: translateX(-50%) translate(140px,    -20px)     rotate(720deg); opacity: 0; }
        }
        .hero-gear {
          position: absolute;
          left: 75%;
          bottom: 80px;
          transform: translateX(-50%);
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          will-change: transform, opacity;
          color: #1F3A1E;
        }
        @media (min-width: 640px) { .hero-gear { bottom: 120px; } }
        @media (min-width: 768px) { .hero-gear { bottom: 150px; } }
        .hero-mounted .hero-gear-1 { animation: hero-gear-throw-a 12s linear  0s   infinite; }
        .hero-mounted .hero-gear-2 { animation: hero-gear-throw-b 12s linear  1.5s infinite; }
        .hero-mounted .hero-gear-3 { animation: hero-gear-throw-c 12s linear  3s   infinite; }
        .hero-mounted .hero-gear-4 { animation: hero-gear-throw-d 12s linear  4.5s infinite; }
        .hero-mounted .hero-gear-5 { animation: hero-gear-throw-a 12s linear  6s   infinite; }
        .hero-mounted .hero-gear-6 { animation: hero-gear-throw-b 12s linear  7.5s infinite; }
        .hero-mounted .hero-gear-7 { animation: hero-gear-throw-c 12s linear  9s   infinite; }
        .hero-mounted .hero-gear-8 { animation: hero-gear-throw-d 12s linear 10.5s infinite; }

        /* Animated slogan — KINETIC TYPOGRAPHY (After Effects style).
           Each slogan is split into WORDS in the JSX. Each word is its
           own span with a staggered animation-delay so the words
           cascade in and out one after the other. Per-word motion:
             0%   : hidden — 34 px below, rotated 70° forward on X,
                    scaled 1.15, blurred 6 px
             6%   : at rest position — translate/rotate/scale all 0,
                    no blur (the back-out cubic-bezier overshoots
                    naturally between these two keyframes)
             19%  : still holding visible
             25%  : flipped away — 28 px up, rotated -50° back on X,
                    scaled 0.9, blurred 5 px, opacity 0
             100% : stays gone until the next iteration kicks in
           4 slogans × 4 s slot = 16 s full cycle.
           Word stagger of 80 ms gives the cinematic "wave" feel
           through each slogan as it lands. */
        @keyframes hero-slogan-action {
          0%   { opacity: 0; transform: translateY(34px) rotateX(70deg)  scale(1.15); filter: blur(6px); }
          6%   { opacity: 1; transform: translateY(0)    rotateX(0deg)   scale(1);    filter: blur(0);   }
          19%  { opacity: 1; transform: translateY(0)    rotateX(0deg)   scale(1);    filter: blur(0);   }
          25%  { opacity: 0; transform: translateY(-28px) rotateX(-50deg) scale(0.9);  filter: blur(5px); }
          100% { opacity: 0; transform: translateY(-28px) rotateX(-50deg) scale(0.9);  filter: blur(5px); }
        }
        .hero-slogan {
          position: relative;
          display: block;
          min-height: 1.6em;
          perspective: 800px;
        }
        .hero-slogan-line {
          position: absolute;
          inset-inline-start: 0;
          top: 0;
          white-space: nowrap;
        }
        .hero-slogan-word {
          display: inline-block;
          opacity: 0;
          transform-origin: center bottom;
          will-change: transform, opacity, filter;
        }
        .hero-mounted .hero-slogan-word {
          animation: hero-slogan-action 16s cubic-bezier(0.34, 1.5, 0.64, 1) infinite;
        }
      `}</style>

      {/* ───── Sun (HTML, never clipped) ───── */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-0 transition-all duration-1000 ease-out",
          isRtl ? "left-[14%]" : "right-[14%]",
          "top-[28%] sm:top-[24%] md:top-[22%]",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        )}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="relative size-12 sm:size-14 md:size-16">
          {/* Halo */}
          <div
            className="hero-sun-halo absolute -inset-[100%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(252, 217, 176, 0.65) 0%, rgba(249, 173, 101, 0.22) 50%, transparent 78%)",
            }}
          />
          {/* Shine — 12 rays rotating around the disc */}
          <svg
            aria-hidden
            viewBox="0 0 200 200"
            className="hero-sun-rays absolute -inset-[80%]"
          >
            <g
              stroke="rgba(252, 217, 176, 0.85)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const long = i % 2 === 0;
                const y1 = long ? 20 : 28;
                const y2 = long ? 42 : 38;
                return (
                  <line
                    key={i}
                    x1="100"
                    y1={y1}
                    x2="100"
                    y2={y2}
                    transform={`rotate(${i * 30} 100 100)`}
                  />
                );
              })}
            </g>
          </svg>
          {/* Core disc */}
          <div className="hero-sun-core absolute inset-0 rounded-full bg-tangerine-400 shadow-[0_0_24px_rgba(249,173,101,0.5)]">
            <div className="absolute left-[18%] top-[18%] size-[28%] rounded-full bg-tangerine-100/60" />
          </div>
        </div>
      </div>

      {/* ───── Birds — eight V-silhouettes crossing the FULL hero width.
          Each is its own absolutely-positioned <svg> at z-5, so they
          glide BEHIND the foreground text container (z-10). ───── */}
      {Array.from({ length: 8 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 40 12"
          preserveAspectRatio="xMidYMid meet"
          className={`hero-bird hero-bird-${i + 1}`}
        >
          <path d="M 2 10 q 8 -7 16 0 q 8 -7 16 0" />
        </svg>
      ))}

      {/* ───── Camping gear — eight icons popping from behind the
          mountains in a staggered wave. ───── */}
      <div className="hero-gear hero-gear-1"><Pickaxe className="size-12 sm:size-14 md:size-16" strokeWidth={1.8} /></div>
      <div className="hero-gear hero-gear-2"><Tent className="size-12 sm:size-14 md:size-16" strokeWidth={1.8} /></div>
      <div className="hero-gear hero-gear-3"><Axe className="size-12 sm:size-14 md:size-16" strokeWidth={1.8} /></div>
      <div className="hero-gear hero-gear-4"><Compass className="size-12 sm:size-14 md:size-16" strokeWidth={1.8} /></div>
      <div className="hero-gear hero-gear-5"><Flame className="size-12 sm:size-14 md:size-16" strokeWidth={1.8} /></div>
      <div className="hero-gear hero-gear-6"><Backpack className="size-12 sm:size-14 md:size-16" strokeWidth={1.8} /></div>
      <div className="hero-gear hero-gear-7"><TreePine className="size-12 sm:size-14 md:size-16" strokeWidth={1.8} /></div>
      <div className="hero-gear hero-gear-8"><Map className="size-12 sm:size-14 md:size-16" strokeWidth={1.8} /></div>

      {/* ───── Foreground content ───── */}
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-[680px] max-w-7xl flex-col px-4 pt-16 pb-[320px] sm:min-h-[760px] sm:px-8 sm:pt-20 sm:pb-[360px] md:min-h-[840px] md:pt-24 md:pb-[400px]",
          isRtl ? "items-end text-right" : "items-start text-left"
        )}
      >
        {/* BINGO wordmark — letters cascade in, then ride the wave */}
        <h1
          id="hero-title"
          className={cn(
            "font-display font-medium leading-[0.82] tracking-[-0.06em] text-forest-900",
            "text-[88px] sm:text-[136px] md:text-[184px] lg:text-[224px]",
            mounted && "hero-bingo-mounted"
          )}
        >
          {letters.map((char, i) => (
            <span
              key={i}
              aria-hidden={i > 0}
              className={cn(
                "hero-bingo-letter transition-all duration-700 ease-out",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transitionDelay: `${500 + i * 110}ms`,
                animationDelay: `${i * 160}ms`,
              }}
            >
              {char}
            </span>
          ))}
          <span
            aria-hidden
            className={cn(
              "ms-2 inline-block text-tangerine-500 transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "1100ms" }}
          >
            .
          </span>
          <span className="sr-only">BINGO</span>
        </h1>

        {/* Hairline */}
        <div
          aria-hidden
          className={cn(
            "mt-3 h-px w-16 bg-wood-700/40 transition-all duration-700 ease-out sm:mt-4",
            isRtl ? "ms-auto" : "me-auto",
            mounted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
            isRtl ? "origin-right" : "origin-left"
          )}
          style={{ transitionDelay: "1300ms" }}
        />

        {/* Animated slogans — kinetic typography. Each slogan is split
            into WORDS that cascade in with 3D rotation + motion blur,
            hold, then flip away. Word-level (not letter-level) so
            Arabic shaping is preserved. */}
        <div
          className={cn(
            "hero-slogan mt-5 max-w-xl font-display text-xs font-semibold uppercase tracking-[0.18em] text-tangerine-700 transition-opacity duration-700 sm:text-sm",
            mounted ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDelay: "1500ms" }}
        >
          {(
            [
              { text: t("home.hero.slogan1"), delay: 0 },
              { text: t("home.hero.slogan2"), delay: 4 },
              { text: t("home.hero.slogan3"), delay: 8 },
              { text: t("home.hero.slogan4"), delay: 12 },
            ] as const
          ).map((slogan, sIdx) => {
            const words = slogan.text.split(" ");
            return (
              <span key={sIdx} className="hero-slogan-line">
                {words.map((word, wIdx) => (
                  <span
                    key={wIdx}
                    className="hero-slogan-word"
                    style={{
                      animationDelay: `${slogan.delay + wIdx * 0.08}s`,
                    }}
                  >
                    {word}
                    {wIdx < words.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
            );
          })}
        </div>
      </div>

      {/* ───── Scroll indicator ───── */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1.5 transition-opacity duration-700 sm:flex",
          mounted ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "2200ms" }}
      >
        <Mono className="text-wood-700/60 tracking-[0.25em]">SCROLL</Mono>
        <ArrowDown className="size-3.5 text-wood-700/70 animate-bounce" />
      </div>

      {/* ───── Mountain scene — filled silhouettes. z-15 so it always
          covers the foreground text where they overlap (the silhouettes
          remain on top of everything else, unifying the hero into one
          continuous container). ───── */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 280"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 z-[15] h-[260px] w-full sm:h-[300px] md:h-[340px]"
      >
        {/* Back layer */}
        <g className="hero-mount-entry-back">
          <g className="hero-mount-back">
            <path
              d="M -60 110
                 C 160 60, 320 95, 460 110
                 C 600 125, 740 80, 880 105
                 C 1020 130, 1160 90, 1300 110
                 C 1380 120, 1440 115, 1500 117
                 L 1500 300
                 L -60 300 Z"
              fill="#C9B58E"
              opacity="0.85"
            />
          </g>
        </g>

        {/* Mid layer */}
        <g className="hero-mount-entry-mid">
          <g className="hero-mount-mid">
            <path
              d="M -60 140
                 L 90 50
                 L 195 100
                 L 305 30
                 L 405 90
                 L 540 45
                 L 665 100
                 L 790 50
                 L 920 105
                 L 1050 60
                 L 1195 115
                 L 1320 70
                 L 1440 115
                 L 1500 120
                 L 1500 300
                 L -60 300 Z"
              fill="#7A6035"
            />
            <path
              d="M 90 50 L 195 100 M 305 30 L 405 90 M 540 45 L 665 100 M 790 50 L 920 105 M 1050 60 L 1195 115 M 1320 70 L 1440 115"
              stroke="#9C7E48"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </g>
        </g>

        {/* Front layer with pines */}
        <g className="hero-mount-entry-front">
          <g className="hero-mount-front">
            <path
              d="M -60 180
                 L 80 90
                 L 165 160
                 L 265 70
                 L 380 155
                 L 495 100
                 L 620 175
                 L 770 90
                 L 900 160
                 L 1040 100
                 L 1185 160
                 L 1325 115
                 L 1440 150
                 L 1500 170
                 L 1500 300
                 L -60 300 Z"
              fill="#1F3A1E"
            />
            <g fill="#0F2410" opacity="0.85">
              {[
                { x: 130, y: 122, h: 16 },
                { x: 220, y: 118, h: 12 },
                { x: 320, y: 110, h: 20 },
                { x: 410, y: 132, h: 14 },
                { x: 540, y: 128, h: 18 },
                { x: 700, y: 138, h: 15 },
                { x: 840, y: 120, h: 19 },
                { x: 985, y: 130, h: 12 },
                { x: 1120, y: 125, h: 17 },
                { x: 1265, y: 132, h: 14 },
                { x: 1400, y: 140, h: 16 },
              ].map((p, i) => (
                <path
                  key={i}
                  d={`M ${p.x} ${p.y}
                      l -${p.h * 0.35} ${p.h * 0.5}
                      l ${p.h * 0.18} 0
                      l -${p.h * 0.28} ${p.h * 0.4}
                      l ${p.h * 0.14} 0
                      l -${p.h * 0.22} ${p.h * 0.35}
                      l ${p.h * 0.94} 0
                      l -${p.h * 0.22} -${p.h * 0.35}
                      l ${p.h * 0.14} 0
                      l -${p.h * 0.28} -${p.h * 0.4}
                      l ${p.h * 0.18} 0
                      Z`}
                />
              ))}
            </g>
          </g>
        </g>

        {/* Horizon shadow line */}
        <rect x="-60" y="298" width="1560" height="4" fill="#0A1A0B" opacity="0.4" />
      </svg>
    </section>
  );
}
