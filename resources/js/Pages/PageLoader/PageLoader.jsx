// import React, { useEffect, useRef } from "react";

// const PageLoader = () => {
//     const ringRef = useRef(null);
//     const animRef = useRef(null);
//     const frameRef = useRef(0);

//     useEffect(() => {
//         const ring = ringRef.current;
//         if (!ring) return;

//         const COUNT = 20;
//         ring.innerHTML = "";

//         for (let i = 0; i < COUNT; i++) {
//             const progress = i / COUNT;
//             const angle = progress * 360;
//             const size = 4 + progress * 7;
//             const opacity = 0.15 + progress * 0.85;
//             const blueG = Math.round(100 + progress * 60);
//             const blueB = Math.round(150 + progress * 105);
//             const glowSize = Math.round(progress * 14);
//             const glowSpread = Math.round(progress * 8);

//             const dot = document.createElement("div");
//             dot.style.cssText = `
//                 position: absolute;
//                 width: ${size}px;
//                 height: ${size}px;
//                 border-radius: 50%;
//                 top: 50%;
//                 left: 50%;
//                 margin-top: ${-size / 2}px;
//                 margin-left: ${-size / 2}px;
//                 background: rgb(30, ${blueG}, ${blueB});
//                 opacity: ${opacity};
//                 box-shadow: 0 0 ${glowSize}px ${glowSpread}px rgba(55,138,221,${progress * 0.6});
//                 transform: rotate(${angle}deg) translateX(52px) rotate(${-angle}deg);
//             `;
//             ring.appendChild(dot);
//         }

//         const spin = () => {
//             frameRef.current = (frameRef.current + 1.5) % 360;
//             if (ring) ring.style.transform = `rotate(${frameRef.current}deg)`;
//             animRef.current = requestAnimationFrame(spin);
//         };
//         animRef.current = requestAnimationFrame(spin);

//         return () => {
//             if (animRef.current) cancelAnimationFrame(animRef.current);
//         };
//     }, []);

//     return (
//         <>
//             <style>{`
//                 @keyframes pulse-label {
//                     0%, 100% { opacity: 0.4; }
//                     50% { opacity: 1; }
//                 }
//             `}</style>
//             <div className="flex flex-col items-center justify-center min-h-[400px]">
//                 <div
//                     ref={ringRef}
//                     style={{ position: "relative", width: 120, height: 120 }}
//                 />
//                 <p style={{
//                     marginTop: 28,
//                     fontSize: 13,
//                     fontWeight: 500,
//                     letterSpacing: "0.2em",
//                     color: "#378ADD",
//                     textTransform: "uppercase",
//                     animation: "pulse-label 1.6s ease-in-out infinite",
//                 }}>
//                     Loading
//                 </p>
//             </div>
//         </>
//     );
// };

// export default PageLoader;



// Second version with SVG arcs and center glow



// import React from "react";

// const PageLoader = () => {
//     return (
//         <>
//             <style>{`
//                 @keyframes pulse-label {
//                     0%, 100% { opacity: 0.3; letter-spacing: 0.25em; }
//                     50% { opacity: 1; letter-spacing: 0.35em; }
//                 }
//                 @keyframes ring-spin {
//                     to { transform: rotate(360deg); }
//                 }
//                 @keyframes ring-spin-rev {
//                     to { transform: rotate(-360deg); }
//                 }
//                 @keyframes float-glow {
//                     0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.75; }
//                     50% { transform: translate(-50%, -50%) scale(1.18); opacity: 1; }
//                 }
//                 @keyframes dash-anim {
//                     0%   { stroke-dashoffset: 220; }
//                     50%  { stroke-dashoffset: 55; }
//                     100% { stroke-dashoffset: 220; }
//                 }
//             `}</style>

//             <div style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 minHeight: "400px",
//             }}>
//                 <div style={{ position: "relative", width: 160, height: 160 }}>

//                     {/* Outer arc — coral */}
//                     <svg
//                         style={{
//                             position: "absolute", inset: 0,
//                             width: "100%", height: "100%",
//                             animation: "ring-spin 2.2s linear infinite",
//                         }}
//                         viewBox="0 0 160 160"
//                     >
//                         <defs>
//                             <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
//                                 <stop offset="0%" stopColor="#D85A30" stopOpacity="0" />
//                                 <stop offset="100%" stopColor="#F0997B" />
//                             </linearGradient>
//                         </defs>
//                         <circle cx="80" cy="80" r="70" fill="none" stroke="#f0997b"
//                             strokeWidth="2.5" strokeDasharray="220 500"
//                             strokeLinecap="round" opacity="0.2" />
//                         <circle cx="80" cy="80" r="70" fill="none" stroke="url(#g1)"
//                             strokeWidth="3" strokeDasharray="70 500"
//                             strokeLinecap="round"
//                             style={{ animation: "dash-anim 2.2s ease-in-out infinite" }} />
//                     </svg>

//                     {/* Middle arc — pink (reverse) */}
//                     <svg
//                         style={{
//                             position: "absolute", inset: 12,
//                             width: "calc(100% - 24px)", height: "calc(100% - 24px)",
//                             animation: "ring-spin-rev 1.8s linear infinite",
//                         }}
//                         viewBox="0 0 136 136"
//                     >
//                         <defs>
//                             <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
//                                 <stop offset="0%" stopColor="#993556" stopOpacity="0" />
//                                 <stop offset="100%" stopColor="#ED93B1" />
//                             </linearGradient>
//                         </defs>
//                         <circle cx="68" cy="68" r="58" fill="none" stroke="#ED93B1"
//                             strokeWidth="2" strokeDasharray="160 500"
//                             strokeLinecap="round" opacity="0.18" />
//                         <circle cx="68" cy="68" r="58" fill="none" stroke="url(#g2)"
//                             strokeWidth="2.5" strokeDasharray="50 500"
//                             strokeLinecap="round"
//                             style={{ animation: "dash-anim 1.8s ease-in-out infinite" }} />
//                     </svg>

