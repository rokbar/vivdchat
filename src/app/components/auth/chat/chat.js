import React, { Component } from 'react';
import { connect } from 'react-redux';
import { receiveMessage } from '../../../actions';
import io from 'socket.io-client';
import MessageList from './message_list';
import MessageInput from './message_input';

class Chat extends Component {
  constructor(props) {
    super(props);
    const groupId = "5a4d3664d428d425e85a2b5f";
    this.socket = io.connect('http://localhost:3000');
    this.socket
      .on('connect', () => {
        this.socket
          .emit('authenticate', { token: localStorage.getItem('token') }) //send the jwt
          .on('authenticated', function () {
            console.log('authenticated');
          })
          .emit('join room', groupId)
          .on('unauthorized', function (msg) {
            console.log("unauthorized: " + JSON.stringify(msg.data));
            throw new Error(msg.data.type);
          })
      })
      .on('disconnect', () => {
        console.log('disconnected');
      })
      .on('receive message', (message) => {
        this.updateChatFromSockets(message);
      });
  }

  updateChatFromSockets(message) {
    this.props.receiveMessage(message);
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    return (
      <div>
        <div id="messages">
          <MessageList messages={this.props.messages} />
        </div>
        <div id="inputs">
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