function partsFor(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
}

function offsetAt(date: Date, timeZone: string) {
  const parts = partsFor(date, timeZone);
  const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
  return asUtc - date.getTime();
}

function localTimeToInstant(value: string, timeZone: string) {
  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return new Date(NaN);
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) return new Date(NaN);
  const wallTime = Date.UTC(year, month - 1, day, hour, minute, 0);
  const initialOffset = offsetAt(new Date(wallTime), timeZone);
  let instant = new Date(wallTime - initialOffset);
  const correctedOffset = offsetAt(instant, timeZone);
  if (correctedOffset !== initialOffset) instant = new Date(wallTime - correctedOffset);
  return instant;
}

function formatResult(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export function convertLocalDateTime(value: string, fromTimeZone: string, toTimeZone: string) {
  const instant = localTimeToInstant(value, fromTimeZone);
  return Number.isNaN(instant.getTime()) ? null : formatResult(instant, toTimeZone);
}
