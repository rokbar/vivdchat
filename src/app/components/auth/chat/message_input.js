import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/types';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '' };

    this.socket = this.props.socket;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ term: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const message = {
      term: this.state.term,
      username: localStorage.getItem('username')
    }
    this.socket.emit('send message', message);
    this.setState({ term: '' });
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input id="m" autoComplete="off"
          value={this.state.term}
          onChange={this.handleChange} />
        <button>Send</button>
      </form>
    );
  }
}

export default connect(null, actions)(MessageInput);