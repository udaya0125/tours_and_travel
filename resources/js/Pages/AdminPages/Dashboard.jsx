// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Link, usePage } from "@inertiajs/react";
// import axios from "axios";
// import {
//     ArrowUpRight,
//     BookOpenText,
//     CalendarClock,
//     CircleHelp,
//     FolderOpen,
//     FolderTree,
//     Globe2,
//     LayoutDashboard,
//     Map,
//     Plus,
//     RefreshCw,
// } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";

// const getCollection = (response, keys = []) => {
//     const payload = response?.data;

//     for (const key of keys) {
//         if (Array.isArray(payload?.[key])) return payload[key];
//     }

//     if (Array.isArray(payload)) return payload;
//     if (Array.isArray(payload?.data)) return payload.data;

//     return [];
// };

// const formatTime = (date) =>
//     date.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//     });

// const formatDate = (date) =>
//     date.toLocaleDateString("en-US", {
//         weekday: "long",
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//     });

// const Dashboard = () => {
//     const { auth } = usePage().props;
//     const firstName = auth?.user?.name?.split(" ")[0] || "Admin";

//     const [now, setNow] = useState(new Date());
//     const [loadingStats, setLoadingStats] = useState(true);
//     const [stats, setStats] = useState({
//         packages: 0,
//         countries: 0,
//         categories: 0,
//         subCategories: 0,
//         faqs: 0,
//         logs: 0,
//     });

//     useEffect(() => {
//         const timer = setInterval(() => setNow(new Date()), 30000);
//         return () => clearInterval(timer);
//     }, []);

//     useEffect(() => {
//         const fetchStats = async () => {
//             setLoadingStats(true);

//             const [
//                 packages,
//                 countries,
//                 categories,
//                 subCategories,
//                 faqs,
//                 logs,
//             ] = await Promise.allSettled([
//                 axios.get(route("ourpackages.index")),
//                 axios.get(route("ourcountries.index")),
//                 axios.get(route("ourcategories.index")),
//                 axios.get(route("oursubcategories.index")),
//                 axios.get(route("ourfaqs.index")),
//                 axios.get(route("ourlogs.index")),
//             ]);

//             setStats({
//                 packages:
//                     packages.status === "fulfilled"
//                         ? getCollection(packages.value, ["packages"]).length
//                         : 0,
//                 countries:
//                     countries.status === "fulfilled"
//                         ? getCollection(countries.value, ["countries"]).length
//                         : 0,
//                 categories:
//                     categories.status === "fulfilled"
//                         ? getCollection(categories.value, ["categories"]).length
//                         : 0,
//                 subCategories:
//                     subCategories.status === "fulfilled"
//                         ? getCollection(subCategories.value, ["sub_categories"])
//                               .length
//                         : 0,
//                 faqs:
//                     faqs.status === "fulfilled"
//                         ? getCollection(faqs.value, ["faqs"]).length
//                         : 0,
//                 logs:
//                     logs.status === "fulfilled"
//                         ? getCollection(logs.value, ["activity_logs"]).length
//                         : 0,
//             });

//             setLoadingStats(false);
//         };

//         fetchStats();
//     }, []);

//     const greeting = useMemo(() => {
//         const hour = now.getHours();
//         if (hour < 12) return "Good morning";
//         if (hour < 17) return "Good afternoon";
//         return "Good evening";
//     }, [now]);

//     const metricCards = [
//         {
//             label: "Packages",
//             value: stats.packages,
//             helper: "Tour packages listed",
//             href: "/package",
//             icon: Map,
//             tone: "indigo",
//         },
//         {
//             label: "Countries",
//             value: stats.countries,
//             helper: "Available destinations",
//             href: "/countries",
//             icon: Globe2,
//             tone: "emerald",
//         },
//         {
//             label: "Categories",
//             value: stats.categories,
//             helper: "Travel groups",
//             href: "/categories",
//             icon: FolderOpen,
//             tone: "sky",
//         },
//         {
//             label: "Sub Categories",
//             value: stats.subCategories,
//             helper: "Nested package types",
//             href: "/subcategories",
//             icon: FolderTree,
//             tone: "amber",
//         },
//     ];

//     const secondaryStats = [
//         {
//             label: "FAQs",
//             value: stats.faqs,
//             href: "/faqs",
//             icon: CircleHelp,
//         },
//         {
//             label: "Activity Logs",
//             value: stats.logs,
//             href: "/activity-logs",
//             icon: CalendarClock,
//         },
//     ];

