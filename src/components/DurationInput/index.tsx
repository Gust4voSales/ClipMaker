import { useEffect, useState } from "react";
import { formatSecondsToTime } from "../../utils/SecondsToTimeFormat";
import * as S from "./styles";

interface DurationInputProps {
  disabled: boolean;
  min: number;
  max: number;
}
export function DurationInput({ disabled, min, max }: DurationInputProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (max > 1) {
      setDuration(Math.floor(max / 2));
    } else {
      setDuration(0);
    }
  }, [max]);

  function parseSecondsToTime() {
    const timeObj = formatSecondsToTime(duration);

    let timeStr = "";
    if (timeObj.hours > 0) {
      timeStr = `${timeObj.hours.toString().padStart(2, "0")}:`;
    }
    if (timeObj.hours > 0 || timeObj.minutes > 0) {
      timeStr += `${timeObj.minutes.toString().padStart(2, "0")}:${timeObj.seconds.toString().padStart(2, "0")}`;
    } else {
      timeStr = `${timeObj.seconds.toString().padStart(2, "0")} s`;
    }

    return timeStr;
  }

  return (
    <S.Container>
      <S.DurationRange
        value={duration}
        onChange={(e) => {
          setDuration(Number(e.target.value));
        }}
        disabled={disabled}
        type="range"
        min={min}
        max={max}
        style={{ backgroundSize: `${(duration * 100) / max}% 100%` }}
      />
      <S.SelectedDuration style={disabled ? { opacity: 0.7 } : {}}>
        {duration > 0 ? parseSecondsToTime() : 0}
      </S.SelectedDuration>
    </S.Container>
  );
}
