// import lamejs from "lamejs";

// export function paste(instance, cutSelection) {
//   var offlineAudioContext = instance.backend.ac;
//   var originalAudioBuffer = instance.backend.buffer;

//   let cursorPosition = instance.getCurrentTime();
//   var newAudioBuffer = offlineAudioContext.createBuffer(
//     originalAudioBuffer.numberOfChannels,
//     originalAudioBuffer.length + cutSelection.length,
//     originalAudioBuffer.sampleRate
//   );

//   for (
//     var channel = 0;
//     channel < originalAudioBuffer.numberOfChannels;
//     channel++
//   ) {
//     var new_channel_data = newAudioBuffer.getChannelData(channel);
//     var empty_segment_data = cutSelection.getChannelData(channel);
//     var original_channel_data = originalAudioBuffer.getChannelData(channel);

//     var before_data = original_channel_data.subarray(
//       0,
//       cursorPosition * originalAudioBuffer.sampleRate
//     );
//     var mid_data = empty_segment_data;
//     var after_data = original_channel_data.subarray(
//       Math.floor(cursorPosition * originalAudioBuffer.sampleRate),
//       originalAudioBuffer.length * originalAudioBuffer.sampleRate
//     );

//     new_channel_data.set(before_data);
//     new_channel_data.set(mid_data, cursorPosition * newAudioBuffer.sampleRate);
//     new_channel_data.set(
//       after_data,
//       (cursorPosition + cutSelection.duration) * newAudioBuffer.sampleRate
//     );
//   }
//   return newAudioBuffer;
// }

// export function cut(params, instance) {
//   /*
//     ---------------------------------------------
//     The function will take the buffer used to create the waveform and will
//     create
//     a new blob with the selected area from the original blob using the
//     offlineAudioContext
//     */

//   // var self = this;
//   var start = params.start;
//   var end = params.end;
//   var originalAudioBuffer = instance.backend.buffer;
//   console.log(`originalAudioBuffer`, originalAudioBuffer);

//   var lengthInSamples = Math.floor(
//     (end - start) * originalAudioBuffer.sampleRate
//   );
//   if (!window.OfflineAudioContext) {
//     if (!window.webkitOfflineAudioContext) {
//       // $('#output').append('failed : no audiocontext found, change browser');
//       alert("webkit context not found");
//     }
//     window.OfflineAudioContext = window.webkitOfflineAudioContext;
//   }
//   // var offlineAudioContext = new OfflineAudioContext(1, 2,originalAudioBuffer.sampleRate );
//   var offlineAudioContext = instance.backend.ac;

//   var emptySegment = offlineAudioContext.createBuffer(
//     originalAudioBuffer.numberOfChannels,
//     lengthInSamples,
//     originalAudioBuffer.sampleRate
//   );
//   console.log(`emptySegment`, emptySegment);
//   var newAudioBuffer = offlineAudioContext.createBuffer(
//     originalAudioBuffer.numberOfChannels,
//     start === 0
//       ? originalAudioBuffer.length - emptySegment.length
//       : originalAudioBuffer.length,
//     originalAudioBuffer.sampleRate
//   );
//   console.log(`newAudioBuffer`, newAudioBuffer);
//   for (
//     var channel = 0;
//     channel < originalAudioBuffer.numberOfChannels;
//     channel++
//   ) {
//     var new_channel_data = newAudioBuffer.getChannelData(channel);
//     var empty_segment_data = emptySegment.getChannelData(channel);
//     var original_channel_data = originalAudioBuffer.getChannelData(channel);

//     var before_data = original_channel_data.subarray(
//       0,
//       start * originalAudioBuffer.sampleRate
//     );
//     var mid_data = original_channel_data.subarray(
//       start * originalAudioBuffer.sampleRate,
//       end * originalAudioBuffer.sampleRate
//     );
//     var after_data = original_channel_data.subarray(
//       Math.floor(end * originalAudioBuffer.sampleRate),
//       originalAudioBuffer.length * originalAudioBuffer.sampleRate
//     );
//     empty_segment_data.set(mid_data);
//     if (start <= 0) {
//       new_channel_data.set(before_data);
//       new_channel_data.set(after_data, start * newAudioBuffer.sampleRate);
//     } else {
//       new_channel_data.set(after_data);
//     }
//   }
//   return {
//     newAudioBuffer,
//     cutSelection: emptySegment,
//   };
// }

// export function copy(region, instance) {
//   var segmentDuration = region.end - region.start;

//   var originalBuffer = instance.backend.buffer;
//   var emptySegment = instance.backend.ac.createBuffer(
//     originalBuffer.numberOfChannels,
//     segmentDuration * originalBuffer.sampleRate,
//     originalBuffer.sampleRate
//   );
//   for (var i = 0; i < originalBuffer.numberOfChannels; i++) {
//     var chanData = originalBuffer.getChannelData(i);
//     var emptySegmentData = emptySegment.getChannelData(i);
//     var mid_data = chanData.subarray(
//       region.start * originalBuffer.sampleRate,
//       region.end * originalBuffer.sampleRate
//     );
//     emptySegmentData.set(mid_data);
//   }

