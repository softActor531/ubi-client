import React from 'react';
import classNames from 'classnames'

import './Message.css'

// import MessageType from '../../interfaces/MessageType'
import { Message as MessageType } from 'twilio-chat/lib/message'

interface MessageProps {
  identity: string,
  message: MessageType,
}

function Message({ identity, message }: MessageProps) {
  const classes = classNames('Message', {
    log: !message.author,
    me: identity === message.author
  })

  return (
    <div className={classes}>
      {message.author && (
        <span className="author">{message.author}:</span>
      )}
      {message.body}
    </div>
  );
}

export default Message;
