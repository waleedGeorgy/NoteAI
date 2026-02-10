import toast from "react-hot-toast";

export const createToast = (type: "success" | "error", message: string) => {
  const toastDarkMode = {
    borderRadius: "10px",
    backgroundColor: "#333",
    color: "#fff",
  };

  switch (type) {
    case "success":
      toast.success(message, {
        style: toastDarkMode,
        duration: 4000,
      });
      break;
    case "error":
      toast.error(message, {
        style: toastDarkMode,
        duration: 4000,
      });
      break;
  }
};
