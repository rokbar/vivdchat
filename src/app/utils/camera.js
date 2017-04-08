const Camera = () => {
  let stopButton = document.getElementById('stop');
  let startButton = document.getElementById('start');
  let liveStream;
  let recorder;

  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      liveStream = stream;
      
      var liveVideo = document.getElementById('video');
      liveVideo.src = URL.createObjectURL(stream);
      liveVideo.play();

      startButton.addEventListener('click', startRecording);
    });
  }

  const startRecording = () => {  
    recorder = new MediaRecorder(liveStream);
    recorder.addEventListener('dataavailable', onRecordingReady);
    recorder.start();
    setTimeout((stopRecording), 1500);
  }

  const stopRecording = () => {
    recorder.stop();
  }

  const onRecordingReady = (e) => {
    var video = document.getElementById('recorded');
    video.src = URL.createObjectURL(e.data);
    video.play();
  }
}

export default Camera;