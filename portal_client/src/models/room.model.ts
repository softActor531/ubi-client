import { Action, action, Thunk, thunk } from 'easy-peasy';

export interface RoomApiModel {
  userName: string;
  roomName: string;
}

export interface RoomModel {
  userName: string;
  roomName: string;
  token: string;
  fontSize: string;
  isLoading: boolean;
  autoScroll: boolean;
  setIsLoading: Action<RoomModel, boolean>;
  setAutoScroll: Action<RoomModel, boolean>;
  setFontSize: Action<RoomModel, string>;
  setUserName: Action<RoomModel, string>;
  setRoomName: Action<RoomModel, string>;
  setToken: Action<RoomModel, string>;
  leaveMeeting: Action<RoomModel>;
  // reset: Action<RoomModel>;
  getToken: Thunk<RoomModel, RoomApiModel>;
};

const room: RoomModel = {
  userName: '',
  roomName: '',
  token: '',
  fontSize: 'md',
  isLoading: false,
  autoScroll: true,
  setIsLoading: action((state, boolean) => {
    if (boolean) {
      state.isLoading = boolean
    } else {
      state.isLoading = !state.isLoading
    }
  }),
  setAutoScroll: action((state, boolean) => {
    state.autoScroll = boolean
  }),
  setFontSize: action((state, size) => {
    state.fontSize = size;
  }),
  setUserName: action((state, userName) => {
    state.userName = userName;
  }),
  setRoomName: action((state, roomName) => {
    state.roomName = roomName;
  }),
  setToken: action((state, token) => {
    state.token = token;
  }),
  leaveMeeting: action((state) => {
    // @ts-ignore
    const room = window.twilioRoom
    if (room) {
      room.disconnect();
    }
    state.roomName = state.token = '';
    document.location.href = '/'
  }),
  // reset: action(state => {
  //   state.id = state.token = ''
  // }),
  getToken: thunk(async (actions, data) => {
    actions.setIsLoading(true)
    // /rooms/:roomId/token
    // const response = await fetch(`http://localhost:3001/api/rooms/token`, {
      const response = await fetch(`/api/rooms/token`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const body = await response.json()
    console.log(body)
    actions.setToken(body.token)
    actions.setIsLoading(false)
  }),
};

export default room;
