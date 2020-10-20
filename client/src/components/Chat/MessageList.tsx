import React, { useRef, useEffect } from 'react';
import Message from './Message'
import './MessageList.css'

import { Message as MessageType } from 'twilio-chat/lib/message'

// import MessageType from '../../interfaces/MessageType'

interface MessageListProps {
  identity: string,
  messages: MessageType[],
}

function MessageList({ identity, messages }: MessageListProps) {
  const divEl = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // if (null !== divEl) {
      divEl.current!.scrollTop = divEl.current!.scrollHeight
    // }
  });

  const divStyle = {
    overflowY: 'scroll',
    wordWrap: 'break-word',
    position: "fixed",
    top: '86px',
    bottom: '102px',
    width: '300px',
  } as React.CSSProperties;

  return (
    <div className="MessageList" ref={divEl} style={divStyle}>
      {messages.map((message, i) => (
        <Message
          key={i}
          identity={identity}
          message={message}
        />
      ))}
    </div>
  );
}

export default MessageList;
