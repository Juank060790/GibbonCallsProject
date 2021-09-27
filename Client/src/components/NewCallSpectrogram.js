import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function NewCallSpectrogram({ call }) {
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const ref = useRef(null);
  console.log("call :>> ", call, selectedAudio);

  useEffect(() => {
    if (call && selectedAudio) {
      let canvas = ref.current;

      canvas.style.width = "100%";
      canvas.width = 200;
      canvas.height = 100;
      let ctx = canvas.getContext("2d");
      // Load image
      let image = new Image();
      image.src = selectedAudio.imageUrl;

      ctx.drawImage(
        image,
        call.start * (image.width / 300),
        0,
        (call.end - call.start) * (image.width / 300),
        image.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  });

  return (
    <div>
      <canvas width="100%" ref={ref} />
    </div>
  );
}
