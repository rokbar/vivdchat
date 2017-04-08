import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appendMessage } from '../../../actions';
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
      'progressCallback': function(captureProgress) {
        console.log(captureProgress);
        document.querySelector("progress").style.visibility = "";
        document.querySelector("progress").value = captureProgress;
      }
    }, (obj) => {
      if(!obj.error) {
        self.setState({ gif: obj.image });
        const message = {
          term: self.state.term,
          username: localStorage.getItem('username'),
          gif: self.state.gif
        }
        self.props.appendMessage(message);
        self.socket.emit('send message', message);
        self.setState({ term: '', gif: '' }); 
        document.querySelector("progress").style.visibility = "hidden";
      }
    });
  }

  render () {
    return (
      <div>
        <progress max="1" min="0" className="progress-bar" style={{visibility: 'hidden'}}></progress>
        <form onSubmit={this.handleSubmit}>
          <input id="m" autoComplete="off"
            value={this.state.term}
            onChange={this.handleChange}
            placeholder="Your Message" />
          <input id="g" autoComplete="off"
            value={this.state.gifTerm}
            onChange={this.handleChange}
            placeholder="GIF text" />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default connect(null, { appendMessage })(MessageInput);