import React from "react";

type Props = {
  participants: any[];
};

export default function ParticipantsList({ participants }: Props) {
  if (!participants || participants.length === 0) {
    return <p>No participants yet</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Participants</h2>

      {participants.map((p: any) => (
        <div key={p.id}>
          {p.name}
        </div>
      ))}
    </div>
  );
}