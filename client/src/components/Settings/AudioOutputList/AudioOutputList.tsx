import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/core"
// import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
// import { useAppState } from '../../../../state';
import { useAudioOutputDevices } from '../useDevices/useDevices';

export default function AudioOutputList() {
  const audioOutputDevices = useAudioOutputDevices();
  // const { activeSinkId, setActiveSinkId } = useAppState();
  const [activeSinkId, setActiveSinkId] = useState('default');
  const activeOutputLabel = audioOutputDevices.find(device => device.deviceId === activeSinkId)?.label;

  return (
    <div className="inputSelect">
      {audioOutputDevices.length > 1 ? (
        <FormControl id="input-device">
          <FormLabel>Audio Output:</FormLabel>
          <Select onChange={e => setActiveSinkId(e.target.value as string)} value={activeSinkId}>
            {audioOutputDevices.map(device => (
              <option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </option>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Text>Audio Output:</Text>
          <Text>{activeOutputLabel || 'System Default Audio Output'}</Text>
        </>
      )}
    </div>
  );
}
