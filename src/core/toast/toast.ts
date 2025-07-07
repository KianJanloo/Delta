import { toast } from "react-toastify"

type ToastType = "success" | "error" | "warning" | "info" | "loading"

export const showToast = (type: ToastType, message: string, label?: string, description?: string, duration?: number) => {

    toast[type](message, {
        position: "top-center",
        className: "bg-subBg text-foreground font-semibold text-sm  ",
        delay: duration,
        pauseOnHover: true,
        closeButton: false,
    });
}