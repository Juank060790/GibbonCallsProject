// Converts second to minutes and seconds

export default function toTimeString(seconds) {
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  var d = new Date(seconds * 1000);
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds()); // Add leading zero
  return m + ":" + s;
}
