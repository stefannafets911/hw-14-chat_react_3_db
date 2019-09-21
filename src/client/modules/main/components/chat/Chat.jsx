import React, { useState } from 'react';
import { ChatMessage } from '../chatMessage';

export const Chat = (props) => {
  const { addMessage, messages, user, initWs } = props;
  // console.log(props);
  const [message, setMessage] = useState('');
  const handleClick = () => {
    // console.log(message);
    addMessage(message);
    setMessage('');
  };

  return (
    <div className='users__chat chat' id='chat'>
      <div className='chat__title'>Chat</div>
      <div className='chat__body'>
        <div className='chat__content' id='chatContent'>
          {messages.map(message => (
            <ChatMessage
              key={message._id}
              message={message}
              user={user}
            />
          ))}
        </div>
        <div className='chat__footer'>
          <input
            type='text'
            className='chat__input'
            id='message'
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
          <button className='chat__button' id='sendBtn' onClick={handleClick}>Send</button>
        </div>
      </div>
    </div>
  );
};
