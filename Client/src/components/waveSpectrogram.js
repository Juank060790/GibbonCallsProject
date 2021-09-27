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
  const [labelForNewCall, setLableForNewCall] = useState("");
  const [labelColor, setLabelColor] = useState("");
  const [duration, setDuration] = useState(null);
  const [Play, setPlay] = useState("Play");
  const canvasWidth = useSelector((state) => state.spectrogram.canvasWidth);
  const [run, setRun] = useState(true);
  const playerRef = useRef(null);
  const dispatch = useDispatch();

  const audioCurrentTime = useSelector(
    (state) => state.spectrogram.audioCurrentTime
  );

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

  // Save regions to data base

  const saveRegionsDataBase = (selections, audioId) => {
    if (selections) {
      selections?.forEach((region) => {
        if (region.dataBase === undefined) {
          region.color = {
            r: region.color.r ? region.color.r : 255,
            g: region.color.g ? region.color.g : 0,
            b: region.color.b ? region.color.b : 0,
          };
          let singleCall = region;

          dispatch(callActions.saveRegionCall(singleCall, audioId));
          dispatch(callActions.getSingleCall(singleCall.id));
        }
      });
    }
  };

  // Clear all the regions from the waveform
  const clearRegions = (callId) => {
    dispatch(spectrogramActions.clearSingleSelection(callId));
  };

  const onLoadedMetadata = () => {
    if (playerRef.current) {
      setDuration(playerRef.current.duration);
    }
  };

  const actions = {
    NONE: "NONE",
    DRAG_NEW_SELECTION: "DRAG_NEW_SELECTION",
    DRAG_HIGHLIGHT_SELECTION: "DRAG_HIGHLIGHT_SELECTION",
    DRAG_HIGHLIGHT_SELECTION_START: "DRAG_HIGHLIGHT_SELECTION_START",
    DRAG_HIGHLIGHT_SELECTION_END: "DRAG_HIGHLIGHT_SELECTION_END",
  };

  const playButton = () => {
    if (run === true) {
      setRun(false);
    } else {
      setRun(true);
    }
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
    dispatch(spectrogramActions.updateAudioTime(0));
    playerRef.current.currentTime = audioCurrentTime;
  };

  // Load the spectrogram audio
  useEffect(() => {
    if (!loadingAudio) {
      playerRef.current.src = selectedAudio?.audio;
    } else {
      console.log("Loading audio");
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
              ref.current.getBoundingClientRect().width / 300 / 10 // Converting time to pixel, one second in pixels
          )
        );
      }
    }, 100);

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
      canvas.height = 205;
      let ctx = canvas.getContext("2d");

      const handleMouseDown = (e) => {
        // console.log("e :>> ", e);
        e.preventDefault();
        let eX = (e.clientX - canvasBBox.x) / (canvasWidth / 300);
        if (selections.length > 0) {
          for (let i = 0; i < selections.length; i++) {
            let sel = selections[i];
            if (action === actions.NONE) {
            }
            if (sel.start < eX && eX < sel.end) {
              // console.log("sel :>> ", sel);
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
          if (newSelection.start + 5 / (canvasWidth / 300) > newSelection.end) {
            newSelection.start = 0;
            newSelection.end = 0;
          }

          dispatch(spectrogramActions.handleMouseUp(newSelection));

          setmousedownPos(0);
          setAction(actions.NONE);
          // dispatch(spectrogramActions.highlightSelection(-1));
        }
        if (highlightedSelection) {
          dispatch(
            spectrogramActions.updatePlayTracker(
              highlightedSelection.start * (canvasWidth / 300)
            )
          );
          playerRef.current.currentTime = highlightedSelection.start;

          // Updates the selection in the database
          dispatch(
            spectrogramActions.updateSelectionTime(
              highlightedSelection.start,
              highlightedSelection.end,
              highlightedSelection.id
            )
          );
        }
      };

      // Mouse Down Event
      const handleMouseMove = (e) => {
        e.preventDefault();
        let eX = (e.clientX - canvasBBox.x) / (canvasWidth / 300);
        let overlapping = false;
        let overlappingX = 0;

        if (mousedown) {
          // Moving a highlghted selection
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
            // Handling collision with boundary
            if (
              eX - mousedownPos <= 0 ||
              highlightedSelection.end -
                highlightedSelection.start +
                eX -
                mousedownPos >=
                300
            ) {
              return;
            } else {
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
                // console.log("Left");
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
            selection.start * (canvasWidth / 300), // x
            0, // y
            (selection.end - selection.start) * (canvasWidth / 300), // width
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
          if (selection.isCorrect === true) {
            drawSelection(selection);
          }
        });

        // Play Tracker
        drawPlayTracker(ctx);

        // Draw the time line
        const drawTimeLines = () => {
          for (let i = 0; i < 30; i++) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "white";

            ctx.beginPath();
            ctx.rect(
              i * (canvasWidth / 30), // x
              canvas.height - 5, // y
              0, // width
              5 // height
            );
            ctx.stroke();
            ctx.closePath();

            ctx.stroke();

            let seconds = i * 10;

            if (seconds % 30 === 0 && seconds !== 0) {
              ctx.fillStyle = "white";
              ctx.font = "12px Arial";
              ctx.textAlign = "center";

              let text;
              if (seconds % 60 === 0) {
                text = `${Math.floor(seconds / 60)}:00`;
              } else {
                text = `${Math.floor(seconds / 60)}:30`;
              }

              ctx.fillText(text, i * (canvasWidth / 30), canvas.height - 10);
            }
          }
        };

        drawTimeLines();

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
                      onClick={() => playButton()}
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
              clearRegions={clearRegions}
              selectedAudio={selectedAudio}
              labelForNewCall={labelForNewCall}
              labelNewCall={labelNewCall}
              labelColor={labelColor}
              saveCommentNewCall={saveCommentNewCall}
              saveRegionsDataBase={saveRegionsDataBase}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
