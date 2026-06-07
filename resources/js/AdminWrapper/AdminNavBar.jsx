// import React, { useState, useRef, useEffect } from "react";
// import { Menu, UserCircle, Settings, LogOut, ChevronDown } from "lucide-react";
// import { Link, usePage, router } from "@inertiajs/react";

// const AdminNavBar = ({ onMenuToggle }) => {
//     const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//     const userMenuRef = useRef(null);
//     const { auth } = usePage().props;
//     const user = auth?.user;
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const toggleUserMenu = () => {
//         setIsUserMenuOpen((prev) => !prev);
//     };

//     const handleLogout = async () => {
//         try {
//             await axios.post(route("logout"));
//             window.location.href = "/login";
//         } catch (error) {
//             console.error("Logout error:", error);
//             window.location.href = "/login";
//         }
//     };

//     // Close menu when clicking outside or pressing Escape key
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 userMenuRef.current &&
//                 !userMenuRef.current.contains(event.target)
//             ) {
//                 setIsUserMenuOpen(false);
//             }
//         };

//         const handleEscapeKey = (event) => {
//             if (event.key === "Escape") {
//                 setIsUserMenuOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         document.addEventListener("keydown", handleEscapeKey);

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//             document.removeEventListener("keydown", handleEscapeKey);
//         };
//     }, []);

//     // Close menu when route changes
//     useEffect(() => {
//         setIsUserMenuOpen(false);
//     }, [window.location.pathname]);

//     return (
//         <nav className="fixed top-0 right-0 w-full lg:w-[98%] h-16 border-b z-30 bg-white">
//             <div className="h-full px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-full">
//                     {/* Left side - Menu toggle and branding */}
//                     <div className="flex items-center space-x-4">
//                         <button
//                             onClick={onMenuToggle}
//                             className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                             aria-label="Toggle menu"
//                         >
//                             <Menu className="w-5 h-5 text-gray-700" />
//                         </button>

//                         {/* Optional: Add branding/logo here */}
//                         <div className="hidden lg:block px-8">
//                             <img
//                                 src="/images/logo.png"
//                                 alt="Logo"
//                                 className="h-12 w-auto"
//                             />
//                         </div>
//                     </div>

//                     {/* Right side - User menu */}
//                     <div className="flex items-center space-x-4">
//                         {/* Optional: Add notifications or other icons here */}

//                         <div className="relative" ref={userMenuRef}>
//                             <button
//                                 onClick={toggleUserMenu}
//                                 className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                                 aria-expanded={isUserMenuOpen}
//                                 aria-haspopup="true"
//                             >
//                                 <div className="flex items-center space-x-3">
//                                     <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-200">
//                                         {user?.image ? (
//                                             <img
//                                                 src={`${imgurl}/${user.image}`}
//                                                 alt={`${
//                                                     user?.name || "User"
//                                                 } profile`}
//                                                 className="w-full h-full rounded-full object-cover"
//                                                 onError={(e) => {
//                                                     e.target.style.display =
//                                                         "none";
//                                                 }}
//                                             />
//                                         ) : (
//                                             <UserCircle className="w-6 h-6 text-gray-600" />
//                                         )}
//                                     </div>
//                                     <div className="hidden sm:block text-left">
//                                         <span className="text-sm font-medium text-gray-700 block">
//                                             {user?.name || "Guest"}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <ChevronDown
//                                     className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
//                                         isUserMenuOpen ? "rotate-180" : ""
//                                     }`}
//                                 />
//                             </button>

//                             {/* User dropdown menu */}
//                             {isUserMenuOpen && (
//                                 <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
//                                     {/* User info section */}
//                                     <div className="px-4 py-3 border-b border-gray-200">
//                                         <p className="text-sm font-medium text-gray-900 truncate">
//                                             {user?.name || "Guest"}
//                                         </p>
//                                         <p className="text-sm text-gray-500 truncate mt-1">
//                                             {user?.email || ""}
//                                         </p>
//                                     </div>

//                                     {/* Logout section */}
//                                     <div className="border-t border-gray-200 pt-1">
//                                         <button
//                                             onClick={handleLogout}
//                                             className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150 focus:outline-none"
//                                         >
//                                             <LogOut className="w-4 h-4 mr-3" />
//                                             Sign Out
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default AdminNavBar;

import React, { useState, useRef, useEffect } from "react";
import { Menu, UserCircle, Settings, LogOut, ChevronDown, Bell, Search } from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";

const AdminNavBar = ({ onMenuToggle }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const { auth } = usePage().props;
    const user = auth?.user;
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev);

    const handleLogout = async () => {
        try {
            await axios.post(route("logout"));
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        const handleEscapeKey = (event) => {
            if (event.key === "Escape") setIsUserMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    useEffect(() => {
        setIsUserMenuOpen(false);
    }, [window.location.pathname]);

    const getInitials = (name) => {
        if (!name) return "G";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <nav
            className="fixed top-0 right-0 w-full lg:w-[calc(100%-var(--sidebar-width,256px))] h-16 z-30 transition-all duration-300 bg-white border-b border-gray-300"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
            <div className="h-full px-4 sm:px-5">
                <div className="flex items-center justify-between h-full">

                    {/* Left — mobile toggle + search */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md hover:scale-110 hover:border-blue-300 transition-all duration-200"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Search */}
                        {/* <div className="hidden md:flex items-center gap-2 bg-gray-100/80 border border-gray-200 rounded-xl px-3 py-2 w-60 group focus-within:border-blue-300 focus-within:bg-white transition-all duration-200 hover:border-gray-300">
                            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
                            />
                            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-200 rounded-md">⌘K</kbd>
                        </div> */}
                    </div>

                    {/* Right — bell + user */}
                    <div className="flex items-center gap-2">

                        {/* Notification bell */}
                        <button className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md hover:scale-110 hover:border-blue-300 transition-all duration-200">
                            <Bell style={{ width: "15px", height: "15px" }} className="text-gray-500" />
                            {/* <span className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white" /> */}
                        </button>

                        {/* Divider */}
                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        {/* User dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={toggleUserMenu}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 hover:shadow-sm focus:outline-none
                                    ${isUserMenuOpen
                                        ? "bg-gray-200 border-gray-300"
                                        : "bg-gray-100/80 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                                    }`}
                                aria-expanded={isUserMenuOpen}
                            >
                                {/* Avatar */}
                                <div className="w-7 h-7 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    {user?.image ? (
                                        <img
                                            src={`${imgurl}/${user.image}`}
                                            alt={user?.name || "User"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = "none"; }}
                                        />
                                    ) : (
                                        <span className="text-blue-700 text-xs font-bold">{getInitials(user?.name)}</span>
                                    )}
                                </div>

                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || "Guest"}</p>
                                </div>

                                <ChevronDown
                                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown */}
                            {isUserMenuOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-gray-200 z-50 overflow-hidden"
                                    style={{
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
                                        animation: "dropdownIn 0.15s ease-out forwards",
                                    }}
                                >
                                    <style>{`
                                        @keyframes dropdownIn {
                                            from { opacity:0; transform:translateY(-6px) scale(0.97); }
                                            to   { opacity:1; transform:translateY(0) scale(1); }
                                        }
                                    `}</style>

                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                {user?.image ? (
                                                    <img src={`${imgurl}/${user.image}`} alt={user?.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-blue-700 font-bold text-sm">{getInitials(user?.name)}</span>
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Guest"}</p>
                                                <p className="text-[11px] text-gray-400 truncate">{user?.email || "admin@domain.com"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu items */}
                                    {/* <div className="p-1.5 space-y-0.5">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:border-gray-200 border border-transparent transition-all duration-150 group"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                                                <UserCircle className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <span className="font-medium">My Profile</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:border-gray-200 border border-transparent transition-all duration-150 group"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                                                <Settings className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <span className="font-medium">Settings</span>
                                        </Link>
                                    </div> */}

                                    <div className="mx-3 border-t border-gray-100" />

                                    <div className="p-1.5">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all duration-150 group"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                                <LogOut className="w-4 h-4 text-red-400" />
                                            </div>
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavBar;
