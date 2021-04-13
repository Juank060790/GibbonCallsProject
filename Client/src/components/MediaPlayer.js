import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import notFoundImage from "../images/No_image_available.svg";

export default function MediaPlayer(props) {
  console.log("SElected Spectogram mediaplayer", props?.spectogramImage);

  return (
    <>
      <Container className="MediaPlayerContainer">
        <div className="text-center">
          {props.spectogramImage ? (
            <img
              src={props.spectogramImage}
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
      </Container>
      <h4>selectedAudio</h4>
    </>
  );
}
