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

import { usePage } from "@inertiajs/react";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import axios from "axios";

const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const FADE_DURATION = 0.5;

const Welcome = () => {
    const videoRef = useRef(null);
    const rafRef = useRef(null);
    const heroRef = useRef(null);
    const user = usePage().props.auth.user;

    // Video cross-fade loop (start/end of clip fades through white)
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

    // Hero entrance — orchestrated with GSAP, scoped to the section
    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

                tl.set(".hero-headline-word", { yPercent: 110, opacity: 0 })
                    .set(".hero-desc, .hero-cta", { y: 24, opacity: 0 })
                    .to(".hero-headline-word", {
                        yPercent: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.08,
                    })
                    .to(
                        ".hero-desc",
                        { y: 0, opacity: 1, duration: 0.8 },
                        "-=0.55",
                    )
                    .to(
                        ".hero-cta",
                        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15 },
                        "-=0.45",
                    );
            });

            // Respect reduced-motion users: show final state immediately
            mm.add("(prefers-reduced-motion: reduce)", () => {
                gsap.set(".hero-headline-word, .hero-desc, .hero-cta", {
                    opacity: 1,
                    y: 0,
                    yPercent: 0,
                });
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(route("logout"));
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/login";
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-white">
            {/* Video background */}
            <div className="absolute inset-x-0 bottom-0 top-[300px] z-0 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white via-transparent to-white" />
                <video
                    ref={videoRef}
                    src={VIDEO_URL}
                    muted
                    playsInline
                    preload="auto"
                    className="block h-full w-full object-cover opacity-0"
                />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
                <span className="select-none font-[var(--font-display)] text-3xl tracking-tight text-black">
                    Tours and Travel
                    <sup className="align-super font-sans text-xs font-normal">
                        ®
                    </sup>
                </span>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-medium text-black">
                            Welcome, {user.name}!
                        </span>
                        <button
                            onClick={handleLogout}
                            className="inline-block rounded-full border-[1.5px] border-black px-[1.4rem] py-2 font-[var(--font-body)] text-sm text-black transition-all duration-200 hover:scale-[1.03] hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <a
                        href="/login"
                        className="inline-block rounded-full border-[1.5px] border-black px-[1.4rem] py-2 font-[var(--font-body)] text-sm text-black transition-all duration-200 hover:scale-[1.03] hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        Log In
                    </a>
                )}
            </nav>

            {/* Hero */}
            <section
                ref={heroRef}
                className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 pt-[calc(8rem_-_75px)] text-center"
            >
                <h1 className="max-w-5xl font-[var(--font-display)] text-[clamp(2.8rem,8vw,6rem)] font-normal leading-[0.95] tracking-[-2.46px] text-black">
                    <span className="inline-block overflow-hidden align-bottom">
                        <span className="hero-headline-word inline-block">
                            Wander&nbsp;far,
                        </span>
                    </span>{" "}
                    <span className="inline-block overflow-hidden align-bottom">
                        <span className="hero-headline-word inline-block italic text-[#6F6F6F]">
                            return&nbsp;changed.
                        </span>
                    </span>
                </h1>

                <p className="hero-desc mx-auto mt-8 max-w-xl font-[var(--font-body)] text-[clamp(0.95rem,1.4vw,1.05rem)] font-light leading-relaxed text-[#6F6F6F]">
                    Handcrafted travel experiences across Nepal, Southeast Asia,
                    and beyond. From Himalayan treks to coastal retreats we
                    design journeys that stay with you.
                </p>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                    {user ? (
                        <>
                            <a
                                href="/dashboard"
                                className="hero-cta rounded-full bg-black px-12 py-[1.1rem] font-[var(--font-body)] text-[0.95rem] text-white transition-all duration-200 hover:scale-[1.03] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                            >
                                Dashboard
                            </a>
                            <a
                                href="/packages"
                                className="hero-cta inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#d4d4d4] bg-transparent px-10 py-[1.1rem] font-[var(--font-body)] text-[0.95rem] text-black transition-all duration-200 hover:scale-[1.03] hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                            >
                                <span>Packages</span>
                                <span className="text-[1.1rem]">→</span>
                            </a>
                        </>
                    ) : (
                        <a
                            href="/login"
                            className="hero-cta rounded-full bg-black px-12 py-[1.1rem] font-[var(--font-body)] text-[0.95rem] text-white transition-all duration-200 hover:scale-[1.03] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                            Log In
                        </a>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Welcome;

// import { usePage } from "@inertiajs/react";
// import React, { useEffect, useRef } from "react";

// const VIDEO_URL =
//     "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

// const FADE_DURATION = 0.5;

// const Welcome = () => {
//     const videoRef = useRef(null);
//     const rafRef = useRef(null);
//     const user = usePage().props.auth.user;

//     useEffect(() => {
//         const video = videoRef.current;
//         if (!video) return;

//         const tick = () => {
//             if (!video.duration || isNaN(video.duration)) {
//                 rafRef.current = requestAnimationFrame(tick);
//                 return;
//             }
//             const t = video.currentTime;
//             const d = video.duration;
//             const fadeEnd = d - FADE_DURATION;
//             let opacity = 1;
//             if (t < FADE_DURATION) opacity = t / FADE_DURATION;
//             else if (t > fadeEnd) opacity = (d - t) / FADE_DURATION;
//             video.style.opacity = Math.max(0, Math.min(1, opacity));
//             rafRef.current = requestAnimationFrame(tick);
//         };

//         const handleEnded = () => {
//             video.style.opacity = 0;
//             setTimeout(() => {
//                 video.currentTime = 0;
//                 video.play();
//             }, 100);
//         };

//         const handleCanPlay = () => {
//             video.play().catch(() => {});
//             if (rafRef.current) cancelAnimationFrame(rafRef.current);
//             rafRef.current = requestAnimationFrame(tick);
//         };

//         video.addEventListener("ended", handleEnded);
//         video.addEventListener("canplay", handleCanPlay);

//         return () => {
//             video.removeEventListener("ended", handleEnded);
//             video.removeEventListener("canplay", handleCanPlay);
//             if (rafRef.current) cancelAnimationFrame(rafRef.current);
//         };
//     }, []);

//     return (
//         <>
//             <style>{`
//         @keyframes fade-rise {
//           from { opacity: 0; transform: translateY(20px); }
//           to   { opacity: 1; transform: translateY(0);    }
//         }
//         .animate-fade-rise {
//           animation: fade-rise 0.8s ease-out forwards;
//           opacity: 0;
//         }
//         .animate-fade-rise-delay {
//           animation: fade-rise 0.8s ease-out 0.2s forwards;
//           opacity: 0;
//         }
//         .animate-fade-rise-delay-2 {
//           animation: fade-rise 0.8s ease-out 0.4s forwards;
//           opacity: 0;
//         }
//         .animate-fade-rise-delay-3 {
//           animation: fade-rise 0.8s ease-out 0.55s forwards;
//           opacity: 0;
//         }
//         .login-btn {
//           border: 1.5px solid #000000;
//           background: transparent;
//           color: #000000;
//           padding: 0.5rem 1.4rem;
//           border-radius: 9999px;
//           font-size: 0.875rem;
//           font-family: var(--font-body);
//           cursor: pointer;
//           transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
//           text-decoration: none;
//           display: inline-block;
//         }
//         .login-btn:hover {
//           background: #000000;
//           color: #ffffff;
//           transform: scale(1.03);
//         }

//         .explore-btn {
//           background: #000000;
//           color: #ffffff;
//           border: none;
//           border-radius: 9999px;
//           padding: 1.1rem 3rem;
//           font-size: 0.95rem;
//           font-family: var(--font-body);
//           cursor: pointer;
//           transition: transform 0.2s ease, opacity 0.2s ease;
//         }
//         .explore-btn:hover { transform: scale(1.03); opacity: 0.88; }
//         .ghost-btn {
//           background: transparent;
//           color: #000000;
//           border: 1.5px solid #d4d4d4;
//           border-radius: 9999px;
//           padding: 1.1rem 2.4rem;
//           font-size: 0.95rem;
//           font-family: var(--font-body);
//           cursor: pointer;
//           transition: border-color 0.2s ease, transform 0.2s ease;
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//         }
//         .ghost-btn:hover { border-color: #000; transform: scale(1.03); }
//         @media (prefers-reduced-motion: reduce) {
//           .animate-fade-rise, .animate-fade-rise-delay,
//           .animate-fade-rise-delay-2, .animate-fade-rise-delay-3 {
//             animation: none; opacity: 1; transform: none;
//           }
//         }
//       `}</style>

//             <div className="relative min-h-screen w-full overflow-hidden bg-white">
//                 {/* ── Video background ── */}
//                 <div
//                     className="absolute inset-x-0 bottom-0 z-0 overflow-hidden"
//                     style={{ top: "300px" }}
//                 >
//                     <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10 pointer-events-none" />
//                     <video
//                         ref={videoRef}
//                         src={VIDEO_URL}
//                         muted
//                         playsInline
//                         preload="auto"
//                         className="w-full h-full object-cover block"
//                         style={{ opacity: 0 }}
//                     />
//                 </div>

//                 {/* ── Navigation ── */}
//                 <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
//                     {/* Logo */}
//                     <span
//                         className="text-3xl tracking-tight select-none"
//                         style={{
//                             fontFamily: "var(--font-display)",
//                             color: "#000000",
//                         }}
//                     >
//                         Aethera
//                         <sup className="text-xs font-sans font-normal align-super">
//                             ®
//                         </sup>
//                     </span>

//                     {/* Login */}
//                     {user ? (
//                         <div className="flex items-center gap-4">
//                             <span className="text-lg font-medium">
//                                 Welcome, {user.name}!
//                             </span>
//                             {/* <a
//                                 href="/dashboard"
//                                 className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
//                             >
//                                 Dashboard
//                             </a> */}
//                             <a href="/dashboard" className="login-btn">
//                             Dashboard
//                             </a>
//                         </div>
//                     ) : (
//                         <a href="/login" className="login-btn">
//                             Log In
//                         </a>
//                     )}
//                 </nav>

//                 {/* ── Hero section ── */}
//                 <section
//                     className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
//                     style={{ paddingTop: "calc(8rem - 75px)" }}
//                 >
//                     {/* Headline */}
//                     <h1
//                         className="animate-fade-rise-delay font-normal max-w-5xl"
//                         style={{
//                             fontFamily: "var(--font-display)",
//                             fontSize: "clamp(2.8rem, 8vw, 6rem)",
//                             lineHeight: 0.95,
//                             letterSpacing: "-2.46px",
//                             color: "#000000",
//                         }}
//                     >
//                         Wander far,{" "}
//                         <em style={{ color: "#6F6F6F", fontStyle: "italic" }}>
//                             return changed.
//                         </em>
//                     </h1>

//                     {/* Description */}
//                     <p
//                         className="animate-fade-rise-delay-2 max-w-xl flex mt-8 leading-relaxed font-light mx-auto text-center"
//                         style={{
//                             fontFamily: "var(--font-body)",
//                             fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
//                             color: "#6F6F6F",
//                         }}
//                     >
//                         Handcrafted travel experiences across Nepal, Southeast
//                         Asia, and beyond. From Himalayan treks to coastal
//                         retreats — we design journeys that stay with you.
//                     </p>

//                     {/* CTAs */}
//                     <div className="animate-fade-rise-delay-3 flex items-center gap-4 mt-12 flex-wrap justify-center">
//                         <button className="explore-btn">
//                             Explore Packages
//                         </button>
//                         <button className="ghost-btn">
//                             <span>View Destinations</span>
//                             <span style={{ fontSize: "1.1rem" }}>→</span>
//                         </button>
//                     </div>
//                 </section>
//             </div>
//         </>
//     );
// };

// export default Welcome;
