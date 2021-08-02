import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import notFoundImage from "../images/No_image_available.svg";
import WaveSpectogram from "./waveSpectogram";

export default function MediaPlayer(props) {
  const SpectogramAudio = props?.spectogramAudio;
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);

  return (
    <>
      <Container fluid className="MediaPlayerContainer">
        <div className="infoAudio">
          {" "}
          <div>
            {selectedAudio ? (
              <div className="FileDetails">
                <h4>File Details:</h4>
                <p className="line-break-text">Name:{selectedAudio.audioId}</p>
                <p className="line-break-text">
                  Duration:{selectedAudio.duration}
                </p>
                <p className="line-break-text">
                  Record Date:{" "}
                  {new Date(
                    selectedAudio.recordDate.seconds * 1000
                  ).toLocaleDateString()}
                </p>
                <p className="line-break-text">
                  Comment:{selectedAudio.comments}
                </p>
              </div>
            ) : (
              <p></p>
            )}
          </div>
        </div>{" "}
        <div className="spectogramContainer text-center">
          {props.spectogramImage ? (
            <div className="spectogramImageContainer">
              <img
                src={props.spectogramImage}
                className="spectogramImage"
                width="900px"
                height="300px"
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
