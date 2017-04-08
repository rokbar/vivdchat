import React, { Component } from 'react';
import { connect } from 'react-redux';
import { receiveMessage } from '../../../actions';
import io from 'socket.io-client';
import MessageList from './message_list';
import MessageInput from './message_input';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.socket = io.connect('http://localhost:3000', {
      'query': 'token=' + localStorage.getItem('token')
    });
    this.socket.on('connect', function () {
      console.log('authenticated');
    }).on('disconnect', function () {
      console.log('disconnected');
    });
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
      <div>
        <div id="messages">
          <MessageList messages={this.props.messages} />
          <MessageInput socket={this.socket} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages
  };
}

export default connect(mapStateToProps, { receiveMessage })(Chat);