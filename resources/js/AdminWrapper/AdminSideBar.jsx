// import React, { useState } from "react";
// import { Link, usePage } from "@inertiajs/react";
// import {
//     X,
//     Menu,
//     LayoutDashboard,
//     UserCog,
//     Folder,
//     FolderTree,
//     Map,
//     Mountain,
//     Footprints,
//     ClipboardList,
// } from "lucide-react";

// const AdminSideBar = ({
//     isMobileOpen,
//     onMobileToggle,
//     isCollapsed,
//     onToggleCollapse,
// }) => {
//     const { url } = usePage();
//     const currentPath = url.split("/")[1];
//     const [openDropdown, setOpenDropdown] = useState(null);

//     const isActive = (href) => {
//         const path = href.replace("/", "");
//         return currentPath === path;
//     };

//     const isPageActive = () => {
//         return [
//             "our-teams",
//             "gallery",
//             "events",
//             "partners",
//             "inscriptions",
//         ].includes(currentPath);
//     };

//     const isUsersActive = () => {
//         return [
//             "users",
//             "user-management",
//             "activity-log",
//             "activities",
//         ].includes(currentPath);
//     };

//     const toggleDropdown = (dropdownName) => {
//         if (openDropdown === dropdownName) {
//             setOpenDropdown(null);
//         } else {
//             setOpenDropdown(dropdownName);
//         }
//     };

//     return (
//         <>
//             {/* Mobile Overlay */}
//             {isMobileOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                     onClick={onMobileToggle}
//                 />
//             )}

//             {/* Sidebar */}
//             <div
//                 className={`
//                     fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
//                     bg-white border-gray-200
//                     ${isCollapsed ? "w-16" : "w-64"}
//                     ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//                 `}
//             >
//                 {/* Header */}
//                 <div
//                     className={`flex items-center justify-between p-4 border-b h-16 ${isCollapsed ? "px-3" : ""}`}
//                 >
//                     {/* {!isCollapsed && (
//                         <div className="text-xl font-bold text-gray-800 whitespace-nowrap">
//                             Nepal Inscription
//                         </div>
//                     )} */}

//                     {!isCollapsed && (
//                         <div className="flex items-center gap-2 flex-1 pr-10">
//                             <img
//                                 src="/images/logo.png"
//                                 alt="logo"
//                                 className="w-28 object-cover"
//                             />
//                         </div>
//                     )}

//                     <div className="flex items-center space-x-1">
//                         {/* Desktop Collapse Toggle */}
//                         <button
//                             onClick={onToggleCollapse}
//                             className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//                             title={
//                                 isCollapsed
//                                     ? "Expand sidebar"
//                                     : "Collapse sidebar"
//                             }
//                         >
//                             <Menu className="w-4 h-4 text-gray-600" />
//                         </button>

//                         {/* Mobile Close Button */}
//                         <button
//                             onClick={onMobileToggle}
//                             className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//                         >
//                             <X className="w-4 h-4 text-gray-600" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Menu Items */}
//                 <div
//                     className={`p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] ${isCollapsed ? "px-2" : "px-3"}`}
//                 >
//                     {/* Dashboard Link */}
//                     <Link
//                         href="/"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${isActive("/") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                         `}
//                         title={isCollapsed ? "Dashboard" : ""}
//                     >
//                         <LayoutDashboard
//                             className={`w-5 h-5 ${isActive("/") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
//                         />

//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Dashboard
//                             </span>
//                         )}

//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Dashboard
//                             </div>
//                         )}
//                     </Link>

//                     {/* Category Link */}
//                     <Link
//                         href="/category"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${isActive("/category") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                         `}
//                         title={isCollapsed ? "Category" : ""}
//                     >
//                         <Folder
//                             className={`w-5 h-5 ${isActive("/category") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
//                         />

//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Category
//                             </span>
//                         )}

//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Category
//                             </div>
//                         )}
//                     </Link>

//                     {/* Sub Category Link */}
//                     <Link
//                         href="/sub-category"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${isActive("/sub-category") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                         `}
//                         title={isCollapsed ? "Sub Category" : ""}
//                     >
//                         <FolderTree
//                             className={`w-5 h-5 ${isActive("/sub-category") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
//                         />

//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Sub Category
//                             </span>
//                         )}

//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Sub Category
//                             </div>
//                         )}
//                     </Link>

