import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
// import { this.ffmpeg, loadFFMPEG } from "./services/this.ffmpeg";
import { getFileExtension } from "./utils/FileExtension";
import { OVERLAYS } from "./utils/Overlays";
import { randomInRange } from "./utils/Random";

// interface ClipLength {
//   min: number;
//   max: number;
// }
export class ClipMaker {
  videoInput: File;
  videoExtension: string;

  audioInput: File;
  audioExtension: string;

  screenPlay: ScreenPlay;

  outputClip: Uint8Array | null;

  currentProgress: number | null;
  progressStates: string[];

  ffmpeg: FFmpeg;

  static transitionDuration = 1;

  // TO-DO: ADAPT TO THE NEW SCREENPLAY FORMAT WHERE THE INPUTS ARE PASSED
  constructor(videoInput: File, audioInput: File, screenPlay: ScreenPlay) {
    this.videoInput = videoInput;
    const videoName = videoInput.name;
    this.videoExtension = getFileExtension(videoName);

    this.audioInput = audioInput;
    const audioName = audioInput.name;
    this.audioExtension = getFileExtension(audioName);

    this.screenPlay = screenPlay;

    this.ffmpeg = createFFmpeg({
      corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    });

    this.currentProgress = null;

    this.outputClip = null;
    this.progressStates = this.generateProgressStates();
  }

  /* This function returns an object with an array with the timeline (clips starting point and durations + black 
    transitions) it also returns information whether it uses overlays, color filter etc or not */
  public static generateClipScreenPlay(
    videoInput: MediaInput,
    audioInput: MediaInput,
    duration: number,
    overlayFilterID: string | null,
    colorFilter: string | null
  ) {
    const timeline = ClipMaker.generateTimeline(videoInput.duration, duration);

    let overlayFilter: string | null = null;
    if (overlayFilterID) overlayFilter = OVERLAYS.find((o) => o.id === overlayFilterID)!.url;

    const screenPlay: ScreenPlay = {
      videoInput,
      audioInput,
      timeline,
      duration: duration,
      overlayFilter,
      colorFilter,
    };

    return screenPlay;
  }

  private static generateTimeline(videoDuration: number, desiredOutputLength: number) {
    let timeline: { start: number; duration: number }[] = [];

    const clipsLength = { min: 3, max: 5 }; // static for now

    let currentVideoDuration = 0;
    while (currentVideoDuration < desiredOutputLength) {
      let randomClipLength = randomInRange(clipsLength.min, clipsLength.max);
      const diff = desiredOutputLength - (currentVideoDuration + randomClipLength);
      if (diff < 0)
        // random clip extrapolated the time
        randomClipLength += diff;

      // if the video is 60s long and the max clip length is 5s, generate start time clip from 0 to the 55 seconds
      const randomStartTime = randomInRange(0, videoDuration - clipsLength.max);

      timeline.push({ start: randomStartTime, duration: randomClipLength });

      const chanceOfAddingBlackTransition = randomInRange(1, 3);
      if (chanceOfAddingBlackTransition === 1 && diff > 0) {
        // 33% of chance to add transition if it doesn't extrapolate the time
        currentVideoDuration += ClipMaker.transitionDuration;
        timeline.push({ start: -1, duration: ClipMaker.transitionDuration });
      }
      currentVideoDuration += randomClipLength;
    }

    return timeline;
  }

  public getCurrentProgress() {
    return this.currentProgress;
  }

  private generateProgressStates() {
    let steps = ["Cortando o vídeo", "Adicionando audio"];

    if (this.screenPlay.overlayFilter) steps.push("Adicionando video de overlay");
    if (this.screenPlay.colorFilter) steps.push("Adicionando filtro de cor");

    steps.push("Finalizando");
    return steps;
  }

  public getProgressStates() {
    return this.progressStates;
  }

  public exitFFMPEG() {
    try {
      this.ffmpeg.exit();
    } catch (err) {
      console.log("exit >", err);
    }
  }

  async getVideoClip() {
    await this.ffmpeg.load();

    this.currentProgress = 0;
    let outputName = await this.cutClips();

    this.currentProgress += 1;
    outputName = await this.addAudio(outputName);

    if (this.screenPlay.overlayFilter) {
      this.currentProgress += 1;
      outputName = await this.addOverlayFilter(outputName);
    }
    if (this.screenPlay.colorFilter) {
      this.currentProgress += 1;
      outputName = await this.addColorFilter(outputName);
    }

    this.currentProgress += 1;
    this.outputClip = this.ffmpeg.FS("readFile", outputName);

    this.exitFFMPEG();
    return this.outputClip;
  }

  private async cutClips() {
    const input = `input_file${this.videoExtension}`;

    this.ffmpeg.FS("writeFile", input, await fetchFile(this.videoInput));

    let concat_clips_array: any = [];

    // 1 sec video of black
    let black_transition_command = `-t ${ClipMaker.transitionDuration} -i ${input} -preset ultrafast -vf setsar=1,drawbox=t=fill:c=black black_transition${this.videoExtension}`;

    await this.ffmpeg.run(...black_transition_command.split(" "));

    let index = 0;

    while (index < this.screenPlay.timeline.length) {
      if (this.screenPlay.timeline[index].start === -1) {
        concat_clips_array.push(`file black_transition${this.videoExtension}`);
      } else {
        const clip = this.screenPlay.timeline[index] as {
          start: number;
          duration: number;
        };
        const clipName = `clip_output${index.toString() + this.videoExtension}`;

        await this.ffmpeg.run(
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

    this.ffmpeg.FS("writeFile", "concat_clips.txt", concat_clips_array.join("\n"));
    await this.ffmpeg.run("-f", "concat", "-i", "concat_clips.txt", "-map", "0:0", "-preset", "ultrafast", outputName);

    return outputName;
  }

  private async addAudio(inputName: string) {
    const input = `input_audio_file${this.audioExtension}`;

    this.ffmpeg.FS("writeFile", input, await fetchFile(this.audioInput));
    const outputName = `audio-output${this.videoExtension}`;

    let audio_command = `-i ${inputName} -stream_loop -1 -i ${input} -c copy -map 0:v -map 1:a -shortest -preset ultrafast ${outputName}`;
    await this.ffmpeg.run(...audio_command.split(" "));

    return outputName;
  }

  private async addOverlayFilter(inputName: string) {
    const overlayFileName = this.screenPlay.overlayFilter!.replace("/overlays/", "");
    this.ffmpeg.FS("writeFile", overlayFileName, await fetchFile(this.screenPlay.overlayFilter!));

    const outputName = `filter_output${this.videoExtension}`;
    let overlayVideoCommand = `-i ${inputName} -stream_loop -1 -i ${overlayFileName} -t ${this.screenPlay.duration} -filter_complex [1][0]scale2ref=h=ow:w=iw[A][B];[A]format=argb,colorchannelmixer=aa=0.3[Btransparent];[B][Btransparent]overlay=(main_w-w):(main_h-h) -pix_fmt yuv420p -preset ultrafast ${outputName}`;
    await this.ffmpeg.run(...overlayVideoCommand.split(" "));

    return outputName;
  }

  private async addColorFilter(inputName: string) {
    const outputName = `color_filter_output${this.videoExtension}`;

    const colorFilterCommand = `-i ${inputName} -preset ultrafast -vf setsar=1,drawbox=t=fill:c=${this.screenPlay
      .colorFilter!}@0.05 ${outputName}`;
    await this.ffmpeg.run(...colorFilterCommand.split(" "));

    return outputName;
  }
}
