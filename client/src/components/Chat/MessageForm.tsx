import React, { useRef, useEffect } from 'react';
// import classNames from 'classnames'

import {
  Flex,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/core"


import './MessageForm.css'

interface MessageFormCallback {
  onMessageSend: (message: string) => void
}

function MessageForm({ onMessageSend }: MessageFormCallback) {
  const inputEl = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // if (null !== inputEl.current) {
      // inputEl.current!.focus()
    // }
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onMessageSend(inputEl.current!.value)

    // if (null !== inputEl.current) {
      inputEl.current!.value = ''
    // }
  }

  return (
    <form className="MessageForm" onSubmit={handleFormSubmit}>
      <InputGroup size="md">
        <Input
          pr="3.5rem"
          type="text"
          ref={inputEl}
          placeholder="Enter your message..."
        />
        <InputRightElement width="3.5rem" px="0">
          <Button px="2" size="sm" type="submit">
            Send
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  );
}

export default MessageForm;
