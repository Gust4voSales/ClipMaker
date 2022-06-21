import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import { ClipProvider } from "../contexts/ClipContext";
import { GlobalTheme } from "../styles/GlobalStyles";
import theme from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <GlobalTheme />
      <ThemeProvider theme={theme}>
        <ClipProvider>
          <Component {...pageProps} />
        </ClipProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
