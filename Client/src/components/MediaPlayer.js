import React from "react";
import { Container } from "react-bootstrap";
import notFoundImage from "../images/No_image_available.svg";
import WaveSpectogram from "./WaveSpectogram";

export default function MediaPlayer(props) {
  // console.log("SElected Spectogram mediaplayer MEdia player", props.audioCall);
  const audioCallSpectogram = props?.audioCall;
  return (
    <>
      <Container className="MediaPlayerContainer">
        {" "}
        <div className="spectogramContainer text-center">
          {props.spectogramImage ? (
            <img
              src={props.spectogramImage}
              className="spectogramImage"
              width="900px"
              height="300px"
              alt="Spectogram "
            />
          ) : (
            <img
              src={notFoundImage}
              width="900px"
              height="300px"
              alt="Spectogram "
            />
          )}
        </div>
      </Container>{" "}
      <WaveSpectogram audioCallSpectogram={audioCallSpectogram} />
      <div className="containerInfoAudio">
        <div>
          {props.selectedAudio ? (
            <div className="FileDetails">
              <h4>File Details:</h4>
              <p>Name:{props?.selectedAudio.fileName}</p>
              <p>Duration:{props?.selectedAudio.duration}</p>
              <p>Record Date: {props?.selectedAudio.recordDate}</p>
            </div>
          ) : (
            <p></p>
          )}
        </div>
        <div></div>
      </div>
    </>
  );
}
