export default function toTimeStringFromSeconds(seconds) {
    let minute = Math.floor(seconds / 60);
    let second = ('0' + seconds % 60).slice(-2);

    return minute + ":" + second;
}