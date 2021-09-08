import React, { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { callActions } from "../redux/actions";
import TableNewCalls from "./TableNewCalls";
// import testAudio from "../images/testAudio.WAV";
import "../Styles/Styles.scss";

export default function Waveform() {
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const loadingAudio = useSelector((state) => state.audio.loadingAudio);
  const regionListRedux = useSelector((state) => state.call.call);
  const loading = useSelector((state) => state.audio.loading);
  const [labelForNewCall, setLableForNewCall] = useState("");
  const [regionsArray, setRegionsArray] = useState([]);
  const [labelColor, setLabelColor] = useState("");
  const [duration, setDuration] = useState(null);
  const [Play, setPlay] = useState("Play");
  const regionColor = randomColor(0.1);
  const [run, setRun] = useState(true);
  const SpectrogramRef = useRef(null);
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  let context = null;
  let canvas = null;
  let posX = 0;

  // Save the region to be show in the waveform, after needs to be saved to the database.

  function saveCreatedRegions(region) {
    var d = Date.now();
    let singleRegion = {
      callId: d.toString(),
      SpectrogramAudio: "",
      start: region.start,
      end: region.end,
      spectrogram: "",
      isCorrect: true,
      isDeleted: false,
      color: region.color,
      comment: "",
      label: "Female",
    };
    // Update teh state with the single call selected in the spectrogram

    console.log(`regionsArray`, regionsArray);
    setRegionsArray((regionsArray) => [...regionsArray, singleRegion]);
  }

  // Set Label from new call in the new table

  const labelNewCall = (tag, id) => {
    let regionId = regionsArray.findIndex(
      (regionsArray) => regionsArray.callId === id
    );

    if (tag === "Male") {
      regionsArray[regionId].label = "Male";
      setLabelColor("rgba(192, 212, 255, 0.278)");
      setLableForNewCall("Male");
    }
    if (tag === "Female") {
      regionsArray[regionId].label = "Female";
      setLabelColor("rgba(255, 192, 245, 0.278)");
      setLableForNewCall("Female");
    }
    if (tag === "Other") {
      regionsArray[regionId].label = "Other";
      setLabelColor("#6fcf978e");
      setLableForNewCall("Other");
    }
  };

  // Save comments into the region
  const saveCommentNewCall = (event, regionId) => {
    let region = regionsArray.findIndex(
      (regionsArray) => regionsArray.callId === regionId
    );
    if (event.target.value) {
      regionsArray[region].comment = event.target.value;
    }
  };

  // Save regions to data base, label to the save region is added here and add + count to the Raw audio.
  const saveRegionsDataBase = (regionsArray, audioId) => {
    if (regionsArray) {
      const addCallCount =
        regionListRedux?.filter((x) => x.isCorrect === true).length + 1;
      regionsArray?.forEach((region) => {
        let singleCall = region;
        dispatch(callActions.saveRegionCall(singleCall, audioId, addCallCount));
        dispatch(callActions.getSingleCall(singleCall.callId));
        setRegionsArray([]);
      });
    } else {
      console.log("Nothing to send");
    }
  };

  // Clear all the regions from the waveform
  const clearRegions = () => {
    setRegionsArray([]);
  };

  // Get Audio from the database
  // const getAudio = (audio) => {
  //   const audioUrl = selectedAudio?.audioLink; // spectrograms/20200926_033000.png
  //   if (audioUrl) {
  //     var storageRef = storage.ref();
  //     storageRef
  //       .child(`/${audioUrl}`)
  //       .getDownloadURL()
  //       .then(function (audioUrl) {
  //         setAudioUrl(audioUrl);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }
  // };

  const onLoadedMetadata = () => {
    // if (playerRef.current) {
    //   setDuration(playerRef.current.duration);
    // }
  };
  // selectedAudio?.audioLink;
  // "https://firebasestorage.googleapis.com/v0/b/coderschool-project-gibbon.appspot.com/o/calls%2F19700101_013658.WAV?alt=media&token=86c99103-0f75-4adb-a20b-be1e82b2020a";

  // Load regions into the waveform
  function loadRegions(canvas, ctx, regionListRedux) {
    if (!ctx || !canvas || !regionListRedux) {
      console.log("ctx and canvas not found");
      return;
    } else {
      regionListRedux.forEach(function (region) {
        if (region.isCorrect === true) {
          console.log(`region`, region);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(
            (canvas.width / duration) * region.start,
            0,
            (canvas.width / duration) * region.start -
              (canvas.width / duration) * region.end,
            canvas.height
          );
          ctx.stroke();
          ctx.fillStyle = region.color;
          ctx.fill();
          ctx.closePath();
        } else {
          console.log("Region Not correct");
        }
      });
    }
  }

  /**
   * Random RGBA color.
   */
  function randomColor(alpha) {
    return (
      "rgba(" +
      [
        ~~(Math.random() * 255),
        ~~(Math.random() * 255),
        ~~(Math.random() * 255),
        alpha || 1,
      ] +
      ")"
    );
  }

  function resizeCanvasToDisplaySize(canvas) {
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      canvas.height = height;
      canvas.width = width;
      return true; // here you can return some usefull information like delta width and delta height instead of just true
      // this information can be used in the next redraw...
    }

    return false;
  }

  const DrawInCanvas = (canvas, ctx) => {
    let newSelection = {};
    let mousedown = false;
    if (!ctx || !canvas) {
      return;
    }

    // Draw the region on the canvas
    const drawSelection = (start, end) => {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(start, 0, end - start, canvas.height);
      ctx.stroke();
      ctx.fillStyle = regionColor;
      ctx.fill();
      ctx.closePath();
    };
    // Start the selection
    canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();
      mousedown = true;
      newSelection.start = e.offsetX;
      newSelection.end = e.offsetX;
      // drawSelection(newSelection.start, newSelection.end);
    });
    // End the selection
    canvas.addEventListener("mouseup", (e) => {
      e.preventDefault();
      mousedown = false;
      drawSelection(newSelection.start, newSelection.end);
      let newRegion = {
        start: newSelection.start / canvas.width,
        end: newSelection.end / canvas.width,
        id: Date.now(),
        color: regionColor,
      };
      console.log(`newRegion`, newRegion);
      saveCreatedRegions(newRegion);
      newSelection = {};
    });

    canvas.addEventListener("mousemove", (e) => {
      e.preventDefault();
      if (mousedown === true) {
        newSelection = { ...newSelection, end: e.offsetX };
      }
    });
  };

  function DrawPlayTracker(ctx, canvas) {
    let v = window.innerWidth / duration / duration;
    ctx.linearWith = 50;
    ctx.strokeStyle = "rgba(255, 165, 0, .9)";
    ctx.beginPath();
    ctx.rect(
      posX, // x
      0, // y
      0, // width
      canvas.height // height
    );
    ctx.clearRect(0, 0, posX, canvas.height);
    ctx.stroke();
    ctx.moveTo((posX += v), 0);
    ctx.closePath();
  }

  // useCallback hook with a play audio function
  const playAudio = useCallback(() => {
    if (run === true) {
      playerRef.current.play();
      setPlay("Pause");
      // posX = 0;
    } else {
      console.log(`run`, run);
      playerRef.current.pause();
      setPlay("Play");
    }
  }, [setPlay, run]);

  const restartAudio = () => {
    playerRef.current.currentTime = 0;
  };

  // Load the spectrogram audio
  useEffect(() => {
    if (loadingAudio === true) {
      // console.log("Loading audio");
    } else {
      playerRef.current.src = selectedAudio?.audio;
    }
  }, [loadingAudio]);

  useEffect(() => {
    // eslint-disable-next-line
    if (loading === false) {
      canvas = SpectrogramRef.current;
      // eslint-disable-next-line
      context = canvas.getContext("2d");
      resizeCanvasToDisplaySize(context.canvas);
      context.canvas.width = window.innerWidth;
      context.canvas.height = 200;
      const image = new Image();
      image.src = selectedAudio.imageUrl;
      image.onload = () => {
        context.drawImage(
          image,
          0,
          0,
          context.canvas.width,
          context.canvas.height
        );
      };

      let animationFrameId;

      DrawInCanvas(canvas, context);
      const render = () => {
        if (run === false) {
          loadRegions(canvas, context, regionListRedux);
          DrawPlayTracker(context, canvas);
        }
      };
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(render);
      render();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    } else {
      // console.log("Not ready yet...");
    }

    // eslint-disable-next-line
  }, [run, loading]);

  return (
    <div>
      <div className="row"> </div>
      <div>
        <div>
          <div>
            <div className="m-2">
              <div>
                <div className="Spectrogram-container">
                  <canvas width="100%" ref={SpectrogramRef} />
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
                        playAudio(run === true ? setRun(false) : setRun(true))
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
                          icon={["fas", "pause-circle"]}
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
              loadRegions={loadRegions}
              clearRegions={clearRegions}
              selectedAudio={selectedAudio}
              labelForNewCall={labelForNewCall}
              labelNewCall={labelNewCall}
              regionsArray={regionsArray}
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
