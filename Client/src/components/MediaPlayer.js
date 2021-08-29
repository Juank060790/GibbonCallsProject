import WaveSpectrogram from "./waveSpectrogram";
import React from "react";

export default function MediaPlayer(props) {
  const SpectrogramAudio = props?.spectrogramAudio;

  return (
    <>
      <WaveSpectrogram SpectrogramAudio={SpectrogramAudio} />
    </>
  );
}
