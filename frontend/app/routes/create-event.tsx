import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { tokens } = useAuth();
  const token = tokens?.accessToken;

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    requiredVolunteers: "",
    eventDate: "",
    startTime: "",
    endTime: "",
  });

  const formatLocal = (date: Date) => {
    return date.toISOString().slice(0, 19);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const volunteers = Number(form.requiredVolunteers);

    if (!volunteers || volunteers <= 0) {
      alert("Required volunteers must be greater than 0");
      return;
    }

    if (!form.eventDate || !form.startTime || !form.endTime) {
      alert("Please fill date and time");
      return;
    }

    const start = new Date(`${form.eventDate}T${form.startTime}`);
    const end = new Date(`${form.eventDate}T${form.endTime}`);

    if (end <= start) {
      alert("End time must be after start time");
      return;
    }

    try {
      const res = await fetch(
        "https://gateway-service-production-37b5.up.railway.app/vms-api/api/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            location: form.location,
            startTime: formatLocal(start),
            endTime: formatLocal(end),
            eventDate: formatLocal(start),
            requiredVolunteers: volunteers,
          }),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        console.error(error);
        throw new Error("Failed to create event");
      }

      alert("Event created successfully");
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("Event creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* HEADER (same as Events page) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Event
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Organize a new volunteer opportunity.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Event Title
              </label>
              <input
                value={form.title}
                required
                placeholder="Enter event title"
                className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Location
              </label>
              <input
                value={form.location}
                required
                placeholder="Enter location"
                className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                required
                rows={4}
                placeholder="Enter event details"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* DATE + TIME GRID */}
            <div className="grid md:grid-cols-3 gap-4">

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Start
                </label>
                <input
                  type="time"
                  required
                  className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  End
                </label>
                <input
                  type="time"
                  required
                  className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </div>

            </div>

            {/* VOLUNTEERS */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Required Volunteers
              </label>
              <input
                type="number"
                value={form.requiredVolunteers}
                required
                min="1"
                placeholder="Enter number"
                className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) > 0) {
                    setForm({ ...form, requiredVolunteers: value });
                  }
                }}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/events")}
                className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition"
              >
                Create Event
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}