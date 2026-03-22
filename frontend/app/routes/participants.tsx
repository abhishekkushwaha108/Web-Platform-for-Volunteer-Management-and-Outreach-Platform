import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

export default function ParticipantsPage() {
  const [params] = useSearchParams();
  const eventId = params.get("eventId");

  const [participants, setParticipants] = useState<any[]>([]);
  const [eventName, setEventName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError("No event ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Try multiple storage locations
    const token = localStorage.getItem("authToken") || 
                  localStorage.getItem("token") || 
                  sessionStorage.getItem("authToken") ||
                  sessionStorage.getItem("token");

    console.log("Token available:", !!token);
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("All sessionStorage keys:", Object.keys(sessionStorage));

    if (!token) {
      setError("No authentication token found. Please login first.");
      setLoading(false);
      return;
    }

    // Fetch event details
    fetch(`https://gateway-service-production-37b5.up.railway.app/vms-api/api/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch event: HTTP ${res.status}`);
        return res.json();
      })
      .then((eventData) => {
        console.log("EVENT DATA:", eventData);
        setEventName(eventData.name || eventData.title || "Unknown Event");
      })
      .catch((error: unknown) => {
        console.error("ERROR fetching event:", error);
      });

    // Fetch participants
    fetch(`https://gateway-service-production-37b5.up.railway.app/vms-api/api/participations/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then((res) => {
        console.log("Fetch participants - STATUS:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("API RESPONSE:", data);

        let participantsList: any[] = [];

        if (Array.isArray(data)) {
          participantsList = data;
        } else if (data && data.data) {
          participantsList = Array.isArray(data.data) ? data.data : [];
        }

        // ✅ FILTER OUT CANCELLED PARTICIPANTS
        const activeParticipants = participantsList.filter(
          (p: any) => p.status?.toLowerCase() !== "cancelled"
        );

        setParticipants(activeParticipants);
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error("ERROR fetching participants:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        setParticipants([]);
        setLoading(false);
      });
  }, [eventId]);

  const cancelParticipation = async (participationId: string) => {
    if (!participationId) {
      alert("Invalid participation ID");
      return;
    }

    try {
      const token = localStorage.getItem("authToken") || 
                    sessionStorage.getItem("authToken");
      if (!token) {
        setError("User not authenticated. Please login.");
        return;
      }

      const response = await fetch(
        `https://gateway-service-production-37b5.up.railway.app/vms-api/api/participations/${participationId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Cancel participation - STATUS:", response.status);
      const responseBody = await response.text();
      console.log("Cancel response body:", responseBody);

      if (response.ok) {
        alert('Participation canceled successfully');
        setParticipants(participants.filter(p => p.id !== participationId));
      } else {
        alert(`Failed to cancel participation: ${response.status} - ${responseBody}`);
      }
    } catch (error: unknown) {
      console.error('ERROR canceling participation:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
  <div style={{ padding: "20px" }}>
    <h2>{eventName || "Event"} - Participants</h2>
    <p style={{ color: "#666" }}>Event ID: {eventId}</p>

    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p style={{ color: "red" }}>Error: {error}</p>
    ) : participants.length === 0 ? (
      <p style={{ textAlign: "center", color: "#94a3b8" }}>
        No active participants found
      </p>
    ) : (
      <div style={{ marginTop: "20px" }}>
        <p style={{ color: "#aaa", marginBottom: "10px" }}>
          Total: <strong style={{ color: "#fff" }}>{participants.length}</strong> participants
        </p>

        <div style={{
          background: "#0f172a",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #1e293b"
        }}>
          {participants.map((p: any, index) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: index !== participants.length - 1 ? "1px solid #1e293b" : "none",
                transition: "0.2s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1e293b")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#fff"
                }}>
                  {(p.volunteerName || p.name || "U")[0].toUpperCase()}
                </div>

                <div>
                  <div style={{ fontWeight: "600", color: "#fff" }}>
                    {p.volunteerName || p.name || "N/A"}
                  </div>
                  <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                    {p.volunteerEmail || p.email || p.user?.email || "No email"}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "20px",
                background: "#022c22",
                color: "#4ade80"
              }}>
                Active
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}