import React from "react";
import { useNavigate } from "react-router";

type Props = {
  event: any;
  onEnroll: (id: number) => void;
  onUnenroll: (id: number) => void;
  onViewParticipants: (id: number) => void;
};

export default function EventCard({
  event,
  onEnroll,
  onUnenroll,
  onViewParticipants,
}: Props) {
  const navigate = useNavigate(); 

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px" }}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>

      <button onClick={() => onEnroll(event.id)}>
        Enroll
      </button>

      <button onClick={() => onUnenroll(event.id)} style={{ marginLeft: "10px" }}>
        Unenroll
      </button>

      <button onClick={() => navigate(`/participants?eventId=${event.id}`)}>
        Participants
      </button>
    </div>
  );
}