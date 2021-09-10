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
    endtime: 403

},
  {
    _id: '4',
    nsfw_type: 'nudity',
    startTime: 138,
    endtime: 200

}];

const nsfwMapper =
    {
        "nudity": "#dcd0ff",
        "violence": "#006400"
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

function getAllTimestamps(modelJSON){
    let tagObj = {};
    let nsfwArr = [];
    let violenceArr = [];
    let inapArr = [];
    for (let obj in modelJSON) {
        let lowEnd = modelJSON[obj]["startTime"] - 5;
        let highEnd = modelJSON[obj]["endtime"] - 5;
        for (let i = lowEnd; i <= highEnd; i++) {
            if(modelJSON[obj]["nsfw_type"] === 'nudity')
                nsfwArr.push(i);
            else if(modelJSON[obj]["nsfw_type"] === 'violence')
                violenceArr.push(i);
            else if(modelJSON[obj]["nsfw_type"] === 'sexual_content')
               inapArr.push(i);}}
        tagObj["nudity"] = nsfwArr;
        tagObj['violence'] = violenceArr;
        tagObj['sexual_content'] = inapArr;
        console.log("tagobj", tagObj);
        return tagObj;
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
  const [showOverlay, setOverlay] = useState(false);
  const [nudeOverlay, setNude] = useState(false);
  const [violenceOverlay, setViolence] =useState(false);
  const [inappOverlay, setInapp] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeStart] = useState(0);

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
    let currTime = Math.round(e.target.currentTime);
    console.log('Whole Number:', currTime);
    let timestamps = getAllTimestamps(dummmyModelJSON);
    let nudeArray = timestamps["nudity"];
    let violenceArray = timestamps["violence"];
    if(nudeArray.includes(currTime)){
        console.log("nude");
        setNude(true);
        setViolence(false);}
    else if(violenceArray.includes(currTime)){
        console.log("violence");
        setViolence(true);
        setNude(false);}
    else{
        setOverlay(false);
        console.log('fuzili')
        }
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
        <VideoPlayer id="v"
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
        onMarkerClick={handleMarkerClick}>
        </VideoPlayer>
        {nudeOverlay === true &&
        <div className="fade-in">
            <div id="overlay" style={{"backgroundColor": "rgba(220, 208, 255, 0.44)"}}></div>
        </div> }
        {violenceOverlay === true &&
        <div className="fade-in">
            <div id="overlay" style={{"backgroundColor": "rgba(255, 2, 0, 0.57)"}}></div>
        </div> }
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
        <p>showOverlay: {showOverlay.toString()}</p>
        <p>volume: {volume}</p>
        <p>timeStart: {timeStart}</p>
      </div>
    </div>
  );
}


export default withRouter(VideoApp);