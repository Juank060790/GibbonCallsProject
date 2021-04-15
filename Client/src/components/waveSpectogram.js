import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import SpectrogramPlugin from "wavesurfer.spectrogram.js";

export default function waveSpectogram() {
  var wavesurfer = new WaveSurfer.create({
    container: "#waveform",
    waveColor: "#D2EDD4",
    progressColor: "#46B54D",
  });

  //   wavesurfer.on("ready", function () {
  //     var spectrogram = Object.create(WaveSurfer.Spectrogram);
  //     spectrogram.init({
  //       wavesurfer: wavesurfer,
  //       container: "#wave-spectrogram",
  //       fftSamples: 1024,
  //       labels: true,
  //     });
  //   });

  wavesurfer.load("");
  return (
    <>
      <div id="waveform"></div>
      <div id="wave-spectrogram"></div>
    </>
  );
}
