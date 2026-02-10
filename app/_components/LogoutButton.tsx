'use client'
import { useActionState, useEffect } from "react";
import { redirect } from "next/navigation";
import { logout } from "@/actions/usersActions"
import { createToast } from "@/utils/createToast";
import { Loader2, LogOut } from "lucide-react";

const LogoutButton = ({ disabled }: { disabled: boolean }) => {
  const [logoutResponse, logoutAction, isLoggingOut] = useActionState(logout, null);

  useEffect(() => {
    if (logoutResponse?.supabaseError) createToast("error", logoutResponse.supabaseError);
    else if (logoutResponse?.success) {
      createToast("success", logoutResponse.success);
      redirect("/login");
    }
  }, [logoutResponse]);

  return (
    <form action={logoutAction}>
      <button
        className="rounded-lg border border-orange-600/30 bg-orange-600/10 px-4 py-2 text-sm text-orange-100 hover:bg-orange-600/20 focus:outline-none focus:ring-2 focus:ring-orange-600/40 transition-colors duration-200"
        disabled={disabled}
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