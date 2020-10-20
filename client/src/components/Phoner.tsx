import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';

interface PhonerProps {
  roomName: string;
  token: string;
}

const Phoner = ({ roomName, token }: PhonerProps) => {
  const [room, setRoom] = useState<Video.Room|null>(null);
  const [participants, setParticipants] = useState<Video.Participant[]>([]);

  useEffect(() => {
    const participantConnected = (participant: Video.Participant) => {
      console.log('New Participant: ', participant.identity)
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant: Video.Participant) => {
      console.log('Participant Left: ', participant.identity)
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName,
      audio: true,
      video: false,
      // logLevel: 'debug',
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
            // trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  // const remoteParticipants = participants.map(participant => (
  //   <Participant key={participant.sid} participant={participant} />
  // ));

  return (
    <div className="Phoner">
      {/* <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ''
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div> */}
    </div>
  );
};

export default Phoner;
