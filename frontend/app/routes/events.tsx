import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import AuthGuard from "~/components/AuthGuard";
import NotificationBell from "~/components/NotificationBell";

import {
  getEvents,
  enrollEvent,
  unenrollEvent,
  getParticipants,
  type EventResponse,
  type ParticipantResponse
} from "~/services/events";

export function meta() {
  return [
    { title: "Events | VolunteerHub" },
    { name: "description", content: "Browse volunteer events" },
  ];
}

function EventsContent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isOrganizer = user?.role === "ORGANIZER";
  const canManageEvents = isAdmin || isOrganizer;
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming">("all");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
  const controller = new AbortController();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const apiEvents = await getEvents(
        filter === "upcoming" ? true : undefined,
        controller.signal
      );

      setEvents(apiEvents);

      setLoading(false);
    } catch (err: any) {
      if (!controller.signal.aborted) {
        setError(err.response?.data?.message || "Failed to load events.");
        setLoading(false);
      }
    }
  };

  fetchEvents();

  return () => controller.abort();
}, [filter, retryCount]);

  function fetchEvents() {
    setRetryCount((c) => c + 1);
  }

  async function handleEnroll(eventId: string) {
    try {
      await enrollEvent(eventId);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, currentVolunteers: e.currentVolunteers + 1 }
            : e
        )
      );
    } catch {
      alert("Failed to enroll");
    }
  }

  async function handleUnenroll(eventId: string) {
    try {
      await unenrollEvent(eventId);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, currentVolunteers: e.currentVolunteers - 1 }
            : e
        )
      );
    } catch {
      alert("Failed to unenroll");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(timeStr: string) {
    if (!timeStr) return "";
    try {
      const [hours, minutes] = timeStr.split(":");
      const h = parseInt(hours, 10);
      const suffix = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 || 12;
      return `${displayH}:${minutes} ${suffix}`;
    } catch {
      return timeStr;
    }
  }

  function getStatusColor(status: string) {
    switch (status?.toUpperCase()) {
      case "UPCOMING":
      case "SCHEDULED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "ONGOING":
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "COMPLETED":
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  }

  function getCategoryColor(category: string) {
    switch (category?.toUpperCase()) {
      case "ENVIRONMENT":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "EDUCATION":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "HEALTH":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      case "COMMUNITY":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "ANIMAL_WELFARE":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    }
  }

  const spotsPercentage = (e: EventResponse) => {
    const max = e.maxVolunteers ?? 0;
    const current = e.currentVolunteers ?? 0;

    if (max === 0) return 0;

    return Math.round((current / max) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">VolunteerHub</span>
              </Link>
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/events"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                >
                  Events
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">

              {/* 🔔 Notification */}
              <NotificationBell />

              {/* 👤 Profile Button */}
              <button
                onClick={() => navigate("/profile")}
                className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Profile
              </button>

              {/* Existing user info */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Browse and discover volunteer opportunities.
            </p>
          </div>
          <div className="flex items-center gap-2">

          {canManageEvents && (
            <button
              onClick={() => navigate("/create-event")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              + Create Event
            </button>
          )}

            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "upcoming"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button onClick={fetchEvents} className="ml-auto text-red-600 dark:text-red-400 underline text-sm font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading events...</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No events found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              {filter === "upcoming"
                ? "There are no upcoming events right now. Check back later or view all events."
                : "No events have been created yet. Check back soon!"}
            </p>
            {filter === "upcoming" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                View all events
              </button>
            )}
          </div>
        )}

        <div className="flex-1"></div>
        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {event.category && (
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                          {event.category.replace(/_/g, " ")}
                        </span>
                      )}
                      {event.status && (
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                      {event.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-2.5">
                    {event.date && (
                      <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(event.date)}</span>
                      </div>
                    )}

                    {(event.startTime || event.endTime) && (
                      <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {event.startTime && formatTime(event.startTime)}
                          {event.startTime && event.endTime && " - "}
                          {event.endTime && formatTime(event.endTime)}
                        </span>
                      </div>
                    )}

                    {event.location && (
                      <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                    {event.organizerName && (
                      <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{event.organizerName}</span>
                      </div>
                    )}
                  </div>
                  </div>
                {/* Card Footer - Volunteer spots */}
                {event.maxVolunteers > 0 && (
                  <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500 dark:text-gray-400">Volunteer spots</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {event.currentVolunteers}/{event.maxVolunteers}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          spotsPercentage(event) >= 100
                            ? "bg-red-500"
                            : spotsPercentage(event) >= 75
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(spotsPercentage(event), 100)}%` }}
                      />
                    </div>
                    {spotsPercentage(event) >= 100 && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">Event is full</p>
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="mt-auto px-6 pb-4 pt-4">
                  <div className="flex gap-2">
                  <button
                    disabled={
                      event.maxVolunteers > 0 &&
                      (event.currentVolunteers ?? 0) >= event.maxVolunteers
                    }
                    onClick={() => handleEnroll(event.id)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md text-white transition ${
                      event.maxVolunteers > 0 &&
                      (event.currentVolunteers ?? 0) >= event.maxVolunteers
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {event.maxVolunteers > 0 &&
                    (event.currentVolunteers ?? 0) >= event.maxVolunteers
                      ? "Full"
                      : "Enroll"}
                  </button>

                  <button
                    onClick={() => handleUnenroll(event.id)}
                    className="flex-1 py-2 text-sm font-medium rounded-md bg-gray-600 text-white hover:bg-gray-700 transition"
                  >
                    Unenroll
                  </button>

                  {canManageEvents && (
                    <button
                      onClick={() => navigate(`/participants?eventId=${event.id}`)}
                      className="py-2 px-3 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Participants
                    </button>
                  )}
                </div>
                </div>
              </div>
            ))}   
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <AuthGuard>
      <EventsContent />
    </AuthGuard>
  );
}
