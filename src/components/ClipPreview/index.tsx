import { useEffect, useRef, useState } from "react";
import hexToRgba from "hex-to-rgba";
import * as S from "./styles";
import { Pause, Play, SpeakerSimpleHigh, SpeakerSimpleLow, SpeakerSimpleNone } from "phosphor-react";
import { parseSecondsToTime } from "../../utils/SecondsToTimeFormat";
import theme from "../../styles/theme";

interface ClipPreviewProps {
  screenPlay: ScreenPlay;
}

let timeoutTickingFrameRef: NodeJS.Timeout | null = null;
export function ClipPreview({ screenPlay }: ClipPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  const [video, setVideo] = useState<HTMLVideoElement>();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [videoOverlay, setVideoOverlay] = useState<HTMLVideoElement>();

  let videoPlaybackPosition = screenPlay.timeline[0].start; // in seconds
  let currentClipIndex = 0;

  useEffect(() => {
    if (!canvasRef.current) return;
    setCanvas(canvasRef.current!);
  }, [canvasRef.current]);

  // when canvas reference has loaded then initialize all medias
  useEffect(() => {
    if (!canvas) return;

    console.log("new screenplay");
    console.log(screenPlay.timeline);

    const initializedMedia = initializeMedias();
    setVideo(initializedMedia.video);
    setAudio(initializedMedia.audio);
    setVideoOverlay(initializedMedia.videoOverlay);
  }, [canvas, screenPlay]);

  // Set video related events
  useEffect(() => {
    if (!video) return;
    changePlayButtonIcon();

    const onPlay = () => {
      if (timeoutTickingFrameRef) clearTimeout(timeoutTickingFrameRef);

      // using absolute value because transitions use negative values
      video.currentTime = Math.abs(videoPlaybackPosition);

      audio?.play();
      videoOverlay?.play();
      changePlayButtonIcon();
      processVideo(); // process the canvas
    };
    const onPause = () => {
      if (timeoutTickingFrameRef) clearTimeout(timeoutTickingFrameRef);

      audio?.pause();
      videoOverlay?.pause();
      changePlayButtonIcon();
    };

    video.addEventListener("play", onPlay, false);
    video.addEventListener("pause", onPause, false);
    // updates progress indicators
    video.addEventListener("timeupdate", setVideoTimers, false);

    return () => {
      video.removeEventListener("play", onPlay, false);
      video.removeEventListener("pause", onPause, false);
      video.removeEventListener("timeupdate", setVideoTimers, false);
    };
  }, [video]);

  // updates elements that are responsible of displaying the progress of the video (timeline and timer)
  function setVideoTimers() {
    const currentTime = calculateCurrentTime();

    // Set timeline progress (range) and timer progress span values
    document.getElementById("timer-progress")!.textContent = `${parseSecondsToTime(currentTime)} / ${parseSecondsToTime(
      screenPlay.duration
    )}`;

    const timeline = document.getElementById("timeline-progress") as HTMLInputElement;
    timeline.value = String(currentTime);
    timeline.style.backgroundSize = `${(parseFloat(timeline.value) * 100) / screenPlay.duration}% 100%`;
  }

  function resetPreview() {
    if (timeoutTickingFrameRef) clearTimeout(timeoutTickingFrameRef);

    // destroy previous medias elements
    const container = document.getElementById("invisible-medias-preview-container");

    while (container!.lastChild) {
      container!.removeChild(container!.lastChild);
    }
  }

  function initializeMedias() {
    resetPreview(); // remove/reset old preview stuff

    const container = document.getElementById("invisible-medias-preview-container");
    const video = document.createElement("video");
    container?.appendChild(video);
    video.style.display = "none";
    video.src = URL.createObjectURL(screenPlay.videoInput.media);
    video.volume = 0;
    video.load();

    const audio = document.createElement("audio");
    container?.appendChild(audio);
    audio.style.display = "none";
    audio.src = URL.createObjectURL(screenPlay.audioInput.media);
    audio.loop = true;
    audio.volume = 0.5;
    changeVolumeIcon(0.5);
    document.getElementById("volume-control")!.style.backgroundSize = "50% 100%"; // reseting input range visual position
    audio.load();

    let videoOverlay: HTMLVideoElement | undefined;
    if (screenPlay.overlayFilter) {
      videoOverlay = document.createElement("video");
      container?.appendChild(videoOverlay);
      videoOverlay.style.display = "none";
      videoOverlay.src = screenPlay.overlayFilter;
      videoOverlay.volume = 0;
      videoOverlay.loop = true;
      videoOverlay.load();
    }

    const context = canvas!.getContext("2d")!;
    context.canvas.width = 640;
    context.canvas.height = 360;
    context.fillStyle = theme.colors.secondary; // transparency
    context.fillRect(0, 0, canvas!.width, canvas!.height);

    return { video, audio, videoOverlay };
  }

  // calculates current progress of the video
  function calculateCurrentTime() {
    let ellapsedTime = 0; // total ellapsedTime to be calculated
    let elapsedTimeFromPreviousClips = 0;
    screenPlay.timeline.slice(0, currentClipIndex).forEach((clip) => {
      elapsedTimeFromPreviousClips += clip.duration;
    });
    const currentClip = screenPlay.timeline[currentClipIndex];
    // transition
    if (currentClip.start === -1) {
      // ellapsedTime = videoTimer + video!.currentTime + elapsedTimeFromPreviousClips;
      ellapsedTime = video!.currentTime + elapsedTimeFromPreviousClips;
    } else {
      // ellapsedTimeFromCurrentClip => videoPlaybackPosition - currentClip.start
      // ellapsedTimeTotal => ellapsedTimeFromCurrentClip + elapsedTimeFromPreviousClips
      ellapsedTime = videoPlaybackPosition - currentClip.start + elapsedTimeFromPreviousClips;
    }
    return Math.round(ellapsedTime);
  }

  // called when the video is supposed to finish
  function finishVideo() {
    currentClipIndex = 0; // reset clips index

    // reset video time to the start of the 1st clip and other medias to the inital time
    videoPlaybackPosition = screenPlay.timeline[0].start;
    audio!.currentTime = 0;
    if (videoOverlay) videoOverlay!.currentTime = 0;

    video!.pause();
  }

  function processVideo() {
    const isTransition = screenPlay.timeline[currentClipIndex].start === -1;
    // transitions starts are -1, so we add 1 when computing the clipEndTime of a transition
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
    // showCurrentClipHelper();

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

  // This is called when the user wants to change the timeline progress of the video
  function handleVideoTimelineChange(time: number) {
    let secondsAccumulator = 0;
    for (let index = 0; index < screenPlay.timeline.length; index++) {
      secondsAccumulator += screenPlay.timeline[index].duration;
      if (time <= secondsAccumulator) {
        currentClipIndex = index;
        const secsPassedFromClip = screenPlay.timeline[currentClipIndex].duration - (secondsAccumulator - time);
        videoPlaybackPosition =
          screenPlay.timeline[index].start === -1
            ? -screenPlay.timeline[currentClipIndex].duration + secsPassedFromClip
            : screenPlay.timeline[index].start + secsPassedFromClip;

        video!.currentTime = videoPlaybackPosition;
        video!.play();
        break;
      }
    }

    syncMediasWithNewVideoProgress(time);
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

  function changePlayButtonIcon() {
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");

    if (video!.paused) {
      pauseIcon!.style.display = "none";
      playIcon!.style.display = "block";
    } else {
      playIcon!.style.display = "none";
      pauseIcon!.style.display = "block";
    }
  }
  function changeVolumeIcon(volume: number) {
    const highVolumeIcon = document.getElementById("volume-icon-high");
    const lowVolumeIcon = document.getElementById("volume-icon-low");
    const mutedVolumeIcon = document.getElementById("volume-icon-muted");

    if (volume >= 0.5) {
      highVolumeIcon!.style.display = "block";
      lowVolumeIcon!.style.display = "none";
      mutedVolumeIcon!.style.display = "none";
    } else if (volume < 0.5 && volume > 0) {
      highVolumeIcon!.style.display = "none";
      lowVolumeIcon!.style.display = "block";
      mutedVolumeIcon!.style.display = "none";
    } else {
      highVolumeIcon!.style.display = "none";
      lowVolumeIcon!.style.display = "none";
      mutedVolumeIcon!.style.display = "block";
    }
  }

  // VIDEO CONTROLS
  function handleTogglePlay() {
    if (video!.paused) {
      video!.play();
    } else {
      video!.pause();
    }
  }
  function handleVolumeChange(volume: number) {
    audio!.volume = volume;

    const volumeInput = document.getElementById("volume-control") as HTMLInputElement;
    volumeInput.style.backgroundSize = `${volume * 100}% 100%`;
    changeVolumeIcon(volume);
  }

  return (
    <S.PreviewContainer>
      {/* invisible-medias-preview-container is a container with all invisible media elements */}
      <div id="invisible-medias-preview-container"></div>

      <canvas ref={canvasRef} />

      {/* video preview controls */}
      <S.VideoControlsContainer>
        <S.TimelineInput
          id="timeline-progress"
          type="range"
          min={0}
          max={screenPlay.duration}
          defaultValue="0"
          onChange={(e) => handleVideoTimelineChange(Number(e.target.value))}
        />
        <div>
          <S.TogglePlayButton onClick={handleTogglePlay}>
            <Play id="play-icon" weight="fill" />
            <Pause id="pause-icon" style={{ display: "none" }} weight="fill" />
          </S.TogglePlayButton>

          <S.VolumeContainer>
            <SpeakerSimpleHigh id="volume-icon-high" onClick={() => handleVolumeChange(0)} weight="fill" />
            <SpeakerSimpleLow id="volume-icon-low" onClick={() => handleVolumeChange(0)} weight="fill" />
            <SpeakerSimpleNone id="volume-icon-muted" onClick={() => handleVolumeChange(0.5)} weight="fill" />
            <S.VolumeInput
              id="volume-control"
              type="range"
              min={0}
              max={1}
              step={0.1}
              defaultValue={0.5}
              onChange={(e) => {
                handleVolumeChange(Number(e.target.value));
              }}
            />
          </S.VolumeContainer>

          <S.VideoProgressTime id="timer-progress">0</S.VideoProgressTime>
        </div>
      </S.VideoControlsContainer>
    </S.PreviewContainer>
  );
}
