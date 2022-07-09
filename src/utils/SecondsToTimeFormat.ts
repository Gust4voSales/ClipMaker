function extractTimeUnitsFromSeconds(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

export function parseSecondsToTime(totalSeconds: number) {
  const timeObj = extractTimeUnitsFromSeconds(totalSeconds);

  return `${timeObj.hours.toString().padStart(2, "0")}:${timeObj.minutes.toString().padStart(2, "0")}:${timeObj.seconds
    .toString()
    .padStart(2, "0")}`;
}
