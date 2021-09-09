import { Input } from 'antd';
import {withRouter} from "react-router";
import React, { useState } from 'react';
import VideoPlayer from 'react-video-markers';
import './styles.css';


const dummmyModelJSON= [{
    _id: '1',
    nsfw_type: 'nudity',
    startTime: 50,
    endtime: 65

  },
  {
    _id: '2',
    nsfw_type: 'violence',
    startTime: 80,
    endtime: 82

},
  {
    _id: '3',
    nsfw_type: 'violence',
    startTime: 400,
    endtime: 82

},
  {
    _id: '4',
    nsfw_type: 'nudity',
    startTime: 138,
    endtime: 82

}];

const nsfwMapper =
    {
        "nudity": "#964b00",
        "violence": "#ff0200"
    };

function createMarkers(modelJSON){
  let markerArr = [];
  let counter = 0;
  for (let obj in modelJSON) {
      let markerObj = {};
      counter = counter + 1;
      markerObj["id"] = counter;
      markerObj["time"] = modelJSON[obj]["startTime"];
      markerObj["color"] = nsfwMapper[modelJSON[obj]["nsfw_type"]];
      markerObj["title"] = modelJSON[obj]["nsfw_type"];
      markerArr.push(markerObj);
      console.log("chicken");
      console.log(markerObj);
  }
  console.log(markerArr);
  return markerArr
}

function VideoApp (){
  const [url] = useState('https://storage.cloud.google.com/vanilla-custard-bucket/nsfw_collection.mp4');
  const [controls, setControls] = useState([
    'play',
    'time',
    'progress',
    'volume',
    'full-screen'
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(5);

  const controlsList = [
    {
      id: 'play',
      title: 'Play button'
    },
    {
      id: 'time',
      title: 'Time'
    },
    {
      id: 'progress',
      title: 'Progress'
    },
    {
      id: 'volume',
      title: 'Volume'
    },
    {
      id: 'full-screen',
      title: 'Full Screen'
    }
  ];

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleControlToggle = event => {
    let result = [...controls];
    const name = event.target.id;
    if (result.includes(name)) {
      result = result.filter(item => item !== name);
    } else {
      result.push(name);
    }
    setControls(result);
  };

  const handleVolume = value => {
    setVolume(value);
  };

  const handleProgress = e => {
    console.log('Current time: ', e.target.currentTime);
  };

  const handleDuration = duration => {
    console.log('Duration: ', duration);
  };

  const handleMarkerClick = marker => {
    alert(`Marker ${marker.id} clicked!`);
  };

  const markers = createMarkers(dummmyModelJSON);

  return (
    <div className="container" style={{ paddingTop: '100px'}}>
      <VideoPlayer
        url={url}
        controls={controls}
        isPlaying={isPlaying}
        volume={volume}
        loop={true}
        markers={markers}
        height={'360px'}
        width={'640px'}
        timeStart={timeStart}
        onPlay={handlePlay}
        onPause={handlePause}
        onVolume={handleVolume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onMarkerClick={handleMarkerClick}
      />
      <div className="controls">
        <p>
          Controls:
          <button onClick={isPlaying ? handlePause : handlePlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </p>
        <p>
          Show controls:
          {controlsList.map(control => {
            return (
              <label key={control.id} htmlFor={control.id}>
                <input
                  id={control.id}
                  type="checkbox"
                  checked={controls.includes(control.id)}
                  onChange={handleControlToggle}
                />{' '}
                {control.title}
              </label>
            );
          })}
        </p>
      </div>
      <div>
        <h3>State:</h3>
        <p>
          controls: {controls.length ? '["' : ''}
          {controls.join('", "')}
          {controls.length ? '"]' : ''}
        </p>
        <p>isPlaying: {isPlaying.toString()}</p>
        <p>volume: {volume}</p>
        <p>timeStart: {timeStart}</p>
      </div>
    </div>
  );
}

export default withRouter(VideoApp);