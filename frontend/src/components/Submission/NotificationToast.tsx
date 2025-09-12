import { useEffect } from "react";
import { CheckCircle, XCircle, Clock, X } from "lucide-react";

export interface Notification {
  id: string;
  type: "error" | "success" | "info";
  message: string;
  duration?: number;
}

interface Props {
  notification: Notification;
  onDismiss: (id: string) => void;
}

export default function NotificationToast({ notification, onDismiss }: Props) {
  const { id, type, message, duration = 4000 } = notification;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const bgColor =
    type === "error"
      ? "bg-red-100 border-red-300 text-red-800"
      : type === "success"
      ? "bg-green-100 border-green-300 text-green-800"
      : "bg-blue-100 border-blue-300 text-blue-800";

  const icon =
    type === "error" ? (
      <XCircle className="w-5 h-5" />
    ) : type === "success" ? (
      <CheckCircle className="w-5 h-5" />
    ) : (
      <Clock className="w-5 h-5" />
    );

  return (
    <div
      className={`flex items-center justify-between p-4 mb-2 rounded-lg border ${bgColor} shadow-lg animate-fadeIn`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={() => onDismiss(id)} className="text-gray-500 hover:text-gray-700 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
