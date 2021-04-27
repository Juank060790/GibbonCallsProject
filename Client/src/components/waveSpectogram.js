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

  const url = `https://00f74ba44b73d79ea287c312cc46b0e3716fe33575-apidata.googleusercontent.com/download/storage/v1/b/coderschool-project-gibbon.appspot.com/o/19700101_194149.WAV?jk=AFshE3U0LoN8omyukXD4B1KhOusC2a6AJlA4ZB_bFvHlIbH63Sd-lnHOSLyk4xgvqmQgiH76MHvNovQxmo3vs71-iXSP6Ez1e3ebD8gVHR1uCrLxPhp1tQTkdWhpDbs3yt6EC_GhwHsvGAuCw1aoC8kMXlmgJLmXFARB-V8oDLS8f4xO2g1iaNrQ5ST_4YgRC4lFY_5y-Q-6VTlcoBaora2CZuukTloRrU3b7wnDEyniK1TtELQo56xpTU4wrHO6E8yPjtCShfFw4jRGzD4ntDNqCrSFaXmow3yzIeBXbRFqT7ieGnIMg9Fx6Z37lr5-HVVcJXwlAIeQ-u7E4u7oyLyZoAM-AwKHMRzOBLTI-eku3C_Ljb0sCC44gjiCqhB2bDH4QNHsdbN7IWwkwLzeH-cJLSW27JVmBpkD3nMsBhGGLuSiKiTYVfPJKCZ-EjLCBgBlZWY1hokZhpAvZFyLgBNZZI12U1SSnUdoJSvdPDP5dCy1ESVIrk_ixK_I1JQ12mbNst9ubp9ut_O2inBDOM2YMoTBBqCBcUighPUYJWxdot2qFoLM9L1Fs_YSj9oqTdFd75WAyyM1KCLExz2K-KJyYUsYu3n1_l4eeFq9sWeTXBRzPGGcfTMwVR9CxVdulJUCaSgHl1yXNXFKQvwJuXvZ5qpwB97YLeskqsnN6mvtEv5agD5f4w-AqZjUJ65k2ogDaC0KqU4-yiSWg5dsTJSStIbpqheNP98GWbtD48rGRzw3HptQOevZiPAnfEYUqKMJ1IHJuBvWIa3AWQWL8PewlZ52LS2oA3W924a0LM-z_Xx9Py6tFI0CMfrMxQndF96VwxhvIqXm3vho52Rgd5QdUX1evhAkoYffhiso6s5Dw7qWul24FYr6mUqaJLblhMebY-pSWzEhU-_Db7CbuFjb00MeYiJkVnhQqhTh95Hu5vYyqRmWy3Zt3PWI4UtKOaPckD_Beyslgi-7wu0gzMv6L1g1mA8zP2ZzrxAffyJOaas&isca=1`;

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
    // eslint-disable-next-line
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
