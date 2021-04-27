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

export default function Waveform() {
  // const calls = useSelector((state) => state.call);
  const [Play, setPlay] = useState(false);
  const [SpectogramPluginInit, setSpectogramPluginInit] = useState(true);
  const waveformRef = useRef(null);
  const Waveform = useRef(null);
  const waveformTimeLineRef = useRef(null);
  const waveformSpectogramRef = useRef(null);
  const [zoomValue, setZoomValue] = React.useState(20);

  // Get Start time and End time from each call(TO DO!)

  // Spectogram and sound waves options

  const WaveformOptions = (ref) => ({
    container: waveformRef.current,
    barWidth: 0.9,
    cursorWidth: 1,
    backend: "WebAudio",
    height: 128,
    progressColor: "#2D5BFF",
    responsive: true,
    waveColor: "#d7ebd6",
    cursorColor: "green",
    normalize: true,
    partialRender: true,
    plugins: [
      Regions.create(),
      Minimap.create({
        container: "#wave-minimap",
        waveColor: "#777",
        progressColor: "#222",
        height: 100,
      }),
      TimelinePlugin.create({
        container: "#wave-timeline",
      }),
      CursorPlugin.create({
        showCursor: false,
        showTime: true,
        opacity: 1,
        customShowTimeStyle: {
          "background-color": "#000",
          color: "#fff",
          padding: "2px",
          "font-size": "10px",
        },
      }),
      SpectogramPlugin,
    ],
  });
  let colors = colorMap({
    colorMap: "jet",
    nshades: 512,
    format: "float",
  });

  let SpectogramPlugin = SpectrogramPlugin.create({
    fftSamples: 512,
    container: "#wavespectrogram",
    labels: true,
    colorMap: colors,
    pixelRatio: 2,
    deferInit: SpectogramPluginInit,
  });

  const url = `https://00f74ba44b784a47d4d5f6e266083bf2ed98d26f80-apidata.googleusercontent.com/download/storage/v1/b/test-gibbon-bucket/o/19700101_013658.wav?jk=AFshE3VBXKv1K8JtYiwdq9P0z-Ps1GUXI8zco2ai6l5N5khcGzNKySKDeql1HkEVLZGQJcmetUTYxgVR_WWpoet8VaFVpKWKuY8Okgq2Z2lPSJvP_8jGoHzXkUQvLV61hjfrwiAWn3_YOInTfdwx4_sPouJCx5v43eS6QmWu93VgXaytGIhKwQq1JjojpXl4F9q5AkImlNRRLmUH3mZyoq-qA6Qa3mJyIKAhC340ltayDXtOHFKaA21-eQ23tCslm8a7hwlhxDZDWEc-13YmKJgA3eFonq7ln_M1AeSgADVmnrTGWopzu40xNW0Ze0ZD2Ip4S73mnclU7_02ZagQWcfZfopdYwSwMQflg-xPyIDuQYtk2JmZPhroRqOETu3BiN29ib1R7FSsbR-OeHruD-NyTYXY_iu49e-xk5wmAg6LfHCbZT27jQonimwbhrf4Ho80sDXbZwI2NTbAriTDQaSur2ANf8FCqv_zG9ozfGHk8VX2_1FzBX08b8-cGCar2W5_endXQmp0bjLsa1a_wnhex5IM6Qh77RWwLlsNbQ_XrMXgjZShURSfX64D1a3xZC785owddjN__Us3OzRDlfFLSgGzTRjbyxSkFb56oL5AOYm5ZFJmm1TqDTFUmgwrNQ3eJuwGn6G3TwugV96sBFc8zE8W7ijbkhAYQQvPkW37iZMmrbFmi3XG0dajWk8C1NR-swB_deeOiTXJGAoORFYme_k_1EOvN8ajjDIGsZB-T21WZdmGUSUH3I2-f1TuqH-lW1BmPJcEbYya5jjiy8olQD4te2Yihvhl1aaUbx-y3eMTPxZ72Lb5G26vl3hle2Nwj1RieVToQrCB8PQdUfqj5ZTw15FpcSQtVYAV-MSLbhq0FDdXOftFUyST8JY16S7ag_uO5neiMyHvKfUzS9YOVOmc9pBPmMfORA42iaCYGBKSilC1ZtSdvwyAtMe1yWWRCx3FDKtQ4lkT02X5&isca=1`;

  useEffect(() => {
    setPlay(false);

    const options = WaveformOptions(waveformRef.current);
    Waveform.current = WaveSurfer.create(options);
    Waveform.current.load(url);

    /* Regions */

    function saveRegions() {
      localStorage.regions = JSON.stringify(
        Object.keys(Waveform.current.regions.list).map(function (id) {
          let region = Waveform.current.regions.list[id];
          return {
            start: region.start,
            end: region.end,
            attributes: region.attributes,
            data: region.data,
          };
        })
      );
      console.log("SAVE ", localStorage.regions);
    }

    /**
     * Load regions from localStorage.
     */
    function loadRegions(regions) {
      regions.forEach(function (region) {
        region.color = randomColor(0.1);
        console.log("add regions");
        Waveform.current.addRegion(region);
      });
    }

    Waveform.current.on("ready", function () {
      Waveform.current.enableDragSelection({
        color: randomColor(0.1),
      });

      if (localStorage.regions) {
        // console.log(JSON.parse(localStorage.regions));
        loadRegions(JSON.parse(localStorage.regions));
      } else {
      }
    });

    Waveform.current.on("region-click", function (region, e) {
      e.stopPropagation();
      // Play on click, loop on shift click
      e.shiftKey ? region.playLoop() : region.play();
    });
    Waveform.current.on("region-click", editAnnotation);
    Waveform.current.on("region-updated", saveRegions);
    Waveform.current.on("region-removed", saveRegions);
    Waveform.current.on("region-in", showNote);

    Waveform.current.on("region-play", function (region) {
      region.once("out", function () {
        Waveform.current.play(region.start);
        Waveform.current.pause();
      });
    });
    return () => Waveform.current.destroy();
  }, [SpectogramPluginInit, url]);

  function editAnnotation(region) {
    let form = document.forms.edit;
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
  }, [zoomValue]);

  // Switch
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
        <div className="d-flex flex-column ">
          Show Spectogram
          <label className="switch">
            <input
              id="SpectogramPluginInit"
              type="checkbox"
              onChange={ShowSpectogram}
            />
            <span className="sliderSwitch round"></span>
          </label>
          <div className="d-flex flex-column">
            <div>Zoom</div>
            <div className="slidecontainer ">
              <RangeSlider
                className="slider"
                value={zoomValue}
                onChange={(e) => setZoomValue(e.target.value)}
                variant="success"
                size="sm"
                min={10}
                max={200}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <PlayButton onClick={handlePlayPause}>
            {!Play ? "Play" : "Pause"}
          </PlayButton>
        </div>

        <div className="spectogramandwave">
          <WaveformContianer>
            <Wave ref={waveformTimeLineRef} id="wave-minimap" />
            <Wave ref={waveformRef} id="waveform" />
            <Wave ref={waveformTimeLineRef} id="wave-timeline" />
            <Wave ref={waveformSpectogramRef} id="wavespectrogram" />
            <audio src={url} />
          </WaveformContianer>
        </div>
      </div>
    </div>
  );
}
