import type { NextPage } from "next";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ClipPreview } from "../components/ClipPreview";
import { ClipMaker, loadFFMPEG } from "../utils/ClipMaker";

const GenerateTest: NextPage = () => {
  const videoEl = useRef<HTMLVideoElement | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const audioEl = useRef<HTMLAudioElement | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);

  const [screenPlay, setScreenPlay] = useState<ScreenPlay>();
  const [clipLength, setClipLength] = useState(30);
  const [colorFilter, setColorFilter] = useState<string>();

  const [output, setOutput] = useState<string>();

  useEffect(() => {
    loadFFMPEG();
  }, []);

  const handleLoadedMetadata = () => {
    const videoCurrent = videoEl.current;
    const audioCurrent = audioEl.current;
    if (!videoCurrent || !audioCurrent) return;
    setVideoDuration(videoCurrent.duration);
    setAudioDuration(audioCurrent.duration);
    console.log(`The video is ${videoCurrent.duration} seconds long.`);
    console.log(`The audio is ${audioCurrent.duration} seconds long.`);
  };

  async function handle(e: FormEvent) {
    e.preventDefault();

    if (videoDuration === 0 || audioDuration === 0) return;

    const screenPlayObj = ClipMaker.generateClipScreenPlay(
      videoDuration,
      clipLength,
      true,
      colorFilter
    );
    setScreenPlay(screenPlayObj);
    console.log(screenPlayObj);

    const clipMaker = new ClipMaker(video!, audio!, screenPlayObj);

    const videoData = await clipMaker.getVideoClip();
    const url = URL.createObjectURL(new Blob([videoData!.buffer]));
    // const url = URL.createObjectURL(new Blob([videoData!.buffer], {type: "video/x-matroska audio/x-matroska"}))
    setOutput(url);
  }

  return (
    <div>
      <form onSubmit={handle}>
        <div>
          <label>VIDEO</label>
          <input
            type="file"
            name="video"
            required
            onChange={(e) => setVideo(e.target.files!.item(0))}
          />
        </div>
        <div>
          <label>AUDIO</label>
          <input
            type="file"
            name="audio"
            required
            onChange={(e) => setAudio(e.target.files!.item(0))}
          ></input>
        </div>
        <div>
          <label>DURAÇÃO DO CLIPE</label>
          <input
            type="number"
            name="clip-duration"
            required
            value={clipLength}
            onChange={(e) => setClipLength(Number(e.target.value))}
          />
        </div>
        <div>
          <label>COR DE FILTRO</label>
          <input
            type="color"
            name="color"
            required
            onChange={(e) => setColorFilter(e.target.value)}
          ></input>
        </div>

        <button type="submit">CRIAR</button>
      </form>
      <div>
        {video && (
          <video
            controls
            width={200}
            ref={videoEl}
            onDurationChange={handleLoadedMetadata}
            src={URL.createObjectURL(video)}
          ></video>
        )}
        {audio && (
          <audio
            controls
            ref={audioEl}
            src={URL.createObjectURL(audio)}
          ></audio>
        )}
        {<span>{colorFilter}</span>}
      </div>

      <div style={{ display: "flex", columnGap: 10 }}>
        {output && (
          <video controls width={640} height={360} src={output}></video>
        )}
        {video && audio && screenPlay && (
          <ClipPreview
            videoInput={video}
            audioInput={audio}
            screenPlay={screenPlay}
          />
        )}
      </div>
    </div>
  );
};

export default GenerateTest;