//     const quickActions = [
//         {
//             label: "Create Package",
//             href: "/package",
//             icon: Plus,
//             description: "Add a new tour package",
//         },
//         {
//             label: "Add Country",
//             href: "/countries",
//             icon: Globe2,
//             description: "Register a destination country",
//         },
//         {
//             label: "Add Category",
//             href: "/categories",
//             icon: FolderOpen,
//             description: "Organize packages by type",
//         },
//         {
//             label: "Manage FAQs",
//             href: "/faqs",
//             icon: BookOpenText,
//             description: "Update customer questions",
//         },
//     ];

//     const toneClasses = {
//         indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
//         emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
//         sky: "bg-sky-50 text-sky-600 border-sky-100",
//         amber: "bg-amber-50 text-amber-600 border-amber-100",
//     };

//     return (
//         <AdminWrapper>
//             <div className="space-y-6">
//                 {/* ── Header ── */}
// <section className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 via-green-700 to-emerald-500 px-6 py-7 text-white shadow-xl shadow-green-200/60 md:px-9 md:py-9'>
//   {/* Decorative blobs */}
//   <div className='absolute -right-16 -top-28 h-72 w-72 rounded-full bg-white/10' />
//   <div className='absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-black/10' />
//   <div className='absolute right-8 top-8 hidden h-28 w-28 rotate-12 rounded-3xl border border-white/10 bg-white/5 md:block' />

//   <div className='relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-end'>
//     {/* Left */}
//     <div>
//       <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm'>
//         <LayoutDashboard size={14} />
//         Admin Dashboard
//       </div>
//       <h1 className='text-3xl font-semibold tracking-tight md:text-4xl'>
//         {greeting}, {firstName}.
//       </h1>
//       <p className='mt-2 max-w-xl text-sm leading-6 text-green-50 md:text-base'>
//         Everything's on track. Manage bookings, packages, destinations and enquiries from one place.
//       </p>
//     </div>

//     {/* Right — clock + date */}
//     <div className='flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm'>
//       <CalendarClock size={20} className='text-green-100' />
//       <div>
//         <p className='text-xl font-bold tracking-widest'>{formatTime(now)}</p>
//         <p className='mt-0.5 text-xs text-green-100'>{formatDate(now)}</p>
//       </div>
//     </div>
//   </div>
// </section>

//                 <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//                     {metricCards.map((card) => {
//                         const Icon = card.icon;

//                         return (
//                             <Link
//                                 key={card.label}
//                                 href={card.href}
//                                 className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
//                             >
//                                 <div className="flex items-start justify-between gap-4">
//                                     <div
//                                         className={`flex h-11 w-11 items-center justify-center rounded-xl border ${toneClasses[card.tone]}`}
//                                     >
//                                         <Icon size={20} />
//                                     </div>
//                                     <ArrowUpRight
//                                         size={17}
//                                         className="text-gray-300 transition group-hover:text-green-600"
//                                     />
//                                 </div>

//                                 <div className="mt-5">
//                                     {loadingStats ? (
//                                         <span className="block h-8 w-14 animate-pulse rounded-lg bg-gray-100" />
//                                     ) : (
//                                         <p className="text-3xl font-bold text-gray-800">
//                                             {card.value}
//                                         </p>
//                                     )}
//                                     <p className="mt-2 text-sm font-semibold text-gray-700">
//                                         {card.label}
//                                     </p>
//                                     <p className="mt-1 text-xs text-gray-400">
//                                         {card.helper}
//                                     </p>
//                                 </div>
//                             </Link>
//                         );
//                     })}
//                 </section>

