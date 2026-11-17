"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";

/** CSS-only motion: no animation loop, video, network asset or canvas dependency. */
export function AnimatedPoolHero() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return (
    <section className={`pool-hero${paused || reduced ? " motion-paused" : ""}`} aria-labelledby="hero-title">
      <div className="pool-scene" aria-hidden="true">
        <svg viewBox="0 0 1440 780" preserveAspectRatio="xMidYMid slice" focusable="false">
          <defs>
            <linearGradient id="pool-depth" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#88edfa" />
              <stop offset="55%" stopColor="#35c9ef" />
              <stop offset="100%" stopColor="#199fe4" />
            </linearGradient>
            <pattern id="pool-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="#fff" strokeWidth="1" strokeOpacity=".27" />
            </pattern>
            <pattern id="pool-light" width="290" height="210" patternUnits="userSpaceOnUse">
              <path d="M-40 75Q25 12 90 58T215 55T340 45M-35 155Q45 100 115 145T255 130T360 160M65-30Q110 30 75 100T115 235M225-40Q170 35 220 110T195 250" fill="none" stroke="#fff" strokeWidth="2.5" strokeOpacity=".48" />
              <path d="M-10 87Q52 36 105 77T240 76M-20 169Q70 115 126 160T290 154" fill="none" stroke="#fff" strokeWidth="9" strokeOpacity=".1" />
            </pattern>
            <filter id="buoy-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="7" dy="18" stdDeviation="12" floodColor="#006eab" floodOpacity=".25" />
            </filter>
            <linearGradient id="white-rubber" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fff" /><stop offset="1" stopColor="#e1f4ff" />
            </linearGradient>
          </defs>
          <rect width="1440" height="780" fill="url(#pool-depth)" />
          <g transform="rotate(-20 960 390)">
            <rect x="-350" y="-500" width="2300" height="1800" fill="url(#pool-grid)" />
            <g className="pool-caustics pool-caustics-back"><rect x="-400" y="-500" width="2400" height="1800" fill="url(#pool-light)" /></g>
            <g className="pool-caustics pool-caustics-front"><rect x="-400" y="-500" width="2400" height="1800" fill="url(#pool-light)" /></g>
            {[135, 465, 795].map((y, i) => (
              <g key={y} className={`pool-lane pool-lane-${i}`}>
                <path d={`M-300 ${y + 165}H1810`} stroke="#057ab8" strokeWidth="13" opacity=".43" />
                <path d={`M1370 ${y + 118}V${y + 212}`} stroke="#057ab8" strokeWidth="13" opacity=".43" />
                <path d={`M-300 ${y + 5}H1850`} stroke="#087cae" strokeWidth="18" opacity=".14" />
                <path d={`M-300 ${y}H1850`} stroke="#fff" strokeWidth="15" />
                <path d={`M-300 ${y}H1850`} stroke="#fa414e" strokeWidth="15" strokeDasharray="15 42" />
                <path d={`M-300 ${y - 3}H1850`} stroke="#fff" strokeWidth="2" opacity=".55" />
              </g>
            ))}
          </g>
          <g className="pool-ripples">
            <ellipse className="pool-ripple ripple-one" cx="1080" cy="380" rx="160" ry="150" />
            <ellipse className="pool-ripple ripple-two" cx="1080" cy="380" rx="160" ry="150" />
            <ellipse className="pool-ripple ripple-three" cx="1080" cy="380" rx="160" ry="150" />
          </g>
          <g className="floating-buoy">
            <path className="buoy-rope" d="M1172 441C1305 470 1230 566 1332 622S1424 647 1452 700" fill="none" stroke="#057aaf" strokeWidth="7" opacity=".16" transform="translate(4 9)" />
            <path className="buoy-rope" d="M1172 441C1305 470 1230 566 1332 622S1424 647 1452 700" fill="none" stroke="#fff" strokeWidth="5" />
            <g filter="url(#buoy-shadow)" transform="rotate(-28 1080 380)">
              <circle cx="1080" cy="380" r="126" fill="none" stroke="#fff" strokeWidth="3" opacity=".75" />
              <circle cx="1080" cy="380" r="98" fill="none" stroke="url(#white-rubber)" strokeWidth="48" />
              <circle cx="1080" cy="380" r="98" fill="none" stroke="#f53648" strokeWidth="49" strokeDasharray="77 76.94" />
              <circle cx="1080" cy="380" r="116" fill="none" stroke="#fff" strokeWidth="2.5" opacity=".4" />
              <circle cx="1080" cy="380" r="74" fill="none" stroke="#086ca4" strokeWidth="2" opacity=".18" />
              {[0,90,180,270].map(angle=><path key={angle} d="M1080 252V271" transform={`rotate(${angle} 1080 380)`} stroke="#fff" strokeWidth="5" strokeLinecap="round" />)}
            </g>
          </g>
        </svg>
      </div>
      <div className="pool-reading-shade" aria-hidden="true" />
      <div className="pool-hero-content wrap">
        <div className="pool-hero-copy">
          <span className="pool-label"><span /> NPLQ REVISION</span>
          <h1 id="hero-title">Dive<br /><span>back in<span className="hero-stop">.</span></span></h1>
          <p>Your knowledge. Back at your fingertips. Refresh the essentials, practise a test and get ready for your next lifeguard interview.</p>
          <div className="button-row">
            <Link href="/learn" className="button pool-start">Start learning <ArrowRight size={20} /></Link>
            <Link href="/practice" className="pool-test-link">Take a mock test <ArrowUpRight size={18} /></Link>
          </div>
          <div className="pool-hero-details"><span><strong>42</strong> lessons</span><span><strong>60</strong> practice questions</span><span>Pick up where you left off</span></div>
        </div>
      </div>
      <div className="pool-scene-caption" aria-hidden="true"><span className="caption-line" />THE POOL IS CALLING.</div>
      <button className="motion-toggle" onClick={()=>setPaused(!paused)} disabled={reduced} aria-pressed={paused || reduced} aria-label={reduced ? "Background motion reduced by your device settings" : paused ? "Play background animation" : "Pause background animation"}>
        {paused || reduced ? <Play size={14} /> : <Pause size={14} />}<span>{reduced ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}</span>
      </button>
    </section>
  );
}
