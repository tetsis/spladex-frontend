export default function toSecondsFromTimeString(time) {
    if (time.indexOf(':') === -1) {
      // : が含まれていなければ整数にして返す
      return parseInt(time, 10);
    }

    let elements = time.split(':');
    let minute = parseInt(elements[0], 10);
    let second = parseInt(elements[1], 10);
    let seconds = minute * 60 + second;

    return seconds;
}
