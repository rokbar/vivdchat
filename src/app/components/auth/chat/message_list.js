import React from 'react';
import { 
  List, 
  ListItem,
  Subheader, 
  Paper, 
} from 'material-ui';
import moment from 'moment';

const MessageList = (props) => {
  const messageItems = props.messages.map((message, index) => {
    const time = moment(message.time).local().calendar();
    return (
      <ListItem
        key={index}
        children={
          <div>
            <span>{time}</span>
            <img src={message.gif} />
            <span>
              &nbsp;<span style={styles.username}>{message.username}:</span>
              &nbsp;{message.text}
            </span>
          </div>
        }
      />
    );
  });

  return (
    <List>
      <Subheader>Messages</Subheader>
      {messageItems}
    </List>
  );
};

const styles = {
  username: {
    color: 'rgb(0, 188, 212)',
  }
}

export default MessageList;