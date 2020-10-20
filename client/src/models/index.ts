import room, { RoomModel } from './room.model';
import chat, { ChatModel } from './chat.model';

export interface StoreModel {
  room: RoomModel;
  chat: ChatModel;
};

const model: StoreModel = {
  room,
  chat,
};

export default model;
