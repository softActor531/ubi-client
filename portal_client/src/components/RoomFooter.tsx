import React, { useEffect } from 'react';
import { Flex, Box, Button, Center, Spacer, LightMode, Tooltip, IconButton, Badge, useColorModeValue } from "@chakra-ui/core"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/core";

import {
  Heading,
  Divider,
  Text,
  Stack,
  Select,
  Switch,
  FormControl,
  FormLabel,
  FormHelperText,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  RadioGroup,
  Radio,
  HStack,
} from "@chakra-ui/core"

import { useStoreState, useStoreActions } from "../store";

import { MdSettings, MdExitToApp, MdChat, MdGraphicEq } from "react-icons/md"
import { MdMicOff } from 'react-icons/md'

import useLocalAudioToggle from '../hooks/useLocalAudioToggle/useLocalAudioToggle';
import LocalAudioLevelIndicator from './Settings/LocalAudioLevelIndicator/LocalAudioLevelIndicator';

import Settings from './Settings'

function RoomFooter() {
  // const setId = useStoreActions(actions => actions.room.setId);
  const bg = useColorModeValue("gray.100", "gray.700")
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const displaySidebar = useStoreState(state => state.chat.displaySidebar);

  const leaveMeeting = useStoreActions(actions => actions.room.leaveMeeting);
  const showChatSidebar = useStoreActions(actions => actions.chat.showChatSidebar);

  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  // useEffect(() => {
  //   if (displaySidebar && isOpen) {
  //     onClose()
  //   }
  // }, [displaySidebar]);

  useEffect(() => {
    if (isOpen && displaySidebar) {
      showChatSidebar(false)
    }
  }, [isOpen]);

  // const onLeaveMeeting = () => {
  //   leaveMeeting();
  // }

  return (
    <>
      <Flex w="100%" bg={bg} h="50px">
        <Box p="1">
          <Tooltip label="Settings">
            <IconButton variant="ghost" aria-label="Settings" icon={<MdSettings />} onClick={onOpen} />
          </Tooltip>
          <Tooltip label="Mute">
            <Button variant="ghost" onClick={toggleAudioEnabled}>
              <LocalAudioLevelIndicator />
              {/* {isAudioEnabled ? <LocalAudioLevelIndicator /> : <MdMicOff />} */}
            </Button>
            {/* <IconButton variant="ghost" aria-label="Mute" icon={<FaMicrophone />} /> */}
          </Tooltip>
        </Box>
        <Spacer />
        <Center>
          <LightMode>
            <Button leftIcon={<MdExitToApp />} colorScheme="red" variant="solid" onClick={() => leaveMeeting()}>
              Leave Meeting
            </Button>
          </LightMode>
        </Center>
        <Spacer />
        <Box p="1">
          <Button leftIcon={<MdChat />} variant="ghost" onClick={() => showChatSidebar(null)}>
            Chat
            {/* <Badge ml="1" colorScheme="green" borderRadius="lg">2</Badge> */}
          </Button>
        </Box>
      </Flex>
      <Settings isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}

export default RoomFooter;
