import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { randomInRange } from "./Random";

const ffmpeg = createFFmpeg({
  // log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
});

export const loadFFMPEG = async () => {
  if (!ffmpeg.isLoaded()) await ffmpeg.load();
};

interface ClipLength {
  min: number;
  max: number;
}
export class ClipMaker {
  videoInput: File;
  videoExtension: string;

  audioInput: File;
  audioExtension: string;

  screenPlay: ScreenPlay;

  outputClip: Uint8Array | null;

  constructor(videoInput: File, audioInput: File, screenPlay: ScreenPlay) {
    this.videoInput = videoInput;
    const videoName = videoInput.name;
    this.videoExtension = videoName.slice(
      videoName.indexOf("."),
      videoName.length
    );

    this.audioInput = audioInput;
    const audioName = audioInput.name;
    this.audioExtension = audioName.slice(
      audioName.indexOf("."),
      audioName.length
    );

    this.screenPlay = screenPlay;

    this.outputClip = null;
  }

  async getVideoClip() {
    let outputName = await this.cutClips();

    outputName = await this.addAudio(outputName);

    if (this.screenPlay.overlayFilter)
      outputName = await this.addOverlayFilter(outputName);

    if (this.screenPlay.colorFilter)
      outputName = await this.addColorFilter(outputName);

    this.outputClip = ffmpeg.FS("readFile", outputName);

    return this.outputClip;
  }

  /* This function returns an object with an array with the timeline (clips starting point and durations + black 
    transitions) it also returns information whether it uses overlays, color filter etc or not */
  public static generateClipScreenPlay(
    videoDuration: number,
    desiredOutputLength: number,
    overlayFilter: boolean,
    colorFilter?: string
  ) {
    const timeline = ClipMaker.generateTimeline(
      videoDuration,
      desiredOutputLength
    );

    const screenPlay: ScreenPlay = {
      timeline,
      duration: desiredOutputLength,
      overlayFilter,
      colorFilter,
    };

    return screenPlay;
  }

  private static generateTimeline(
    videoDuration: number,
    desiredOutputLength: number
  ) {
    let timeline: ({ start: number; duration: number } | string)[] = [];

    const clipsLength = { min: 3, max: 5 }; // static for now

    let currentVideoDuration = 0;
    while (currentVideoDuration < desiredOutputLength) {
      let randomClipLength = randomInRange(clipsLength.min, clipsLength.max);
      const diff =
        desiredOutputLength - (currentVideoDuration + randomClipLength);
      if (diff < 0)
        // random clip extrapolated the time
        randomClipLength += diff;

      // if the video is 60s long and the max clip length is 5s, generate start time clip from 0 to the 55 seconds
      const randomStartTime = randomInRange(0, videoDuration - clipsLength.max);

      timeline.push({ start: randomStartTime, duration: randomClipLength });

      const chanceOfAddingBlackTransition = randomInRange(1, 3);
      if (chanceOfAddingBlackTransition === 1 && diff > 0) {
        // 33% of chance to add transition if it doesn't extrapolate the time
        currentVideoDuration += 1; // more 1 sec added
        timeline.push("transition");
      }
      currentVideoDuration += randomClipLength;
    }

    return timeline;
  }

  private async cutClips() {
    const input = `input_file${this.videoExtension}`;

    ffmpeg.FS("writeFile", input, await fetchFile(this.videoInput));

    let concat_clips_array: any = [];

    // 1 sec video of black
    let black_transition_command = `-t 1 -i ${input} -preset ultrafast -vf setsar=1,drawbox=t=fill:c=black black_transition${this.videoExtension}`;

    await ffmpeg.run(...black_transition_command.split(" "));

    let index = 0;

    while (index < this.screenPlay.timeline.length) {
      if (this.screenPlay.timeline[index].toString() === "transition") {
        concat_clips_array.push(`file black_transition${this.videoExtension}`);
      } else {
        const clip = this.screenPlay.timeline[index] as {
          start: number;
          duration: number;
        };
        const clipName = `clip_output${index.toString() + this.videoExtension}`;

        await ffmpeg.run(
          "-ss",
          clip.start.toString(),
          "-t",
          clip.duration.toString(),
          "-i",
          input,
          "-preset",
          "ultrafast",
          clipName
        );

        concat_clips_array.push(`file ${clipName}`);
      }
      index++;
    }

    const outputName = `clips-output${this.videoExtension}`;

    ffmpeg.FS("writeFile", "concat_clips.txt", concat_clips_array.join("\n"));
    await ffmpeg.run(
      "-f",
      "concat",
      "-i",
      "concat_clips.txt",
      "-map",
      "0:0",
      "-preset",
      "ultrafast",
      outputName
    );

    return outputName;
  }

  private async addAudio(inputName: string) {
    // ffmpeg.setProgress(({ ratio }) => {
    //   console.log('progress -> ', ratio*100);
    //   /*
    //    * ratio is a float number between 0 to 1.
    //    */
    // })
    const input = `input_audio_file${this.audioExtension}`;

    ffmpeg.FS("writeFile", input, await fetchFile(this.audioInput));
    const outputName = `audio-output${this.videoExtension}`;

    let audio_command = `-i ${inputName} -stream_loop -1 -i ${input} -c copy -map 0:v -map 1:a -shortest -preset ultrafast ${outputName}`;
    await ffmpeg.run(...audio_command.split(" "));

    return outputName;
  }

  private async addOverlayFilter(inputName: string) {
    ffmpeg.FS("writeFile", "overlay.mov", await fetchFile("/overlay.mov"));

    const outputName = `filter_output${this.videoExtension}`;
    let overlayVideoCommand = `-i ${inputName} -stream_loop -1 -i overlay.mov -t ${this.screenPlay.duration} -filter_complex [1][0]scale2ref=h=ow:w=iw[A][B];[A]format=argb,colorchannelmixer=aa=0.3[Btransparent];[B][Btransparent]overlay=(main_w-w):(main_h-h) -pix_fmt yuv420p -preset ultrafast ${outputName}`;
    await ffmpeg.run(...overlayVideoCommand.split(" "));

    return outputName;
  }

  private async addColorFilter(inputName: string) {
    const outputName = `color_filter_output${this.videoExtension}`;

    const colorFilterCommand = `-i ${inputName} -preset ultrafast -vf setsar=1,drawbox=t=fill:c=${this
      .screenPlay.colorFilter!}@0.05 ${outputName}`;
    await ffmpeg.run(...colorFilterCommand.split(" "));

    return outputName;
  }
}
