import { useEffect, useState } from "react";
import { useClip } from "../../hooks/useClip";
import { parseSecondsToTime } from "../../utils/SecondsToTimeFormat";
import * as S from "./styles";

export function DurationInput() {
  const { videoInputDuration, areInputsDisabled, clipDuration, setClipDuration } = useClip();

  const [max, setMax] = useState(1);

  // useEffect(() => {
  //   // if video and audio are set, then display clipDuration and set max range to the clipDuration
  //   if (!areInputsDisabled()) {
  //     setMax(videoInputDuration);
  //   } else {
  //     // otherwise set max 1 and clipDuration to 0 (the range input is displayed properly as disabled)
  //     setMax(1);
  //   }
  // }, [areInputsDisabled]);

  useEffect(() => {
    if (videoInputDuration) {
      setMax(videoInputDuration);
      setClipDuration(Math.floor(videoInputDuration / 2));
    } else {
      setMax(1);
      setClipDuration(0);
    }
  }, [videoInputDuration]);

  return (
    <S.Container>
      <S.DurationRange
        value={clipDuration}
        onChange={(e) => {
          setClipDuration(Number(e.target.value));
        }}
        disabled={areInputsDisabled()}
        type="range"
        min={1}
        max={max}
        style={{ backgroundSize: `${(clipDuration * 100) / max}% 100%` }}
      />
      <S.SelectedDuration style={areInputsDisabled() ? { opacity: 0.7 } : {}}>
        {clipDuration > 0 ? parseSecondsToTime(clipDuration) : 0}
      </S.SelectedDuration>
    </S.Container>
  );
}
