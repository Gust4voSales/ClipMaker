import { Check, X } from "phosphor-react";
import theme from "../styles/theme";
import { Dropfile } from "../components/Dropfile";
import uploadVideoBG from "../assets/media-player-boy.svg";
import uploadAudioBG from "../assets/girl-listening.svg";
import instructionsBG from "../assets/instructions.svg";
import { audioExtensions, videoExtensions } from "../utils/AcceptedFileExtensions";
import { DurationInput } from "../components/DurationInput";
import Image from "next/image";
import { ColorInput } from "../components/ColorInput";
import { OverlayInput } from "../components/OverlayInput";
import { useClip } from "../hooks/useClip";
import { ClipPreview } from "../components/ClipPreview";
import { parseSecondsToTime } from "../utils/SecondsToTimeFormat";
import { isDesktop, isChrome, isEdge } from "react-device-detect";
import Link from "next/link";
import * as S from "../styles/pages/index";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Footer } from "../components/Footer";
import { ExamplesModal } from "../components/ExamplesModal";

export default function Index() {
  const {
    screenPlay,
    generateClip,
    videoInput,
    setVideoInput,
    audioInput,
    setAudioInput,
    videoInputDuration,
    audioInputDuration,
    areInputsDisabled,
  } = useClip();

  useEffect(() => {
    if (!isDesktop) {
      toast.warning(
        "Seu dispositivo pode não ser compatível com a tecnologia de geração de vídeo do ClipMaker. Utilize em um navegador desktop como o Google Chrome ou Edge se tiver problemas.",
        { autoClose: false }
      );
    } else if (!(isChrome || isEdge)) {
      toast.warning(
        "Seu navegador pode não ser compatível com a tecnologia de geração de vídeo do ClipMaker. Utilize o Google Chrome ou Edge se tiver problemas.",
        { autoClose: false }
      );
    }
  }, []);

  function handleVideoUpload(video: File) {
    setVideoInput(video);
  }

  function handleAudioUpload(audio: File) {
    setAudioInput(audio);
  }

  function renderLeftContainer() {
    if (screenPlay)
      return (
        <>
          <ClipPreview screenPlay={screenPlay} />
          <div>
            <S.ExportText>Gostou do resultado?</S.ExportText>
            <Link href="/export">
              <S.ExportButton>EXPORTAR</S.ExportButton>
            </Link>
          </div>
        </>
      );

    return (
      <>
        {!videoInput || !audioInput ? (
          <Dropfile
            acceptedExtensions={!videoInput ? videoExtensions : audioExtensions}
            backgroundImg={!videoInput ? uploadVideoBG : uploadAudioBG}
            dropfileDragMessage={`Arraste o arquivo de ${!videoInput ? "vídeo" : "audio"}`}
            onUpload={!videoInput ? handleVideoUpload : handleAudioUpload}
          />
        ) : (
          <S.InstructionsContainer>
            <div>
              <Image src={instructionsBG} objectFit="contain" layout="responsive" />
            </div>
            <span>Altere as configurações do seu clipe como desejar</span>
          </S.InstructionsContainer>
        )}
      </>
    );
  }

  return (
    <div>
      <S.Header>
        <S.Title>Criar clipe</S.Title>
        <ExamplesModal />
      </S.Header>

      <S.Container>
        <S.LeftContainer>{renderLeftContainer()}</S.LeftContainer>
        <S.RightContainer>
          <h2>Configurações</h2>

          <S.Form>
            <S.Label>Vídeo</S.Label>
            <S.FileInputContainer style={{ marginBottom: theme.spacing(2) }}>
              <S.IconStatus>{videoInput ? <Check weight="bold" /> : "?"}</S.IconStatus>
              <S.FileInfoContainer>
                <S.FileTitle>{videoInput ? videoInput.name : "Faça upload de um arquivo de vídeo ao lado"}</S.FileTitle>
                <S.FileInfo>{videoInputDuration ? parseSecondsToTime(videoInputDuration) : "00:00:00"}</S.FileInfo>
              </S.FileInfoContainer>
              {videoInput && (
                <S.RemoveFileButton onClick={() => setVideoInput(null)}>
                  <X weight="bold" />
                </S.RemoveFileButton>
              )}
            </S.FileInputContainer>

            <S.Label>Audio</S.Label>
            <S.FileInputContainer disabled={!videoInput}>
              <S.IconStatus>{audioInput ? <Check weight="bold" /> : "?"}</S.IconStatus>
              <S.FileInfoContainer disabled={!videoInput}>
                <S.FileTitle>{audioInput ? audioInput.name : "Faça upload de um arquivo de audio ao lado"}</S.FileTitle>
                <S.FileInfo>{audioInputDuration ? parseSecondsToTime(audioInputDuration) : "00:00:00"}</S.FileInfo>
              </S.FileInfoContainer>
              {audioInput && (
                <S.RemoveFileButton onClick={() => setAudioInput(null)}>
                  <X weight="bold" />
                </S.RemoveFileButton>
              )}
            </S.FileInputContainer>

            <S.GroupFields>
              <div>
                <S.Label>Duração</S.Label>
                <DurationInput />
              </div>

              <div>
                <S.Label>Filtro</S.Label>
                <OverlayInput />
              </div>

              <div>
                <S.Label>Filtro de cor</S.Label>
                <ColorInput />
              </div>
            </S.GroupFields>

            <S.SubmitButton onClick={generateClip} disabled={areInputsDisabled()}>
              Gerar Clipe
            </S.SubmitButton>
          </S.Form>
        </S.RightContainer>
      </S.Container>

      <Footer />
    </div>
  );
}
