import React, { useEffect } from 'react';
// import { useStoreState, useStoreActions } from "../store";

import { Flex, Center } from "@chakra-ui/core"

import RoomChat from '../components/RoomChat'
import RoomHeader from '../components/RoomHeader'
import RoomFooter from '../components/RoomFooter'

import Captioner from '../components/Captioner'
// import Phoner from '../components/Phoner'
import Participants from '../components/VideoComponents/Participants'

import useVideoContext from '../hooks/useVideoContext/useVideoContext';
import useRoomState from '../hooks/useRoomState/useRoomState';

interface RoomProps {
  userName?: string;
  roomName: string;
  token: string;
}

function Room({ roomName, token }:RoomProps) {
  const roomState = useRoomState();
  const { isConnecting, connect, isAcquiringLocalTracks, removeLocalAudioTrack} = useVideoContext();

  useEffect(() => {
    connect(token)
    return function disconnect() {
      console.log('disconnecting')
      removeLocalAudioTrack();
      // // @ts-ignore
      // const room = window.twilioRoom
      // if (room) {
      //   room.disconnect();
      // }
    };
  }, [token]);

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <RoomHeader />
      <Flex flex="1" h="100%" flexDirection="row">
        <Center flex="1" m="3">
          <Captioner roomName={roomName} />
        </Center>
        <RoomChat roomName={roomName} token={token} />
      </Flex>
      {roomState === 'disconnected' ? <></> : <Participants />}
      {/* <Phoner roomName={roomName} token={token} /> */}
      <RoomFooter />
    </Flex>
  );
}

export default Room;
