import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appendMessage } from '../../../actions';
import gifShot from 'gifshot';
import _ from 'lodash';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = { messageTerm: '', gifTerm: '', gif: '' };

    this.socket = this.props.socket;
    this.handleChange = this.handleChange.bind(this);
    this.createGif = this.createGif.bind(this);
  }

  handleChange(event) {
    let eti = String(event.target.id), newState = {}; 

    newState[eti] = event.target.value;
    this.setState(newState);
  }

  handleSubmit(event) {  
    event.preventDefault(); 
    this.createGif();
  };

  createGifOptions() {
    return {
      text: this.state.gifTerm,
      fontWeight: 'bold',
      fontSize: '20px',
      'progressCallback': function(captureProgress) {
        document.querySelector("progress").style.visibility = "";
        document.querySelector("progress").value = captureProgress;
        document.querySelector("button").disabled = true;
      }
    }
  }

  createGif() {
    let self = this;

    gifShot.createGIF(this.createGifOptions(), (obj) => {
      if (!obj.error) {
        self.setState({ gif: obj.image });  
        const message = {
          term: self.state.messageTerm,
          username: localStorage.getItem('username'),
          gif: self.state.gif
        }
        self.props.appendMessage(message);
        self.socket.emit('send message', message);
        self.setState({ messageTerm: '', gifTerm: '' }); 
        document.querySelector("progress").style.visibility = "hidden";
        document.querySelector("button").disabled = false;
      }
    });
  }

  render () {
    const handleSubmit = _.throttle((event) => { this.handleSubmit(event) }, 2000);

    return (
      <div>
        <progress max="1" min="0" className="progress-bar" style={{visibility: 'hidden'}}></progress>
        <form onSubmit={handleSubmit}>
          <input id="messageTerm" autoComplete="off"
            value={this.state.messageTerm}
            onChange={this.handleChange}
            placeholder="Your Message" />
          <input id="gifTerm" autoComplete="off"
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