//                     {/* Tour Link */}
//                     <Link
//                         href="/tours"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${isActive("/tours") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                         `}
//                         title={isCollapsed ? "Tour" : ""}
//                     >
//                         <Map
//                             className={`w-5 h-5 ${isActive("/tours") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
//                         />

//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Tours
//                             </span>
//                         )}

//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Tours
//                             </div>
//                         )}
//                     </Link>

//                     {/* Trekking Link */}
//                     <Link
//                         href="/trekking"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${isActive("/trekking") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                         `}
//                         title={isCollapsed ? "Trekking" : ""}
//                     >
//                         <Mountain
//                             className={`w-5 h-5 ${isActive("/trekking") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
//                         />

//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Trekking
//                             </span>
//                         )}

//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Trekking
//                             </div>
//                         )}
//                     </Link>

//                     {/* Activities Link */}
//                     <Link
//                         href="/activities"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${isActive("/activities") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                         `}
//                         title={isCollapsed ? "Activities" : ""}
//                     >
//                         <Footprints
//                             className={`w-5 h-5 ${isActive("/activities") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
//                         />

//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Activities
//                             </span>
//                         )}

//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Activities
//                             </div>
//                         )}
//                     </Link>

//                     {/* FQA Link */}
//                     <Link
//                         href="/faqs"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${isActive("/faqs") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                         `}
//                         title={isCollapsed ? "FAQ" : ""}
//                     >
//                         <Footprints
//                             className={`w-5 h-5 ${isActive("/faqs") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
//                         />

//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 FAQ
//                             </span>
//                         )}

//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 FAQ
//                             </div>
//                         )}
//                     </Link>
//                     {/* Activity Logs Link */}
//                     <Link
//                         href="/activity-logs"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${isActive("/activity-logs") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                         `}
//                         title={isCollapsed ? "Activity Logs" : ""}
//                     >
//                         <ClipboardList
//                             className={`w-5 h-5 ${isActive("/activity-logs") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
//                         />

//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 Activity Logs
//                             </span>
//                         )}

//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 Activity Logs
//                             </div>
//                         )}
//                     </Link>

//                     {/* User Management Link */}
//                     <Link
//                         href="/user-management"
//                         className={`
//                             flex items-center rounded-lg transition-colors duration-200 group relative
//                             ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                             ${isActive("/user-management") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                         `}
//                         title={isCollapsed ? "User Management" : ""}
//                     >
//                         <UserCog
//                             className={`w-5 h-5 ${isActive("/user-management") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
//                         />

//                         {!isCollapsed && (
//                             <span className="ml-3 font-medium whitespace-nowrap">
//                                 User Management
//                             </span>
//                         )}

//                         {isCollapsed && (
//                             <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                                 User Management
//                             </div>
//                         )}
//                     </Link>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AdminSideBar;

