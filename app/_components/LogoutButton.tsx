'use client'
import { useActionState, useEffect } from "react";
import { redirect } from "next/navigation";
import { logout } from "@/actions/usersActions"
import { createToast } from "@/utils/createToast";

const LogoutButton = () => {
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
      <button className="rounded border border-orange-600/30 bg-orange-600/10 px-4 py-1.5 text-sm text-orange-100 hover:bg-orange-600/20 focus:outline-none focus:ring-2 focus:ring-orange-600/40 transition-colors duration-200">
        {isLoggingOut ? "Logging out" : "Log out"}
      </button>
    </form>
  )
}

export default LogoutButton