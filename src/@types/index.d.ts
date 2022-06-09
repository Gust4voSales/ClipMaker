type ScreenPlay = {
  // an array containing either a clip (with start time and duration) or a string indicating a transition
  timeline: ({ start: number; duration: number } | string)[];
  overlayFilter: boolean;
  duration: number;
  colorFilter?: string;
};
