import { useEffect, useRef, useState } from "react";

export function ScrollLensHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  // target/current time refs for smooth lerp
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const seekingRef = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Ensure video stays paused — we drive currentTime manually
    v.pause();

    const ensurePaused = () => {
      if (!v.paused) v.pause();
    };
    v.addEventListener("play", ensurePaused);

    const computeProgress = () => {
      const sec = sectionRef.current;
      if (!sec) return 0;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      return total > 0 ? scrolled / total : 0;
    };

    const syncTarget = () => {
      const p = computeProgress();
      setProgress(p);
      const dur = v.duration;
      if (dur && !isNaN(dur) && isFinite(dur)) {
        targetTimeRef.current = Math.min(dur - 0.05, Math.max(0, p * dur));
      }
    };

    // Continuous rAF loop — smoothly eases currentTime toward target
    const tick = () => {
      const dur = v.duration;
      if (dur && !isNaN(dur) && isFinite(dur) && v.readyState >= 2) {
        const target = targetTimeRef.current;
        const current = currentTimeRef.current;
        // Ease toward target more slowly so the video lags behind scroll.
        const next = current + (target - current) * 0.5;
        currentTimeRef.current = next;
        if (!seekingRef.current && Math.abs(next - v.currentTime) > 0.015) {
          try {
            v.currentTime = next;
          } catch {}
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onSeeking = () => {
      seekingRef.current = true;
    };
    const onSeeked = () => {
      seekingRef.current = false;
    };
    v.addEventListener("seeking", onSeeking);
    v.addEventListener("seeked", onSeeked);

    const onScroll = () => syncTarget();
    const onResize = () => syncTarget();

    // When the tab becomes visible again, force a re-sync.
    // Browsers often pause / unload video timers in background tabs,
    // which makes scrubbing appear "stuck" until the next scroll.
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        // Snap current to target so nothing has to "catch up"
        currentTimeRef.current = targetTimeRef.current;
        try {
          v.pause();
          v.currentTime = targetTimeRef.current;
        } catch {}
        syncTarget();
      }
    };

    const onLoaded = () => {
      syncTarget();
      currentTimeRef.current = targetTimeRef.current;
    };
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("canplay", onLoaded);

    if (v.readyState >= 1) onLoaded();

    syncTarget();
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onVisibility);
    window.addEventListener("focus", onVisibility);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onVisibility);
      window.removeEventListener("focus", onVisibility);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("canplay", onLoaded);
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("play", ensurePaused);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Text fades: intro visible early, outro emerges late
  const introOpacity = Math.max(0, 1 - progress * 3);
  const outroOpacity = Math.max(0, Math.min(1, (progress - 0.7) / 0.25));
  const hintOpacity = Math.max(0, 1 - progress * 6);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "320vh" }}
      aria-label="Hero"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[oklch(0.12_0.01_40)]">
        <video
          ref={videoRef}
          src="/videos/lens-reveal.mp4"
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: `scale(${1.05 + progress * 0.05})`,
            willChange: "transform",
          }}
        />

        {/* warm vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 50%, transparent 40%, oklch(0.12 0.02 40 / 0.55) 100%)",
          }}
        />

        {/* Top nav floating over hero */}
        <div className="absolute inset-x-0 top-0 z-20">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-[oklch(0.98_0.01_80)]">
            <a href="/" className="font-display text-xl tracking-wide">
              Aperture <span className="opacity-60">&</span> Vow
            </a>
            <ul className="hidden gap-8 text-sm md:flex">
              <li><a href="#services" className="opacity-80 hover:opacity-100">Services</a></li>
              <li><a href="#story" className="opacity-80 hover:opacity-100">Story</a></li>
              <li><a href="#gallery" className="opacity-80 hover:opacity-100">Gallery</a></li>
              <li><a href="#contact" className="opacity-80 hover:opacity-100">Contact</a></li>
            </ul>
            <a
              href="#contact"
              className="hidden rounded-sm border border-[oklch(0.98_0.01_80/0.4)] px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-[oklch(0.98_0.01_80/0.1)] md:inline-block"
            >
              Inquire
            </a>
          </nav>
        </div>

        {/* Intro copy */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-[oklch(0.98_0.01_80)]"
          style={{ opacity: introOpacity }}
        >
          <div className="max-w-3xl">
            <p className="mb-6 text-xs uppercase tracking-[0.4em] opacity-80">
              A boutique wedding studio
            </p>
            <h1 className="font-display text-5xl leading-[1.05] md:text-7xl lg:text-8xl text-balance">
              Every love story <em className="italic opacity-90">deserves</em> a perfect frame.
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-base opacity-80 md:text-lg">
              Scroll through the lens — and see the day we'll design for you.
            </p>
          </div>
        </div>

        {/* Outro copy when wedding revealed */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 px-6 pb-24 text-center text-[oklch(0.98_0.01_80)]"
          style={{ opacity: outroOpacity, transform: `translateY(${(1 - outroOpacity) * 24}px)` }}
        >
          <p className="text-xs uppercase tracking-[0.4em] opacity-80">In focus</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-balance">
            Your day, designed in every detail.
          </h2>
        </div>

        {/* scroll hint */}
        <div
          className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
          style={{ opacity: hintOpacity }}
        >
          <div className="flex flex-col items-center gap-2 text-[oklch(0.98_0.01_80)]">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-70">Scroll</span>
            <div className="h-10 w-px bg-[oklch(0.98_0.01_80/0.5)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
