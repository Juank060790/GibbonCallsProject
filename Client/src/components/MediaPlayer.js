import React from "react";
import { Container } from "react-bootstrap";
import notFoundImage from "../images/No_image_available.svg";
import WaveSpectogram from "./waveSpectogram";

export default function MediaPlayer(props) {
  const SpectogramAudio = props?.spectogramAudio;

  return (
    <>
      <Container fluid className="MediaPlayerContainer">
        {" "}
        <div className="spectogramContainer text-center">
          {props.spectogramImage ? (
            <div className="spectogramImageContainer">
              <img
                src={props.spectogramImage}
                className="spectogramImage"
                // width="900px"
                // height="300px"
                alt="Spectogram "
              />
            </div>
          ) : (
            <img
              src={notFoundImage}
              // width="900px"
              // height="300px"
              alt="Spectogram "
            />
          )}
        </div>
      </Container>{" "}
      <WaveSpectogram SpectogramAudio={SpectogramAudio} />
    </>
  );
}
