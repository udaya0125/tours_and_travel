// import React from "react";
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
//     HelpCircle,
// } from "lucide-react";

// const NAV_ITEMS = [
//     { href: "/", label: "Dashboard", icon: LayoutDashboard },
//     { href: "/category", label: "Category", icon: Folder },
//     { href: "/sub-category", label: "Sub Category", icon: FolderTree },
//     { href: "/tours", label: "Tours", icon: Map },
//     { href: "/trekking", label: "Trekking", icon: Mountain },
//     { href: "/activities", label: "Activities", icon: Footprints },
//     { href: "/faqs", label: "FAQ", icon: HelpCircle },
//     { href: "/activity-logs", label: "Activity Logs", icon: ClipboardList },
//     { href: "/user-management", label: "User Management", icon: UserCog },
// ];

// const AdminSideBar = ({
//     isMobileOpen,
//     onMobileToggle,
//     isCollapsed,
//     onToggleCollapse,
// }) => {
//     const { url } = usePage();
//     const currentPath = "/" + url.split("/")[1];

//     const isActive = (href) => currentPath === href;

//     return (
//         <>
//             {/* Mobile overlay */}
//             {isMobileOpen && (
//                 <div
//                     className="fixed inset-0 z-40 lg:hidden"
//                     style={{
//                         background: "rgba(15,23,42,0.35)",
//                         backdropFilter: "blur(4px)",
//                     }}
//                     onClick={onMobileToggle}
//                 />
//             )}

//             {/* Sidebar */}
//             <div
//                 className={`
//                     fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out
//                     ${isCollapsed ? "w-[68px]" : "w-64"}
//                     ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//                 `}
//                 style={{
//                     background: "#ffffff",
//                     borderRight: "1px solid #e5e7eb",
//                     boxShadow: "2px 0 12px rgba(0,0,0,0.05)",
//                 }}
//             >
//                 {/* Header */}
//                 <div
//                     className={`flex items-center h-16 px-4 flex-shrink-0 ${isCollapsed ? "justify-center" : "justify-between"}`}
//                     style={{ borderBottom: "1px solid #f3f4f6" }}
//                 >
//                     {!isCollapsed && (
//                         <div className="flex items-center gap-2.5 overflow-hidden">
//                             <Link href="/" className="group">
//                                 <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-md">
//                                     <img
//                                         src="/images/logo.png"
//                                         alt="logo"
//                                         className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
//                                         onError={(e) => {
//                                             e.target.style.display = "none";
//                                             e.target.parentNode.innerHTML =
//                                                 '<span style="color:#1d4ed8;font-weight:800;font-size:15px">A</span>';
//                                         }}
//                                     />
//                                 </div>
//                             </Link>
//                             <div>
//                                 <p className="font-bold text-sm text-gray-900 leading-none">
//                                     Admin Panel
//                                 </p>
//                                 <p className="text-[10px] text-gray-400 mt-0.5 leading-none tracking-widest uppercase font-medium">
//                                     Management
//                                 </p>
//                             </div>
//                         </div>
//                     )}

//                     {isCollapsed && (
//                         <button
//                             onClick={onToggleCollapse}
//                             className="lg:flex w-7 h-7 rounded-full items-center justify-center border border-gray-200 bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-110 hover:border-blue-300 ml-1"
//                             title="Collapse sidebar"
//                         >
//                             <Menu className="w-3.5 h-3.5 text-gray-500" />
//                         </button>
//                     )}

//                     {!isCollapsed && (
//                         <div className="flex items-center gap-1">
//                             <button
//                                 onClick={onToggleCollapse}
//                                 className="hidden lg:flex w-7 h-7 rounded-full items-center justify-center border border-gray-200 bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-110 hover:border-blue-300 ml-1"
//                                 title="Collapse sidebar"
//                             >
//                                 <Menu className="w-3.5 h-3.5 text-gray-500" />
//                             </button>
//                             <button
//                                 onClick={onMobileToggle}
//                                 className="lg:hidden w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 bg-gray-50 hover:shadow-md hover:scale-110 transition-all"
//                             >
//                                 <X className="w-3.5 h-3.5 text-gray-500" />
//                             </button>
//                         </div>
//                     )}

//                     {/* Collapsed expand button */}
//                     {/* {isCollapsed && (
//                         <button
//                             onClick={onToggleCollapse}
//                             className="hidden lg:flex absolute -right-3.5 top-[4.5rem] w-7 h-7 rounded-full items-center justify-center z-10 border border-gray-200 bg-white shadow-md hover:shadow-lg hover:scale-110 hover:border-blue-300 transition-all duration-200"
//                             title="Expand sidebar"
//                         >
//                             <Menu className="w-3.5 h-3.5 text-gray-500" />
//                         </button>
//                     )} */}
//                 </div>

//                 {/* Section label */}
//                 {!isCollapsed && (
//                     <div className="px-5 pt-5 pb-2">
//                         <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-gray-400">
//                             Main Menu
//                         </span>
//                     </div>
//                 )}

//                 {/* Nav items */}
//                 <nav
//                     className={`flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-1 ${isCollapsed ? "px-2" : "px-2"}`}
//                     style={{ scrollbarWidth: "none" }}
//                 >
//                     {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
//                         const active = isActive(href);
//                         return (
//                             <Link
//                                 key={href}
//                                 href={href}
//                                 title={isCollapsed ? label : ""}
//                                 className={`
//                                     relative flex items-center gap-3 rounded-xl transition-all duration-200 group
//                                     ${isCollapsed ? "p-2.5 justify-center" : "p-2.5"}
//                                     ${
//                                         active
//                                             ? "bg-gray-200 border border-gray-300"
//                                             : "hover:bg-gray-100/80 text-gray-700 hover:text-gray-800 hover:border hover:border-gray-200 border border-transparent"
//                                     }
//                                 `}
//                             >
//                                 {/* Icon with active dot */}
//                                 <div
//                                     className={`relative flex-shrink-0 ${isCollapsed ? "mx-auto" : ""}`}
//                                 >
//                                     <Icon
//                                         className={`transition-colors duration-200`}
//                                         style={{
//                                             width: "18px",
//                                             height: "18px",
//                                         }}
//                                     />
//                                 </div>

