import { XMarkIcon } from "@heroicons/react/24/outline";
import { useToast } from "../../context/ToastContext";
import "./ToastContainer.css";

export default function ToastContainer() {
    const { toasts, dismissToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-stack">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast toast-${toast.type}${toast.onClick ? " toast-clickable" : ""}`}
                    onClick={() => {
                        toast.onClick?.();
                        dismissToast(toast.id);
                    }}
                    role={toast.onClick ? "button" : "status"}
                    tabIndex={toast.onClick ? 0 : undefined}
                >
                    <div className="toast-body">
                        <div className="toast-title">{toast.title}</div>
                        {toast.message && <div className="toast-message">{toast.message}</div>}
                    </div>
                    <button
                        type="button"
                        className="toast-close"
                        onClick={(e) => { e.stopPropagation(); dismissToast(toast.id); }}
                        aria-label="Dismiss"
                    >
                        <XMarkIcon className="toast-close-icon" />
                    </button>
                </div>
            ))}
        </div>
    );
}
