'use client'
import Link from "next/link";
import { useActionState, useEffect } from "react";
import SubmitButton from "../_components/SubmitButton";
import { signup } from "@/actions/usersActions";
import { createToast } from "@/utils/createToast";
import { redirect } from "next/navigation";

const SignupPage = () => {
    const [signupState, signupAction, isSigningUp] = useActionState(signup, null);

    useEffect(() => {
        if (signupState?.emailError) createToast("error", signupState.emailError);
        else if (signupState?.passwordError) createToast("error", signupState.passwordError);
        else if (signupState?.supabaseError) createToast("error", signupState.supabaseError);
        else if (signupState?.success) {
            createToast("success", signupState.success);
            redirect("/login");
        }
    }, [signupState]);

    return (
        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.45)]">
                <div className="border-b border-white/10 px-8 py-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-center">Create your account</h1>
                    <p className="text-sm text-gray-400 mt-1 text-center">Start off by creating an account</p>
                </div>

                <div className="px-8 py-6">
                    <form action={signupAction} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm text-zinc-300">Email</label>
                            <input id="email" name="email" type="email" autoComplete="email" autoFocus disabled={isSigningUp}
                                placeholder="john.doe@domain.com"
                                className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-gray-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500/80 placeholder:text-gray-500" />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm text-zinc-300">Password</label>
                            <input id="password" name="password" type="password" autoComplete="off" disabled={isSigningUp}
                                placeholder="Create a strong password"
                                className="w-full rounded-xl bg-zinc-900/70 px-3 py-2.5 text-gray-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-indigo-500/80 placeholder:text-gray-500" />
                        </div>

                        <SubmitButton pendingText="Creating account…">Create account</SubmitButton>

                        <div className="flex items-center justify-center pt-2">
                            <p className="text-sm text-gray-400">Already have an account?</p>
                            <Link href="/login" className={`text-sm font-semibold text-gray-100 underline-offset-4 transition hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 rounded-md px-1 ${isSigningUp && "pointer-events-none opacity-20"}`}>
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignupPage