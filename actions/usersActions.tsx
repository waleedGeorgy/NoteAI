'use server';
import { createClient } from "@/utils/supabase/server";

type AuthActionsResponses = {
    emailError?: string;
    passwordError?: string;
    supabaseError?: string;
    success?: string;
}

export const login = async (prevState: unknown, formData: FormData): Promise<AuthActionsResponses> => {
    const supabase = await createClient();

    const res = {} as AuthActionsResponses;

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || email.trim().length === 0) {
        res.emailError = "Please enter your email";
        return res;
    }
    if (!password || password.trim().length < 6) {
        res.passwordError = "Please enter your password";
        return res;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        res.supabaseError = error.message + " | " + error.name;
        return res;
    }

    res.success = "Successfully logged in";
    return res;
}

export const signup = async (prevState: unknown, formData: FormData): Promise<AuthActionsResponses> => {
    const supabase = await createClient();

    const res = {} as AuthActionsResponses;

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || email.trim().length === 0) {
        res.emailError = "A valid email is required";
        return res;
    }
    if (!password || password.trim().length < 6) {
        res.passwordError = "Password must be at least 6 characters long";
        return res;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
        res.supabaseError = error.message + " | " + error.name;
        return res;
    }

    res.success = "Check email for confirmation code";
    return res;
}

export const logout = async (): Promise<AuthActionsResponses> => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    const res = {} as AuthActionsResponses;

    if (error) {
        res.supabaseError = error.message;
        return res;
    }

    res.success = "Successfully logged out";
    return res;
}