import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    X,
    Menu,
    LayoutDashboard,
    UserCog,
    Folder,
    FolderTree,
    Map,
    Mountain,
    Footprints,
    ClipboardList,
    HelpCircle,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/category", label: "Category", icon: Folder },
    { href: "/sub-category", label: "Sub Category", icon: FolderTree },
    { href: "/tours", label: "Tours", icon: Map },
    { href: "/trekking", label: "Trekking", icon: Mountain },
    { href: "/activities", label: "Activities", icon: Footprints },
    { href: "/faqs", label: "FAQ", icon: HelpCircle },
    { href: "/activity-logs", label: "Activity Logs", icon: ClipboardList },
    { href: "/user-management", label: "User Management", icon: UserCog },
];

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = "/" + url.split("/")[1];

    const isActive = (href) => currentPath === href;

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{
                        background: "rgba(15,23,42,0.35)",
                        backdropFilter: "blur(4px)",
                    }}
                    onClick={onMobileToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out
                    ${isCollapsed ? "w-[68px]" : "w-64"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
                style={{
                    background: "#ffffff",
                    borderRight: "1px solid #e5e7eb",
                    boxShadow: "2px 0 12px rgba(0,0,0,0.05)",
                }}
            >
                {/* Header */}
                <div
                    className={`flex items-center h-16 px-4 flex-shrink-0 ${isCollapsed ? "justify-center" : "justify-between"}`}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                    {!isCollapsed && (
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <Link href="/" className="group">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-md">
                                    <img
                                        src="/images/logo.png"
                                        alt="logo"
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.parentNode.innerHTML =
                                                '<span style="color:#1d4ed8;font-weight:800;font-size:15px">A</span>';
                                        }}
                                    />
                                </div>
                            </Link>
                            <div>
                                <p className="font-bold text-sm text-gray-900 leading-none">
                                    Admin Panel
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5 leading-none tracking-widest uppercase font-medium">
                                    Management
                                </p>
                            </div>
                        </div>
                    )}

                    {isCollapsed && (
                        <button
                            onClick={onToggleCollapse}
                            className="lg:flex w-7 h-7 rounded-full items-center justify-center border border-gray-200 bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-110 hover:border-blue-300 ml-1"
                            title="Collapse sidebar"
                        >
                            <Menu className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                    )}

                    {!isCollapsed && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onToggleCollapse}
                                className="hidden lg:flex w-7 h-7 rounded-full items-center justify-center border border-gray-200 bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-110 hover:border-blue-300 ml-1"
                                title="Collapse sidebar"
                            >
                                <Menu className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                            <button
                                onClick={onMobileToggle}
                                className="lg:hidden w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 bg-gray-50 hover:shadow-md hover:scale-110 transition-all"
                            >
                                <X className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                        </div>
                    )}

                    {/* Collapsed expand button */}
                    {/* {isCollapsed && (
                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:flex absolute -right-3.5 top-[4.5rem] w-7 h-7 rounded-full items-center justify-center z-10 border border-gray-200 bg-white shadow-md hover:shadow-lg hover:scale-110 hover:border-blue-300 transition-all duration-200"
                            title="Expand sidebar"
                        >
                            <Menu className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                    )} */}
                </div>

                {/* Section label */}
                {!isCollapsed && (
                    <div className="px-5 pt-5 pb-2">
                        <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-gray-400">
                            Main Menu
                        </span>
                    </div>
                )}

                {/* Nav items */}
                <nav
                    className={`flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-1 ${isCollapsed ? "px-2" : "px-2"}`}
                    style={{ scrollbarWidth: "none" }}
                >
                    {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                title={isCollapsed ? label : ""}
                                className={`
                                    relative flex items-center gap-3 rounded-xl transition-all duration-200 group
                                    ${isCollapsed ? "p-2.5 justify-center" : "p-2.5"}
                                    ${
                                        active
                                            ? "bg-gray-200 border border-gray-300"
                                            : "hover:bg-gray-100/80 text-gray-700 hover:text-gray-800 hover:border hover:border-gray-200 border border-transparent"
                                    }
                                `}
                            >
                                {/* Icon with active dot */}
                                <div
                                    className={`relative flex-shrink-0 ${isCollapsed ? "mx-auto" : ""}`}
                                >
                                    <Icon
                                        className={`transition-colors duration-200`}
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                        }}
                                    />
                                </div>

                                {/* Label */}
                                {!isCollapsed && (
                                    <span
                                        style={{
                                            fontSize: "14.5px",
                                            fontWeight: active ? 500 : 500,
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        {label}
                                    </span>
                                )}

                                {/* Tooltip */}
                                {isCollapsed && (
                                    <div
                                        className="absolute left-full ml-3 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all duration-150 translate-x-1 group-hover:translate-x-0"
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            borderColor:
                                                "rgba(255,255,255,0.06)",
                                            fontSize: "12.5px",
                                        }}
                                    >
                                        {label}
                                        <div
                                            className="absolute right-full top-1/2 -translate-y-1/2"
                                            style={{
                                                width: 0,
                                                height: 0,
                                                borderTop:
                                                    "4px solid transparent",
                                                borderBottom:
                                                    "4px solid transparent",
                                                borderRight:
                                                    "4px solid #1e293b",
                                            }}
                                        />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div
                    className="mx-4 mb-2"
                    style={{ borderTop: "1px solid #f3f4f6" }}
                />

                {/* Footer */}
                {/* {!isCollapsed && (
                    <div className="p-3 m-3 rounded-xl bg-gray-100 border border-gray-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <HelpCircle className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold text-gray-700">Need help?</p>
                                <p className="text-[11px] text-gray-400">View docs or support</p>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* {isCollapsed && (
                    <div className="flex justify-center pb-4">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 border border-gray-200">
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                )} */}
            </div>
        </>
    );
};

export default AdminSideBar;