//                                 {/* Label */}
//                                 {!isCollapsed && (
//                                     <span
//                                         style={{
//                                             fontSize: "14.5px",
//                                             fontWeight: active ? 500 : 500,
//                                             letterSpacing: "0.01em",
//                                         }}
//                                     >
//                                         {label}
//                                     </span>
//                                 )}

//                                 {/* Tooltip */}
//                                 {isCollapsed && (
//                                     <div
//                                         className="absolute left-full ml-3 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all duration-150 translate-x-1 group-hover:translate-x-0"
//                                         style={{
//                                             background: "#1e293b",
//                                             color: "#f8fafc",
//                                             borderColor:
//                                                 "rgba(255,255,255,0.06)",
//                                             fontSize: "12.5px",
//                                         }}
//                                     >
//                                         {label}
//                                         <div
//                                             className="absolute right-full top-1/2 -translate-y-1/2"
//                                             style={{
//                                                 width: 0,
//                                                 height: 0,
//                                                 borderTop:
//                                                     "4px solid transparent",
//                                                 borderBottom:
//                                                     "4px solid transparent",
//                                                 borderRight:
//                                                     "4px solid #1e293b",
//                                             }}
//                                         />
//                                     </div>
//                                 )}
//                             </Link>
//                         );
//                     })}
//                 </nav>

//                 {/* Divider */}
//                 <div
//                     className="mx-4 mb-2"
//                     style={{ borderTop: "1px solid #f3f4f6" }}
//                 />

//                 {/* Footer */}
//                 {/* {!isCollapsed && (
//                     <div className="p-3 m-3 rounded-xl bg-gray-100 border border-gray-200">
//                         <div className="flex items-center gap-2.5">
//                             <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
//                                 <HelpCircle className="w-4 h-4 text-gray-500" />
//                             </div>
//                             <div>
//                                 <p className="text-[12px] font-semibold text-gray-700">Need help?</p>
//                                 <p className="text-[11px] text-gray-400">View docs or support</p>
//                             </div>
//                         </div>
//                     </div>
//                 )} */}

//                 {/* {isCollapsed && (
//                     <div className="flex justify-center pb-4">
//                         <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 border border-gray-200">
//                             <HelpCircle className="w-4 h-4 text-gray-400" />
//                         </div>
//                     </div>
//                 )} */}
//             </div>
//         </>
//     );
// };

// export default AdminSideBar;

import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { RxDashboard } from "react-icons/rx";
import { BiMenu } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { LuFolderOpen, LuFolderTree, LuMap, LuMountain, LuFootprints, LuLogs } from "react-icons/lu";
import { MdOutlineManageAccounts } from "react-icons/md";
import { IoHelpCircleOutline } from "react-icons/io5";

const NAV_ITEMS = [
    { href: "/", label: "Dashboard", icon: RxDashboard },
    { href: "/category", label: "Category", icon: LuFolderOpen },
    { href: "/sub-category", label: "Sub Category", icon: LuFolderTree },
    { href: "/tours", label: "Tours", icon: LuMap },
    { href: "/trekking", label: "Trekking", icon: LuMountain },
    { href: "/activities", label: "Activities", icon: LuFootprints },
    { href: "/faqs", label: "FAQ", icon: IoHelpCircleOutline },
    { href: "/activity-logs", label: "Activity Logs", icon: LuLogs },
    { href: "/user-management", label: "User Management", icon: MdOutlineManageAccounts },
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
                            <BiMenu className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                    )}

                    {!isCollapsed && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onToggleCollapse}
                                className="hidden lg:flex w-7 h-7 rounded-full items-center justify-center border border-gray-200 bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-110 hover:border-blue-300 ml-1"
                                title="Collapse sidebar"
                            >
                                <BiMenu className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                            <button
                                onClick={onMobileToggle}
                                className="lg:hidden w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 bg-gray-50 hover:shadow-md hover:scale-110 transition-all"
                            >
                                <IoClose className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                        </div>
                    )}
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
                                <div
                                    className={`relative flex-shrink-0 ${isCollapsed ? "mx-auto" : ""}`}
                                >
                                    <Icon size={18} />
                                </div>

                                {!isCollapsed && (
                                    <span
                                        style={{
                                            fontSize: "14.5px",
                                            fontWeight: 500,
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        {label}
                                    </span>
                                )}

                                {isCollapsed && (
                                    <div
                                        className="absolute left-full ml-3 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all duration-150 translate-x-1 group-hover:translate-x-0"
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            borderColor: "rgba(255,255,255,0.06)",
                                            fontSize: "12.5px",
                                        }}
                                    >
                                        {label}
                                        <div
                                            className="absolute right-full top-1/2 -translate-y-1/2"
                                            style={{
                                                width: 0,
                                                height: 0,
                                                borderTop: "4px solid transparent",
                                                borderBottom: "4px solid transparent",
                                                borderRight: "4px solid #1e293b",
                                            }}
                                        />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div
                    className="mx-4 mb-2"
                    style={{ borderTop: "1px solid #f3f4f6" }}
                />
            </div>
        </>
    );
};

export default AdminSideBar;
