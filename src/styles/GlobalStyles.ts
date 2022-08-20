import { createGlobalStyle } from "styled-components";
import theme from "./theme";

export const GlobalTheme = createGlobalStyle`
  :root {
    font-size: 62.5%;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    -webkit-font-smoothing: antialiased;
    font-family: 'Roboto', sans-serif;

    &:disabled {
      cursor: default !important;
      opacity: ${theme.disabledOpacity} !important;
      background-color: ${theme.colors.disabledBG} !important;
      border-color: ${theme.colors.disabledBG} !important;
      color: ${theme.colors.disabledColor} !important;

      &:hover{ 
        filter: none;
        opacity: ${theme.disabledOpacity} !important;
        cursor: default !important; 
      }
    }
  }
  
  html, body {
    height: 100%;
    scroll-behavior: smooth;
    overflow-x: hidden;

    background: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
  }

  body {
    padding: ${theme.spacing()} ${theme.spacing(2)};
  }

  h1 {
    font-size: 3.2rem;
  }
  h2 {
    font-size: 2.4rem;
  }
  h3 {
    font-size: 1.872rem;
  }
  h4, p, span, label {
    font-size: 1.6rem;
  }

  a, button {
    font-size: 1.6rem;

    cursor: pointer;
    text-decoration: 0;
    transition: filter 0.2s;
    &:hover {
      filter: brightness(0.9);
    }
  }

  @media(max-width: 700px) {
    :root {
      font-size: 56%;
    }
  }
`;
