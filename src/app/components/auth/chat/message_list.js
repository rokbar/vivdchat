import React from 'react';
import { 
  List, 
  ListItem,
  Subheader, 
  Paper, 
} from 'material-ui';

const MessageList = (props) => {
  const messageItems = props.messages.map((message, index) => {
    return (
      <ListItem
        key={index}
        children={
          <div>
            <img src={message.gif} />
            <span>
              &nbsp;<span style={styles.username}>{message.username}:</span>
              &nbsp;{message.term}
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