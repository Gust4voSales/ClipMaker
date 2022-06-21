type MediaInput = {
  media: File;
  duration: number;
};
type ScreenPlay = {
  videoInput: MediaInput;
  audioInput: MediaInput;

  // an array containing either a clip (with start time and duration) or a string indicating a transition
  timeline: ({ start: number; duration: number } | string)[];
  duration: number;
  overlayFilter: string | null;
  colorFilter: string | null;
};
