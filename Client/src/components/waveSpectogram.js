import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { WaveformContianer, Wave, PlayButton } from "./Waveform.styled";
import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js";
import Regions from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import Minimap from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import colorMap from "colormap";
import RangeSlider from "react-bootstrap-range-slider";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
// import audio from "../19700101_013658.wav";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { callActions } from "../redux/actions";
import "../Styles/Styles.scss";
import TableNewCalls from "./TableNewCalls";

export default function Waveform(SpectogramAudio) {
  // console.log(`SpectogramAudio`, SpectogramAudio);
  // const calls = useSelector((state) => state.call);
  const dispatch = useDispatch();
  const [Play, setPlay] = useState(false);
  const [SpectogramPluginInit, setSpectogramPluginInit] = useState(true);
  const waveformRef = useRef(null);
  var Waveform = useRef(null);
  const waveformTimeLineRef = useRef(null);
  const waveformSpectogramRef = useRef(null);
  const [zoomValue, setZoomValue] = useState(30);
  const [regionsArray, setRegionsArray] = useState();
  // console.log(`regionsArray`, regionsArray);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const CallsList = useSelector((state) => state.audio.callsList);
  const regionListRedux = useSelector((state) => state.call.call);

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
      CursorPlugin.create({
        showCursor: true,
        showTime: true,
        opacity: 1,
        customShowTimeStyle: {
          "background-color": "#000",
          color: "#999",
          padding: "1px",
          "font-size": "10px",
        },
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
    // windowFunc: "triangular",
    height: "300px",
    container: "#wavespectrogram",
    labels: true,
    responsive: true,
    colorMap: colors,
    noverlap: false,
    pixelRatio: 2,
    deferInit: SpectogramPluginInit,
  });

  // Object.values(SpectogramAudio);
  // console.log(`url`, url);
  function saveCreatedRegions(regionListRedux) {
    console.log("Load Regions without calling them");
    let arrayRegion = [];
    Object.keys(Waveform.current.regions.list).map(function (id) {
      let region = Waveform.current.regions.list[id];
      // console.log(`region`, region);

      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));

      const regionColor = randomColor(0.1);
      // console.log("REGION ==> ", region);
      let singleRegion = {
        callId: randLetter + new Date().getTime().toString(),
        label: "Female",
        spectogram:
          "https://firebasestorage.googleapis.com/v0/b/coderschool-project-gibbon.appspot.com/o/gibbon-call-1.png?alt=media&token=baf12507-37c1-4a7d-9437-2e77f479166f",
        comment: "",
        start: region.start,
        end: region.end,
        isCorrect: true,
        isDeleted: false,
        SpectogramAudio: "",
        color: regionColor,

        // attributes: region.attributes,
        // data: region.data,
      };

      arrayRegion.push({ singleRegion });
      // console.log("ARRAY", arrayRegion);
      return { arrayRegion };
    });
    // console.log(`arrayRegion`, arrayRegion.length);
    setRegionsArray(arrayRegion);
  }

  // Save regions

  const saveRegionsDataBase = (regionsArray, audioId) => {
    if (regionsArray) {
      console.log(`regionsArray`, regionsArray);
      regionsArray?.forEach((region) => {
        let singleCall = region.singleRegion;
        dispatch(callActions.saveRegionCall(singleCall, audioId));
        dispatch(callActions.getSingleCall(singleCall.callId));
        setRegionsArray([]);
      });
    } else {
      console.log("Nothing to send");
    }
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
        color: randomColor(0.1),
      });
    });

    function editAnnotation(region) {
      //   let form = region;
      //   console.log(`regionEDIT`, region.element);
      //   console.log(`Form`, form);
      //   form.style.opacity = 0.1;
      //   // form.element.start.value = Math.round(region.start * 10) / 10;
      //   // form.element.end.value = Math.round(region.end * 10) / 10;
      //   form.data.note = "First NOte";
      //   form.onsubmit = function (e) {
      //     e.preventDefault();
      //     region.update({
      //       start: form.element.start.value,
      //       end: form.element.end.value,
      //       data: {
      //         note: form.element.note.value,
      //       },
      //     });
      //     form.style.opacity = 0;
      //   };
      //   form.onreset = function () {
      //     form.style.opacity = 0;
      //     form.dataset.region = null;
      //   };
      //   form.dataset.region = region.id;
    }

    /**
     * Display annotation.
     */

    // function showNote(region) {
    //   //   if (!showNote.el) {
    //   //     showNote.el = document.querySelector("#subtitle");
    //   //   }
    //   //   showNote.el.textContent = region.data.note || "–";
    // }

    Waveform.current.on("region-click", function (region, e) {
      console.log("make region");
      e.stopPropagation();
      // Play on click, loop on shift click
      e.shiftKey ? region.playLoop() : region.play();
    });
    Waveform.current.on("region-click", editAnnotation);
    Waveform.current.on("region-updated", saveCreatedRegions);
    // Waveform.current.on("region-removed", saveCreatedRegions);
    // Waveform.current.on("region-in", showNote);

    Waveform.current.on("region-play", function (region) {
      region.once("out", function () {
        Waveform.current.play(region.start);
        Waveform.current.pause();
      });
    });
    return () => Waveform.current.destroy();
    // eslint-disable-next-line
  }, [SpectogramPluginInit, url]);

  function loadRegions(regionListRedux) {
    // var listToLoadRegions = [];
    console.log(`regionListRedux`, regionListRedux);
    regionListRedux.forEach(function (region) {
      // eslint-disable-next-line
      region.color = region.color;
      console.log("ADDREGION");
      Waveform.current.addRegion(region);
    });
  }

  // useEffect(() => {
  //   if (regionListRedux) {
  //     loadRegions(regionListRedux);
  //     console.log("loadREgion", regionListRedux);
  //   }
  // }, [regionListRedux.length, regionListRedux]);

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

  // Slider

  useEffect(() => {
    // Zoom
    Waveform.current.zoom(Number(zoomValue));
  }, [zoomValue, Waveform]);

  // Switch
  const ShowSpectogram = () => {
    if (SpectogramPluginInit === false) {
      setSpectogramPluginInit(true);
    } else {
      setSpectogramPluginInit(false);
    }
  };

  // Render list of calls of regions

  return (
    <div>
      {" "}
      <div>
        <Container fluid>
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
        </Container>
        <div>
          <div className="d-flex controlsContainer ">
            <div className="d-flex flex-column">
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
            <div className="d-flex flex-column">
              <div>Zoom</div>
              <div className="slidecontainer ">
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
            </div>
            <div>
              <PlayButton onClick={handlePlayPause}>
                {!Play ? "Play" : "Pause"}
              </PlayButton>
            </div>
          </div>
        </div>

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
            Save Regions
          </button>
          <button
            onClick={() => loadRegions(regionListRedux)}
            className="btnSave draw-border"
          >
            Load Regions
          </button>
          <div>
            <TableNewCalls regionsArray={regionsArray} />
          </div>
        </div>
      </div>
    </div>
  );
}
