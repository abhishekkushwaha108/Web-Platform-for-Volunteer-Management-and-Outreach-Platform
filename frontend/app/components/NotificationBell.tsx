import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";

type Notification = {
  id: number;
  type: "join" | "create" | "system";
  message: string;
  eventTitle?: string;
  time: string;
};

export default function NotificationBell() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // 🔔 Load notifications based on role
  useEffect(() => {
    if (user?.role === "USER") {
      setNotifications([
        {
          id: 1,
          type: "join",
          message: "You enrolled in",
          eventTitle: "Clean River",
          time: "2 mins ago",
        },
        {
          id: 2,
          type: "system",
          message: "Reminder for",
          eventTitle: "Tree Plantation Drive",
          time: "1 hour ago",
        },
      ]);
    } else if (user?.role === "ORGANIZER") {
      setNotifications([
        {
          id: 1,
          type: "join",
          message: "Rahul joined",
          eventTitle: "Tree Plantation Drive",
          time: "1 min ago",
        },
        {
          id: 2,
          type: "create",
          message: "Event created",
          eventTitle: "Clean River",
          time: "5 mins ago",
        },
      ]);
    } else if (user?.role === "ADMIN") {
      setNotifications([
        {
          id: 1,
          type: "system",
          message: "New user registered",
          time: "10 mins ago",
        },
        {
          id: 2,
          type: "system",
          message: "System activity alert",
          time: "30 mins ago",
        },
      ]);
    }
  }, [user]);

  // 🎯 Icon helper
  const getIcon = (type: string) => {
    switch (type) {
      case "join":
        return "👤";
      case "create":
        return "📅";
      default:
        return "🔔";
    }
  };

  return (
    <div className="relative">
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 
               2.032 0 0118 14.158V11a6.002 
               6.002 0 00-4-5.659V5a2 
               2 0 10-4 0v.341C7.67 
               6.165 6 8.388 6 11v3.159c0 
               .538-.214 1.055-.595 
               1.436L4 17h5m6 0a3 
               3 0 11-6 0h6z"
          />
        </svg>

        {/* 🔴 Badge */}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* 📩 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 shadow-2xl rounded-xl z-50 overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="px-4 py-3 font-semibold text-gray-900 border-b bg-gray-50">
            Notifications
          </div>

          {/* Content */}
          {notifications.length === 0 ? (
            <p className="p-6 text-sm text-gray-400 text-center">
              You're all caught up 🎉
            </p>
          ) : (
            notifications.map((n, index) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b last:border-none hover:bg-gray-50 transition cursor-pointer ${
                  index === 0 ? "bg-emerald-50" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  
                  {/* Icon */}
                  <span className="text-lg mt-0.5">
                    {getIcon(n.type)}
                  </span>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-snug">
                      <span className="font-medium">{n.message}</span>{" "}
                      {n.eventTitle && (
                        <span className="text-emerald-600 font-medium">
                          "{n.eventTitle}"
                        </span>
                      )}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {n.time}
                    </p>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}