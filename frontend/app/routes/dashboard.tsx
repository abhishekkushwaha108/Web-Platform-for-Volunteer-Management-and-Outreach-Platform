import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  return <div>Admin Dashboard</div>;
}

function OrganizerDashboard() {
  return <div>Organizer Dashboard</div>;
}

function UserDashboard() {
  return <div>User Dashboard</div>;
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") return <AdminDashboard />;
  if (user?.role === "ORGANIZER") return <OrganizerDashboard />;
  return <UserDashboard />;
}