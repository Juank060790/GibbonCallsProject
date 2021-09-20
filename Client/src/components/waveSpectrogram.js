import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { callActions } from "../redux/actions";
import TableNewCalls from "./TableNewCalls";
import { spectrogramActions } from "../redux/actions";

import "../Styles/Styles.scss";

export default function Waveform() {
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const loadingAudio = useSelector((state) => state.audio.loadingAudio);
  const loading = useSelector((state) => state.audio.loading);

  // const regionListRedux = useSelector((state) => state.call.call);
  const [labelForNewCall, setLableForNewCall] = useState("");
  const [labelColor, setLabelColor] = useState("");
  const [duration, setDuration] = useState(null);
  const [Play, setPlay] = useState("Play");
  const [canvasWidth, setCanvasWidth] = useState();
  // const regionColor = randomColor(0.1);
  const [run, setRun] = useState(true);
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const calls = useSelector((state) => state.call.call);

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

  // Save the region to be show in the waveform, after needs to be saved to the database.

  // function saveCreatedRegions(region) {
  //   var d = Date.now();
  //   let singleRegion = {
  //     callId: d.toString(),
  //     SpectrogramAudio: "",
  //     start: region.start,
  //     end: region.end,
  //     spectrogram: "",
  //     isCorrect: true,
  //     isDeleted: false,
  //     color: region.color,
  //     comment: "",
  //     label: "Female",
  //   };
  //   // Update teh state with the single call selected in the spectrogram

  //   console.log(`regionsArray`, regionsArray);
  //   setRegionsArray((regionsArray) => [...regionsArray, singleRegion]);
  // }

  // Set Label from new call in the new table

  const labelNewCall = (tag, id) => {
    let regionId = selections.findIndex((selections) => selections.id === id);

    if (tag === "Male") {
      selections[regionId].label = "Male";
      setLabelColor("rgba(192, 212, 255, 0.278)");
      setLableForNewCall("Male");
    }
    if (tag === "Female") {
      selections[regionId].label = "Female";
      setLabelColor("rgba(255, 192, 245, 0.278)");
      setLableForNewCall("Female");
    }
    if (tag === "Other") {
      selections[regionId].label = "Other";
      setLabelColor("#6fcf978e");
      setLableForNewCall("Other");
    }
  };

  // Save comments into the region
  const saveCommentNewCall = (event, regionId) => {
    let region = selections.findIndex(
      (selections) => selections.id === regionId
    );
    if (event.target.value) {
      selections[region].comment = event.target.value;
    }
  };

  // Save regions to data base, label to the save region is added here and add + count to the Raw audio.
  const saveRegionsDataBase = (selections, audioId) => {
    if (selections) {
      // const addCallCount =
      //   regionListRedux?.filter((x) => x.isCorrect === true).length + 1;
      selections?.forEach((region) => {
        // region.start = region.start / (1723 / 300) / 60;
        // region.end = region.end / (1723 / 300) / 60;
        let singleCall = region;
        console.log("singleCall :>> ", singleCall);

        dispatch(callActions.saveRegionCall(singleCall, audioId));
        dispatch(callActions.getSingleCall(singleCall.id));
        dispatch(spectrogramActions.clearSelection());
      });
    }
  };

  // Clear all the regions from the waveform
  const clearRegions = () => {
    dispatch(spectrogramActions.clearSelection());
  };

  const onLoadedMetadata = () => {
    if (playerRef.current) {
      setDuration(playerRef.current.duration);
    }
  };
  // selectedAudio?.audioLink;
  // "https://firebasestorage.googleapis.com/v0/b/coderschool-project-gibbon.appspot.com/o/calls%2F19700101_013658.WAV?alt=media&token=86c99103-0f75-4adb-a20b-be1e82b2020a";

  // Load regions into the waveform
  // function loadRegions(canvas, ctx, regionListRedux) {
  //   if (!ctx || !canvas || !regionListRedux) {
  //     console.log("ctx and canvas not found");
  //     return;
  //   } else {
  //     regionListRedux.forEach(function (region) {
  //       if (region.isCorrect === true) {
  //         console.log(`region`, region);
  //         ctx.lineWidth = 1;
  //         ctx.beginPath();
  //         ctx.rect(
  //           (canvas.width / duration) * region.start,
  //           0,
  //           (canvas.width / duration) * region.start -
  //             (canvas.width / duration) * region.end,
  //           canvas.height
  //         );
  //         ctx.stroke();
  //         ctx.fillStyle = region.color;
  //         ctx.fill();
  //         ctx.closePath();
  //       } else {
  //         console.log("Region Not correct");
  //       }
  //     });
  //   }
  // }

  // /**
  //  * Random RGBA color.
  //  */
  // function randomColor(alpha) {
  //   return (
  //     "rgba(" +
  //     [
  //       ~~(Math.random() * 255),
  //       ~~(Math.random() * 255),
  //       ~~(Math.random() * 255),
  //       alpha || 1,
  //     ] +
  //     ")"
  //   );
  // }

  const actions = {
    NONE: "NONE",
    DRAG_NEW_SELECTION: "DRAG_NEW_SELECTION",
    DRAG_HIGHLIGHT_SELECTION: "DRAG_HIGHLIGHT_SELECTION",
    DRAG_HIGHLIGHT_SELECTION_START: "DRAG_HIGHLIGHT_SELECTION_START",
    DRAG_HIGHLIGHT_SELECTION_END: "DRAG_HIGHLIGHT_SELECTION_END",
  };

  // Play Audio Button
  // useCallback hook with a play audio function
  // const playAudio = useCallback(() => {
  //   if (run === true) {
  //     playerRef.current.play();
  //     setPlay("Pause");
  //   } else {
  //     console.log(`run`, run);
  //     playerRef.current.pause();
  //     setPlay("Play");
  //   }
  // }, [setPlay, run]);

  const playButton = () => {
    if (!play) {
      dispatch(spectrogramActions.playAudio());
      playerRef.current.play();
      setPlay("Pause");
    } else {
      dispatch(spectrogramActions.stopAudio());
      playerRef.current.pause();
      setPlay("Play");
    }
  };

  const restartAudio = () => {
    dispatch(spectrogramActions.stopAudio());
    dispatch(spectrogramActions.updatePlayTracker(0));
  };

  // Load the spectrogram audio
  useEffect(() => {
    if (!loadingAudio) {
      playerRef.current.src = selectedAudio?.audio;
    } else {
      // console.log("Loading audio");
    }
  }, [loadingAudio, selectedAudio]);

  // Waveform render

  useEffect(() => {
    // Load canvas width to use in tables
    dispatch(
      spectrogramActions.updateCanvasWidth(
        ref.current.getBoundingClientRect().width
      )
    );
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
  }, [play, playtrackerPos, dispatch]);

  useEffect(() => {
    if (!loading) {
      // requestId
      let requestId;

      // Setup canvas
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
            if (action === actions.NONE) {
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
        if (action === actions.NONE) {
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
          if (action === actions.DRAG_HIGHLIGHT_SELECTION_START) {
            // Expand start of highlighted selection
            dispatch(
              spectrogramActions.updateHighlightedSelection(
                eX - mousedownPos,
                highlightedSelection.end
              )
            );
          } else if (action === actions.DRAG_HIGHLIGHT_SELECTION_END) {
            // Expand end of highlighted selection
            dispatch(
              spectrogramActions.updateHighlightedSelection(
                highlightedSelection.start,
                eX
              )
            );
          } else if (action === actions.DRAG_HIGHLIGHT_SELECTION) {
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

                    action === actions.DRAG_HIGHLIGHT_SELECTION
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
                    action === actions.DRAG_HIGHLIGHT_SELECTION
                      ? sel.start -
                          (highlightedSelection.end -
                            highlightedSelection.start)
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

          if (action === actions.DRAG_NEW_SELECTION) {
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
      image.src = selectedAudio.imageUrl;
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
        ctx.lineWidth = 4;
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
        if (selectedAudio.imageUrl) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }

        // New Selection
        if (mousedown) {
          drawSelection(newSelection);
        }

        // Existing Selections
        selections.forEach((selection) => {
          drawSelection(selection);
        });

        // Draw existing selections  [To do...]
        if (calls) {
          calls.forEach((call) => {
            if (call.isCorrect === true) {
              drawSelection(call);
            }
          });
        }

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
    }
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
                  {loadingAudio === true ? (
                    <div>Loading!</div>
                  ) : (
                    <audio
                      ref={playerRef}
                      id="playCall"
                      onLoadedMetadata={onLoadedMetadata}
                    >
                      <source id="audioCall" type="audio/mpeg" />
                    </audio>
                  )}
                  <div className="controls-container">
                    <div
                      className="controls"
                      onClick={() =>
                        playButton(run === true ? setRun(false) : setRun(true))
                      }
                      type="button"
                    >
                      {Play === "Play" ? (
                        <FontAwesomeIcon
                          className="controls-icon"
                          icon={["fas", "play-circle"]}
                          color="#04c45c"
                        ></FontAwesomeIcon>
                      ) : (
                        <FontAwesomeIcon
                          className="controls-icon"
                          icon={["fas", "stop"]}
                          color="#04c45c"
                        ></FontAwesomeIcon>
                      )}
                    </div>
                    <div
                      className="controls "
                      onClick={() => restartAudio()}
                      type="button"
                    >
                      <FontAwesomeIcon
                        className="controls-icon"
                        icon={["fas", "undo"]}
                        color="#04c45c"
                        size="2x"
                      ></FontAwesomeIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TableNewCalls
              // loadRegions={loadRegions}
              clearRegions={clearRegions}
              selectedAudio={selectedAudio}
              labelForNewCall={labelForNewCall}
              labelNewCall={labelNewCall}
              labelColor={labelColor}
              saveCommentNewCall={saveCommentNewCall}
              saveRegionsDataBase={saveRegionsDataBase}
              canvasWidth={canvasWidth}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
