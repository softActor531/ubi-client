import React, { useEffect, useCallback, useRef } from 'react';
import { Textarea } from "@chakra-ui/core"
import classNames from 'classnames'
import './Captioner.css';
import { useStoreState, useStoreActions } from "../store";
import connection, { StringBinding, SDBDoc } from '../services/sharedb'
import { useLocation } from 'react-router-dom';

interface CaptionerProps {
  roomName: string;
}

function Captioner({ roomName }: CaptionerProps) {
  const fontSize = useStoreState(state => state.room.fontSize)
  const autoScroll = useStoreState(state => state.room.autoScroll);
  const setAutoScroll = useStoreActions(actions => actions.room.setAutoScroll);
  let roomConnection: SDBDoc<string>|null = connection.get(roomName, 'textarea')
  const inputEl = useRef<HTMLTextAreaElement | null>(null)

  // Set Location
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isAgent = Boolean(query.get('isAgent'))

  useEffect(() => {
    // console.log('Room UseEffect: ', inputEl)
    // roomConnection = connection.get(roomName, 'textarea');
    if (roomConnection) {
      roomConnection.__doc__().subscribe((err: any) => {
        if (err) {
          console.log("Error:", err);
        }
        console.log(`Loading Captioning Room: ${roomName}`)
        if (inputEl.current && roomConnection) {
          let binding = new StringBinding(inputEl.current, roomConnection);
          // let binding = new StringBinding(inputEl.current, roomConnection, ['content']);
          binding.setup();
        }
      });
    }
    return function cleanup() {
      roomConnection?.destroy()
    }
  }, [roomName]);

  useEffect(() => {
    if (!isAgent && inputEl.current) {
      inputEl.current.disabled = true
    }
  }, [isAgent]);

  useEffect(() => {
    roomConnection?.subscribe(docChanged)
    return function cleanup() {
      roomConnection?.unsubscribe(docChanged)
    }
  }, [autoScroll]);

  const onWheel = () => {
    const { current } = inputEl;
    if (current) {
      setAutoScroll(current.scrollTop + current.offsetHeight === current.scrollHeight + 2);
    }
  }

  const docChanged = () => {
    if (!autoScroll) {
      return;
    }
    const { current } = inputEl;
    if (current) {
      current.scrollTop = current.scrollHeight;
    } else {}
  }

  var padClass = classNames({
    'pad-small': fontSize === 'sm',
    'pad-medium': fontSize === 'md',
    'pad-large': fontSize === 'lg',
    'pad-xlarge': fontSize === 'xl'
  });

  return (
    <Textarea
      className={padClass}
      ref={inputEl}
      placeholder="Text will stream when audio begins..."
      defaultValue="Connecting..."
      resize="none"
      onWheel={onWheel}
      h="100%"
      w="100%"
      style={{opacity: '1 !important', cursor: 'default !important'}}
    />
  );
}

export default Captioner;
