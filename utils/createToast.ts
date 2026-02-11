import toast from "react-hot-toast";

export const createToast = (type: "success" | "error", message: string) => {
  const toastDarkMode = {
    borderRadius: "10px",
    backgroundColor: "#1f2937",
    color: "#e5e7eb",
  };

  switch (type) {
    case "success":
      toast.success(message, {
        style: toastDarkMode,
        duration: 4000,
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
      break;
    case "error":
      toast.error(message, {
        style: toastDarkMode,
        duration: 4000,
        ariaProps: {
          role: "alert",
          "aria-live": "polite",
        },
      });
      break;
  }
};
