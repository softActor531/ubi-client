import React from 'react';
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

import { useStoreState, useStoreActions } from "../../store";

import { MdSettings, MdExitToApp, MdChat, MdGraphicEq } from "react-icons/md"
import { FaMicrophone } from 'react-icons/fa'

import ColorModeSwitcher from './../ColorModeSwitcher';
import AudioInputList from './AudioInputList/AudioInputList'
import AudioOutputList from './AudioOutputList/AudioOutputList'

interface SettingsProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const Settings = ({ isOpen, onOpen, onClose }: SettingsProps) => {
  const bg = useColorModeValue("gray.100", "gray.700")
  const btnRef = React.useRef();

  const fontSize = useStoreState(state => state.room.fontSize);
  const setFontSize = useStoreActions(actions => actions.room.setFontSize);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>

          <DrawerCloseButton />
          <DrawerHeader>Settings</DrawerHeader>
          <DrawerBody>
          <Stack spacing={5}>
            {/* <Text fontSize="2xl">Audio Settings:</Text> */}
            <Divider />
            <Heading color="gray.400" as="h5" size="xs">THEME</Heading>

            <FormControl id="theme">
              <Flex justify="center">
                <FormLabel htmlFor="theme-switch">Light/Dark Theme:</FormLabel>
                <Spacer />
                <ColorModeSwitcher />
                {/* <Switch id="theme-switch" /> */}
              </Flex>
              {/* <FormHelperText>We recommend to leave it enabled.</FormHelperText> */}
            </FormControl>

            <FormControl id="text-size">
              <FormLabel>Text Size:</FormLabel>
              <RadioGroup defaultValue={fontSize} onChange={(value) => setFontSize(value.toString())}>
                <Stack spacing={4} direction="row">
                  <HStack>
                    <Radio value="sm"><Text fontSize="sm">Small</Text></Radio>
                    <Radio value="md"><Text fontSize="md">Medium</Text></Radio>
                    <Radio value="lg"><Text fontSize="lg">Large</Text></Radio>
                    <Radio value="xl"><Text fontSize="xl">X-Large</Text></Radio>
                  </HStack>
                </Stack>
              </RadioGroup>
            </FormControl>


            <Divider />
            <Heading color="gray.400" as="h5" size="xs">AUDIO SETTINGS</Heading>
            <AudioInputList />
            <AudioOutputList />

            {/* <FormControl id="input-sensitivity">
              <FormLabel>Input Sensitivity:</FormLabel>
              <Slider defaultValue={30}>
                <SliderTrack bg="red.100">
                  <SliderFilledTrack bg="tomato" />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color="tomato" as={MdGraphicEq} />
                </SliderThumb>
              </Slider>
            </FormControl>
            <FormControl id="echo-cancellation">
              <Flex justify="center">
                <FormLabel htmlFor="echo-cancellation-switch">Echo Cancellation</FormLabel>
                <Spacer />
                <Switch id="echo-cancellation-switch" />
              </Flex>
            </FormControl> */}
            <Divider />
          </Stack>
          </DrawerBody>

          {/* <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue">Save</Button>
          </DrawerFooter> */}

        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Settings;
