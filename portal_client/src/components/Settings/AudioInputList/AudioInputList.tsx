import React from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/core"
// import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
// import LocalAudioLevelIndicator from '../LocalAudioLevelIndicator/LocalAudioLevelIndicator';
// import { makeStyles } from '@material-ui/core/styles';
import { useAudioInputDevices } from '../useDevices/useDevices';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

// const useStyles = makeStyles({
//   container: {
//     display: 'flex',
//     alignItems: 'flex-end',
//     justifyContent: 'space-between',
//   },
// });

export default function AudioInputList() {
  // const classes = useStyles();

  const audioInputDevices = useAudioInputDevices();
  const {
    room: { localParticipant },
    localTracks,
    getLocalAudioTrack,
  } = useVideoContext();

  const localAudioTrack = localTracks.find(track => track.kind === 'audio');
  const localAudioInputDeviceId = localAudioTrack?.mediaStreamTrack.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    localAudioTrack?.stop();
    getLocalAudioTrack(newDeviceId).then(newTrack => {
      if (localAudioTrack) {
        const localTrackPublication = localParticipant?.unpublishTrack(localAudioTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
      }

      localParticipant?.publishTrack(newTrack);
    });
  }

  return (
    <div className="inputSelect">
      {audioInputDevices.length > 1 ? (
        <FormControl id="input-device">
          <FormLabel>Audio Input:</FormLabel>
          {/* <Select placeholder="Select Input Device"> */}
          <Select onChange={e => replaceTrack(e.target.value as string)} value={localAudioInputDeviceId || ''}>
            {audioInputDevices.map(device => (
              <option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </option>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Text>Audio Input:</Text>
          <Text>{localAudioTrack?.mediaStreamTrack.label || 'No Local Audio'}</Text>
        </>
      )}
    </div>
  );
}
