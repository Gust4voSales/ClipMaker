import hexToRgba from "hex-to-rgba";
import { useEffect, useRef, useState } from "react";

interface ClipPreviewProps {
  videoInput: File;
  audioInput: File;
  screenPlay: ScreenPlay;
}

enum VIDEO_STATES {
  PLAYING,
  PAUSED,
  FINISHED,
}

let timeoutTickingFrameRef: NodeJS.Timeout | null = null;
export function ClipPreview({ videoInput, audioInput, screenPlay }: ClipPreviewProps) {
  const FRAME_RATE = 33.3; // TO DO: Get frame rate from the input video instead of using hardcoded 33.3
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  const [video, setVideo] = useState<HTMLVideoElement>();
  const [videoOverlay, setVideoOverlay] = useState<HTMLVideoElement>();
  const [audio, setAudio] = useState<HTMLAudioElement>();

  const [frames, setFrames] = useState<number[]>([]);
  const [videoState, setVideoState] = useState(VIDEO_STATES.PAUSED);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    setCanvas(canvasRef.current!);
  }, [canvasRef.current]);

  // when canvas reference has loaded then iniatialize all medias
  useEffect(() => {
    if (!canvas) return;

    const initializedMedia = initializeVideoAndAudio();
    setVideo(initializedMedia.video);
    setAudio(initializedMedia.audio);
    setVideoOverlay(initializedMedia.videoOverlay);
  }, [canvas, videoInput, audioInput, screenPlay]);
  // once video has been referenced then set the frames
  useEffect(() => {
    if (!video) return;

    setFrames(parseTimeLineToFramesArray());
  }, [video]);

  useEffect(() => {
    if (!video || !audio || !(screenPlay.overlayFilter && videoOverlay)) return;

    if (timeoutTickingFrameRef)
      // clear process video recursive call that are pending if it exists
      clearTimeout(timeoutTickingFrameRef!);

    if (videoState === VIDEO_STATES.PLAYING) {
      audio.play();
      videoOverlay?.play();
      processVideo(currentFrameIndex);
    } else {
      audio.pause();
      videoOverlay?.pause();
    }

    if (videoState === VIDEO_STATES.FINISHED) {
      audio.currentTime = 0;
      if (videoOverlay) videoOverlay.currentTime = 0;
      setCurrentFrameIndex(0);
    }
  }, [videoState]);

  function parseTimeLineToFramesArray() {
    let framesArray: number[] = [];
    screenPlay.timeline.forEach((line) => {
      if (line.toString() === "transition") {
        // add 1 second (which is the amount of FRAME_RATE) of -1 to represent a transition
        for (let i = 0; i < FRAME_RATE; i++) {
          framesArray.push(-1);
        }
      } else {
        const clip = line as { start: number; duration: number };

        const frameClipStart = Math.round(clip.start * FRAME_RATE);
        const frameClipEnd = Math.round((clip.start + clip.duration) * FRAME_RATE);

        for (let i = frameClipStart; i <= frameClipEnd; i++) {
          framesArray.push(i);
        }
      }
    });

    console.log(screenPlay.timeline);
    console.log(framesArray);

    return framesArray;
  }

  function resetPreview() {
    setCurrentFrameIndex(0);
    setVideoState(VIDEO_STATES.PAUSED);
    if (timeoutTickingFrameRef) clearTimeout(timeoutTickingFrameRef);

    // destroy previous medias elements
    const videoEl = document.getElementById("video-preview-input");
    const audioEl = document.getElementById("audio-preview-input");
    const videoOverlayEl = document.getElementById("video-preview-overlay");
    if (videoEl && audioEl) {
      videoEl.parentNode?.removeChild(videoEl);
      audioEl.parentNode?.removeChild(audioEl);
    }
    if (videoOverlayEl) videoOverlayEl.parentNode?.removeChild(videoOverlayEl);
  }

  function initializeVideoAndAudio() {
    resetPreview(); // remove/reset old preview stuff

    const video = document.createElement("video");
    video.setAttribute("id", "video-preview-input");
    video.src = URL.createObjectURL(videoInput);
    video.load();

    const audio = document.createElement("audio");
    audio.setAttribute("id", "audio-preview-input");
    audio.src = URL.createObjectURL(audioInput);
    audio.loop = true;
    audio.load();

    let videoOverlay: HTMLVideoElement | undefined;
    if (screenPlay.overlayFilter) {
      videoOverlay = document.createElement("video");
      videoOverlay.setAttribute("id", "video-preview-overlay");
      videoOverlay.src = "/overlay.mov";
      videoOverlay.volume = 0;
      videoOverlay.loop = true;
      videoOverlay.load();
    }

    const context = canvas!.getContext("2d")!;
    context.canvas.width = 640;
    context.canvas.height = 360;

    return { video, audio, videoOverlay };
  }

  function processVideo(frameIndex: number) {
    if (frameIndex >= frames.length - 1) {
      setVideoState(VIDEO_STATES.FINISHED);
      return;
    }

    showVideoFrame(frames[frameIndex]);
    showFrameNumbers(frames[frameIndex], frameIndex);

    frameIndex++;
    setCurrentFrameIndex(frameIndex);

    timeoutTickingFrameRef = setTimeout(() => {
      processVideo(frameIndex);
    }, FRAME_RATE);
  }

  function showVideoFrame(frame: number) {
    const context = canvas!.getContext("2d")!;

    if (frame === -1) {
      // transition
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas!.width, canvas!.height);

      if (screenPlay.overlayFilter) addFilterOverlay(context);
      return;
    }

    const time = frame / FRAME_RATE;

    video!.currentTime = time;
    context.drawImage(video!, 0, 0, canvas!.width, canvas!.height);

    if (screenPlay.overlayFilter) addFilterOverlay(context);

    if (screenPlay.colorFilter) addColorOverlay(context);
  }

  function addColorOverlay(context: CanvasRenderingContext2D) {
    context.fillStyle = hexToRgba(screenPlay.colorFilter!, 0.15); // transparency
    context.fillRect(0, 0, canvas!.width, canvas!.height);
  }

  function addFilterOverlay(context: CanvasRenderingContext2D) {
    context.globalAlpha = 0.3;
    context.drawImage(videoOverlay!, 0, 0, canvas!.width, canvas!.height);
    context.globalAlpha = 1;
  }

  function showFrameNumbers(frame: number, frameIndex: number) {
    const context = canvas!.getContext("2d")!;
    context.font = "30px Arial";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillStyle = "white";
    const currentTime = Math.round(frameIndex / FRAME_RATE).toString();
    context.fillText(frame.toString() + "/" + currentTime, 5, 5);
  }

  // Since all medias are independent and are playing at the same time, changing the videos' current progress
  // won't change the other medias progress, this function syncs the other medias with the current
  // progress of the video
  function syncMediasWithNewVideoProgress(currentProgressTime: number) {
    syncMediaWithNewVideoProgress(audio!, currentProgressTime);
    if (videoOverlay) syncMediaWithNewVideoProgress(videoOverlay, currentProgressTime);

    // encapsulating this logic to be able to reuse for every media requested to sync
    function syncMediaWithNewVideoProgress(media: HTMLVideoElement | HTMLAudioElement, currentProgressTime: number) {
      const mediaDuration = Math.round(media.duration);

      let mediaPositionRelativeToVideo = currentProgressTime / mediaDuration;

      if (Number.isInteger(mediaPositionRelativeToVideo)) {
        // eg: 10s (currentProgressTime) / 5s (media duration)
        media.currentTime = 0; // loop again
      } else {
        // eg: 10s (currentProgressTime) / 4s (media duration) = 2.5 So it has passed 0.5 * 4s from the media
        const decimals = mediaPositionRelativeToVideo - Math.floor(mediaPositionRelativeToVideo);
        const timePassedProgress = decimals * mediaDuration;
        media.currentTime = timePassedProgress;
      }
    }
  }

  return (
    <div id="cont">
      <h5 style={{ margin: 0 }}>PREVIEW</h5>
      <canvas ref={canvasRef} />

      <div>
        <button
          onClick={() => {
            if (videoState !== VIDEO_STATES.PLAYING) setVideoState(VIDEO_STATES.PLAYING);
          }}
        >
          PLAY
        </button>
        <button
          onClick={() => {
            if (videoState === VIDEO_STATES.PLAYING) setVideoState(VIDEO_STATES.PAUSED);
          }}
        >
          PAUSE
        </button>

        <input
          type="range"
          style={{ width: "100%" }}
          min={0}
          max={screenPlay.duration}
          onMouseDown={() => {
            setVideoState(VIDEO_STATES.PAUSED);
          }}
          onMouseUp={() => setVideoState(VIDEO_STATES.PLAYING)}
          value={Math.round(currentFrameIndex / FRAME_RATE)}
          onChange={(e) => {
            syncMediasWithNewVideoProgress(Number(e.target.value));
            setCurrentFrameIndex(Math.round(Number(e.target.value) * FRAME_RATE));
          }}
        />
        <span>{Math.round(currentFrameIndex / FRAME_RATE)}</span>
      </div>
    </div>
  );
}
