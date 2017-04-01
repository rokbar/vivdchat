import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import io from 'socket.io-client';
import MessageList from './message_list';

const socket = io('http://localhost:3000');

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    socket.on('receive message', (message) => {
      this.updateChatFromSockets(message);
    });
  }

  updateChatFromSockets(message) {
    this.props.receiveMessage(message);
  }

  handleChange(event) {
    this.setState({ term: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const message = {
      term: this.state.term,
      username: this.props.username
    }
    socket.emit('send message', message);
    this.setState({ term: '' });
  }

  componentWillMount() {
    this.props.fetchMessage();
  }

  render() {
    return (
      <div id="messages">
        <MessageList messages={this.props.messages} />
        <form onSubmit={this.handleSubmit}>
          <input id="m" autoComplete="off"
            value={this.state.term}
            onChange={this.handleChange} />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.auth.message,
    username: state.auth.username,
    messages: state.messages
  };
}

export default connect(mapStateToProps, actions)(Chat);