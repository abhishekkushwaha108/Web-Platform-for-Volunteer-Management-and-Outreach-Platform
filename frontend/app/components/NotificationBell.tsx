import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext"; 

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user?.role === "USER") {
      setNotifications([
        { id: 1, msg: "You enrolled in an event" },
        { id: 2, msg: "Event reminder tomorrow" },
      ]);
    } else if (user?.role === "ORGANIZER") {
      setNotifications([
        { id: 1, msg: "New participant joined your event" },
        { id: 2, msg: "Event created successfully" },
      ]);
    } else if (user?.role === "ADMIN") {
      setNotifications([
        { id: 1, msg: "New user registered" },
        { id: 2, msg: "System activity alert" },
      ]);
    }
  }, [user]);

  return (
    <div className="relative">
      
      {/* 🔔 Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {/* SVG icon (better than emoji) */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z" />
        </svg>

        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-3 z-50">
          <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Notifications
          </h4>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <p
                key={n.id}
                className="text-sm py-1 border-b border-gray-200 dark:border-gray-700 last:border-none text-gray-700 dark:text-gray-300"
              >
                {n.msg}
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}