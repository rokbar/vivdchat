import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appendMessage } from '../../../actions';
import gifShot from 'gifshot';
import _ from 'lodash';
import {
  TextField,
  LinearProgress,
} from 'material-ui';
import MessageIcon from 'material-ui/svg-icons/communication/message';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageTerm: '',
      gifTerm: '',
      gif: '',
      completed: 0,
    };

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
      gifWidth: '150',
      gifHeight: '150',
      progressCallback: (captureProgress) => {
        this.setState({ completed: captureProgress * 100 });
        document.querySelector("button").disabled = true;
      }
    }
  }

  createGif() {
    gifShot.createGIF(this.createGifOptions(), (obj) => {
      if (!obj.error) {
        this.setState({ gif: obj.image });

        const message = {
          term: this.state.messageTerm,
          username: localStorage.getItem('username'),
          gif: this.state.gif
        }

        this.props.appendMessage(message);
        this.socket.emit('send message', message);
        this.setState({ messageTerm: '', gifTerm: '' });

        document.querySelector("button").disabled = false;
        this.setState({ completed: 0 });
      }
    });
  }

  render () {
    const handleSubmit = _.throttle((event) => { this.handleSubmit(event) }, 2000);

    return (
      <div style={styles.messageInput}>
        <LinearProgress style={styles.progressBar} mode="determinate" value={this.state.completed} />
        <form onSubmit={handleSubmit}>
          {<MessageIcon color="rgb(0, 188, 212)" />}
          <TextField
            id="messageTerm"
            floatingLabelText="Message"
            value={this.state.messageTerm}
            onChange={this.handleChange}
          />
          <TextField
            id="gifTerm"
            floatingLabelText="GIF text"
            value={this.state.gifTerm}
            onChange={this.handleChange}
          />
          <button type="submit" hidden></button>
        </form>
      </div>
    );
  }
}

export default connect(null, { appendMessage })(MessageInput);

const styles = {
  messageInput: {
    position: 'fixed',
    bottom: 0,
    padding: '0px 0px 10px 10px',
  },
};