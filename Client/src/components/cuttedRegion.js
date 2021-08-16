// import React, { useRef, useEffect } from "react";
// import WaveSurfer from "wavesurfer.js";
// import { bufferToWave } from "../helpers/utils";

// export default function CuttedRegion(audio) {
//   const waveformRef = useRef(null);
//   //   var Waveform = useRef(null);

//   //   const WaveformOptions = (ref) => ({
//   //     container: waveformRef.current,
//   //     cursorWidth: 1,
//   //     cursorColor: "rgba(255,255,255,0.5)",
//   //     progressColor: "#7AD7F0",
//   //     waveColor: "#F5FCFF",
//   //     dragSelection: true,
//   //     backend: "WebAudio",
//   //     drawingContextAttributes: {
//   //       // Boolean that hints the user agent to reduce the latency
//   //       // by desynchronizing the canvas paint cycle from the event
//   //       // loop
//   //       desynchronized: true,
//   //     },
//   //     normalize: true,
//   //     partialRender: true,
//   //     loopSelection: true,
//   //     plugins: [],
//   //   });

//   //   const createWaveform = (audio) => {
//   //     var wavesurfer = WaveSurfer.create({
//   //       container: "#waveform",
//   //       waveColor: "violet",
//   //       progressColor: "purple",
//   //     });
//   //   };
//   //   console.log(`audio`, audio.regionCutted);
//   //   if (audio.regionCutted) {
//   //     let newWaveform = bufferToWave(
//   //       audio.regionCutted,
//   //       null,
//   //       audio.regionCutted.length
//   //     );
//   //     console.log(`newWaveform`, newWaveform);
//   //     createWaveform(newWaveform);
//   //   }

//   //   useEffect(() => {
//   //     createWaveform();
//   //   }, [audio]);

//   return (
//     <>
//       <div ref={waveformRef}></div>
//     </>
//   );
// }
