import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import io from 'socket.io-client';
import MessageList from './message_list';
import MessageInput from './message_input';

class Chat extends Component {
  constructor(props) {
    super(props);

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

  componentDidMount() {
    var startButton = document.getElementById('start');
    var stopButton = document.getElementById('stop');
    var liveStream, recorder;

    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        liveStream = stream;
        
        var liveVideo = document.getElementById('video');
        liveVideo.src = URL.createObjectURL(stream);
        liveVideo.play();

        startButton.addEventListener('click', startRecording);
        stopButton.addEventListener('click', stopRecording);
      });
    }

    var startRecording = function() {
      recorder = new MediaRecorder(liveStream);

      recorder.addEventListener('dataavailable', onRecordingReady);

      recorder.start();
    }

    var stopRecording = function() {
      recorder.stop();
    }

    var onRecordingReady = function(e) {
      var video = document.getElementById('recorded');
      video.src = URL.createObjectURL(e.data);
      video.play();
    }
  }

  updateChatFromSockets(message) {
    this.props.receiveMessage(message);
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    return (
      <div>
        <video id="video" width="640" height="480" autoPlay></video>
        <button id="start">Start</button>
        <button id="stop">Stop</button>
        <video id="recorded" width="640" height="480" controls loop></video>
        <div id="messages">
          <MessageList messages={this.props.messages} />
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

export default connect(mapStateToProps, actions)(Chat);