export default function toDateStringFromDateTime(dateTime) {
    const date = new Date(dateTime);
    return (
      date.getFullYear()
      + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
      + '/' + ('0' + date.getDate()).slice(-2)
    )
}