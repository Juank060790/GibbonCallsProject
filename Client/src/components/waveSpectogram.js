import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import WaveSurfer from "wavesurfer.js";
import { WaveformContianer, Wave, PlayButton } from "./Waveform.styled";
import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js";
import Regions from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import Minimap from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import colorMap from "colormap";
import RangeSlider from "./RangeSlider";
import { useSelector } from "react-redux";

export default function Waveform() {
  // const calls = useSelector((state) => state.call);
  const [Play, setPlay] = useState(false);
  const [SpectogramPluginInit, setSpectogramPluginInit] = useState(true);
  const waveformRef = useRef(null);
  const Waveform = useRef(null);
  const waveformTimeLineRef = useRef(null);
  const waveformSpectogramRef = useRef(null);
  const [parentVal, setParentVal] = useState(20);

  // Get Start time and End time from each call(TO DO!)

  // Spectogram and sound waves options

  const WaveformOptions = (ref) => ({
    container: waveformRef.current,
    barWidth: 1,
    cursorWidth: 5,
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
        height: 50,
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
      SpectrogramPlugin.create({
        fftSamples: 512,
        container: "#wavespectrogram",
        labels: true,
        colorMap: colors,
        pixelRatio: 2,
        deferInit: SpectogramPluginInit,
      }),
    ],
  });

  let colors = colorMap({
    colorMap: "jet",
    nshades: 512,
    format: "float",
  });

  const url = `https://00f74ba44bbcc5574f34eab9034e3971243e115ccb-apidata.googleusercontent.com/download/storage/v1/b/test-gibbon-bucket/o/19700101_013658.wav?jk=AFshE3X3p31lEi5i05VmxHftclKziSxWPSc7jNuYzfDJitlWTyEvlmWKYiCduQWzy_hEls_D0QoCYyUYW-WNx3XhctL44kvv-qQh-Ax7mIsXWgxAVbpLHiqL_OcgBnPau4knDiFMWGlLTfxjf1b6Vfe2DpWCSmrBhpt-d9qM3OZMvKmmw3ZGVk02NeyV4vgNudIPKTU9GQ2r6ZF0COeba9DNY_H-RKcygnlZmUbmJ4Ib677PcXLXQOSymqex6svuBAt93jd86RCDSTjz2tGivH9sQVCCqHK9MqnnAXPMLsDuQ_LeS9ae9BNDyHpbhtAlbUfpT7uR47PK0MgWDS1285-MGJIlAsu4k-xbpm-s5tytc9PHI3KXZIEwvpb23l-PNUk8ZNtZ6ti_wZcF0Ga4nAt48nGk88nLSLCDG2pVCH0U1yzs1wCNKvfREJGv3hjq8VHXEEz41kvNKkGtuhX0aWQ9ewtM-tdaCapG_0dT3FcS3U3OD-VhxFVtV8Z593j-l0hHXPXoQENosFxEaJY8gnoTp7NfnvDO32iy-RAUAxWSqCznlRdpcjNHUoET-qTrDlaLTP-kk5Nfu723of5hqedaRt8e1pGyiyhin6SZ-qOy1szSmee1ajb20GuGIb_vzKeEC4xyJ1N1k5zmYfyVRO7aV689DLvmKsF4yD0jFgJXFr0FsSOgTfAe8ovyTfPBZ_r3hvDf_yeN91lOPNcmUMxJMxspH9B0jz_ZBDrvQT8bQo-3cW5W4nmlas40bNNyKuTapIiePAKaXau8fSik88uAtiB173ipSAtCD0Apsw6yL2NQ3MIKe4jjmg--OPfThoEweg9yHxKftJ78cVEYv6tHAIp-fCsW21nXBR77Bd466C0NZONynHY_w2BljoUY59-56CijL2nJ4BlRLfb51K_1_3wzRULRxSABeBHWvKFl0GZSUi5TR6enT2pbWGYJkJcNmRvmus8-bpk-7zGj&isca=1`;

  useEffect(() => {
    setPlay(false);

    const options = WaveformOptions(waveformRef.current);
    Waveform.current = WaveSurfer.create(options);
    Waveform.current.load(url);

    // Zoom
    Waveform.current.zoom(Number(parentVal));

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
  }, [parentVal, SpectogramPluginInit]);

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

  // Slider

  const sliderValueChanged = useCallback((val) => {
    // console.log("NEW VALUE", val);
    setParentVal(val);
  });

  const sliderProps = useMemo(
    () => ({
      min: 0,
      max: 200,
      value: parentVal,
      step: 1,
      label: "This is a Zoom slider",
      onChange: (e) => sliderValueChanged(e),
    }),
    [parentVal]
  );

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
          <label class="switch">
            <input
              id="SpectogramPluginInit"
              type="checkbox"
              onChange={ShowSpectogram}
            />
            <span className="sliderSwitch round"></span>
          </label>
          <div className="d-flex flex-column">
            <div>Zoom</div>
            <div>
              <RangeSlider {...sliderProps} />
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
