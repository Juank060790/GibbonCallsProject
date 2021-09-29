import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function NewCallSpectrogram({ call }) {
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const ref = useRef(null);

  var imageURL = selectedAudio.imageUrl;
  var imgs = [];

  useEffect(() => {
    // Load image
    function loadAllImages() {
      var img = new Image();
      imgs.push(img);
      img.onload = onLoad;
      img.src = imageURL;
    }
    loadAllImages();

    function onLoad() {
      imagesAllLoaded();
    }

    if (call && selectedAudio) {
      let canvas = ref.current;

      canvas.style.width = "100%";
      canvas.width = 200;
      canvas.height = 100;
      let ctx = canvas.getContext("2d");

      var imagesAllLoaded = function () {
        if (imageURL.length) {
          ctx.drawImage(
            imgs[0],
            call.start * (imgs[0].width / 300),
            0,
            (call.end - call.start) * (imgs[0].width / 300),
            imgs[0].height,
            0,
            0,
            canvas.width,
            canvas.height
          );
        }
      };
    }
  });

  return (
    <div>
      <canvas width="100%" ref={ref} />
    </div>
  );
}
