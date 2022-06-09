import { DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;

      textPrimary: string;
      textSecondary: string;

      success: string;
      error: string;
      disabled: string;
    };
    spacing: (multiplier = 1) => string;
  }
}
