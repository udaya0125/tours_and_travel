// import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Login({ status, canResetPassword }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Log in" />

//             {status && (
//                 <div className="mb-4 text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         isFocused={true}
//                         onChange={(e) => setData('email', e.target.value)}
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="current-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4 block">
//                     <label className="flex items-center">
//                         <Checkbox
//                             name="remember"
//                             checked={data.remember}
//                             onChange={(e) =>
//                                 setData('remember', e.target.checked)
//                             }
//                         />
//                         <span className="ms-2 text-sm text-gray-600">
//                             Remember me
//                         </span>
//                     </label>
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     {canResetPassword && (
//                         <Link
//                             href={route('password.request')}
//                             className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Forgot your password?
//                         </Link>
//                     )}

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Log in
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }


// import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import { Head, Link, useForm } from '@inertiajs/react';
// import { Eye, EyeOff } from 'lucide-react';
// import { useState } from 'react';

// export default function Login({ status, canResetPassword }) {
//     const [showPassword, setShowPassword] = useState(false);

//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();
//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <>
//             <Head title="Log in" />

//             <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
//                 <div className="flex w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl">

//                     {/* Left Panel — Blue */}
//                     <div className="flex w-5/12 flex-col items-center justify-between bg-[#3a4fc7] px-8 py-10">
//                         {/* Logo */}
//                         <div className="flex items-center gap-2">
//                             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
//                                 <img
//                                     src="/images/logo2.png"
//                                     alt="Everyday Bakery"
//                                     className="h-5 w-5 object-contain"
//                                 />
//                             </div>
//                             <div className="leading-tight text-white">
//                                 <p className="text-base font-semibold">
//                                     <span className="text-lg">E</span>veryday
//                                 </p>
//                                 <p className="text-[10px] tracking-wider opacity-80">
//                                     Bakery —
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Heading */}
//                         <div className="text-center">
//                             <h1 className="text-2xl font-medium text-white">
//                                 Welcome
//                             </h1>
//                             <p className="mt-1.5 text-sm text-white/75">
//                                 Empower Your Team, Simplify Your Day
//                             </p>
//                         </div>

//                         {/* Illustration placeholder */}
//                         <div className="w-full max-w-[200px]">
//                             <img
//                                 src="/images/login-illustration.png"
//                                 alt=""
//                                 className="h-auto w-full object-contain"
//                                 onError={(e) => (e.target.style.display = 'none')}
//                             />
//                         </div>
//                     </div>

//                     {/* Right Panel — White */}
//                     <div className="flex w-7/12 flex-col justify-between bg-white px-8 py-10">
//                         <div>
//                             {status && (
//                                 <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
//                                     {status}
//                                 </div>
//                             )}

//                             <form onSubmit={submit} className="space-y-5">
//                                 {/* Email */}
//                                 <div>
//                                     <label
//                                         htmlFor="email"
//                                         className="mb-1.5 block text-sm font-medium text-gray-700"
//                                     >
//                                         Email
//                                     </label>
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         name="email"
//                                         value={data.email}
//                                         autoComplete="username"
//                                         autoFocus
//                                         onChange={(e) =>
//                                             setData('email', e.target.value)
//                                         }
//                                         placeholder="testadmin@test.com"
//                                         className="block h-11 w-full rounded-lg border border-[#e2e4f0] bg-[#eef0f8] px-3 text-sm text-gray-700 outline-none transition focus:border-[#3a4fc7] focus:ring-2 focus:ring-[#3a4fc7]/20"
//                                     />
//                                     <InputError
//                                         message={errors.email}
//                                         className="mt-1.5"
//                                     />
//                                 </div>

//                                 {/* Password */}
//                                 <div>
//                                     <div className="mb-1.5 flex items-center justify-between">
//                                         <label
//                                             htmlFor="password"
//                                             className="block text-sm font-medium text-gray-700"
//                                         >
//                                             Password
//                                         </label>
//                                         {canResetPassword && (
//                                             <Link
//                                                 href={route('password.request')}
//                                                 className="text-xs text-[#3a4fc7] hover:underline"
//                                             >
//                                                 Forgot password?
//                                             </Link>
//                                         )}
//                                     </div>
//                                     <div className="relative">
//                                         <input
//                                             id="password"
//                                             type={
//                                                 showPassword
//                                                     ? 'text'
//                                                     : 'password'
//                                             }
//                                             name="password"
//                                             value={data.password}
//                                             autoComplete="current-password"
//                                             onChange={(e) =>
//                                                 setData(
//                                                     'password',
//                                                     e.target.value,
//                                                 )
//                                             }
//                                             placeholder="••••••••••"
//                                             className="block h-11 w-full rounded-lg border border-[#e2e4f0] bg-[#eef0f8] px-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-[#3a4fc7] focus:ring-2 focus:ring-[#3a4fc7]/20"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 setShowPassword((c) => !c)
//                                             }
//                                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                             aria-label={
//                                                 showPassword
//                                                     ? 'Hide password'
//                                                     : 'Show password'
//                                             }
//                                         >
//                                             {showPassword ? (
//                                                 <EyeOff className="h-4 w-4" />
//                                             ) : (
//                                                 <Eye className="h-4 w-4" />
//                                             )}
//                                         </button>
//                                     </div>
//                                     <InputError
//                                         message={errors.password}
//                                         className="mt-1.5"
//                                     />
//                                 </div>

