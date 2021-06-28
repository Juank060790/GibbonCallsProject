import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { WaveformContianer, Wave } from "./Waveform.styled";
import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js";
import Regions from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import Minimap from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import colorMap from "colormap";
import RangeSlider from "react-bootstrap-range-slider";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { useDispatch, useSelector } from "react-redux";
import { Container, Dropdown, Modal } from "react-bootstrap";
import { callActions } from "../redux/actions";
import "../Styles/Styles.scss";
import TableNewCalls from "./TableNewCalls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import soundBeat from "../images/soundBeat.png";
import colorPalette from "../images/colorPalette.png";
// import testAudio from "../images/testAudio.WAV";

export default function Waveform() {
  const dispatch = useDispatch();
  const [Play, setPlay] = useState(false);
  const [SpectogramPluginInit, setSpectogramPluginInit] = useState(true);
  const waveformRef = useRef(null);
  var Waveform = useRef(null);
  const waveformTimeLineRef = useRef(null);
  const waveformSpectogramRef = useRef(null);
  const [zoomValue, setZoomValue] = useState(30);
  // const  setSe = useState(1024);
  const [colorOfSpectogram, setColorOfSpectogram] = useState("cool");
  const [regionsArray, setRegionsArray] = useState();
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const CallsList = useSelector((state) => state.audio.callsList);
  const regionListRedux = useSelector((state) => state.call.call);
  const [labelColor, setLabelColor] = useState("");
  const [labelForNewCall, setLableForNewCall] = useState("");
  const [helpModal, setHelpModal] = useState(false);
  const regionColor = randomColor(0.1);

  // Spectogram and sound waves options

  const WaveformOptions = (ref) => ({
    container: waveformRef.current,
    cursorWidth: 1,
    backend: "WebAudio",
    // minPxPerSec: 50,
    scrollParent: true,
    progressColor: "#7AD7F0",
    responsive: true,
    waveColor: "#F5FCFF",
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
      Minimap.create({
        backgroundColor: "white",
        waveColor: "#ddd",
        progressColor: "#999",
        cursorColor: "#999",
        height: 30,
      }),
      TimelinePlugin.create({
        container: "#wave-timeline",
      }),
    ],
  });

  // Set of colors used fot the spectogram "cool", "jet", "electric", "oxygen", "cubehelix", "copper"
  let colors = colorMap({
    colormap: colorOfSpectogram,
    nshades: 256,
    format: "float",
  });

  let SpectogramPlugin = SpectrogramPlugin.create({
    // fftSamples:
    container: "#wavespectrogram",
    labels: false,
    responsive: false,
    colorMap: colors,
    height: 128,
    deferInit: SpectogramPluginInit,
  });

  // Save the region to be show in the waveform, after needs to be saved to the database.

  function saveCreatedRegions(event) {
    console.log(`event`, event);
    let arrayRegion = [];

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

  // Save regions to data base, label to the save region is added here and add + count to the Raw audio.

  const saveRegionsDataBase = (regionsArray, audioId) => {
    if (regionsArray) {
      console.log(`regionsArray`, regionsArray);
      const addCallCount =
        regionListRedux?.filter((x) => x.isCorrect === true).length + 1;
      regionsArray?.forEach((region) => {
        // Test if Start and End time are the same

        // ----------------------------------------
        // Check if the start from the old and new region are the same
        // const isRegionStartInTheArray = (el) =>
        //   el.start === region.singleRegion.start;
        // const findStartOfCall = regionListRedux.findIndex(
        //   isRegionStartInTheArray
        // );
        // console.log(`findIndexOfCall`, findStartOfCall);
        // // Check if the end of a new and old regions are the same
        // const isRegionEndInTheArray = (el) =>
        //   el.end === region.singleRegion.end;

        // const findEndOfCall = regionListRedux.findIndex(isRegionEndInTheArray);
        // console.log(`findIndexOfCall`, findEndOfCall);

        // //  Comparare start/end from old and new region

        // if (
        //   regionListRedux[findStartOfCall]?.start ===
        //     region.singleRegion.start &&
        //   regionListRedux[findEndOfCall]?.end === region.singleRegion.end
        // ) {
        //   // regionListRedux[findIndexOfCall] = region;
        //   console.log(`region is equal to region`, regionListRedux);
        // } else {
        //   // regionListRedux.push(region);
        //   console.log("region is not equal", regionListRedux);
        // }
        // --------------------------
        // ENDDDD

        region.singleRegion.label = labelForNewCall;
        let singleCall = region.singleRegion;
        dispatch(callActions.saveRegionCall(singleCall, audioId, addCallCount));
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

  const url = selectedAudio?.audioLink;
  // selectedAudio?.audioLink;
  // "https://firebasestorage.googleapis.com/v0/b/coderschool-project-gibbon.appspot.com/o/calls%2F19700101_013658.WAV?alt=media&token=86c99103-0f75-4adb-a20b-be1e82b2020a";

  useEffect(() => {
    setPlay(false);
    const options = WaveformOptions(waveformRef.current);
    Waveform.current = WaveSurfer.create(options);
    if (url) {
      Waveform.current.load(url);
    }

    Waveform.current.on("ready", function () {
      Waveform.current.enableDragSelection({
        color: regionColor,
        passive: true,
      });
    });

    // Play region on click
    Waveform.current.on("region-click", function (region, e) {
      e.stopPropagation();
      // Play on click, loop on shift click
      e.shiftKey ? region.playLoop() : region.play();
      setPlay(true);
    });

    // Create a region on drag and update it in to the table to edit and add labels.
    Waveform.current.on("region-updated", saveCreatedRegions);
    Waveform.current.on("region-dblclick", deleteRegion);

    return () => Waveform.current.destroy();
    // eslint-disable-next-line
  }, [SpectogramPluginInit, url, colorOfSpectogram]);

  // Load regions into the waveform
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

  // Play and pause function for the waveform
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
                  <p className="line-break-text">
                    Name:{selectedAudio.fileName}
                  </p>
                  <p className="line-break-text">
                    Duration:{selectedAudio.duration}
                  </p>
                  <p className="line-break-text">
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
              <FontAwesomeIcon
                className="helpIcon"
                icon={["fas", "question"]}
                color="#04c45c"
                onClick={() => setHelpModal(true)}
                size="2x"
              ></FontAwesomeIcon>
            </div>
            {SpectogramPluginInit === false ? (
              <div className="spectogramOptions">
                <div className="colorPaletteDropdownContainer m-2">
                  <Dropdown className="dropdownBtnSpectogramOption ">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="colorPaletteDropdownBtn dropdownButonsSpectogram"
                    >
                      <img
                        src={colorPalette}
                        alt="soundBeat icon"
                        width="25px"
                        height="25px"
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={(e) => setColorOfSpectogram("cool")}
                      >
                        Cool
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e) => setColorOfSpectogram("jet")}
                      >
                        Jet
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e) => setColorOfSpectogram("electric")}
                      >
                        Electric
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e) => setColorOfSpectogram("oxygen")}
                      >
                        Oxygen
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e) => setColorOfSpectogram("cubehelix")}
                      >
                        Cubehelix
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e) => setColorOfSpectogram("copper")}
                      >
                        Copper
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>{" "}
                </div>
                {/* <div className="soundBeatDropdownContainer">
                  <Dropdown className="dropdownBtnSpectogramOption">
                    <Dropdown.Toggle
                      className="dropdownButonsSpectogram "
                      id="dropdown-basic"
                    >
                      <img
                        src={soundBeat}
                        alt="soundBeat icon"
                        width="80px"
                        color="white"
                        // height="100px"
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={(e) => setSetSpectogramSize(256)}>
                        FftSamples 128
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => setSetSpectogramSize(512)}>
                        FftSamples 512
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e) => setSetSpectogramSize(1024)}
                      >
                        FftSamples 1024
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={(e) => setSetSpectogramSize(2048)}
                      >
                        FftSamples 2048
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>{" "}
                </div> */}
              </div>
            ) : (
              <> </>
            )}
          </div>
        </Container>

        <div className="spectogramandwave">
          <WaveformContianer>
            {SpectogramPluginInit === false ? (
              <>
                <div className="lightweight">Spectogram</div>
                <Wave
                  className="wavespectrogram m-1"
                  ref={waveformSpectogramRef}
                  id="wavespectrogram"
                />
              </>
            ) : (
              <> </>
            )}
            <div className="lightweight">Waveform</div>
            <Wave ref={waveformRef} id="waveform" />
            <Wave ref={waveformTimeLineRef} id="wave-minimap" />
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
              labelForNewCall={labelForNewCall}
              labelNewCall={labelNewCall}
              regionsArray={regionsArray}
              labelColor={labelColor}
            />
          </div>
        </div>
      </div>
      <Modal
        className="modalHelpContainer"
        centered
        show={helpModal}
        onHide={() => setHelpModal(false)}
      >
        <Modal.Header className="modalHelpBody" closeButton>
          <h4>Notes</h4>
        </Modal.Header>
        <Modal.Body className="modalHelpBody">
          {" "}
          <div>
            <div className="FileDetails">
              <p className="line-break-text">
                <b>Double click</b> = Delete a region from the waveform.
              </p>
              <p className="line-break-text">
                <b> Click and drag </b> = Create a new region in the waveform.
              </p>
              <p className="line-break-text">
                <b>Click</b> = Play region.
              </p>
              <p className="line-break-text">
                <b> Save </b> = Save a region into the database, save one at the
                time.
              </p>
              <p className="line-break-text">
                <b> Load </b> = Load the regions from the database into the
                waveform.
              </p>
              <p className="line-break-text">
                <b> Clear </b> = Clear regions <b>only</b> from the waveform.
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
