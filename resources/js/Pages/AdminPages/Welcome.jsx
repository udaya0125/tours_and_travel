// import AdminWrapper from '@/AdminWrapper/AdminWrapper'
// import React from 'react'

// const Welcome = () => {
//   return (
//     <>
//       <AdminWrapper>
//         <h2 className='text-2xl font-bold text-center justify-between'>Welcome to Admin Dashboard</h2>
//       </AdminWrapper>
//     </>
//   )
// }

// export default Welcome

import React, { useEffect, useRef } from "react";

const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const FADE_DURATION = 0.5;

const Welcome = () => {
    const videoRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const tick = () => {
            if (!video.duration || isNaN(video.duration)) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }
            const t = video.currentTime;
            const d = video.duration;
            const fadeEnd = d - FADE_DURATION;
            let opacity = 1;
            if (t < FADE_DURATION) opacity = t / FADE_DURATION;
            else if (t > fadeEnd) opacity = (d - t) / FADE_DURATION;
            video.style.opacity = Math.max(0, Math.min(1, opacity));
            rafRef.current = requestAnimationFrame(tick);
        };

        const handleEnded = () => {
            video.style.opacity = 0;
            setTimeout(() => {
                video.currentTime = 0;
                video.play();
            }, 100);
        };

        const handleCanPlay = () => {
            video.play().catch(() => {});
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(tick);
        };

        video.addEventListener("ended", handleEnded);
        video.addEventListener("canplay", handleCanPlay);

        return () => {
            video.removeEventListener("ended", handleEnded);
            video.removeEventListener("canplay", handleCanPlay);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            <style>{`
        @keyframes fade-rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fade-rise {
          animation: fade-rise 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-rise-delay {
          animation: fade-rise 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-fade-rise-delay-2 {
          animation: fade-rise 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        .animate-fade-rise-delay-3 {
          animation: fade-rise 0.8s ease-out 0.55s forwards;
          opacity: 0;
        }
        .login-btn {
          border: 1.5px solid #000000;
          background: transparent;
          color: #000000;
          padding: 0.5rem 1.4rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-family: var(--font-body);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }
        .login-btn:hover {
          background: #000000;
          color: #ffffff;
          transform: scale(1.03);
        }
        .pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #f5f5f5;
          border: 1px solid #e5e5e5;
          border-radius: 9999px;
          padding: 0.35rem 1rem;
          font-size: 0.78rem;
          color: #6F6F6F;
          font-family: var(--font-body);
          letter-spacing: 0.04em;
        }
        .explore-btn {
          background: #000000;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 1.1rem 3rem;
          font-size: 0.95rem;
          font-family: var(--font-body);
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .explore-btn:hover { transform: scale(1.03); opacity: 0.88; }
        .ghost-btn {
          background: transparent;
          color: #000000;
          border: 1.5px solid #d4d4d4;
          border-radius: 9999px;
          padding: 1.1rem 2.4rem;
          font-size: 0.95rem;
          font-family: var(--font-body);
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ghost-btn:hover { border-color: #000; transform: scale(1.03); }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-rise, .animate-fade-rise-delay,
          .animate-fade-rise-delay-2, .animate-fade-rise-delay-3 {
            animation: none; opacity: 1; transform: none;
          }
        }
      `}</style>

            <div className="relative min-h-screen w-full overflow-hidden bg-white">
                {/* ── Video background ── */}
                <div
                    className="absolute inset-x-0 bottom-0 z-0 overflow-hidden"
                    style={{ top: "300px" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10 pointer-events-none" />
                    <video
                        ref={videoRef}
                        src={VIDEO_URL}
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover block"
                        style={{ opacity: 0 }}
                    />
                </div>

                {/* ── Navigation ── */}
                <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                    {/* Logo */}
                    <span
                        className="text-3xl tracking-tight select-none"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "#000000",
                        }}
                    >
                        Aethera
                        <sup className="text-xs font-sans font-normal align-super">
                            ®
                        </sup>
                    </span>

                    {/* Login */}
                    <a href="/login" className="login-btn">
                        Log In
                    </a>
                </nav>

                {/* ── Hero section ── */}
                <section
                    className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
                    style={{ paddingTop: "calc(8rem - 75px)" }}
                >
                    {/* Headline */}
                    <h1
                        className="animate-fade-rise-delay font-normal max-w-5xl"
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2.8rem, 8vw, 6rem)",
                            lineHeight: 0.95,
                            letterSpacing: "-2.46px",
                            color: "#000000",
                        }}
                    >
                        Wander far,{" "}
                        <em style={{ color: "#6F6F6F", fontStyle: "italic" }}>
                            return changed.
                        </em>
                    </h1>

                    {/* Description */}
                    <p
                        className="animate-fade-rise-delay-2 max-w-xl flex mt-8 leading-relaxed font-light mx-auto text-center"
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
                            color: "#6F6F6F",
                        }}
                    >
                        Handcrafted travel experiences across Nepal, Southeast
                        Asia, and beyond. From Himalayan treks to coastal
                        retreats — we design journeys that stay with you.
                    </p>

                    {/* CTAs */}
                    <div className="animate-fade-rise-delay-3 flex items-center gap-4 mt-12 flex-wrap justify-center">
                        <button className="explore-btn">
                            Explore Packages
                        </button>
                        <button className="ghost-btn">
                            <span>View Destinations</span>
                            <span style={{ fontSize: "1.1rem" }}>→</span>
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Welcome;
