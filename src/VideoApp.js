import { Input, Row, Col, Card, Layout} from 'antd';
import {withRouter} from "react-router";
import React, { useState } from 'react';
import VideoPlayer from 'react-video-markers';
import { PieChart } from "react-minimal-pie-chart";
import './styles.css';

const trainedDataJSON = require('./violencemocktrainnude.json');

const nudityColor = "#dcd0ff";
const violenceColor= "#ff39c8";


const nsfwMapper =
    {
        "nudity": nudityColor,
        "violence": violenceColor
    };
const noneColor="green";


function getAllTimestamps(modelJSON){
    let tagObj = {};
    let nsfwArr = [];
    let violenceArr = [];
    let inapArr = [];
    for (let obj in modelJSON) {
        let lowEnd = modelJSON[obj]["startTime"] - 5;
        let highEnd = modelJSON[obj]["endTime"] - 5;
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

function createMarkers(nsfwType, counter){
  const fullMarkerObj = getAllTimestamps(trainedDataJSON);
  console.log("Full", fullMarkerObj);
  let markerArr = [];
  const parseArr= fullMarkerObj[nsfwType];
  let i = 0;
  for (i; i < parseArr.length; i++)
      { console.log(parseArr[i]);
      let markerObj = {};
      counter = counter + 1;
      markerObj["id"] = counter;
      markerObj["time"] = parseArr[i];
      markerObj["color"] = nsfwMapper[nsfwType];
      markerObj["title"] = nsfwType;
      markerArr.push(markerObj);
      console.log("chicken");
      console.log(markerObj);}
  console.log(markerArr);
  return markerArr
}

function returnMarkerObject(){
    let nudObjArr = createMarkers("nudity", 0);
    let violObjArr = createMarkers("violence", 1000);
    console.log("help",[...nudObjArr, ...violObjArr]);
    return [...nudObjArr, ...violObjArr];
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
  const [pieData, setPieData] = useState({});

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
    let timestamps = getAllTimestamps(trainedDataJSON);
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
        setViolence(false);
        setNude(false);
        }
    };

  const handleDuration = duration => {
      console.log('Duration: ', duration);
      let timestamps = getAllTimestamps(trainedDataJSON);
      let nudeArray = timestamps["nudity"];
      let violenceArray = timestamps["violence"];
      console.log("arrllength", nudeArray.length);
      const nudeRatio = nudeArray.length/duration;
      const violenceRatio = violenceArray.length/duration;
      console.log("nuderatio", nudeRatio);
      const nudePercent = Math.round(nudeRatio * 100);
      console.log("nuddePercent",nudePercent);
      const violentPercent = Math.round(violenceRatio*100);
      const safePercent = 100 - (nudePercent + violentPercent);
      const pieData = [
      { title: "Nudity", value: nudePercent, color: nudityColor },
      { title: "Violence", value: violentPercent, color: violenceColor },
      { title: "Safe", value: safePercent, color: "green" },];
      return setPieData(pieData)
  };

  const handleMarkerClick = marker => {
  };

  const markers = returnMarkerObject();

  return (
    <div className="container" style={{ paddingTop: '100px', left:'100px'}}>
        <Layout className="layout">
        <Row height="100%" gutter={0} style={{marginTop: 64, marginBottom: 50, paddingLeft: 100, paddingRight: 100}}>
        <Col flex={1}>
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
            <div id="overlay" style={{"backgroundColor": "rgba(255, 57, 200, 0.57)"}}></div>
        </div> }
        </Col>
        <Col flex={2}>
             <Card title="Statistical Breakdown" style={{ width: 500, height: 360, textAlign: "left" }}>
                  <Row height="100%" style={{ paddingRight: 25}}>
                      <Col flex={4}>
                      <PieChart
                      style={{
                        fontFamily:
                          '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                        fontSize: '8px',
                      }}
                      data={pieData}
                      radius={PieChart.defaultProps.radius - 6}
                      lineWidth={60}
                      segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                      animate
                      label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                      labelPosition={100 - 60 / 2}
                      labelStyle={{
                        fill: '#080808',
                        opacity: 0.75,
                        fontSize: "8px",
                        pointerEvents: 'none',
                        fontWeight: 'bold',
                        webkitTextStrokeColor: 'black',
                      }}
                      viewBoxSize={[170, 150]}
                    />
                      </Col>
                      <Col flex={1}>
                      <h5 style={{color: nudityColor, fontWeight: "bold", fontSize:"18px"}}>Nudity</h5>
                      <h5 style={{color: violenceColor, fontWeight: "bold", fontSize:"18px"}}>Violence</h5>
                      <h5 style={{color: noneColor, fontWeight: "bold", fontSize:"18px"}}>Neither</h5>
                      </Col>
                    </Row>
                </Card>
        </Col>
        </Row>
      {/*  <div className="controls">*/}
      {/*  <p>*/}
      {/*    Controls:*/}
      {/*    <button onClick={isPlaying ? handlePause : handlePlay}>*/}
      {/*      {isPlaying ? 'Pause' : 'Play'}*/}
      {/*    </button>*/}
      {/*  </p>*/}
      {/*  <p>*/}
      {/*    Show controls:*/}
      {/*    {controlsList.map(control => {*/}
      {/*      return (*/}
      {/*        <label key={control.id} htmlFor={control.id}>*/}
      {/*          <input*/}
      {/*            id={control.id}*/}
      {/*            type="checkbox"*/}
      {/*            checked={controls.includes(control.id)}*/}
      {/*            onChange={handleControlToggle}*/}
      {/*          />{' '}*/}
      {/*          {control.title}*/}
      {/*        </label>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </p>*/}
      {/*</div>*/}
      {/*<div>*/}
      {/*  <h3>State:</h3>*/}
      {/*  <p>*/}
      {/*    controls: {controls.length ? '["' : ''}*/}
      {/*    {controls.join('", "')}*/}
      {/*    {controls.length ? '"]' : ''}*/}
      {/*  </p>*/}
      {/*  <p>isPlaying: {isPlaying.toString()}</p>*/}
      {/*  <p>showOverlay: {showOverlay.toString()}</p>*/}
      {/*  <p>volume: {volume}</p>*/}
      {/*  <p>timeStart: {timeStart}</p>*/}
      {/*</div>*/}
        </Layout>
      </div>
  );
}


export default withRouter(VideoApp);