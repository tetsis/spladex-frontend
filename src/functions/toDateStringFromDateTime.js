export default function toDateStringFromDateTime(dateTime, delimiter = "/") {
    const date = new Date(dateTime);
    return (
      date.getFullYear()
      + delimiter + ('0' + (date.getMonth() + 1)).slice(-2)
      + delimiter + ('0' + date.getDate()).slice(-2)
    )
}