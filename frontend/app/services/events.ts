import api from "./api";

export interface EventResponse {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  status: string;
  maxVolunteers: number;
  currentVolunteers: number;
  organizerId: string;
  organizerName: string;
  createdAt: string;
  updatedAt: string;
}

export async function getEvents(
  upcoming?: boolean,
  signal?: AbortSignal
): Promise<EventResponse[]> {

  const params = upcoming !== undefined ? { upcoming } : {};

  const { data } = await api.get<EventResponse[]>("/api/events", {
    params,
    signal,
  });

  return data;
}

export async function createEvent(eventData: {
  title: string;
  description: string;
  location: string;
  requiredVolunteers: number;
}, token: string) {
  const res = await fetch(
    "https://gateway-service-production-37b5.up.railway.app/vms-api/api/events",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create event");
  }

  return res.json(); // returns event with UUID
}

export interface ParticipantResponse {
  id: string;
  name: string;
  email?: string;
}

export async function enrollEvent(eventId: string) {
  const { data } = await api.post(`/api/participations/events/${eventId}/register`);
  return data;
}

export async function unenrollEvent(eventId: string) {
  const { data } = await api.post(`/api/participations/events/${eventId}/cancel`);
  return data;
}

export async function getParticipants(
  eventId: string,
  signal?: AbortSignal
): Promise<ParticipantResponse[]> {
  const { data } = await api.get<ParticipantResponse[]>(
    `/api/participations/events/${eventId}/participants`,
    { signal }
  );
  return data;
}