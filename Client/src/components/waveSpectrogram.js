import React, { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import ImageTest from "../images/Spectogram2.png";
import miniImage from "../images/miniImage.png";
import testAudio from "../images/testAudio.WAV";
import { callActions } from "../redux/actions";
import { spectrogramActions } from "../redux/actions";
import TableNewCalls from "./TableNewCalls";
import "../Styles/Styles.scss";
import { SAVE_SELECTION } from "../redux/constants/spectrogram.constants";

// export default function Waveform() {
//   const selectedAudio = useSelector((state) => state.audio.selectedAudio);
//   const regionListRedux = useSelector((state) => state.call.call);
//   console.log(`regionListRedux`, regionListRedux);
//   // const CallsList = useSelector((state) => state.audio.callsList);
//   const [labelForNewCall, setLableForNewCall] = useState("");
//   // const [regionsInWave, setRegionsInWave] = useState(10);
//   const [regionsArray, setRegionsArray] = useState([]);
//   const [labelColor, setLabelColor] = useState("");
//   const regionColor = randomColor(0.1);
//   const [Play, setPlay] = useState("Play");
//   const [run, setRun] = useState(true);
//   const SpectrogramRef = useRef(null);
//   const playerRef = useRef(null);
//   const dispatch = useDispatch();
//   let context = null;
//   let canvas = null;
//   let posX = 0;

//   // Save the region to be show in the waveform, after needs to be saved to the database.

//   function saveCreatedRegions(region) {
//     var d = Date.now();
//     let singleRegion = {
//       callId: d.toString(),
//       SpectrogramAudio: "",
//       start: region.start,
//       end: region.end,
//       spectrogram: miniImage,
//       isCorrect: true,
//       isDeleted: false,
//       color: region.color,
//       comment: "",
//       label: "Female",
//     };
//     // Update teh state with the single call selected in the spectrogram
//     setRegionsArray((regionsArray) => [...regionsArray, singleRegion]);
//   }

//   // Set Label from new call in the new table

//   const labelNewCall = (tag, id) => {
//     console.log(`regionsArray`, regionsArray);
//     let regionId = regionsArray.findIndex(
//       (regionsArray) => regionsArray.callId === id
//     );
//     console.log(`tag`, regionId);

//     if (tag === "Male") {
//       regionsArray[regionId].label = "Male";
//       setLabelColor("rgba(192, 212, 255, 0.278)");
//       setLableForNewCall("Male");
//     }
//     if (tag === "Female") {
//       regionsArray[regionId].label = "Female";
//       setLabelColor("rgba(255, 192, 245, 0.278)");
//       setLableForNewCall("Female");
//     }
//     if (tag === "Other") {
//       regionsArray[regionId].label = "Other";
//       setLabelColor("#6fcf978e");
//       setLableForNewCall("Other");
//     }
//   };

//   // Save comments into the region

//   const saveCommentNewCall = (event, regionId) => {
//     let region = regionsArray.findIndex(
//       (regionsArray) => regionsArray.callId === regionId
//     );
//     if (event.target.value) {
//       regionsArray[region].comment = event.target.value;
//     }
//   };

//   // Save regions to data base, label to the save region is added here and add + count to the Raw audio.

//   const saveRegionsDataBase = (regionsArray, audioId) => {
//     if (regionsArray) {
//       const addCallCount =
//         regionListRedux?.filter((x) => x.isCorrect === true).length + 1;
//       regionsArray?.forEach((region) => {
//         let singleCall = region;
//         dispatch(callActions.saveRegionCall(singleCall, audioId, addCallCount));
//         dispatch(callActions.getSingleCall(singleCall.callId));
//         setRegionsArray([]);
//       });
//     } else {
//       console.log("Nothing to send");
//     }
//   };

//   // Delete region in the waveform
//   // const deleteRegion = (region) => {
//   //   region.remove();
//   //   setRegionsArray([]);
//   // };

//   // Clear all the regions from the waveform
//   const clearRegions = () => {
//     setRegionsArray([]);
//   };

//   // const url = testAudio;
//   const url = selectedAudio?.audioLink;
//   // selectedAudio?.audioLink;
//   // "https://firebasestorage.googleapis.com/v0/b/coderschool-project-gibbon.appspot.com/o/calls%2F19700101_013658.WAV?alt=media&token=86c99103-0f75-4adb-a20b-be1e82b2020a";

// Load regions into the waveform
// function loadRegions(canvas, ctx, regionListRedux) {
//   console.log(`regionListRedux`, regionListRedux);
//   if (!ctx || !canvas || !regionListRedux) {
//     console.log("ctx and canvas not found");
//     return;
//   } else {
//     regionListRedux.forEach((region) => {
//       console.log(`ctx`, region);
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.rect(
//         region.start * canvas.width * 60,
//         0,
//         region.end * canvas.width * 60 - region.start * canvas.width * 60,
//         canvas.height
//       );
//       ctx.stroke();
//       ctx.fillStyle = region.color;
//       ctx.fill();
//       ctx.closePath();
//     });
//   }
//   // console.log("Draw region");

//   // regionListRedux.forEach(function (region) {
//   //   setRegionsInWave(regionListRedux.length);
//   //   if (region.isCorrect === true) {
//   //     Waveform.current.addRegion(region);
//   //   } else {
//   //     console.log("Region Not correct");
//   //   }
//   // });
// }

//   /**
//    * Random RGBA color.
//    */
//   function randomColor(alpha) {
//     return (
//       "rgba(" +
//       [
//         ~~(Math.random() * 255),
//         ~~(Math.random() * 255),
//         ~~(Math.random() * 255),
//         alpha || 1,
//       ] +
//       ")"
//     );
//   }

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
//       ctx.fillStyle = regionColor;
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
//       let newRegion = {
//         start: newSelection.start / (canvas.width / 60),
//         end: newSelection.end / (canvas.width / 60),
//         id: Date.now(),
//         color: regionColor,
//       };

//       saveCreatedRegions(newRegion);
//     });

//     canvas.addEventListener("mousemove", (e) => {
//       e.preventDefault();
//       if (mousedown === true) {
//         newSelection = { ...newSelection, end: e.offsetX };
//       }
//     });
//   };

//   function DrawPlayTracker(ctx, canvas) {
//     let v = window.innerWidth / 60 / 60;
//     ctx.linearWith = 50;
//     ctx.strokeStyle = "rgba(255, 165, 0, .9)";
//     ctx.beginPath();
//     ctx.rect(
//       posX, // x
//       0, // y
//       0, // width
//       canvas.height // height
//     );
//     ctx.clearRect(0, 0, posX, canvas.height);
//     ctx.stroke();
//     ctx.moveTo((posX += v), 0);
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
//     DrawInCanvas(canvas, context);
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
//       if (run === false) {
//         loadRegions(canvas, context, regionListRedux);
//         DrawPlayTracker(context, canvas);
//       }
//       window.cancelAnimationFrame(animationFrameId);
//       animationFrameId = window.requestAnimationFrame(render);
//     };
//     render();

//     return () => {
//       window.cancelAnimationFrame(animationFrameId);
//     };
//     // eslint-disable-next-line
//   }, [run]);

//   return (
//     <div>
//       <div className="row"> </div>
//       <div>
//         <div>
//           <div>
//             <div className="m-2">
//               <div>
//                 <div className="Spectrogram-container">
//                   <canvas width="100%" ref={SpectrogramRef} />
//                   <audio ref={playerRef} id="playCall">
//                     <source id="audioCall" src={url} type="audio/mpeg" />
//                   </audio>
//                   <button
//                     className="btnSave "
//                     onClick={() =>
//                       playAudio(run === true ? setRun(false) : setRun(true))
//                     }
//                     type="button"
//                   >
//                     {Play === "Play" ? (
//                       <FontAwesomeIcon
//                         className=""
//                         icon={["fas", "play-circle"]}
//                         color="#04c45c"
//                         size="2x"
//                       ></FontAwesomeIcon>
//                     ) : (
//                       <FontAwesomeIcon
//                         className=""
//                         icon={["fas", "pause-circle"]}
//                         color="#04c45c"
//                         size="2x"
//                       ></FontAwesomeIcon>
//                     )}
//                   </button>
//                   <button
//                     className="btnSave "
//                     onClick={() => restartAudio()}
//                     type="button"
//                   >
//                     <FontAwesomeIcon
//                       className=""
//                       icon={["fas", "undo"]}
//                       color="#04c45c"
//                       size="2x"
//                     ></FontAwesomeIcon>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <TableNewCalls
//               loadRegions={loadRegions}
//               clearRegions={clearRegions}
//               selectedAudio={selectedAudio}
//               labelForNewCall={labelForNewCall}
//               labelNewCall={labelNewCall}
//               regionsArray={regionsArray}
//               labelColor={labelColor}
//               saveCommentNewCall={saveCommentNewCall}
//               saveRegionsDataBase={saveRegionsDataBase}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function Waveform() {
  const ref = useRef();

  const mousedown = useSelector((state) => state.spectrogram.mousedown);
  const selections = useSelector((state) => state.spectrogram.selections);
  const newSelection = useSelector((state) => state.spectrogram.newSelection);
  const playtrackerPos = useSelector(
    (state) => state.spectrogram.playtrackerPos
  );
  const play = useSelector((state) => state.spectrogram.play);
  const highlightedSelection = useSelector((state) =>
    state.spectrogram.selections.find((selection) => selection.highlighted)
  );

  const [mousedownPos, setmousedownPos] = useState(0); // Tracking the initial pos of mousedown event with relation to highlighted selection
  const [action, setAction] = useState("NONE");

  const dispatch = useDispatch();

  const actions = {
    NONE: "NONE",
    DRAG_NEW_SELECTION: "DRAG_NEW_SELECTION",
    DRAG_HIGHLIGHT_SELECTION: "DRAG_HIGHLIGHT_SELECTION",
    DRAG_HIGHLIGHT_SELECTION_START: "DRAG_HIGHLIGHT_SELECTION_START",
    DRAG_HIGHLIGHT_SELECTION_END: "DRAG_HIGHLIGHT_SELECTION_END",
  };

  // Play Audio Button
  const playButton = () => {
    if (!play) {
      dispatch(spectrogramActions.playAudio());
    } else {
      dispatch(spectrogramActions.stopAudio());
    }
  };

  // Restart Audio Button
  const restartButton = () => {
    dispatch(spectrogramActions.stopAudio());
    dispatch(spectrogramActions.updatePlayTracker(0));
  };

  useEffect(() => {
    // Run Audio
    const interval = setInterval(() => {
      if (play) {
        dispatch(
          spectrogramActions.updatePlayTracker(
            playtrackerPos +
              ref.current.getBoundingClientRect().width / 60 / 5 / 100 // Converting time to pixel
          )
        );
      }
    }, 10);

    return () => clearInterval(interval);
  }, [play, playtrackerPos]);

  useEffect(() => {
    // requestId
    let requestId;

    // // Setup canvas
    let canvas = ref.current;
    const canvasBBox = canvas.getBoundingClientRect(); // Canvas Margin to Modal
    canvas.style.width = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    let ctx = canvas.getContext("2d");

    const handleMouseDown = (e) => {
      e.preventDefault();
      let eX = e.clientX - canvasBBox.x;
      if (selections.length > 0) {
        for (let i = 0; i < selections.length; i++) {
          let sel = selections[i];
          if (action == actions.NONE) {
          }
          if (sel.start < eX && eX < sel.end) {
            dispatch(spectrogramActions.highlightSelection(sel.id));
            if (mousedownPos === 0) {
              setmousedownPos(eX - sel.start);
            }

            if (eX <= sel.start + 5) {
              setAction(actions.DRAG_HIGHLIGHT_SELECTION_START);
            } else if (eX >= sel.end - 5) {
              setAction(actions.DRAG_HIGHLIGHT_SELECTION_END);
            } else {
              setAction(actions.DRAG_HIGHLIGHT_SELECTION);
            }
            return;
          } else {
            dispatch(spectrogramActions.highlightSelection(-1));
          }
        }
      }
      if (action == actions.NONE) {
        dispatch(spectrogramActions.createSelection(eX, eX));
        setAction(actions.DRAG_NEW_SELECTION);
      }
    };

    // Mouse Up Event
    const handleMouseUp = (e) => {
      e.preventDefault();
      if (mousedown) {
        if (newSelection.start + 5 > newSelection.end) {
          newSelection.start = 0;
          newSelection.end = 0;
        }
        dispatch(spectrogramActions.handleMouseUp(newSelection));

        setmousedownPos(0);
        setAction(actions.NONE);
        // dispatch(spectrogramActions.highlightSelection(-1));
      }
    };

    // Mouse Down Event
    const handleMouseMove = (e) => {
      e.preventDefault();
      let eX = e.clientX - canvasBBox.x;
      let overlapping = false;
      let overlappingX = 0;
      if (mousedown) {
        // Moving a highlghted selection
        console.log(highlightedSelection);
        console.log(eX);
        console.log(mousedownPos);
        if (action == actions.DRAG_HIGHLIGHT_SELECTION_START) {
          // Expand start of highlighted selection
          dispatch(
            spectrogramActions.updateHighlightedSelection(
              eX - mousedownPos,
              highlightedSelection.end
            )
          );
        } else if (action == actions.DRAG_HIGHLIGHT_SELECTION_END) {
          // Expand end of highlighted selection
          dispatch(
            spectrogramActions.updateHighlightedSelection(
              highlightedSelection.start,
              eX
            )
          );
        } else if (action == actions.DRAG_HIGHLIGHT_SELECTION) {
          // Move selection
          dispatch(
            spectrogramActions.updateHighlightedSelection(
              eX - mousedownPos,
              highlightedSelection.end -
                highlightedSelection.start +
                eX -
                mousedownPos
            )
          );
        }

        // Handling overlapping between highlight selection with other selections
        if (
          [
            actions.DRAG_HIGHLIGHT_SELECTION,
            actions.DRAG_HIGHLIGHT_SELECTION_START,
            actions.DRAG_HIGHLIGHT_SELECTION_END,
          ].includes(action) &&
          selections.length > 0
        ) {
          for (let i = 0; i < selections.length; i++) {
            let sel = selections[i];

            if (
              // Left overlapping
              highlightedSelection.start <= sel.end &&
              highlightedSelection.start > sel.start
            ) {
              console.log("Left");
              dispatch(
                spectrogramActions.updateHighlightedSelection(
                  sel.end,

                  action == actions.DRAG_HIGHLIGHT_SELECTION
                    ? highlightedSelection.end -
                        highlightedSelection.start +
                        sel.end
                    : highlightedSelection.end
                )
              );
              return;
            }

            if (
              // Right overlapping & Complete overlapping
              (highlightedSelection.end >= sel.start &&
                highlightedSelection.end < sel.end) ||
              (highlightedSelection.start < sel.start &&
                highlightedSelection.end > sel.end)
            ) {
              dispatch(
                spectrogramActions.updateHighlightedSelection(
                  action == actions.DRAG_HIGHLIGHT_SELECTION
                    ? sel.start -
                        (highlightedSelection.end - highlightedSelection.start)
                    : highlightedSelection.start,
                  sel.start
                )
              );
              return;
            }
          }
        }

        if (mousedownPos !== 0) {
          return; // Handle an issue when the mouse moves too fast while dragging highlighted selection
        }

        if (action == actions.DRAG_NEW_SELECTION) {
          // Dragging new selection
          if (selections.length > 0) {
            for (let i = 0; i < selections.length; i++) {
              let sel = selections[i];

              if (newSelection.start < sel.start && eX > sel.start) {
                overlapping = true;
                overlappingX = sel.start;
                break;
              } else {
                overlapping = false;
              }
            }
          } else {
            overlapping = false;
          }

          // Handle overlapping between selections
          if (!overlapping) {
            dispatch(
              spectrogramActions.handleMouseMove(newSelection.start, eX)
            );
          } else {
            dispatch(
              spectrogramActions.handleMouseMove(
                newSelection.start,
                overlappingX
              )
            );
          }
        }
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    // Load image
    let image = new Image();
    image.src = ImageTest;
    image.height = canvas.height;

    const drawSelection = (selection) => {
      if (selection.start < selection.end) {
        ctx.lineWidth = selection.highlighted ? 3 : 1; // Stroke Width
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(
          selection.start, // x
          0, // y
          selection.end - selection.start, // width
          canvas.height // height
        );
        ctx.stroke();
        ctx.fillStyle = selection.highlighted
          ? `rgba(${selection.color.r},${selection.color.g},${selection.color.b}, 0.5)`
          : `rgba(${selection.color.r},${selection.color.g},${selection.color.b}, 0.2)`;
        ctx.fill();
        ctx.closePath();
      }
    };

    const drawPlayTracker = () => {
      ctx.lineWidth = 5;
      ctx.strokeStyle = "orange";
      ctx.beginPath();
      ctx.rect(
        playtrackerPos, // x
        0, // y
        0, // width
        canvas.height // height
      );
      ctx.stroke();
      ctx.closePath();
    };

    let render = () => {
      // Background Image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // New Selection
      if (mousedown) {
        drawSelection(newSelection);
      }

      // Existing Selections
      selections.forEach((selection) => {
        drawSelection(selection);
      });

      // Play Tracker
      drawPlayTracker(ctx);

      requestId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(requestId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  });

  return (
    <div>
      <div className="row"> </div>
      <div>
        <div>
          <div>
            <div className="m-2">
              <div>
                <div className="Spectrogram-container">
                  <canvas width="100%" ref={ref} />
                  {/* <audio ref={ref} id="playCall">
                    <source id="audioCall" src={url} type="audio/mpeg" />
                  </audio> */}
                  <button
                    className="btnSave "
                    onClick={playButton}
                    type="button"
                  >
                    {!play ? (
                      <FontAwesomeIcon
                        className=""
                        icon={["fas", "play-circle"]}
                        color="#04c45c"
                        size="2x"
                      ></FontAwesomeIcon>
                    ) : (
                      <FontAwesomeIcon
                        className=""
                        icon={["fas", "pause-circle"]}
                        color="#04c45c"
                        size="2x"
                      ></FontAwesomeIcon>
                    )}
                  </button>
                  <button
                    className="btnSave "
                    onClick={() => restartButton()}
                    type="button"
                  >
                    <FontAwesomeIcon
                      className=""
                      icon={["fas", "undo"]}
                      color="#04c45c"
                      size="2x"
                    ></FontAwesomeIcon>
                  </button>
                </div>
              </div>
            </div>

            <TableNewCalls
            // loadRegions={loadRegions}
            // clearRegions={clearRegions}
            // selectedAudio={selectedAudio}
            // labelForNewCall={labelForNewCall}
            // labelNewCall={labelNewCall}
            // regionsArray={regionsArray}
            // labelColor={labelColor}
            // saveCommentNewCall={saveCommentNewCall}
            // saveRegionsDataBase={saveRegionsDataBase}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
