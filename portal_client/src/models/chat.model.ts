import { Action, action } from 'easy-peasy';
import { Message } from 'twilio-chat/lib/message'

export interface ChatModel {
  displaySidebar: boolean;
  messages: Message[];
  showChatSidebar: Action<ChatModel, boolean|null>;
  addMessage: Action<ChatModel, Message>;
  setMessages: Action<ChatModel, Message[]>;
};

const room: ChatModel = {
  displaySidebar: false,
  messages: [],
  showChatSidebar: action((state, boolean?) => {
    if (boolean) {
      state.displaySidebar = boolean
    } else {
      state.displaySidebar = !state.displaySidebar
    }
  }),
  addMessage: action((state, msg) => {
    state.messages = [...state.messages, msg];
  }),
  setMessages: action((state, messages) => {
    state.messages = messages;
  }),
};

export default room;
