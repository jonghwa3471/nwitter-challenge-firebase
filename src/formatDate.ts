export default function FormatDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 1~12 → 01~12
  const day = String(date.getDate()).padStart(2, "0");

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = days[date.getDay()]; // 0~6

  const formattedDate = `${year}-${month}-${day}-${dayOfWeek}`;

  return formattedDate;
}
