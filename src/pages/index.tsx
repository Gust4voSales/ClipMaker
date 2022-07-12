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
import { ClipMaker } from "../utils/ClipMaker";
import { useState } from "react";
import { parseSecondsToTime } from "../utils/SecondsToTimeFormat";
import * as S from "../styles/pages/index";

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
  const [output, setOutput] = useState<string | null>(null);

  function handleVideoUpload(video: File) {
    setVideoInput(video);
  }

  function handleAudioUpload(audio: File) {
    setAudioInput(audio);
  }

  async function exportClip() {
    const clipMaker = new ClipMaker(videoInput!, audioInput!, screenPlay!);

    const videoData = await clipMaker.getVideoClip();
    const url = URL.createObjectURL(new Blob([videoData!.buffer]));
    setOutput(url);
  }

  function renderLeftContainer() {
    if (screenPlay)
      return (
        <>
          <ClipPreview screenPlay={screenPlay} />
          <button onClick={exportClip}>EXPORTAR</button>
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
            <span>Altere as configurações ao lado como desejar</span>
          </S.InstructionsContainer>
        )}
      </>
    );
  }

  return (
    <div>
      <S.Title>Criar clipe</S.Title>
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

      {output && <video src={output} controls></video>}
    </div>
  );
}
