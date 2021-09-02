// import React, { useRef, useEffect, useState, useCallback } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import testAudio from "../images/testAudio.WAV";
// import ImageTest from "../images/Spectogram2.png";

// const Spectrogram = (props) => {
//   const [Play, setPlay] = useState("Play");
//   const [run, setRun] = useState(true);
//   const SpectrogramRef = useRef(null);
//   const playerRef = useRef(null);
//   const { randomColor } = props;
//   let canvasRegions = [];
//   let context = null;
//   let canvas = null;
//   let posX = 0;

//   function resizeCanvasToDisplaySize(canvas) {
//     const { width, height } = canvas.getBoundingClientRect();

//     if (canvas.width !== width || canvas.height !== height) {
//       canvas.height = height;
//       canvas.width = width;
//       return true; // here you can return some usefull information like delta width and delta height instead of just true
//       // this information can be used in the next redraw...
//     }

//     return false;
//   }

//   // Draw the region on the canvas and save the region into the canvasRegions array
//   const DrawInCanvas = (canvas, ctx) => {
//     let newSelection = {};
//     let mousedown = false;
//     if (!ctx || !canvas) {
//       return;
//     }

//     // Draw the region on the canvas
//     const drawSelection = (start, end) => {
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.rect(start, 0, end - start, canvas.height);
//       ctx.stroke();
//       ctx.fillStyle = randomColor(0.2);
//       ctx.fill();
//       ctx.closePath();
//     };
//     // Start the selection
//     canvas.addEventListener("mousedown", (e) => {
//       e.preventDefault();
//       mousedown = true;
//       newSelection.start = e.offsetX;
//       newSelection.end = e.offsetX;
//       drawSelection(newSelection.start, newSelection.end);
//     });
//     // End the selection
//     canvas.addEventListener("mouseup", (e) => {
//       e.preventDefault();
//       mousedown = false;
//       drawSelection(newSelection.start, newSelection.end);
//       console.log(`canvas.width`, canvas.width);
//       let newRegion = {
//         start: newSelection.start / (canvas.width / 60),
//         end: newSelection.end / (canvas.width / 60),
//         id: Date.now(),
//         color: randomColor(0.1),
//       };

//       canvasRegions.push({ newRegion });
//     });

//     canvas.addEventListener("mousemove", (e) => {
//       e.preventDefault();
//       if (mousedown === true) {
//         newSelection = { ...newSelection, end: e.offsetX };
//       }
//     });

//     // const btnSave = document.getElementById("saveRegionCanvas");
//     // btnSave.addEventListener("click", () => {
//     //   console.log("SAVEREGION");
//     //   ctx.save();
//     // });
//   };

//   function DrawPlayTracker(ctx, canvas) {
//     let v = window.innerWidth / 60 / 60;
//     ctx.linearWith = 2;
//     ctx.strokeStyle = "rgba(255, 165, 0, .9)";
//     ctx.beginPath();
//     ctx.rect(
//       (posX += v), // x
//       0, // y
//       2, // width
//       canvas.height // height
//     );
//     ctx.clearRect(0, 0, posX, canvas.height);
//     ctx.stroke();
//     // ctx.moveTo((posX += v), 0);
//     ctx.closePath();
//   }

//   // useCallback hook with a play audio function
//   const playAudio = useCallback(() => {
//     if (run === true) {
//       playerRef.current.play();
//       setPlay("Pause");
//       // posX = 0;
//     } else {
//       console.log(`run`, run);
//       playerRef.current.pause();
//       setPlay("Play");
//     }
//   }, [setPlay, run]);

//   const restartAudio = () => {
//     playerRef.current.currentTime = 0;
//   };

//   // Load the spectrogram audio
//   useEffect(() => {
//     playerRef.current.src = testAudio;
//   }, []);

//   useEffect(() => {
//     canvas = SpectrogramRef.current;
//     context = canvas.getContext("2d");
//     resizeCanvasToDisplaySize(context.canvas);
//     context.canvas.width = window.innerWidth;
//     context.canvas.height = 200;
//     const image = new Image();
//     image.src = ImageTest;
//     image.onload = () => {
//       context.drawImage(
//         image,
//         0,
//         0,
//         context.canvas.width,
//         context.canvas.height
//       );
//     };
//     let animationFrameId;
//     const render = () => {
//       DrawInCanvas(canvas, context);
//       if (run === false) {
//         DrawPlayTracker(context, canvas);
//       }
//       window.cancelAnimationFrame(animationFrameId);
//       animationFrameId = window.requestAnimationFrame(render);
//     };
//     render();

//     return () => {
//       console.log("render");
//       window.cancelAnimationFrame(animationFrameId);
//     };
//     // eslint-disable-next-line
//   }, [run]);

//   const url = testAudio;
//   return (
//     <div>
//       <div className="Spectrogram-container">
//         <canvas width="100%" ref={SpectrogramRef} />
//         <audio ref={playerRef} id="playCall">
//           <source id="audioCall" src={url} type="audio/mpeg" />
//         </audio>
//         <button
//           className="btnSave "
//           onClick={() => playAudio(run === true ? setRun(false) : setRun(true))}
//           type="button"
//         >
//           {Play === "Play" ? (
//             <FontAwesomeIcon
//               className=""
//               icon={["fas", "play-circle"]}
//               color="#04c45c"
//               size="2x"
//             ></FontAwesomeIcon>
//           ) : (
//             <FontAwesomeIcon
//               className=""
//               icon={["fas", "pause-circle"]}
//               color="#04c45c"
//               size="2x"
//             ></FontAwesomeIcon>
//           )}
//         </button>
//         <button
//           className="btnSave "
//           onClick={() => restartAudio()}
//           type="button"
//         >
//           <FontAwesomeIcon
//             className=""
//             icon={["fas", "undo"]}
//             color="#04c45c"
//             size="2x"
//           ></FontAwesomeIcon>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Spectrogram;
