'use client'
import { useActionState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { logout } from "@/actions/usersActions"
import { createToast } from "@/utils/createToast";

const LogoutButton = ({ disabled }: { disabled: boolean }) => {
  const [logoutState, logoutAction, isLoggingOut] = useActionState(logout, null);

  useEffect(() => {
    if (logoutState?.supabaseError) createToast("error", logoutState.supabaseError);
    else if (logoutState?.success) {
      createToast("success", logoutState.success);
      redirect("/login");
    }
  }, [logoutState]);

  return (
    <form action={logoutAction}>
      <button
        className="rounded-lg border border-orange-600/30 bg-orange-600/10 px-4 py-2 text-sm text-orange-100 hover:bg-orange-600/20 focus:outline-none focus:ring-2 focus:ring-orange-600/40 transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50"
        disabled={disabled || isLoggingOut}
      >
        {isLoggingOut ? (
          <div>
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5">
            <LogOut className="size-4" />
            <span>Log out</span>
          </div>
        )}
      </button>
    </form>
  )
}

export default LogoutButton