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
import audio from "../19700101_013658.wav";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { callActions } from "../redux/actions";
import "../Styles/Styles.scss";
import TableNewCalls from "./TableNewCalls";

export default function Waveform(SpectogramAudio) {
  // const calls = useSelector((state) => state.call);
  const dispatch = useDispatch();
  const [Play, setPlay] = useState(false);
  const [SpectogramPluginInit, setSpectogramPluginInit] = useState(true);
  const waveformRef = useRef(null);
  const Waveform = useRef(null);
  const waveformTimeLineRef = useRef(null);
  const waveformSpectogramRef = useRef(null);
  const [zoomValue, setZoomValue] = React.useState(30);
  const [regionsArray, setRegionsArray] = useState();
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const CallsList = useSelector((state) => state.audio.callsList);
  console.log(`CallsList`, CallsList);

  useEffect(() => {
    // getCalls();
    console.log("useEffectWAvesurf", CallsList);
  }, [CallsList]);

  const saveRegionsDataBase = (regionsArray, audioId) => {
    console.log(`CallsList`, regionsArray);
    if (regionsArray) {
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

  // Spectogram and sound waves options

  const WaveformOptions = (ref) => ({
    container: waveformRef.current,
    barWidth: 1,
    barHeight: 1,
    cursorWidth: 1,
    backend: "WebAudio",
    height: 128,
    progressColor: "#2D5BFF",
    responsive: true,
    waveColor: "#d7ebd6",
    cursorColor: "blue",
    normalize: true,
    partialRender: true,
    plugins: [
      SpectogramPlugin,
      Regions.create(),
      Minimap.create({
        waveColor: "#ddd",
        progressColor: "#999",
        cursorColor: "#999",
        height: 60,
      }),
      TimelinePlugin.create({
        container: "#wave-timeline",
      }),
      CursorPlugin.create({
        showCursor: true,
        showTime: true,
        opacity: 0.5,
        customShowTimeStyle: {
          "background-color": "#000",
          color: "#fff",
          padding: "2px",
          "font-size": "10px",
        },
      }),
    ],
  });
  let colors = colorMap({
    colormap: "greens",
    nshades: 256,
    format: "float",
  });

  let SpectogramPlugin = SpectrogramPlugin.create({
    fftSamples: 512,
    width: "50px",
    // windowFunc: "triangular",
    height: "100px",
    container: "#wavespectrogram",
    labels: true,
    colorMap: colors,
    pixelRatio: 1,
    deferInit: SpectogramPluginInit,
  });

  const url = audio;
  // Object.values(SpectogramAudio);
  // console.log(`url`, url);

  useEffect(() => {
    setPlay(false);
    const options = WaveformOptions(waveformRef.current);
    Waveform.current = WaveSurfer.create(options);
    Waveform.current.load(url);

    /* Regions */
    // console.log(`region`, region);

    // function saveRegions() {
    //   localStorage.regions = JSON.stringify(
    //     Object.keys(Waveform.current.regions.list).map(function (id) {
    //       let region = Waveform.current.regions.list[id];
    //       setRegionsArray({
    //         start: region.start,
    //         end: region.end,
    //         attributes: region.attributes,
    //         data: region.data,
    //       });
    //       return {
    //         regionsArray: {
    //           start: region.start,
    //           end: region.end,
    //           attributes: region.attributes,
    //           data: region.data,
    //         },
    //       };
    //     })
    //   );
    // }

    function saveRegionsRedux() {
      let arrayRegion = [];
      Object.keys(Waveform.current.regions.list).map(function (id) {
        let region = Waveform.current.regions.list[id];
        var randLetter = String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        );

        let singleRegion = {
          callId: randLetter + new Date().getTime().toString(),
          label: "Female",
          spectogram:
            "https://firebasestorage.googleapis.com/v0/b/coderschool-project-gibbon.appspot.com/o/gibbon-call-5.png?alt=media",
          comment: "",
          timeStart: region.start,
          timeEnd: region.end,
          isCorrect: true,
          isDeleted: false,
          SpectogramAudio: "",
          // attributes: region.attributes,
          // data: region.data,
        };

        arrayRegion.push({ singleRegion });
        return { arrayRegion };
      });
      // console.log(`arrayRegion`, arrayRegion.length);
      setRegionsArray(arrayRegion);
    }

    /**
     * Load regions from localStorage.
     */

    Waveform.current.on("ready", function () {
      Waveform.current.enableDragSelection({
        color: randomColor(0.1),
      });

      if (regionsArray) {
        // console.log(`loacalStorage`, regionsArray);
        // console.log("regions", JSON.parse(regionsArray));
        loadRegions(JSON.parse(regionsArray));
      } else {
      }
    });

    function editAnnotation(region) {
      let form = document.forms.edit;
      console.log(`regionEDIT`, form);

      form.style.opacity = 1;
      form.elements.start.value = Math.round(region.start * 10) / 10;
      form.elements.end.value = Math.round(region.end * 10) / 10;
      form.elements.note.value = region.data.note || "";
      form.onsubmit = function (e) {
        e.preventDefault();
        region.update({
          start: form.elements.start.value,
          end: form.elements.end.value,
          data: {
            note: form.elements.note.value,
          },
        });
        form.style.opacity = 0;
      };
      form.onreset = function () {
        form.style.opacity = 0;
        form.dataset.region = null;
      };
      form.dataset.region = region.id;
    }

    /**
     * Display annotation.
     */

    function showNote(region) {
      if (!showNote.el) {
        showNote.el = document.querySelector("#subtitle");
      }
      showNote.el.textContent = region.data.note || "–";
    }

    function loadRegions(regions) {
      regions.forEach(function (region) {
        region.color = randomColor(0.1);
        Waveform.current.addRegion(region);
      });
    }

    Waveform.current.on("region-click", function (region, e) {
      e.stopPropagation();
      // Play on click, loop on shift click
      e.shiftKey ? region.playLoop() : region.play();
    });
    Waveform.current.on("region-click", editAnnotation);
    Waveform.current.on("region-updated", saveRegionsRedux);
    Waveform.current.on("region-removed", saveRegionsRedux);
    Waveform.current.on("region-in", showNote);

    Waveform.current.on("region-play", function (region) {
      region.once("out", function () {
        Waveform.current.play(region.start);
        Waveform.current.pause();
      });
    });
    return () => Waveform.current.destroy();
    // eslint-disable-next-line
  }, [SpectogramPluginInit, url]);

  // useEffect(() => {}, [selectedAudio, regionsArray]);

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
                  max={1000}
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
            <Wave ref={waveformTimeLineRef} id="wave-minimap" />
            <Wave ref={waveformRef} id="waveform" />
            <Wave ref={waveformSpectogramRef} id="wavespectrogram" />
            <Wave ref={waveformTimeLineRef} id="wave-timeline" />
            <audio src={url} />
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
          <div>
            <TableNewCalls regionsArray={regionsArray} />
          </div>
        </div>
      </div>
    </div>
  );
}