//                                 {/* Submit */}
//                                 <button
//                                     type="submit"
//                                     disabled={processing}
//                                     className="h-11 w-full rounded-lg bg-[#2d3a9c] text-sm font-semibold tracking-widest text-white transition hover:bg-[#3a4fc7] disabled:cursor-not-allowed disabled:opacity-60"
//                                 >
//                                     {processing ? 'SIGNING IN...' : 'LOG IN'}
//                                 </button>
//                             </form>
//                         </div>

//                         {/* Footer */}
//                         <div className="mt-8 text-center">
//                             <p className="mb-2 text-xs font-semibold tracking-wide text-[#3a4fc7]">
//                                 Powered By
//                             </p>
//                             <div className="mb-3 inline-flex items-center gap-1 rounded-lg border border-[#e2e4f0] bg-slate-50 px-3 py-2">
//                                 <span className="text-2xl font-bold text-amber-400">
//                                     S
//                                 </span>
//                                 <div className="rounded bg-[#2d3a9c] px-1 py-0.5">
//                                     <span className="text-sm font-bold text-white">
//                                         A
//                                     </span>
//                                     <span className="text-xs font-bold text-amber-400">
//                                         i
//                                     </span>
//                                     <span className="text-sm font-bold text-white">
//                                         t
//                                     </span>
//                                 </div>
//                                 <div className="ml-1 text-left">
//                                     <p className="text-[8px] font-semibold tracking-wide text-[#2d3a9c]">
//                                         SOLUTION
//                                     </p>
//                                     <p className="text-[7px] text-gray-400">
//                                         & Trade Concern
//                                     </p>
//                                 </div>
//                             </div>

//                             <p className="mb-2 text-xs font-semibold tracking-wide text-[#3a4fc7]">
//                                 Reach Us
//                             </p>
//                             <div className="flex items-center justify-center gap-3">
//                                 {/* Facebook */}
//                                 <a
//                                     href="#"
//                                     aria-label="Facebook"
//                                     className="text-[#1877F2] hover:opacity-80"
//                                 >
//                                     <svg
//                                         className="h-5 w-5"
//                                         fill="currentColor"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                                     </svg>
//                                 </a>
//                                 {/* Instagram */}
//                                 <a
//                                     href="#"
//                                     aria-label="Instagram"
//                                     className="hover:opacity-80"
//                                 >
//                                     <svg
//                                         className="h-5 w-5"
//                                         viewBox="0 0 24 24"
//                                         fill="url(#ig-grad)"
//                                     >
//                                         <defs>
//                                             <linearGradient
//                                                 id="ig-grad"
//                                                 x1="0%"
//                                                 y1="100%"
//                                                 x2="100%"
//                                                 y2="0%"
//                                             >
//                                                 <stop
//                                                     offset="0%"
//                                                     stopColor="#f09433"
//                                                 />
//                                                 <stop
//                                                     offset="50%"
//                                                     stopColor="#dc2743"
//                                                 />
//                                                 <stop
//                                                     offset="100%"
//                                                     stopColor="#bc1888"
//                                                 />
//                                             </linearGradient>
//                                         </defs>
//                                         <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
//                                     </svg>
//                                 </a>
//                                 {/* LinkedIn */}
//                                 <a
//                                     href="#"
//                                     aria-label="LinkedIn"
//                                     className="text-[#0077B5] hover:opacity-80"
//                                 >
//                                     <svg
//                                         className="h-5 w-5"
//                                         fill="currentColor"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                                     </svg>
//                                 </a>
//                                 {/* YouTube */}
//                                 <a
//                                     href="#"
//                                     aria-label="YouTube"
//                                     className="text-[#FF0000] hover:opacity-80"
//                                 >
//                                     <svg
//                                         className="h-5 w-5"
//                                         fill="currentColor"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
//                                     </svg>
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }

import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Globe2,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <main className="min-h-screen bg-[#f6faf7] text-slate-800">
                <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
                    {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(187,247,208,0.55),transparent_34%),linear-gradient(135deg,#f8fcf9_0%,#eef8f1_48%,#f8fafc_100%)]" />
                    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/55 blur-3xl" /> */}

                    <div className="relative w-full max-w-md">
                        <div className="rounded-lg border border-white/90 bg-white/86 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
                            <div className="mb-7 text-center">
                                <p className="text-lg font-medium uppercase tracking-[0.18em] text-emerald-700">
                                    Welcome Back
                                </p>
                            </div>

                            {status && (
                                <div className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <span>{status}</span>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block h-12 w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                            autoComplete="username"
                                            autoFocus
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Password
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route("password.request")}
                                                className="rounded-md text-sm font-medium text-emerald-700 transition hover:text-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            className="block h-12 w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-10 pr-12 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                            autoComplete="current-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((c) => !c)
                                            }
                                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <label className="inline-flex items-center gap-2">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded border-slate-300 text-emerald-600"
                                        />
                                        <span className="text-sm font-medium text-slate-600">
                                            Keep me signed in
                                        </span>
                                    </label>

                                    <span className="hidden text-xs font-medium text-slate-400 sm:inline">
                                        Secure admin access
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(4,120,87,0.22)] transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? "Signing in..." : "Sign in"}
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
