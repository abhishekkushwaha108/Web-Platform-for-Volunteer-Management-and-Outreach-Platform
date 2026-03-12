import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";
import AuthGuard from "~/components/AuthGuard";

export function meta() {
  return [
    { title: "Dashboard | VolunteerHub" },
    { name: "description", content: "Your Volunteer Management System dashboard" },
  ];
}

function LandingContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">VolunteerHub</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">{user?.username}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                  {user?.role}
                </span>
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
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Here's an overview of your volunteer dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Events</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Tasks</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Hours Logged</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Contributions</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Get started with common volunteer activities.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/events" className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Browse Events</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Explore upcoming volunteer events</div>
              </div>
            </Link>

            <button className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Log Hours</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Record your volunteer hours</div>
              </div>
            </button>

            <button className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">My Tasks</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your assigned tasks</div>
              </div>
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Username</div>
              <div className="text-gray-900 dark:text-white font-medium">{user?.username || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</div>
              <div className="text-gray-900 dark:text-white font-medium">{user?.email || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</div>
              <div className="text-gray-900 dark:text-white font-medium">{user?.phoneNumber || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</div>
              <div className="text-gray-900 dark:text-white font-medium">{user?.role || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Member since</div>
              <div className="text-gray-900 dark:text-white font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <LandingContent />
    </AuthGuard>
  );
}
