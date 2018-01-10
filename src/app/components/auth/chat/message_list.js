import React from 'react';
import { 
  List, 
  ListItem,
  Subheader, 
  Paper, 
} from 'material-ui';
import moment from 'moment';
import base64js from 'base64-js';
import { isArray } from 'lodash';

const MessageList = (props) => {
  const groupName = new String(props.groupName);
  const messageItems = props.messages.map((message, index) => {
    const gif = isArray(message.gif) 
    ? `data:image/gif;base64,${base64js.fromByteArray(message.gif)}`
    : message.gif;
    const time = moment(message.time).local().calendar();
    return (
      <ListItem
        key={index}
        children={
          <div>
            <div>{time}</div>
            <img src={gif} />
            <span>
              &nbsp;<span style={styles.username}>{message.username}:</span>
              &nbsp;<span style={styles.text}>{message.text}</span>
            </span>
          </div>
        }
      />
    );
  });
  return (
    <List>
      <Subheader>{groupName}</Subheader>
      {messageItems}
    </List>
  );
};

const styles = {
  username: {
    color: 'rgb(0, 188, 212)',
    fontSize: '15px',
  },
  text: {
    fontSize: '15px',
  },
}

export default MessageList;