//   return emptySegment;
// }

// export function bufferToWave(abuffer, offset, len) {
//   var numOfChan = abuffer.numberOfChannels,
//     length = len * numOfChan * 2 + 44,
//     buffer = new ArrayBuffer(length),
//     view = new DataView(buffer),
//     channels = [],
//     i,
//     sample,
//     pos = 0;

//   // write WAVE header
//   setUint32(0x46464952); // "RIFF"
//   setUint32(length - 8); // file length - 8
//   setUint32(0x45564157); // "WAVE"

//   setUint32(0x20746d66); // "fmt " chunk
//   setUint32(16); // length = 16
//   setUint16(1); // PCM (uncompressed)
//   setUint16(numOfChan);
//   setUint32(abuffer.sampleRate);
//   setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
//   setUint16(numOfChan * 2); // block-align
//   setUint16(16); // 16-bit (hardcoded in this demo)

//   setUint32(0x61746164); // "data" - chunk
//   setUint32(length - pos - 4); // chunk length

//   // write interleaved data
//   for (i = 0; i < abuffer.numberOfChannels; i++)
//     channels.push(abuffer.getChannelData(i));

//   while (pos < length) {
//     for (i = 0; i < numOfChan; i++) {
//       // interleave channels
//       sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
//       sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
//       view.setInt16(pos, sample, true); // update data chunk
//       pos += 2;
//     }
//     offset++; // next source sample
//   }

//   // create Blob
//   return new Blob([buffer], { type: "audio/mpeg" });

//   function setUint16(data) {
//     view.setUint16(pos, data, true);
//     pos += 2;
//   }

//   function setUint32(data) {
//     console.log(`data`, data);
//     view.setUint32(pos, data, true);
//     pos += 4;
//   }
// }

// function wavToMp3(channels, sampleRate, samples) {
//   var buffer = [];
//   var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
//   var remaining = samples.length;
//   var samplesPerFrame = 1152;
//   for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
//     var mono = samples.subarray(i, i + samplesPerFrame);
//     var mp3buf = mp3enc.encodeBuffer(mono);
//     if (mp3buf.length > 0) {
//       buffer.push(new Int8Array(mp3buf));
//     }
//     remaining -= samplesPerFrame;
//   }
//   var d = mp3enc.flush();
//   if (d.length > 0) {
//     buffer.push(new Int8Array(d));
//   }

//   var mp3Blob = new Blob(buffer, { type: "audio/mp3" });
//   var bUrl = window.URL.createObjectURL(mp3Blob);

//   // send the download link to the console
//   console.log("mp3 download:", bUrl);
// }

// export function audioBufferToWav(aBuffer) {
//   let numOfChan = aBuffer.numberOfChannels,
//     btwLength = aBuffer.length * numOfChan * 2 + 44,
//     btwArrBuff = new ArrayBuffer(btwLength),
//     btwView = new DataView(btwArrBuff),
//     btwChnls = [],
//     btwIndex,
//     btwSample,
//     btwOffset = 0,
//     btwPos = 0;
//   setUint32(0x46464952); // "RIFF"
//   setUint32(btwLength - 8); // file length - 8
//   setUint32(0x45564157); // "WAVE"
//   setUint32(0x20746d66); // "fmt " chunk
//   setUint32(16); // length = 16
//   setUint16(1); // PCM (uncompressed)
//   setUint16(numOfChan);
//   setUint32(aBuffer.sampleRate);
//   setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
//   setUint16(numOfChan * 2); // block-align
//   setUint16(16); // 16-bit
//   setUint32(0x61746164); // "data" - chunk
//   setUint32(btwLength - btwPos - 4); // chunk length

//   for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
//     btwChnls.push(aBuffer.getChannelData(btwIndex));

//   while (btwPos < btwLength) {
//     for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
//       // interleave btwChnls
//       btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
//       btwSample =
//         (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
//       btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
//       btwPos += 2;
//     }
//     btwOffset++; // next source sample
//   }

//   let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));
//   let wavSamples = new Int16Array(
//     btwArrBuff,
//     wavHdr.dataOffset,
//     wavHdr.dataLen / 2
//   );

//   wavToMp3(wavHdr.channels, wavHdr.sampleRate, wavSamples);

//   function setUint16(data) {
//     btwView.setUint16(btwPos, data, true);
//     btwPos += 2;
//   }

//   function setUint32(data) {
//     btwView.setUint32(btwPos, data, true);
//     btwPos += 4;
//   }
// }
