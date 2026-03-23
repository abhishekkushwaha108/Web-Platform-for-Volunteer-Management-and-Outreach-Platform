import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, tokens } = useAuth();
  const token = tokens?.accessToken;

  const [events, setEvents] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [enrolledEvents, setEnrolledEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // FETCH EVENTS
        const res = await fetch(
          "https://gateway-service-production-37b5.up.railway.app/vms-api/api/events",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : data?.data || []);

        // FETCH USERS (ADMIN ONLY)
        if (user?.role === "ADMIN") {
          const resUsers = await fetch(
            "https://gateway-service-production-37b5.up.railway.app/vms-api/api/users",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const users = await resUsers.json();
          setAllUsers(Array.isArray(users) ? users : users?.data || []);
        }

        // USER ENROLLED EVENTS
        if (user?.role === "USER") {
          const enrolled: any[] = [];
          const eventsList = Array.isArray(data) ? data : data?.data || [];

          for (const event of eventsList) {
            try {
              const res = await fetch(
                `https://gateway-service-production-37b5.up.railway.app/vms-api/api/participations/events/${event.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (!res.ok) continue;

              const participationData = await res.json();
              const list = Array.isArray(participationData)
                ? participationData
                : participationData.data || [];

              const isEnrolled = list.some((p: any) =>
                p.volunteerName?.toLowerCase() === user.username?.toLowerCase()
              );

              if (isEnrolled) {
                enrolled.push({ id: event.id, event });
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

  // ✅ UPDATE ROLE
  const updateRole = async (userId: number, newRole: string) => {
    try {
      await fetch(
        `https://gateway-service-production-37b5.up.railway.app/vms-api/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  // ✅ DELETE USER
  const deleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(
        `https://gateway-service-production-37b5.up.railway.app/vms-api/api/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const myEvents =
    user?.role === "ORGANIZER"
      ? events.filter((e: any) => e.organizerName === user.username)
      : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <p className="text-sm text-gray-500">{user?.role}</p>
          </div>
        </div>

        {/* ACCOUNT INFO */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Username</p>
              <p>{user?.username}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p>{user?.email || "admin@example.com"}</p>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <p>{user?.role}</p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <p className="text-green-500">Active</p>
            </div>
          </div>
        </div>

        {/* ADMIN DASHBOARD */}
        {user?.role === "ADMIN" && (
          <>
            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border text-center">
                <p>Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border text-center">
                <p>Users</p>
                <p className="text-2xl font-bold">{allUsers.length}</p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border text-center">
                <p>Admins</p>
                <p className="text-2xl font-bold">
                  {allUsers.filter(u => u.role === "ADMIN").length}
                </p>
              </div>
            </div>

            {/* USER MANAGEMENT */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Manage Users</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Username</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Role</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allUsers.map((u: any) => (
                      <tr key={u.id} className="border-b">
                        <td className="p-2">{u.username}</td>
                        <td className="p-2">{u.email}</td>

                        <td className="p-2">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              updateRole(u.id, e.target.value)
                            }
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                          >
                            <option value="USER">USER</option>
                            <option value="ORGANIZER">ORGANIZER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>

                        <td className="p-2">
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ALL EVENTS */}
            <div>
              <h2 className="text-lg font-semibold mb-4">All Events</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: any) => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-gray-900 p-5 rounded-xl border"
                  >
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {event.location}
                    </p>
                    <p className="text-xs mt-2">
                      Organizer: {event.organizerName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ORGANIZER */}
        {user?.role === "ORGANIZER" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">My Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {myEvents.map((event: any) => (
                <div key={event.id} className="border p-4 rounded">
                  <h3>{event.title}</h3>
                  <p>{event.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USER */}
        {user?.role === "USER" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Enrolled Events
            </h2>

            {enrolledEvents.length === 0 ? (
              <p>No enrolled events</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {enrolledEvents.map((p: any) => (
                  <div key={p.id} className="border p-4 rounded">
                    <h3>{p.event?.title}</h3>
                    <p>{p.event?.location}</p>
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