//                 <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
//                     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
//                         <div className="mb-5 flex items-center justify-between gap-3">
//                             <div>
//                                 <h2 className="text-lg font-bold text-gray-800">
//                                     Quick Access
//                                 </h2>
//                                 <p className="mt-1 text-sm text-gray-500">
//                                     Jump into the most common admin sections.
//                                 </p>
//                             </div>
//                             <RefreshCw
//                                 size={18}
//                                 className={
//                                     loadingStats
//                                         ? "animate-spin text-gray-300"
//                                         : "text-gray-300"
//                                 }
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                             {quickActions.map((action) => {
//                                 const Icon = action.icon;

//                                 return (
//                                     <Link
//                                         key={action.label}
//                                         href={action.href}
//                                         className="group flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/40"
//                                     >
//                                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-white group-hover:text-indigo-600">
//                                             <Icon size={18} />
//                                         </div>
//                                         <div className="min-w-0 flex-1">
//                                             <p className="text-sm font-semibold text-gray-800">
//                                                 {action.label}
//                                             </p>
//                                             <p className="mt-0.5 truncate text-xs text-gray-400">
//                                                 {action.description}
//                                             </p>
//                                         </div>
//                                         <ArrowUpRight
//                                             size={16}
//                                             className="text-gray-300 transition group-hover:text-indigo-600"
//                                         />
//                                     </Link>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//                         <h2 className="text-lg font-bold text-gray-800">
//                             System Snapshot
//                         </h2>
//                         <p className="mt-1 text-sm text-gray-500">
//                             Supporting content and admin trail.
//                         </p>

//                         <div className="mt-5 space-y-3">
//                             {secondaryStats.map((item) => {
//                                 const Icon = item.icon;

//                                 return (
//                                     <Link
//                                         key={item.label}
//                                         href={item.href}
//                                         className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition hover:border-green-100 hover:bg-green-50/40"
//                                     >
//                                         <div className="flex items-center gap-3">
//                                             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
//                                                 <Icon size={18} />
//                                             </div>
//                                             <span className="text-sm font-semibold text-gray-700">
//                                                 {item.label}
//                                             </span>
//                                         </div>
//                                         {loadingStats ? (
//                                             <span className="h-6 w-9 animate-pulse rounded bg-gray-100" />
//                                         ) : (
//                                             <span className="text-lg font-bold text-gray-800">
//                                                 {item.value}
//                                             </span>
//                                         )}
//                                     </Link>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Dashboard;



import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import {
    ArrowUpRight,
    BookOpenText,
    CalendarClock,
    CircleCheck,
    ClipboardList,
    FolderOpen,
    FolderTree,
    Globe2,
    LayoutDashboard,
    Leaf,
    Mail,
    Map,
    Pencil,
    Plus,
    RefreshCw,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const getCollection = (response, keys = []) => {
    const payload = response?.data;
    for (const key of keys) {
        if (Array.isArray(payload?.[key])) return payload[key];
    }
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const Dashboard = () => {
    const { auth } = usePage().props;
    const firstName = auth?.user?.name?.split(" ")[0] || "Admin";

    const [now, setNow] = useState(new Date());
    const [loadingStats, setLoadingStats] = useState(true);
    const [stats, setStats] = useState({
        packages: 0,
        countries: 0,
        categories: 0,
        subCategories: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            setLoadingStats(true);
            const [packages, countries, categories, subCategories] =
                await Promise.allSettled([
                    axios.get(route("ourpackages.index")),
                    axios.get(route("ourcountries.index")),
                    axios.get(route("ourcategories.index")),
                    axios.get(route("oursubcategories.index")),
                ]);

            setStats({
                packages:
                    packages.status === "fulfilled"
                        ? getCollection(packages.value, ["packages"]).length
                        : 0,
                countries:
                    countries.status === "fulfilled"
                        ? getCollection(countries.value, ["countries"]).length
                        : 0,
                categories:
                    categories.status === "fulfilled"
                        ? getCollection(categories.value, ["categories"]).length
                        : 0,
                subCategories:
                    subCategories.status === "fulfilled"
                        ? getCollection(subCategories.value, ["sub_categories"])
                              .length
                        : 0,
            });

            setLoadingStats(false);
        };

        fetchStats();
    }, []);

    const greeting = useMemo(() => {
        const hour = now.getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    }, [now]);

    const metricCards = [
        {
            label: "Packages",
            value: stats.packages,
            helper: "Tour packages listed",
            href: "/package",
            icon: Map,
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-500",
        },
        {
            label: "Countries",
            value: stats.countries,
            helper: "Available destinations",
            href: "/countries",
            icon: Globe2,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-500",
        },
        {
            label: "Categories",
            value: stats.categories,
            helper: "Travel groups",
            href: "/categories",
            icon: FolderOpen,
            iconBg: "bg-sky-50",
            iconColor: "text-sky-500",
        },
        {
            label: "Sub Categories",
            value: stats.subCategories,
            helper: "Nested package types",
            href: "/subcategories",
            icon: FolderTree,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
        },
    ];

    const quickActions = [
        {
            label: "Create Package",
            href: "/package",
            icon: Plus,
            description: "Add a new tour package",
        },
        {
            label: "Add Country",
            href: "/countries",
            icon: Globe2,
            description: "Register a destination country",
        },
        {
            label: "Add Category",
            href: "/categories",
            icon: FolderOpen,
            description: "Organize packages by type",
        },
        {
            label: "Manage FAQs",
            href: "/faqs",
            icon: BookOpenText,
            description: "Update customer questions",
        },
    ];

    const workflowTasks = [
        {
            icon: Mail,
            label: "Check new enquiries",
            desc: "Respond while the interest is fresh",
        },
        {
            icon: CircleCheck,
            label: "Confirm bookings",
            desc: "Verify traveller details and payment",
        },
        {
            icon: Pencil,
            label: "Update packages",
            desc: "Adjust pricing, availability & itineraries",
        },
    ];

    return (
        <AdminWrapper>
            <div className="space-y-5">

              {/* ── Hero ── */}
<section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-green-800 to-green-600 px-7 py-8 text-white shadow-lg shadow-green-900/20 md:px-10 md:py-9">
    
    {/* Decorative circles */}
    <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/[0.06]" />
    <div className="pointer-events-none absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-black/[0.08]" />

    {/* Hiking SVG illustration */}
    <svg
        viewBox="0 0 420 180"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute bottom-0 right-0 h-full w-auto max-w-[55%] opacity-[0.07]"
        aria-hidden="true"
    >
        {/* Mountain range */}
        <polygon points="0,180 90,60 140,110 200,30 260,100 310,50 370,90 420,40 420,180" fill="white" />
        {/* Snow caps */}
        <polygon points="200,30 183,72 217,72" fill="white" opacity="0.6" />
        <polygon points="310,50 297,80 323,80" fill="white" opacity="0.5" />
        {/* Hiker silhouette */}
        <g transform="translate(110, 72)">
            {/* Head */}
            <circle cx="18" cy="6" r="5.5" fill="white" />
            {/* Backpack bump */}
            <ellipse cx="23" cy="18" rx="5" ry="7" fill="white" />
            {/* Torso */}
            <rect x="13" y="12" width="9" height="18" rx="2" fill="white" />
            {/* Left arm / trekking pole */}
            <line x1="13" y1="15" x2="2" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="2" y1="32" x2="0" y2="38" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            {/* Right arm */}
            <line x1="22" y1="15" x2="28" y2="26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            {/* Left leg */}
            <line x1="16" y1="30" x2="10" y2="46" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="10" y1="46" x2="4"  y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            {/* Right leg (mid-stride) */}
            <line x1="20" y1="30" x2="26" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="26" y1="44" x2="32" y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Ground/trail line */}
        <path d="M80,180 Q150,155 250,160 Q330,165 420,150" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
        {/* Pine trees */}
        <g fill="white" opacity="0.5">
            <polygon points="50,140 58,110 66,140" />
            <rect x="56" y="140" width="4" height="8" />
            <polygon points="340,130 350,100 360,130" />
            <rect x="348" y="130" width="4" height="8" />
            <polygon points="380,145 388,120 396,145" />
            <rect x="386" y="145" width="4" height="7" />
        </g>
    </svg>

    <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                <LayoutDashboard size={13} />
                Admin Dashboard
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">
                {greeting}, {firstName}.
            </h1>
            <p className="mt-2.5 max-w-md text-sm leading-relaxed text-green-100/80 md:text-[0.925rem]">
                Everything's on track. Manage bookings,
                packages, destinations and enquiries from one
                place.
            </p>
        </div>

        {/* Clock pill */}
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <CalendarClock size={19} className="text-green-200/80" />
            <div>
                <p className="text-xl font-bold tracking-widest">
                    {formatTime(now)}
                </p>
                <p className="mt-0.5 text-[11px] text-green-200/70">
                    {formatDate(now)}
                </p>
            </div>
        </div>
    </div>
</section>

                {/* ── Metric cards ── */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metricCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={card.label}
                                href={card.href}
                                className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
                                        <Icon size={19} />
                                    </div>
                                    <ArrowUpRight
                                        size={16}
                                        className="text-gray-300 transition-colors group-hover:text-green-500"
                                    />
                                </div>
                                <div className="mt-5">
                                    {loadingStats ? (
                                        <span className="block h-9 w-14 animate-pulse rounded-lg bg-gray-100" />
                                    ) : (
                                        <p className="text-4xl font-bold leading-none tracking-tight text-gray-900">
                                            {card.value}
                                        </p>
                                    )}
                                    <p className="mt-2.5 text-sm font-semibold text-gray-700">
                                        {card.label}
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-400">
                                        {card.helper}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </section>

                {/* ── Bottom row ── */}
                <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">

                    {/* Quick Access */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm xl:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-[15px] font-bold text-gray-900">
                                    Quick Access
                                </h2>
                                <p className="mt-0.5 text-xs text-gray-400">
                                    Jump into the most common admin sections.
                                </p>
                            </div>
                            <RefreshCw
                                size={16}
                                className={`transition-colors ${loadingStats ? "animate-spin text-green-400" : "text-gray-300"}`}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="group flex items-center gap-3.5 rounded-xl border border-gray-100 p-3.5 transition-all hover:border-green-100 hover:bg-green-50/50"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all group-hover:bg-white group-hover:text-green-600">
                                            <Icon size={17} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {action.label}
                                            </p>
                                            <p className="mt-0.5 truncate text-[11px] text-gray-400">
                                                {action.description}
                                            </p>
                                        </div>
                                        <ArrowUpRight
                                            size={15}
                                            className="shrink-0 text-gray-300 transition-colors group-hover:text-green-500"
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Daily Workflow */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">

                        {/* Header */}
                        <div className="mb-4">
                            <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-600">
                                <ClipboardList size={11} />
                                Daily workflow
                            </span>
                            <h2 className="text-[15px] font-bold text-gray-900">
                                Keep operations moving
                            </h2>
                            <p className="mt-0.5 text-xs text-gray-400">
                                Your checklist for a productive day.
                            </p>
                        </div>

                        <div className="my-3.5 h-px bg-gray-100" />

                        {/* Tasks */}
                        <div className="divide-y divide-gray-50">
                            {workflowTasks.map((task) => {
                                const Icon = task.icon;
                                return (
                                    <div
                                        key={task.label}
                                        className="flex items-start gap-3 py-2.5"
                                    >
                                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                                            <Icon size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {task.label}
                                            </p>
                                            <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">
                                                {task.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tip */}
                        <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-green-100 bg-green-50 px-3.5 py-3">
                            <Leaf size={14} className="mt-0.5 shrink-0 text-green-600" />
                            <p className="text-[11px] leading-relaxed text-green-800">
                                <span className="font-semibold text-green-900">
                                    Traveller-first approach
                                </span>{" "}
                                — Accurate listings and prompt replies build
                                trust that converts enquiries into confirmed
                                bookings.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </AdminWrapper>
    );
};

export default Dashboard;

// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Link, usePage } from "@inertiajs/react";
// import axios from "axios";
// import {
//     ArrowUpRight,
//     BookOpenText,
//     CalendarClock,
//     CircleCheck,
//     ClipboardList,
//     FolderOpen,
//     FolderTree,
//     Globe2,
//     LayoutDashboard,
//     Leaf,
//     Mail,
//     Map,
//     Pencil,
//     Plus,
//     RefreshCw,
// } from "lucide-react";
// import React, { useEffect, useMemo, useState } from "react";

// const getCollection = (response, keys = []) => {
//     const payload = response?.data;
//     for (const key of keys) {
//         if (Array.isArray(payload?.[key])) return payload[key];
//     }
//     if (Array.isArray(payload)) return payload;
//     if (Array.isArray(payload?.data)) return payload.data;
//     return [];
// };

// const formatTime = (date) =>
//     date.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//     });

// const formatDate = (date) =>
//     date.toLocaleDateString("en-US", {
//         weekday: "long",
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//     });

// const Dashboard = () => {
//     const { auth } = usePage().props;
//     const firstName = auth?.user?.name?.split(" ")[0] || "Admin";

//     const [now, setNow] = useState(new Date());
//     const [loadingStats, setLoadingStats] = useState(true);
//     const [stats, setStats] = useState({
//         packages: 0,
//         countries: 0,
//         categories: 0,
//         subCategories: 0,
//     });

//     useEffect(() => {
//         const timer = setInterval(() => setNow(new Date()), 30000);
//         return () => clearInterval(timer);
//     }, []);

//     useEffect(() => {
//         const fetchStats = async () => {
//             setLoadingStats(true);
//             const [packages, countries, categories, subCategories] =
//                 await Promise.allSettled([
//                     axios.get(route("ourpackages.index")),
//                     axios.get(route("ourcountries.index")),
//                     axios.get(route("ourcategories.index")),
//                     axios.get(route("oursubcategories.index")),
//                 ]);

//             setStats({
//                 packages:
//                     packages.status === "fulfilled"
//                         ? getCollection(packages.value, ["packages"]).length
//                         : 0,
//                 countries:
//                     countries.status === "fulfilled"
//                         ? getCollection(countries.value, ["countries"]).length
//                         : 0,
//                 categories:
//                     categories.status === "fulfilled"
//                         ? getCollection(categories.value, ["categories"]).length
//                         : 0,
//                 subCategories:
//                     subCategories.status === "fulfilled"
//                         ? getCollection(subCategories.value, ["sub_categories"])
//                               .length
//                         : 0,
//             });

//             setLoadingStats(false);
//         };

//         fetchStats();
//     }, []);

//     const greeting = useMemo(() => {
//         const hour = now.getHours();
//         if (hour < 12) return "Good morning";
//         if (hour < 17) return "Good afternoon";
//         return "Good evening";
//     }, [now]);

//     const metricCards = [
//         {
//             label: "Packages",
//             value: stats.packages,
//             helper: "Tour packages listed",
//             href: "/package",
//             icon: Map,
//             iconBg: "bg-indigo-50",
//             iconColor: "text-indigo-500",
//         },
//         {
//             label: "Countries",
//             value: stats.countries,
//             helper: "Available destinations",
//             href: "/countries",
//             icon: Globe2,
//             iconBg: "bg-emerald-50",
//             iconColor: "text-emerald-500",
//         },
//         {
//             label: "Categories",
//             value: stats.categories,
//             helper: "Travel groups",
//             href: "/categories",
//             icon: FolderOpen,
//             iconBg: "bg-sky-50",
//             iconColor: "text-sky-500",
//         },
//         {
//             label: "Sub Categories",
//             value: stats.subCategories,
//             helper: "Nested package types",
//             href: "/subcategories",
//             icon: FolderTree,
//             iconBg: "bg-amber-50",
//             iconColor: "text-amber-500",
//         },
//     ];

//     const quickActions = [
//         {
//             label: "Create Package",
//             href: "/package",
//             icon: Plus,
//             description: "Add a new tour package",
//         },
//         {
//             label: "Add Country",
//             href: "/countries",
//             icon: Globe2,
//             description: "Register a destination country",
//         },
//         {
//             label: "Add Category",
//             href: "/categories",
//             icon: FolderOpen,
//             description: "Organize packages by type",
//         },
//         {
//             label: "Manage FAQs",
//             href: "/faqs",
//             icon: BookOpenText,
//             description: "Update customer questions",
//         },
//     ];

//     const workflowTasks = [
//         {
//             icon: Mail,
//             label: "Check new enquiries",
//             desc: "Respond while the interest is fresh",
//         },
//         {
//             icon: CircleCheck,
//             label: "Confirm bookings",
//             desc: "Verify traveller details and payment",
//         },
//         {
//             icon: Pencil,
//             label: "Update packages",
//             desc: "Adjust pricing, availability & itineraries",
//         },
//     ];

//     return (
//         <AdminWrapper>
//             <div className="space-y-5">

//                 {/* ── Hero ── */}
//                 <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-green-800 to-green-600 px-7 py-8 text-white shadow-lg shadow-green-900/20 md:px-10 md:py-9">
//                     <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/[0.06]" />
//                     <div className="pointer-events-none absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-black/[0.08]" />

//                     <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
//                         <div>
//                             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
//                                 <LayoutDashboard size={13} />
//                                 Admin Dashboard
//                             </div>
//                             <h1 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">
//                                 {greeting}, {firstName}.
//                             </h1>
//                             <p className="mt-2.5 max-w-md text-sm leading-relaxed text-green-100/80 md:text-[0.925rem]">
//                                 Everything's on track. Manage bookings,
//                                 packages, destinations and enquiries from one
//                                 place.
//                             </p>
//                         </div>

//                         {/* Clock pill */}
//                         <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
//                             <CalendarClock size={19} className="text-green-200/80" />
//                             <div>
//                                 <p className="text-xl font-bold tracking-widest">
//                                     {formatTime(now)}
//                                 </p>
//                                 <p className="mt-0.5 text-[11px] text-green-200/70">
//                                     {formatDate(now)}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* ── Metric cards ── */}
//                 <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//                     {metricCards.map((card) => {
//                         const Icon = card.icon;
//                         return (
//                             <Link
//                                 key={card.label}
//                                 href={card.href}
//                                 className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
//                             >
//                                 <div className="flex items-start justify-between">
//                                     <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
//                                         <Icon size={19} />
//                                     </div>
//                                     <ArrowUpRight
//                                         size={16}
//                                         className="text-gray-300 transition-colors group-hover:text-green-500"
//                                     />
//                                 </div>
//                                 <div className="mt-5">
//                                     {loadingStats ? (
//                                         <span className="block h-9 w-14 animate-pulse rounded-lg bg-gray-100" />
//                                     ) : (
//                                         <p className="text-4xl font-bold leading-none tracking-tight text-gray-900">
//                                             {card.value}
//                                         </p>
//                                     )}
//                                     <p className="mt-2.5 text-sm font-semibold text-gray-700">
//                                         {card.label}
//                                     </p>
//                                     <p className="mt-0.5 text-xs text-gray-400">
//                                         {card.helper}
//                                     </p>
//                                 </div>
//                             </Link>
//                         );
//                     })}
//                 </section>

//                 {/* ── Bottom row ── */}
//                 <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">

//                     {/* Quick Access */}
//                     <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm xl:col-span-2">
//                         <div className="mb-5 flex items-center justify-between">
//                             <div>
//                                 <h2 className="text-[15px] font-bold text-gray-900">
//                                     Quick Access
//                                 </h2>
//                                 <p className="mt-0.5 text-xs text-gray-400">
//                                     Jump into the most common admin sections.
//                                 </p>
//                             </div>
//                             <RefreshCw
//                                 size={16}
//                                 className={`transition-colors ${loadingStats ? "animate-spin text-green-400" : "text-gray-300"}`}
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                             {quickActions.map((action) => {
//                                 const Icon = action.icon;
//                                 return (
//                                     <Link
//                                         key={action.label}
//                                         href={action.href}
//                                         className="group flex items-center gap-3.5 rounded-xl border border-gray-100 p-3.5 transition-all hover:border-green-100 hover:bg-green-50/50"
//                                     >
//                                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all group-hover:bg-white group-hover:text-green-600">
//                                             <Icon size={17} />
//                                         </div>
//                                         <div className="min-w-0 flex-1">
//                                             <p className="text-sm font-semibold text-gray-800">
//                                                 {action.label}
//                                             </p>
//                                             <p className="mt-0.5 truncate text-[11px] text-gray-400">
//                                                 {action.description}
//                                             </p>
//                                         </div>
//                                         <ArrowUpRight
//                                             size={15}
//                                             className="shrink-0 text-gray-300 transition-colors group-hover:text-green-500"
//                                         />
//                                     </Link>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* Daily Workflow */}
//                     <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">

//                         {/* Header */}
//                         <div className="mb-4">
//                             <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-600">
//                                 <ClipboardList size={11} />
//                                 Daily workflow
//                             </span>
//                             <h2 className="text-[15px] font-bold text-gray-900">
//                                 Keep operations moving
//                             </h2>
//                             <p className="mt-0.5 text-xs text-gray-400">
//                                 Your checklist for a productive day.
//                             </p>
//                         </div>

//                         <div className="my-3.5 h-px bg-gray-100" />

//                         {/* Tasks */}
//                         <div className="divide-y divide-gray-50">
//                             {workflowTasks.map((task) => {
//                                 const Icon = task.icon;
//                                 return (
//                                     <div
//                                         key={task.label}
//                                         className="flex items-start gap-3 py-2.5"
//                                     >
//                                         <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
//                                             <Icon size={14} />
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-semibold text-gray-800">
//                                                 {task.label}
//                                             </p>
//                                             <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">
//                                                 {task.desc}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         {/* Tip */}
//                         <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-green-100 bg-green-50 px-3.5 py-3">
//                             <Leaf size={14} className="mt-0.5 shrink-0 text-green-600" />
//                             <p className="text-[11px] leading-relaxed text-green-800">
//                                 <span className="font-semibold text-green-900">
//                                     Traveller-first approach
//                                 </span>{" "}
//                                 — Accurate listings and prompt replies build
//                                 trust that converts enquiries into confirmed
//                                 bookings.
//                             </p>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Dashboard;