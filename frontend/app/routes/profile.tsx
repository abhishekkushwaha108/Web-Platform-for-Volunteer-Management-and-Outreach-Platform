import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, tokens } = useAuth();
  const token = tokens?.accessToken;

  const role = user?.role?.toUpperCase();
  const isAdmin = role === "ADMIN";
  const isOrganizer = role === "ORGANIZER";

  const [events, setEvents] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [updatedRoles, setUpdatedRoles] = useState<{ [key: number]: string }>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) return;
    if (!isAdmin && !isOrganizer) return; // VOLUNTEER/USER: skip fetching

    const fetchData = async () => {
      try {
        // Both ADMIN and ORGANIZER fetch events
        const resEvents = await fetch(
          "https://gateway-service-production-37b5.up.railway.app/vms-api/api/events",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const eventsData = await resEvents.json();
        const parsedEvents =
          eventsData?.data || eventsData?.content || eventsData || [];
        setEvents(Array.isArray(parsedEvents) ? parsedEvents : []);

        // Only ADMIN fetches all users
        if (isAdmin) {
          const resUsers = await fetch(
            "https://gateway-service-production-37b5.up.railway.app/vms-api/api/users",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const usersData = await resUsers.json();
          const parsedUsers =
            usersData?.data || usersData?.content || usersData || [];
          setAllUsers(Array.isArray(parsedUsers) ? parsedUsers : []);
        }
      } catch (e) {
        console.error("FETCH ERROR:", e);
      }
    };

    fetchData();
  }, [token, isAdmin, isOrganizer]);

  const updateRole = async (userId: number, newRole: string) => {
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
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Delete user?")) return;
    await fetch(
      `https://gateway-service-production-37b5.up.railway.app/vms-api/api/users/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const matchUser = (u: any) =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase());

  const matchEvent = (e: any) =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase());

  const admins = allUsers.filter(
    (u) => u.role?.toUpperCase() === "ADMIN" && matchUser(u)
  );
  const organizers = allUsers.filter(
    (u) => u.role?.toUpperCase() === "ORGANIZER" && matchUser(u)
  );
  const volunteers = allUsers.filter((u) => {
    const r = u.role?.toUpperCase();
    return (r === "USER" || r === "VOLUNTEER") && matchUser(u);
  });

  // ORGANIZER sees only their own events; ADMIN sees all
  const filteredEvents = events.filter((e) => {
    const matchesSearch = matchEvent(e);
    if (isAdmin) return matchesSearch;
    if (isOrganizer)
      return (
        matchesSearch &&
        (e.organizerName === user?.username || e.organizerId === user?.id)
      );
    return false;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white px-8 py-8 transition-colors">

      {/* PROFILE CARD — visible to ALL roles */}
      <div className="mb-10 p-6 rounded-xl shadow-md border
        bg-white text-gray-900 border-gray-200
        dark:bg-gray-900 dark:text-white dark:border-gray-700">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-lg font-bold text-lg">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{user?.username}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role}</p>
          </div>
        </div>

        {/* ACCOUNT INFO */}
        <div className="border rounded-xl p-5 border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Username</p>
              <p>{user?.username}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Email</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Role</p>
              <span className="px-2 py-1 rounded text-xs
                bg-green-100 text-green-700
                dark:bg-green-900 dark:text-green-300">
                {user?.role}
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Status</p>
              <p className="text-green-600 dark:text-green-400">Active</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Member Since</p>
              <p>Sun Mar 22 2026</p>
            </div>
          </div>
        </div>

        {/* STATS — ADMIN only */}
        {isAdmin && (
          <div className="grid grid-cols-3 gap-6 mt-6 text-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Admins</p>
              <p className="font-semibold text-lg">{admins.length}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Organizers</p>
              <p className="font-semibold text-lg">{organizers.length}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Volunteers</p>
              <p className="font-semibold text-lg">{volunteers.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* SEARCH — ADMIN and ORGANIZER only */}
      {(isAdmin || isOrganizer) && (
        <input
          placeholder={isAdmin ? "Search users or events..." : "Search events..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-10 px-4 py-2 rounded w-96 border
            bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400
            dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}

      {/* USER MANAGEMENT — ADMIN only */}
      {isAdmin && (
        <>
          <UserSection
            title="Admins"
            users={admins}
            {...{ updatedRoles, setUpdatedRoles, updateRole, deleteUser }}
          />
          <UserSection
            title="Organizers"
            users={organizers}
            {...{ updatedRoles, setUpdatedRoles, updateRole, deleteUser }}
          />
          <UserSection
            title="Volunteers"
            users={volunteers}
            {...{ updatedRoles, setUpdatedRoles, updateRole, deleteUser }}
          />
        </>
      )}

      {/* EVENTS — ADMIN sees all, ORGANIZER sees their own */}
      {(isAdmin || isOrganizer) && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            {isOrganizer ? "My Events" : "Events"}
          </h2>

          {filteredEvents.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No events found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((e: any) => (
                <div
                  key={e.id}
                  className="p-5 rounded-xl border
                    bg-gray-50 border-gray-200
                    dark:bg-gray-900 dark:border-gray-700"
                >
                  <h3 className="font-semibold">{e.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{e.location}</p>
                  <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">
                    Organizer: {e.organizerName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserSection({
  title,
  users,
  updatedRoles,
  setUpdatedRoles,
  updateRole,
  deleteUser,
}: any) {
  const [showAll, setShowAll] = useState(false);
  const visibleUsers = showAll ? users : users.slice(0, 10);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {users.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        )}
      </div>

      {visibleUsers.length === 0 ? (
        <p className="text-gray-400">No users found</p>
      ) : (
        <div className="rounded-xl border overflow-hidden
          bg-white border-gray-200
          dark:bg-gray-900 dark:border-gray-800">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-4 px-6 py-3 text-sm font-semibold
            bg-gray-100 text-gray-600
            dark:bg-gray-800 dark:text-gray-300">
            <span>Username</span>
            <span>Email</span>
            <span>Role</span>
            <span className="text-center">Actions</span>
          </div>

          {/* ROWS */}
          {visibleUsers.map((u: any) => (
            <div
              key={u.id}
              className="grid grid-cols-4 px-6 py-4 items-center
                border-t border-gray-100 dark:border-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
            >
              {/* USERNAME */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-sm font-bold text-white">
                  {u.username?.charAt(0).toUpperCase()}
                </div>
                <span>{u.username}</span>
              </div>

              {/* EMAIL */}
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {u.email}
              </span>

              {/* ROLE DROPDOWN */}
              <select
                value={updatedRoles[u.id] || u.role}
                onChange={(e) =>
                  setUpdatedRoles({ ...updatedRoles, [u.id]: e.target.value })
                }
                className="border px-2 py-1 rounded text-sm focus:outline-none
                  bg-gray-100 border-gray-300 text-gray-900
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="USER">USER</option>
                <option value="ORGANIZER">ORGANIZER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              {/* ACTIONS */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    const newRole = updatedRoles[u.id];
                    if (!newRole || newRole === u.role) return;
                    updateRole(u.id, newRole);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}