//                     {/* Inner arc — purple */}
//                     <svg
//                         style={{
//                             position: "absolute", inset: 26,
//                             width: "calc(100% - 52px)", height: "calc(100% - 52px)",
//                             animation: "ring-spin 3s linear infinite",
//                         }}
//                         viewBox="0 0 108 108"
//                     >
//                         <defs>
//                             <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%">
//                                 <stop offset="0%" stopColor="#534AB7" stopOpacity="0" />
//                                 <stop offset="100%" stopColor="#AFA9EC" />
//                             </linearGradient>
//                         </defs>
//                         <circle cx="54" cy="54" r="44" fill="none" stroke="#AFA9EC"
//                             strokeWidth="1.5" strokeDasharray="120 500"
//                             strokeLinecap="round" opacity="0.15" />
//                         <circle cx="54" cy="54" r="44" fill="none" stroke="url(#g3)"
//                             strokeWidth="2" strokeDasharray="36 500"
//                             strokeLinecap="round"
//                             style={{ animation: "dash-anim 3s ease-in-out infinite" }} />
//                     </svg>

//                     {/* Center glowing orb */}
//                     <div style={{
//                         position: "absolute",
//                         top: "50%", left: "50%",
//                         width: 36, height: 36,
//                         borderRadius: "50%",
//                         background: "radial-gradient(circle at 35% 35%, #F0997B, #D4537E 60%, #7F77DD)",
//                         animation: "float-glow 2s ease-in-out infinite",
//                         boxShadow: "0 0 18px 6px rgba(212,83,126,0.35), 0 0 40px 10px rgba(127,119,221,0.2)",
//                     }} />
//                 </div>

//                 <p style={{
//                     marginTop: 32,
//                     fontSize: 11,
//                     fontWeight: 500,
//                     color: "#D4537E",
//                     textTransform: "uppercase",
//                     animation: "pulse-label 2s ease-in-out infinite",
//                 }}>
//                     Please wait
//                 </p>
//             </div>
//         </>
//     );
// };

// export default PageLoader;


import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const PageLoader = () => {
    const outerRef = useRef(null);
    const midRef   = useRef(null);
    const innerRef = useRef(null);
    const dotRef   = useRef(null);
    const barRef   = useRef(null);
    const labelRef = useRef(null);
    const tlRef    = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(outerRef.current, {
                rotation: 360,
                duration: 1.4,
                ease: "none",
                repeat: -1,
            });

            gsap.to(midRef.current, {
                rotation: -360,
                duration: 1.0,
                ease: "none",
                repeat: -1,
            });

            gsap.to(innerRef.current, {
                rotation: 360,
                duration: 0.7,
                ease: "none",
                repeat: -1,
            });

            gsap.to(dotRef.current, {
                scale: 1.6,
                duration: 0.8,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
            });

            gsap.to(barRef.current, {
                width: "100%",
                duration: 2.2,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
            });

            const labels = ["Loading", "Please wait", "Almost there"];
            let li = 0;
            const interval = setInterval(() => {
                li = (li + 1) % labels.length;
                gsap.to(labelRef.current, {
                    opacity: 0,
                    duration: 0.25,
                    onComplete: () => {
                        if (labelRef.current) {
                            labelRef.current.textContent = labels[li];
                        }
                        gsap.to(labelRef.current, { opacity: 1, duration: 0.25 });
                    },
                });
            }, 2400);

            tlRef.current = interval;
        });

        return () => {
            ctx.revert();
            clearInterval(tlRef.current);
        };
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            gap: 32,
        }}>
            {/* Ring stack */}
            <div style={{ position: "relative", width: 80, height: 80 }}>

                {/* Tracks */}
                {[0, 12, 24].map((inset) => (
                    <div key={inset} style={{
                        position: "absolute",
                        inset,
                        borderRadius: "50%",
                        border: "1.5px solid",
                        borderColor: inset === 0
                            ? "rgba(217,119,6,0.12)"
                            : inset === 12
                            ? "rgba(139,92,246,0.10)"
                            : "rgba(236,72,153,0.10)",
                    }} />
                ))}

                {/* Outer ring — amber */}
                <div ref={outerRef} style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "1.5px solid transparent",
                    borderTopColor: "#d97706",
                }} />

                {/* Mid ring — violet */}
                <div ref={midRef} style={{
                    position: "absolute",
                    inset: 12,
                    borderRadius: "50%",
                    border: "1.5px solid transparent",
                    borderBottomColor: "#8b5cf6",
                }} />

                {/* Inner ring — pink */}
                <div ref={innerRef} style={{
                    position: "absolute",
                    inset: 24,
                    borderRadius: "50%",
                    border: "1.5px solid transparent",
                    borderRightColor: "#ec4899",
                }} />

                {/* Center dot */}
                <div ref={dotRef} style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#d97706",
                    transform: "translate(-50%, -50%)",
                }} />
            </div>

            {/* Progress bar */}
            <div style={{
                width: 48,
                height: 2,
                background: "rgba(0,0,0,0.06)",
                borderRadius: 2,
                overflow: "hidden",
                marginTop: -20,
            }}>
                <div ref={barRef} style={{
                    height: "100%",
                    width: "0%",
                    background: "#d97706",
                    borderRadius: 2,
                }} />
            </div>

            {/* Label */}
            <span ref={labelRef} style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#9ca3af",
            }}>
                Loading
            </span>
        </div>
    );
};

export default PageLoader;