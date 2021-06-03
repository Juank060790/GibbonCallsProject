import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { WaveformContianer, Wave } from "./Waveform.styled";
import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js";
import Regions from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
// import Minimap from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import colorMap from "colormap";
import RangeSlider from "react-bootstrap-range-slider";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { callActions } from "../redux/actions";
import "../Styles/Styles.scss";
import TableNewCalls from "./TableNewCalls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Waveform(SpectogramAudio) {
  const dispatch = useDispatch();
  const [Play, setPlay] = useState(false);
  const [SpectogramPluginInit, setSpectogramPluginInit] = useState(true);
  const waveformRef = useRef(null);
  var Waveform = useRef(null);
  const waveformTimeLineRef = useRef(null);
  const waveformSpectogramRef = useRef(null);
  const [zoomValue, setZoomValue] = useState(30);
  const [regionsArray, setRegionsArray] = useState();
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const CallsList = useSelector((state) => state.audio.callsList);
  const regionListRedux = useSelector((state) => state.call.call);
  const [labelColor, setLabelColor] = useState("");
  const [labelForNewCall, setLableForNewCall] = useState("");
  const regionColor = randomColor(0.1);

  // Spectogram and sound waves options

  const WaveformOptions = (ref) => ({
    container: waveformRef.current,
    cursorWidth: 1,
    backend: "WebAudio",
    height: 200,
    barWidth: 0.5,
    barRadius: 0.3,
    minPxPerSec: 30,
    scrollParent: true,
    progressColor: "#2D5BFF",
    responsive: true,
    waveColor: "#d7ebd6",
    cursorColor: "blue",
    normalize: true,
    partialRender: true,
    plugins: [
      CursorPlugin.create({
        showTime: true,
        opacity: 1,
        customShowTimeStyle: {
          "background-color": "#000",
          color: "#999",
          padding: "2px",
          "font-size": "10px",
        },
      }),
      SpectogramPlugin,
      Regions.create({
        resize: false,
      }),
      // Minimap.create({
      //   backgroundColor: "white",
      //   waveColor: "#ddd",
      //   progressColor: "#999",
      //   cursorColor: "#999",
      //   height: 30,
      // }),
      TimelinePlugin.create({
        container: "#wave-timeline",
      }),
    ],
  });
  let colors = colorMap({
    colormap: "cool",
    nshades: 256,
    format: "float",
  });

  let SpectogramPlugin = SpectrogramPlugin.create({
    fftSamples: 1024,
    width: "50px",
    height: "300px",
    container: "#wavespectrogram",
    labels: true,
    responsive: true,
    colorMap: colors,
    noverlap: false,
    pixelRatio: 2,
    deferInit: SpectogramPluginInit,
  });

  // Save the region to be show in the waveform, after needs to be saved to the database.

  function saveCreatedRegions(event) {
    let arrayRegion = [];
    // var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    // randLetter + new Date().getTime().toString(),

    let singleRegion = {
      callId: event.id,
      label: "",
      spectogram: "",
      comment: "",
      start: event.start,
      end: event.end,
      isCorrect: true,
      isDeleted: false,
      SpectogramAudio: "",
      color: regionColor,
    };

    arrayRegion.push({ singleRegion });
    setRegionsArray(arrayRegion);
  }

  // Set Label from new call in the new table

  const labelNewCall = (event) => {
    if (event === "Male") {
      setLabelColor("rgba(192, 212, 255, 0.278)");
      setLableForNewCall("Male");
    }
    if (event === "Female") {
      setLabelColor("rgba(255, 192, 245, 0.278)");
      setLableForNewCall("Female");
    }
    if (event === "Other") {
      setLabelColor("#6fcf978e");
      setLableForNewCall("Other");
    }
  };

  // Save regions to data base, label to the save region is added here.

  const saveRegionsDataBase = (regionsArray, audioId) => {
    if (regionsArray) {
      regionsArray?.forEach((region) => {
        region.singleRegion.label = labelForNewCall;
        let singleCall = region.singleRegion;
        dispatch(callActions.saveRegionCall(singleCall, audioId));
        dispatch(callActions.getSingleCall(singleCall.callId));
        setRegionsArray([]);
      });
    } else {
      console.log("Nothing to send");
    }
  };

  // Delete region in the waveform
  const deleteRegion = (region) => {
    region.remove();
    setRegionsArray([]);
  };

  // Clear all the regions from the waveform
  const clearRegions = () => {
    Waveform.current.clearRegions();
    setRegionsArray([]);
  };

  const url =
    "https://firebasestorage.googleapis.com/v0/b/coderschool-project-gibbon.appspot.com/o/calls%2F19700101_013658.WAV?alt=media&token=86c99103-0f75-4adb-a20b-be1e82b2020a";

  useEffect(() => {
    setPlay(false);
    const options = WaveformOptions(waveformRef.current);
    Waveform.current = WaveSurfer.create(options);
    Waveform.current.load(url);
    // loadRegions(regionListRedux);

    Waveform.current.on("ready", function () {
      Waveform.current.enableDragSelection({
        color: regionColor,
      });
    });
    Waveform.current.on("region-created", saveCreatedRegions);
    Waveform.current.on("region-dblclick", deleteRegion);

    Waveform.current.on("ready", function (region) {
      region.once("out", function () {
        Waveform.current.play(region.start);
        Waveform.current.pause();
      });
    });
    return () => Waveform.current.destroy();
    // eslint-disable-next-line
  }, [SpectogramPluginInit, url]);

  function loadRegions(regionListRedux) {
    regionListRedux.forEach(function (region) {
      // eslint-disable-next-line
      region.color = region.color;
      if (region.isCorrect === true) {
        Waveform.current.addRegion(region);
      } else {
        console.log("Region Not correct");
      }
    });
  }

  const handlePlayPause = () => {
    setPlay(!Play);
    Waveform.current.playPause();
  };

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

  useEffect(() => {
    // Zoom
    Waveform.current.zoom(Number(zoomValue));
  }, [zoomValue, Waveform]);

  // Switch to show spectogram
  const ShowSpectogram = () => {
    if (SpectogramPluginInit === false) {
      setSpectogramPluginInit(true);
    } else {
      setSpectogramPluginInit(false);
    }
  };

  return (
    <div>
      {" "}
      <div>
        <Container className="infoAndNotesContainer" fluid>
          <div className="containerInfoAudio">
            <div>
              {selectedAudio ? (
                <div className="FileDetails">
                  <h4>File Details:</h4>
                  <p>Name:{selectedAudio.fileName}</p>
                  <p>Duration:{selectedAudio.duration}</p>
                  <p>
                    Record Date:{" "}
                    {new Date(
                      selectedAudio.recordDate.seconds * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p></p>
              )}
            </div>
            <div></div>
          </div>
          <div className="AnnotationsNotes">
            <div>
              <div className="FileDetails">
                <h4>Notes</h4>
                <p>Double click delete region.</p>
                <p>Click and drag to create a new region.</p>
                <p>One click to select region.</p>
                <p>Save one region at the time.</p>
              </div>
            </div>
            <div></div>
          </div>
        </Container>

        <div className="spectogramandwave">
          <WaveformContianer>
            <Wave
              className="wavespectrogram m-1"
              ref={waveformSpectogramRef}
              id="wavespectrogram"
            />
            <Wave ref={waveformTimeLineRef} id="wave-minimap" />
            <Wave ref={waveformRef} id="waveform" />
            <Wave ref={waveformTimeLineRef} id="wave-timeline" />
            {/* <audio src={url} /> */}
          </WaveformContianer>
        </div>
        <div>
          {" "}
          <div className="zoomContainer">
            <div className="d-flex flex-row">
              <div className="m-2 ">
                <RangeSlider
                  className="slider"
                  value={zoomValue}
                  onChange={(e) => setZoomValue(e.target.value)}
                  variant="success"
                  size="sm"
                  min={20}
                  max={100}
                />
              </div>
              <div className="m-2">
                {" "}
                <FontAwesomeIcon
                  className="savebutton "
                  icon={["fas", "search-plus"]}
                  color="#04c45c"
                ></FontAwesomeIcon>
              </div>
            </div>
          </div>
          <div className="controlsContainer controlActions">
            <div className="d-flex flex-column justify-content-center ">
              Show Spectogram
              <label className="switch">
                <input
                  id="SpectogramPluginInit"
                  type="checkbox"
                  onChange={ShowSpectogram}
                />
                <span className="sliderSwitch round"></span>
              </label>
            </div>
            <button
              onClick={() =>
                saveRegionsDataBase(
                  regionsArray,
                  selectedAudio?.audioId,
                  CallsList
                )
              }
              className="btnSave draw-border"
            >
              Save
            </button>{" "}
            <div className="containerPlayButton">
              <button className="PlayButton" onClick={handlePlayPause}>
                {!Play ? (
                  <FontAwesomeIcon
                    className=""
                    icon={["fas", "play"]}
                    color="#04c45c"
                  ></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon
                    className=""
                    icon={["fas", "pause"]}
                    color="#04c45c"
                  ></FontAwesomeIcon>
                )}
              </button>
            </div>
            <button
              onClick={() => clearRegions(regionsArray)}
              className="btnSave draw-border"
            >
              Clear
            </button>
            <button
              onClick={() => loadRegions(regionListRedux)}
              className="btnSave draw-border"
            >
              Load
            </button>
          </div>
          <div>
            <TableNewCalls
              labelNewCall={labelNewCall}
              regionsArray={regionsArray}
              labelColor={labelColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
