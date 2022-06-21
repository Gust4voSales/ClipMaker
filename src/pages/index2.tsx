import styled from "styled-components";
import { Check, X } from "phosphor-react";
import theme from "../styles/theme";
import { Button } from "../components/Button";
import { Dropfile } from "../components/Dropfile";
import uploadVideoBG from "../assets/media-player-boy.svg";
import uploadAudioBG from "../assets/girl-listening.svg";
import instructionsBG from "../assets/instructions.svg";
import { audioExtensions, videoExtensions } from "../utils/AcceptedFileExtensions";
import { DurationInput } from "../components/DurationInput";
import { formatSecondsToTime } from "../utils/SecondsToTimeFormat";
import Image from "next/image";
import { ColorInput } from "../components/ColorInput";
import { OverlayInput } from "../components/OverlayInput";
import { useClip } from "../hooks/useClip";

export default function Index2() {
  const {
    generateClip,
    videoInput,
    setVideoInput,
    audioInput,
    setAudioInput,
    videoInputDuration,
    audioInputDuration,
    areInputsDisabled,
  } = useClip();

  function handleVideoUpload(video: File) {
    setVideoInput(video);
  }

  function handleAudioUpload(audio: File) {
    setAudioInput(audio);
  }

  function parseSecondsToTime(totalSeconds: number) {
    const timeObj = formatSecondsToTime(totalSeconds);
    return `${timeObj.hours.toString().padStart(2, "0")}:${timeObj.minutes
      .toString()
      .padStart(2, "0")}:${timeObj.seconds.toString().padStart(2, "0")}`;
  }

  return (
    <div>
      <Title>Criar clipe</Title>
      <Container>
        <LeftContainer>
          {!videoInput || !audioInput ? (
            <Dropfile
              acceptedExtensions={!videoInput ? videoExtensions : audioExtensions}
              backgroundImg={!videoInput ? uploadVideoBG : uploadAudioBG}
              dropfileDragMessage={`Arraste o arquivo de ${!videoInput ? "vídeo" : "audio"}`}
              onUpload={!videoInput ? handleVideoUpload : handleAudioUpload}
            />
          ) : (
            <InstructionsContainer>
              <div>
                <Image src={instructionsBG} objectFit="contain" layout="responsive" />
              </div>
              <span>Altere as configurações ao lado como desejar</span>
            </InstructionsContainer>
          )}
        </LeftContainer>
        <RightContainer>
          <h2>Configurações</h2>

          <Form>
            <Label>Vídeo</Label>
            <FileInputContainer style={{ marginBottom: theme.spacing(2) }}>
              <IconStatus>{videoInput ? <Check weight="bold" /> : "?"}</IconStatus>
              <FileInfoContainer>
                <FileTitle>{videoInput ? videoInput.name : "Faça upload de um arquivo de vídeo ao lado"}</FileTitle>
                <FileInfo>{videoInputDuration ? parseSecondsToTime(videoInputDuration) : "00:00:00"}</FileInfo>
              </FileInfoContainer>
              {videoInput && (
                <RemoveFileButton onClick={() => setVideoInput(null)}>
                  <X weight="bold" />
                </RemoveFileButton>
              )}
            </FileInputContainer>

            <Label>Audio</Label>
            <FileInputContainer style={!videoInput ? { opacity: 0.6 } : {}}>
              <IconStatus>{audioInput ? <Check weight="bold" /> : "?"}</IconStatus>
              <FileInfoContainer>
                <FileTitle>{audioInput ? audioInput.name : "Faça upload de um arquivo de audio ao lado"}</FileTitle>
                <FileInfo>{audioInputDuration ? parseSecondsToTime(audioInputDuration) : "00:00:00"}</FileInfo>
              </FileInfoContainer>
              {audioInput && (
                <RemoveFileButton onClick={() => setAudioInput(null)}>
                  <X weight="bold" />
                </RemoveFileButton>
              )}
            </FileInputContainer>

            <GroupFields>
              <div>
                <Label>Duração</Label>
                <DurationInput />
              </div>

              <div>
                <Label>Filtro</Label>
                <OverlayInput />
              </div>

              <div>
                <Label>Filtro de cor</Label>
                <ColorInput />
              </div>
            </GroupFields>

            <SubmitButton onClick={generateClip} disabled={areInputsDisabled()}>
              Gerar Clipe
            </SubmitButton>
          </Form>
        </RightContainer>
      </Container>
    </div>
  );
}

const Title = styled.h1``;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: ${(props) => props.theme.spacing(2)};
  margin-top: ${(props) => props.theme.spacing(2)};
  & > div:first-child,
  & > div:first-child + div {
    flex: 1;
    padding: ${(props) => props.theme.spacing(2)};
    border-radius: ${(props) => props.theme.spacing()};
  }
`;
const LeftContainer = styled.div`
  border: 2px solid black;
  user-select: none;
  width: 49%;
`;
const InstructionsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: ${(props) => props.theme.spacing(4)};
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
  & > div {
    width: 50%;
    height: 50%;
  }
`;

const RightContainer = styled.div`
  background-color: #fff;
  width: 49%;
`;
const Form = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => props.theme.spacing(2)};
`;
const Label = styled.label`
  font-size: 1.8rem;
  font-weight: 500;
`;
const FileInputContainer = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colors.background};
  align-items: center;
  padding: ${(props) => props.theme.spacing(2)};
  height: 8rem;
  border-radius: ${(props) => props.theme.spacing()};
`;
const IconStatus = styled.span`
  background-color: ${(props) => props.theme.colors.primary};
  height: 100%;
  width: calc(8rem - (2 * ${(props) => props.theme.spacing(2)}));
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${(props) => props.theme.spacing(0.5)};
  margin-right: ${(props) => props.theme.spacing(2)};
  color: #fff;
  font-size: 1.8rem;
  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }
`;
const FileInfoContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.primary};
`;
const FileTitle = styled.h4`
  font-weight: 500;
`;
const FileInfo = styled.span``;
const RemoveFileButton = styled.button`
  margin-left: auto;
  border: none;
  background: none;
  color: ${(props) => props.theme.colors.error};
  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }
`;
const GroupFields = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing(2)};
  & > div {
    display: flex;
    flex-direction: column;
  }
`;
const SubmitButton = styled(Button)`
  margin: ${(props) => props.theme.spacing(4)} auto ${(props) => props.theme.spacing()} auto;
`;
