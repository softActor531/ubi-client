import React, { useState, useEffect, useCallback } from 'react';
import { useStoreState, useStoreActions } from "../store";
import { Flex, Box, Text } from "@chakra-ui/core"

import Chat, { Client } from 'twilio-chat';
import { Channel } from 'twilio-chat/lib/channel'
import { Message } from 'twilio-chat/lib/message'
import { Member } from 'twilio-chat/lib/member'

import MessageList from './Chat/MessageList'
import MessageForm from './Chat/MessageForm'

interface RoomChatProps {
  roomName: string;
  token: string;
}

const RoomChat = ({ roomName, token }: RoomChatProps) => {

  let client: Client|null = null;

  const [identity, setIdentity] = useState<string>('');
  const [channel, setChannel] = useState<Channel|null>(null);
  const [members, setMembers] = useState<number>(0);

  const displaySidebar = useStoreState(state => state.chat.displaySidebar);
  const messages = useStoreState(state => state.chat.messages);
  const setMessages = useStoreActions(actions => actions.chat.setMessages);
  const addMessage = useStoreActions(actions => actions.chat.addMessage);

  useEffect(() => {
    const joinChat = async () => {
      // Joining Chat
      client = await Chat.create(token);
      setIdentity(client.user.identity);
      client.on('connectionError', (err) => {
        console.log(`Connection Error: ${err.message}`);
      });

      // Create or Join Room Channel
      let tempChannel:Channel|null = null;
      try {
        tempChannel = await client.getChannelByUniqueName(roomName);
      } catch (err) {
        console.error(`Get Chat Channel: `,err.message);
      }
      if (!tempChannel) {
        try {
          console.log('Channel not found, creating new channel...')
          tempChannel = await client.createChannel({
            uniqueName: roomName
          });
        } catch (err) {
          console.error(`Creating Chat Channel: `, err.message);
        }
      }
      setChannel(tempChannel)
    }

    joinChat();

    return () => {
      console.log('Leaving Chat: ', client);
      setChannel(currentChannel => {
        // Leave Channel
        console.log(`Current Channel: `, currentChannel);
        if (currentChannel?.state?.current === 'active') {
          currentChannel?.leave();
        }
        return null;
      });
      client?.shutdown();
      client = null;
      console.log('IS Client now nullified? ', client);
    };
  }, [roomName, token]);

  useEffect(() => {
    const joinChannel = async () => {
      if (channel) {
        // Channel Events
        channel.on('memberJoined', (member: Member) => {
          console.log(`New Member: ${member.identity}`);
          setMembers(members + 1)
        });
        channel.on('memberLeft', (member: Member) => {
          console.log(`Member Left: ${member.identity}`);
          const total = members !== 0 ? members - 1 : 0
          setMembers(total)
        });
        channel.on('messageAdded', (msg: Message) => {
          console.log(`messageAdded: ${msg.body}`);
          addMessage(msg)
        });
        channel.on('typingStarted', (member: Member) => {
          console.log(`Member Started Typing: ${member.identity}`);
        });
        channel.on('typingEnded', (member: Member) => {
          console.log(`Member Stopped Typing: ${member.identity}`);
        });

        try {
          await channel.join();
        } catch (err) {
          console.warn(`Join Chat: `, err.message);
        }

        try {
          // Set Members Counts
          let membersCount = await channel.getMembersCount();
          setMembers(membersCount);
        } catch (err) {
          console.error(`Get Members Count: `, err.message);
        }

        try {
          // Set Last 50 Messages
          let gotMessages = await channel.getMessages(50);
          setMessages(gotMessages.items)
        } catch (err) {
          console.error(`Get Chat Messages: `, err.message);
        }
      }
    }
    joinChannel();
  }, [channel]);

  const handleSendMessage = useCallback((msg:string) => {
    console.log('new Message', msg);
    try {
      console.log(channel)
      channel?.sendMessage(msg)
    } catch (err) {
      console.error(err);
    }
    // setMessage([...messages, { me: true, author: "Me", body: msg }])
  }, [channel]);

  if (displaySidebar) {
    return (
      <Flex flexDirection="column" w="300px" py="3">
        <Text>Chat ({members}) </Text>
        <Box flex="1">
          <MessageList identity={identity} messages={messages} />
        </Box>
        {/* <MessageForm onMessageSend={(msg:string) => setMessage([...messages, { me: true, author: "Me", body: msg }])} /> */}
        <MessageForm onMessageSend={handleSendMessage} />
      </Flex>
    );
  } else {
    return null;
  }
}

export default RoomChat;
