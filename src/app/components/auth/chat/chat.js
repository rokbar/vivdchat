import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import io from 'socket.io-client';
import MessageList from './message_list';
import MessageInput from './message_input';

//const socket = io.connect('http://localhost:3000');

class Chat extends Component {
  constructor(props) {
    super(props);

    // this.socket = io('http://localhost:3000');

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

  componentDidMount() {
    //     socket.on('connect', function() {
    //   socket
    //     .emit('authenticate', {token: localStorage.getItem('token')})
    //     .on('authenticated', function() {
    //       console.log('authenticated');
    //     })
    //     .on('unauthorized', function(msg) {
    //       console.log('unauthorized: ' + JSON.stringify(msg.data));
    //       throw new Error(msg.data.type);
    //     })
    // });
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