import hexToRgba from "hex-to-rgba";
import { useEffect, useRef, useState } from "react";

interface ClipPreviewProps {
  screenPlay: ScreenPlay;
}

let timeoutTickingFrameRef: NodeJS.Timeout | null = null;
export function ClipPreview3({ screenPlay }: ClipPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  const [video, setVideo] = useState<HTMLVideoElement>();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [videoOverlay, setVideoOverlay] = useState<HTMLVideoElement>();

  const [videoTimer, setVideoTimer] = useState(0);
  // const [currentTime, setCurrentTime] = useState(screenPlay.timeline[0].start);
  let videoPlaybackPosition = screenPlay.timeline[0].start; // in seconds
  let currentClipIndex = 0;
  let transition = false;
  // const [currentClipIndex, setCurrentClipIndex] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    setCanvas(canvasRef.current!);
  }, [canvasRef.current]);

  // when canvas reference has loaded then initialize all medias
  useEffect(() => {
    if (!canvas) return;

    console.log("new screenplay");
    console.log(screenPlay.timeline);
    const initializedMedia = initializeVideoAndAudio();
    setVideo(initializedMedia.video);
    setAudio(initializedMedia.audio);
    setVideoOverlay(initializedMedia.videoOverlay);
  }, [canvas, screenPlay]);

  // Set events
  useEffect(() => {
    if (!video) return;

    video.addEventListener(
      "play",
      () => {
        if (timeoutTickingFrameRef) clearTimeout(timeoutTickingFrameRef);

        // using absolute value because transitions use negative values
        video.currentTime = Math.abs(videoPlaybackPosition);

        audio?.play();
        videoOverlay?.play();
        processVideo();
      },
      false
    );
    video.addEventListener(
      "pause",
      () => {
        if (timeoutTickingFrameRef) clearTimeout(timeoutTickingFrameRef);

        audio?.pause();
        videoOverlay?.pause();
      },
      false
    );
    video.addEventListener(
      "timeupdate",
      () => {
        setVideoTimer(calculateCurrentTime());
      },
      false
    );
  }, [video]);

  function resetPreview() {
    videoPlaybackPosition = screenPlay.timeline[0].start;
    currentClipIndex = 0;
    if (timeoutTickingFrameRef) clearTimeout(timeoutTickingFrameRef);

    // destroy previous medias elements
    const container = document.getElementById("preview-container");

    const videoEl = document.getElementById("video-preview-input");
    const audioEl = document.getElementById("audio-preview-input");
    const videoOverlayEl = document.getElementById("video-preview-overlay");

    if (videoEl && audioEl) {
      container?.removeChild(videoEl);
      container?.removeChild(audioEl);
    }
    if (videoOverlayEl) container?.removeChild(videoOverlayEl);
  }

  function initializeVideoAndAudio() {
    resetPreview(); // remove/reset old preview stuff

    const container = document.getElementById("preview-container");
    const video = document.createElement("video");
    container?.appendChild(video);
    video.setAttribute("id", "video-preview-input");
    video.src = URL.createObjectURL(screenPlay.videoInput.media);
    video.style.display = "none";
    video.volume = 0;
    video.load();

    const audio = document.createElement("audio");
    container?.appendChild(audio);
    audio.setAttribute("id", "audio-preview-input");
    audio.src = URL.createObjectURL(screenPlay.audioInput.media);
    audio.style.display = "none";
    audio.loop = true;
    audio.load();

    let videoOverlay: HTMLVideoElement | undefined;
    if (screenPlay.overlayFilter) {
      videoOverlay = document.createElement("video");
      container?.appendChild(videoOverlay);
      videoOverlay.setAttribute("id", "video-preview-overlay");
      videoOverlay.src = screenPlay.overlayFilter;
      videoOverlay.style.display = "none";
      videoOverlay.volume = 0;
      videoOverlay.loop = true;
      videoOverlay.load();
    }

    const context = canvas!.getContext("2d")!;
    context.canvas.width = 640;
    context.canvas.height = 360;

    return { video, audio, videoOverlay };
  }

  function calculateCurrentTime() {
    let ellapsedTime = 0; // total ellapsedTime to be calculated

    let elapsedTimeFromPreviousClips = 0;
    screenPlay.timeline.slice(0, currentClipIndex).forEach((clip) => {
      elapsedTimeFromPreviousClips += clip.duration;
    });

    const currentClip = screenPlay.timeline[currentClipIndex];
    if (transition) {
      ellapsedTime = elapsedTimeFromPreviousClips;
    } else {
      // ellapsedTimeFromCurrentClip => videoPlaybackPosition - currentClip.start
      // ellapsedTimeTotal => ellapsedTimeFromCurrentClip + elapsedTimeFromPreviousClips
      ellapsedTime = videoPlaybackPosition - currentClip.start + elapsedTimeFromPreviousClips;
    }
    return Math.round(videoPlaybackPosition);
    return Math.round(ellapsedTime);
  }

  // called when the video is supposed to finish
  function finishVideo() {
    currentClipIndex = 0; // reset clips index

    // reset video time to the start of the 1st clip and other medias to the inital time
    videoPlaybackPosition = screenPlay.timeline[0].start;
    setVideoTimer(videoPlaybackPosition);
    audio!.currentTime = 0;
    if (videoOverlay) videoOverlay!.currentTime = 0;

    video!.pause();
  }

  function processVideo() {
    const isTransition = screenPlay.timeline[currentClipIndex].start === -1;
    // transitions start are -1, so we add 1 when computing clipEndTime of a transition
    const clipEndTime =
      screenPlay.timeline[currentClipIndex].start +
      screenPlay.timeline[currentClipIndex].duration +
      (isTransition ? 1 : 0);

    // Example: In a 3 seconds clip duration our videoPlaybackPosition starts at -3,
    // and once it reaches 0 it means the transition has finished after 3 seconds (this is checked further below)
    if (isTransition) {
      // (initial set) transition has not started yet, set video current time to 0
      if (videoPlaybackPosition >= 0) {
        video!.currentTime = 0;
      }
      videoPlaybackPosition = -screenPlay.timeline[currentClipIndex].duration + video!.currentTime;
    }

    // CHECK IF CURRENT CLIP HAS FINISHED SO WE CAN JUMP TO THE NEXT IF THERE IS ONE
    if (video!.currentTime > clipEndTime) {
      // end of the video (no more clips to push, so reset)
      if (currentClipIndex === screenPlay.timeline.length - 1) {
        finishVideo();
        return;
      }

      // jump to the next clip
      currentClipIndex += 1;
      video!.currentTime = screenPlay.timeline[currentClipIndex].start;
    }

    // if it is not a transition, set videoPlaybackPosition to keep track of the video currentTime
    if (!isTransition) videoPlaybackPosition = video!.currentTime;

    showVideoFrame();
    showCurrentClipHelper();

    timeoutTickingFrameRef = setTimeout(() => {
      processVideo();
    }, 0);
  }

  // DEBUGGER function that displays information
  function showCurrentClipHelper() {
    const context = canvas!.getContext("2d")!;
    context.font = "24px Arial";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillStyle = "white";
    const endOfClip = screenPlay.timeline[currentClipIndex].start + screenPlay.timeline[currentClipIndex].duration;
    context.fillText(
      `ATUAL: ${Math.round(videoPlaybackPosition)} - FIM: ${endOfClip} - CLIP_INDEX: ${currentClipIndex}/${
        screenPlay.timeline.length - 1
      }`,
      5,
      5
    );
  }

  function showVideoFrame() {
    const context = canvas!.getContext("2d")!;

    //transition
    if (screenPlay.timeline[currentClipIndex].start === -1) {
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas!.width, canvas!.height);

      if (screenPlay.overlayFilter) addFilterOverlay(context);
      return;
    }
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
    <div id="preview-container">
      <canvas ref={canvasRef} />

      <div>
        <button
          onClick={() => {
            if (video?.paused) video.play();
          }}
        >
          PLAY
        </button>
        <button
          onClick={() => {
            if (!video?.paused) video?.pause();
          }}
        >
          PAUSE
        </button>

        <input
          type="range"
          style={{ width: "100%" }}
          min={0}
          max={screenPlay.duration}
          // onMouseDown={() => {
          //   setVideoState(VIDEO_STATES.PAUSED);
          // }}
          // onMouseUp={() => setVideoState(VIDEO_STATES.PLAYING)}
          // value={Math.round(videoPlaybackPosition)}
          // onChange={(e) => {
          //   video!.currentTime = Number(e.target.value);
          //   syncMediasWithNewVideoProgress(Number(e.target.value));
          // }}
        />
        <span>{videoTimer}</span>
      </div>
    </div>
  );
}
