'use server'

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server"
import { Note } from "@/utils/types";

type NotesActionsResponses = {
    titleError?: string,
    contentError?: string,
    supabaseError?: string,
    success?: string,
    id?: string,
    updatedNote?: Note
}

export const addNote = async (prevState: unknown, formData: FormData): Promise<NotesActionsResponses> => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    const res = {} as NotesActionsResponses;

    const title = (formData.get('title') as string).trim();
    const content = (formData.get('content') as string).trim();

    if (!title) {
        res.titleError = "A note title is required";
        return res;
    }
    if (!content) {
        res.contentError = "A note content is required";
        return res;
    }

    const { error } = await supabase.from("notes").insert({ title, content, user_id: data.user?.id });
    if (error) {
        res.supabaseError = error.message + ". Please try again.";
        return res;
    } else {
        res.success = "Note added successfully";

        revalidatePath('/dashboard');

        return res;
    }
}

export const updateNote = async (prevState: unknown, formData: FormData): Promise<NotesActionsResponses> => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    const res = {} as NotesActionsResponses;

    const id = formData.get('id') as string;
    const title = (formData.get('title') as string).trim();
    const content = (formData.get('content') as string).trim();

    if (!id) redirect("/dashboard");
    if (!title) {
        res.titleError = "A note title is required";
        return res;
    }
    if (!content) {
        res.contentError = "A note content is required";
        return res;
    }

    const { data: updatedNote, error } = await supabase.from("notes")
        .update({ title, content, summary: null })
        .eq('id', id)
        .eq('user_id', data.user?.id)
        .select().single();

    if (error) {
        res.supabaseError = error.message + ". Please try again.";
        return res;
    }

    res.success = "Note updated successfully";
    res.updatedNote = updatedNote;

    revalidatePath("/dashboard");
    revalidatePath(`/notes/${id}`);

    return res;
}

export const deleteNote = async (prevState: unknown, formData: FormData): Promise<NotesActionsResponses> => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    const res = {} as NotesActionsResponses;

    const id = formData.get('id') as string;
    if (!id) redirect("/dashboard");

    const { error } = await supabase.from("notes").delete().eq('id', id).eq('user_id', data.user?.id);
    if (error) {
        res.supabaseError = error.message + ". Please try again.";
        return res;
    }

    res.success = "Note deleted successfully";
    res.id = id;

    revalidatePath("/dashboard");

    return res;
}

export async function createNoteSummary(id: string, summary: string) {
    const supabase = await createClient();
    if (!id || !summary) {
        throw new Error('Missing note ID or summary');
    }

    try {
        const { error } = await supabase
            .from('notes')
            .update({
                summary,
                summarized_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        return { success: true, summary };
    } catch (error) {
        console.error('Error saving summary:', error);
        throw error;
    }
}