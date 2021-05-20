import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import notFoundImage from "../images/No_image_available.svg";
import WaveSpectogram from "./waveSpectogram";

export default function MediaPlayer(props) {
  const SpectogramAudio = props?.spectogramAudio;
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);

  console.log(`props`, selectedAudio);
  return (
    <>
      <Container fluid className="MediaPlayerContainer">
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
      {/* <Container fluid>
        <div className="containerInfoAudio">
          <div>
            {selectedAudio ? (
              <div className="FileDetails">
                <h4>File Details:</h4>
                <p>Name:{selectedAudio.fileName}</p>
                <p>Duration:{selectedAudio.duration}</p>
                <p>
                  Record Date:{" "}
                  {new Date(
                    selectedAudio.recordDate.seconds * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div></div>
        </div>
      </Container> */}
      <WaveSpectogram SpectogramAudio={SpectogramAudio} />
    </>
  );
}
