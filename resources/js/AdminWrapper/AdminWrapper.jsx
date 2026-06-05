// import React, { useState, useEffect } from "react";
// import AdminNavBar from "./AdminNavBar";
// import AdminSideBar from "./AdminSideBar";
// import { usePage } from "@inertiajs/react";

// const AdminWrapper = ({ children }) => {
//     const [isMobileOpen, setIsMobileOpen] = useState(false);
//     const [isCollapsed, setIsCollapsed] = useState(() => {
//         if (typeof window === "undefined") {
//             return false;
//         }

//         return (
//             window.localStorage.getItem("admin-sidebar-collapsed") === "true"
//         );
//     });
//     const { props } = usePage();
//     const user = props?.auth?.user || null;

//     const toggleMobile = () => setIsMobileOpen((prev) => !prev);
//     const toggleCollapse = () => setIsCollapsed((prev) => !prev);

//     // Close mobile sidebar on window resize & adjust layout
//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth >= 1024) {
//                 setIsMobileOpen(false);
//             }
//         };

//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     useEffect(() => {
//         window.localStorage.setItem(
//             "admin-sidebar-collapsed",
//             String(isCollapsed),
//         );
//     }, [isCollapsed]);

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <AdminNavBar onMenuToggle={toggleMobile} />

//             <AdminSideBar
//                 isMobileOpen={isMobileOpen}
//                 onMobileToggle={toggleMobile}
//                 user={user}
//                 isCollapsed={isCollapsed}
//                 onToggleCollapse={toggleCollapse}
//             />

//             <main
//                 className={`pt-16 min-h-screen  transition-all duration-300 ${
//                     isCollapsed ? "lg:ml-16" : "lg:ml-64"
//                 }`}
//             >
//                 <div className="lg:p-6">{children}</div>
//             </main>
//         </div>
//     );
// };

// export default AdminWrapper;


import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import AdminSideBar from "./AdminSideBar";
import { usePage } from "@inertiajs/react";

const AdminWrapper = ({ children }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem("admin-sidebar-collapsed") === "true";
    });

    const { props } = usePage();
    const user = props?.auth?.user || null;

    const SIDEBAR_WIDTH = isCollapsed ? 68 : 256;

    const toggleMobile = () => setIsMobileOpen((prev) => !prev);
    const toggleCollapse = () => setIsCollapsed((prev) => !prev);

    // Sync CSS variable for navbar width calculation
    useEffect(() => {
        document.documentElement.style.setProperty("--sidebar-width", `${SIDEBAR_WIDTH}px`);
    }, [SIDEBAR_WIDTH]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsMobileOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        window.localStorage.setItem("admin-sidebar-collapsed", String(isCollapsed));
    }, [isCollapsed]);

    return (
        <div className="min-h-screen" style={{ background: "#f8fafc" }}>
            <AdminNavBar onMenuToggle={toggleMobile} />

            <AdminSideBar
                isMobileOpen={isMobileOpen}
                onMobileToggle={toggleMobile}
                user={user}
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
            />

            <main
                className="pt-16 min-h-screen transition-all duration-300 ease-in-out"
                style={{ marginLeft: `${SIDEBAR_WIDTH}px` }}
            >
                {/* Subtle page content wrapper */}
                <div className="lg:p-6 p-3">
                    {/* Optional page fade-in */}
                    <div style={{ animation: "pageIn 0.25s ease-out" }}>
                        {children}
                    </div>
                </div>
            </main>

            <style>{`
                @media (max-width: 1023px) {
                    main { margin-left: 0 !important; }
                }
                @keyframes pageIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AdminWrapper;