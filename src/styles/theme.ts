const SPACE = 8;

const theme = {
  colors: {
    primary: "#586F7C",
    secondary: "#2D1E2F",
    background: "#F3F6F7",

    textPrimary: "#2D1E2F",
    textSecondary: "#F3F6F7",

    success: "green",
    error: "#E3170A",
    disabledColor: "#666666",
    disabledBG: "#CCCCCC",
  },
  disabledOpacity: 0.75,
  spacing: (multiplier = 1) => `${(SPACE * multiplier) / 10}rem`,
};

export default theme;
