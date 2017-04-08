import React from 'react';

const MessageList = (props) => {
  const messageItems = props.messages.map((message, index) => {
    return (
      <li
        key={index}>
        <img src={message.gif} />
        {message.username}: {message.term}
      </li>
    );
  });

  return (
    <ul>
      {messageItems}
    </ul>
  );
};

export default MessageList;