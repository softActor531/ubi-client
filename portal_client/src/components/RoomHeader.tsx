import React, { useEffect } from 'react';
import { Image, Flex, Box, Spacer, useColorModeValue } from "@chakra-ui/core"
import ColorModeSwitcher from './ColorModeSwitcher';
import logo from '../img/ubiaccess-logo.png';

import { useStoreState, useStoreActions } from "../store";

import useRoomState from '../hooks/useRoomState/useRoomState';
import LocalAudioLevelIndicator from './Settings/LocalAudioLevelIndicator/LocalAudioLevelIndicator';

function RoomHeader() {
  const roomState = useRoomState();

  useEffect(() => {
    console.log('roomState: ', roomState)
  }, [roomState]);

  console.log('ro')
  const bg = useColorModeValue("gray.100", "gray.700")

  const fontSize = useStoreState(state => state.room.fontSize);
  return (
    <Flex w="100%" bg={bg} h="50px">
      <Box p="3">
        <Image src={logo} alt="UbiAccess Logo" w="120px" />
      </Box>
      <Spacer />
      <Spacer />
      <Box p="1">
        <ColorModeSwitcher justifySelf="flex-end" />
      </Box>
    </Flex>
  );
}

export default RoomHeader;
