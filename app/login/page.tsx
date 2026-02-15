'use client'
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SubmitButton from "../_components/SubmitButton";
import { login } from "@/actions/usersActions";
import { createToast } from "@/utils/createToast";

const LoginPage = () => {
    const [loginState, loginAction, isLoggingIn] = useActionState(login, null);

    useEffect(() => {
        if (loginState?.emailError) createToast("error", loginState.emailError);
        else if (loginState?.passwordError) createToast("error", loginState.passwordError);
        else if (loginState?.supabaseError) createToast("error", loginState.supabaseError);
        else if (loginState?.success) {
            createToast("success", loginState.success);
            redirect("/dashboard");
        }
    }, [loginState]);

    return (
        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.45)]">
                <div className="border-b border-white/10 px-8 py-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-center">Welcome back</h2>
                    <p className="text-sm text-gray-400 text-center mt-1">Log in to continue with Mnemo.ai</p>
                </div>

                <div className="px-8 py-6">
                    <form action={loginAction} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm text-gray-300">Email</label>
                            <input id="email" name="email" type="email" autoComplete="email" autoFocus disabled={isLoggingIn}
                                placeholder="john.doe@domain.com"
                                className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-gray-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500/80 placeholder:text-gray-500" />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm text-gray-300">Password</label>
                            <input id="password" name="password" type="password" autoComplete="off" disabled={isLoggingIn}
                                placeholder="••••••••"
                                className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-gray-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500/80 placeholder:text-gray-500" />
                        </div>

                        <SubmitButton pendingText="Logging in...">Log in</SubmitButton>

                        <div className="flex items-center justify-center pt-2">
                            <p className="text-sm text-gray-400">Don&apos;t have an account?</p>
                            <Link href="/signup" className={`text-sm text-gray-100 underline-offset-4 transition-colors hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 rounded-md px-1 font-semibold ${isLoggingIn && "pointer-events-none opacity-20"}`}>
                                Create an account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage