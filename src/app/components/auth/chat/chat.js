import React, { Component } from 'react';
import { connect } from 'react-redux';
import { receiveMessage, fetchMessagesByGroup } from '../../../actions';
import io from 'socket.io-client';
import MessageList from './message_list';
import MessageInput from './message_input';
import { BottomNavigation } from 'material-ui';

class Chat extends Component {
  constructor(props) {
    super(props);
    const groupId = props.routeParams.groupId;
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

  componentDidMount() {
    this.props.fetchMessagesByGroup(this.props.routeParams.groupId);
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        <div style={{ overflowY: 'scroll' }} id="messages">
          <MessageList messages={this.props.messages} groupName={this.props.groupName} />
        </div>
        <BottomNavigation
          style={{
            borderTop: 'solid 1px rgba(0, 0, 0, 0.12)',
            paddingTop: '20px',
            width: '100%',
            height: '130px',
            position: 'absolute',
            bottom: '0',
            zIndex: '999',
          }}
          id="inputs"
        >
          <MessageInput socket={this.socket} />
        </ BottomNavigation>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages,
    groupName: state.groupName,
  };
}

export default connect(mapStateToProps, { receiveMessage, fetchMessagesByGroup })(Chat);