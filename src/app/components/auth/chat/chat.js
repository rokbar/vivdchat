import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import io from 'socket.io-client';
import MessageList from './message_list';
import MessageInput from './message_input';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.socket = io('http://localhost:3000');
    this.socket.on('receive message', (message) => {
      this.updateChatFromSockets(message);
    });
  }

  updateChatFromSockets(message) {
    this.props.receiveMessage(message);
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    return (
      <div id="messages">
        <MessageList messages={this.props.messages} />
        <MessageInput socket={this.socket} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages
  };
}

export default connect(mapStateToProps, actions)(Chat);