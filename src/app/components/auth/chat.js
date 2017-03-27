import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({ term: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.term);
    socket.emit('chat message', this.state.term);
    this.setState({ term: '' });
  }

  componentWillMount() {
    this.props.fetchMessage();
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div id="messages">
        <ul></ul>
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
  return { message: state.auth.message };
}

export default connect(mapStateToProps, actions)(Chat);