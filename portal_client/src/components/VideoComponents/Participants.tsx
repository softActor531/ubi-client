import React from 'react';
import ParticipantTracks from './ParticipantTracks';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { RemoteParticipant } from 'twilio-video';

function Participants() {
  const participants = useParticipants();
  return (
    <>
      {participants.map((participant: RemoteParticipant) => (
        <ParticipantTracks participant={participant} />
      ))}
    </>
  )
}

export default Participants
