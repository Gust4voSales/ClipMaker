import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import { ClipProvider } from "../contexts/ClipContext";
import { GlobalTheme } from "../styles/GlobalStyles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import theme from "../styles/theme";
import { Footer } from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <GlobalTheme />
      <ThemeProvider theme={theme}>
        <ClipProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </ClipProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
