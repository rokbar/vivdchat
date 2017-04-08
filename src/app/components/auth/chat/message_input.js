import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/types';
import gifShot from 'gifshot';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '', gif: '' };

    this.socket = this.props.socket;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createGif = this.createGif.bind(this);
  }

  handleChange(event) {
    this.setState({ term: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault(); 
    this.createGif();
  }

  createGif() {
    let self = this;

    gifShot.createGIF({
      text: '#swag',
      fontWeight: 'bold',
      fontSize: '20px',
      fontColor: '#f6f6f6'
    }, function(obj) {
      if(!obj.error) {
        self.setState({ gif: obj.image });

        const message = {
          term: self.state.term,
          username: localStorage.getItem('username'),
          gif: self.state.gif
        }
        self.socket.emit('send message', message);
        self.setState({ term: '', gif: '' });
      }
    });
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