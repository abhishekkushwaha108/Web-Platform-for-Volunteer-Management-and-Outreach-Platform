import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, tokens } = useAuth();
  const token = tokens?.accessToken;

  const [events, setEvents] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [enrolledEvents, setEnrolledEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://gateway-service-production-37b5.up.railway.app/vms-api/api/events",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setEvents(data || []);

        if (user?.role === "ADMIN") {
          const resUsers = await fetch(
            "https://gateway-service-production-37b5.up.railway.app/vms-api/api/users",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const users = await resUsers.json();

          setParticipants(users.filter((u: any) => u.role === "USER"));
          setOrganizers(users.filter((u: any) => u.role === "ORGANIZER"));
        }

        if (user?.role === "USER") {
          const enrolled: any[] = [];
          const eventsList = Array.isArray(data) ? data : data?.data || [];

          for (const event of eventsList) {
            try {
              const res = await fetch(
                `https://gateway-service-production-37b5.up.railway.app/vms-api/api/participations/events/${event.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (!res.ok) {
                if (event.currentVolunteers > 0) {
                  enrolled.push({
                    id: event.id,
                    status: "ACTIVE",
                    event,
                  });
                }
                continue;
              }

              const participationData = await res.json();
              const list = Array.isArray(participationData)
                ? participationData
                : participationData.data || [];

              const isEnrolled = list.some((p: any) =>
                p.volunteerName?.toLowerCase() === user.username?.toLowerCase()
              );

              if (isEnrolled) {
                enrolled.push({
                  id: event.id,
                  status: "ACTIVE",
                  event,
                });
              }
            } catch {}
          }

          setEnrolledEvents(enrolled);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [token, user]);

  const myEvents =
    user?.role === "ORGANIZER"
      ? events.filter((e: any) => e.organizerName === user.username)
      : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* HEADER (same as events page style) */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.username}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {user?.role}
            </p>
          </div>
        </div>

        {/* ACCOUNT CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Account Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-sm">

            <div>
              <p className="text-gray-500 dark:text-gray-400">Username</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.username}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.email || "organizer@example.com"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Role</p>
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {user?.role}
              </span>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Status</p>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Active
              </span>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="text-gray-900 dark:text-white">
                {new Date().toDateString()}
              </p>
            </div>

          </div>
        </div>

        {/* ADMIN DASHBOARD */}
        {user?.role === "ADMIN" && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {events.length}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Organizers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {organizers.length}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {participants.length}
              </p>
            </div>

          </div>
        )}

        {/* ORGANIZER EVENTS */}
        {user?.role === "ORGANIZER" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              My Events
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {event.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USER EVENTS */}
        {user?.role === "USER" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enrolled Events
            </h2>

            {enrolledEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No enrolled events yet
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledEvents.map((p: any) => (
                  <div
                    key={p.id}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {p.event?.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {p.event?.location}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}