import React, { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useStoreState, useStoreActions } from "../store";
import { TwilioError } from "twilio-video";

import Lobby from "./Lobby";
import Room from "./Room";

import { VideoProvider } from "../components/VideoProvider";

const RTTClient = () => {
  // Pull out state from our store
  const userName = useStoreState((state) => state.room.userName);
  const roomName = useStoreState((state) => state.room.roomName);
  const token = useStoreState((state) => state.room.token);

  // Pull out actions from our store
  const setUserName = useStoreActions((actions) => actions.room.setUserName);
  const setRoomName = useStoreActions((actions) => actions.room.setRoomName);
  const setToken = useStoreActions((actions) => actions.room.setToken);
  const getToken = useStoreActions((actions) => actions.room.getToken);

  // Set Location
  const location = useLocation();
  console.log("location123", location);
  const query = new URLSearchParams(location.search);
  const queryRoom = query.get("room");
  const queryName = query.get("name");
  console.log("query", query);
  console.log("queryRoom", queryRoom);
  console.log("queryName", queryName);
  // const queryIsAgent = Boolean(query.get('isAgent'))

  if (queryRoom && queryName) {
    setUserName(queryName);
    setRoomName(queryRoom);
    getToken({ userName: queryName, roomName: queryRoom });
  }

  // setUserName('jax');
  // setRoomName('examples');
  // setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzgwYTA0NmQyZWNhY2IxNTYwZWM0MTQ1Y2RlNDNlZmJjLTE1OTQyNjkwOTEiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJqYXgiLCJ2aWRlbyI6eyJyb29tIjoiZXhhbXBsZXMifSwiY2hhdCI6eyJzZXJ2aWNlX3NpZCI6IklTOTVkYjk1ODE3YjJjNDFlNWFlZDE1ZjEzZDA1NDhkYjUifX0sImlhdCI6MTU5NDI2OTA5MSwiZXhwIjoxNTk0MjcyNjkxLCJpc3MiOiJTSzgwYTA0NmQyZWNhY2IxNTYwZWM0MTQ1Y2RlNDNlZmJjIiwic3ViIjoiQUNhYmY2MzlhOGMyNDFjNmU4MDgzY2ZiNGMyZjU4Nzk3YSJ9.3P2bR_2kiAnOBqnR9ILajy4QEGeMT2bpt_KY7tyG0CA");

  const handleUsernameChange = useCallback(
    (event) => {
      setUserName(event.target.value);
    },
    [setUserName]
  );

  const handleRoomNameChange = useCallback(
    (event) => {
      setRoomName(event.target.value);
    },
    [setRoomName]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      console.log("beforeSubmit", userName, roomName);
      getToken({ userName, roomName });
      console.log("afterSubmit");
    },
    [roomName, userName, getToken]
  );

  const onVideoError = (err: TwilioError | null) => {
    console.log("Video Error");
    console.log(err);
  };

  const connectionOptions = {
    room: roomName,
    audio: true,
    video: false,
  };

  // const handleLogout = useCallback(event => {
  //   setToken('');
  // }, [setToken]);

  let render;
  if (token) {
    render = (
      <VideoProvider options={connectionOptions} onError={onVideoError}>
        <Room userName={userName} roomName={roomName} token={token} />
      </VideoProvider>
      // <Room roomName={roomName} token={token} handleLogout={handleLogout} />
    );
  } else {
    render = (
      <Lobby
        username={userName}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
      />
    );
  }

  return render;
};

export default RTTClient;
