import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { ClipMaker, loadFFMPEG } from "../utils/ClipMaker";

export interface IClipContext {
  screenPlay: ScreenPlay | null;
  generateClip: () => void;

  videoInput: File | null;
  setVideoInput: Dispatch<SetStateAction<File | null>>;
  audioInput: File | null;
  setAudioInput: Dispatch<SetStateAction<File | null>>;

  clipDuration: number;
  setClipDuration: Dispatch<SetStateAction<number>>;
  overlayFilterId: string | null;
  setOverlayFilterId: Dispatch<SetStateAction<string | null>>;
  colorFilter: string | null;
  setColorFilter: Dispatch<SetStateAction<string | null>>;

  videoInputDuration: number;
  audioInputDuration: number;

  areInputsDisabled: () => boolean;
}
export const ClipContext = createContext<IClipContext>({} as IClipContext);

interface ClipProviderProps {
  children: ReactNode;
}
export function ClipProvider({ children }: ClipProviderProps) {
  const [screenPlay, setScreenPlay] = useState<ScreenPlay | null>(null);

  const [videoInput, setVideoInput] = useState<File | null>(null);
  const [audioInput, setAudioInput] = useState<File | null>(null);

  const [clipDuration, setClipDuration] = useState(0);
  const [overlayFilterId, setOverlayFilterId] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);

  const [videoInputDuration, setVideoInputDuration] = useState(0);
  const [audioInputDuration, setAudioInputDuration] = useState(0);

  useEffect(() => {
    loadFFMPEG();
  }, []);

  // Calculates the videoInput duration
  useEffect(() => {
    if (!videoInput) {
      setVideoInputDuration(0);
      return;
    }

    const videoEl = document.createElement("video");
    videoEl.setAttribute("id", "video-input");
    videoEl.setAttribute("src", URL.createObjectURL(videoInput));
    videoEl.ondurationchange = () => {
      setVideoInputDuration(Math.round(videoEl.duration));
    };
  }, [videoInput]);

  // Calculates the audioInput duration
  useEffect(() => {
    if (!audioInput) {
      setAudioInputDuration(0);
      return;
    }
    const audioEl = document.createElement("audio");
    audioEl.setAttribute("id", "audio-input");
    audioEl.setAttribute("src", URL.createObjectURL(audioInput));
    audioEl.ondurationchange = () => {
      setAudioInputDuration(Math.round(audioEl.duration));
    };
  }, [audioInput]);

  function generateClip() {
    console.table({
      video: `${videoInput?.name} - DURAÇÃO: ${videoInputDuration}s`,
      audio: `${audioInput?.name} - DURAÇÃO: ${audioInputDuration}s`,
      clipDuration,
      overlayFilterId,
      colorFilter,
    });

    const video = { media: videoInput!, duration: videoInputDuration };
    const audio = { media: audioInput!, duration: audioInputDuration };
    setScreenPlay(ClipMaker.generateClipScreenPlay(video, audio, clipDuration, overlayFilterId, colorFilter));
  }

  // Inputs can only be changed when there are video and audio set
  function areInputsDisabled() {
    return !videoInputDuration || !audioInputDuration;
  }

  return (
    <ClipContext.Provider
      value={{
        screenPlay,
        generateClip,
        videoInput,
        setVideoInput,
        audioInput,
        setAudioInput,
        clipDuration,
        setClipDuration,
        overlayFilterId,
        setOverlayFilterId,
        colorFilter,
        setColorFilter,
        videoInputDuration,
        audioInputDuration,
        areInputsDisabled,
      }}
    >
      {children}
    </ClipContext.Provider>
  );
}
