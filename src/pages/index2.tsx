import styled from "styled-components";
import { Check, X } from "phosphor-react";
import theme from "../styles/theme";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Dropfile } from "../components/Dropfile";
import uploadVideoBG from "../assets/media-player-boy.svg";
import uploadAudioBG from "../assets/girl-listening.svg";
import instructionsBG from "../assets/instructions.svg";
import { audioExtensions, videoExtensions } from "../utils/AcceptedFileExtensions";
import { useState } from "react";
import { DurationInput } from "../components/DurationInput";
import { formatSecondsToTime } from "../utils/SecondsToTimeFormat";
import Image from "next/image";
import { ColorInput } from "../components/ColorInput";

export default function Index2() {
  const [video, setVideo] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);

  const [colorFilter, setColorFilter] = useState("");

  function handleVideoUpload(video: File) {
    setVideo(video);

    const videoEl = document.createElement("video");
    videoEl.setAttribute("id", "video-input");
    videoEl.setAttribute("src", URL.createObjectURL(video));
    videoEl.ondurationchange = () => {
      setVideoDuration(Math.round(videoEl.duration));
    };
  }
  function handleRemoveVideo() {
    setVideo(null);
    setVideoDuration(0);
  }

  function handleAudioUpload(audio: File) {
    setAudio(audio);

    const audioEl = document.createElement("audio");
    audioEl.setAttribute("id", "audio-input");
    audioEl.setAttribute("src", URL.createObjectURL(audio));
    audioEl.ondurationchange = () => {
      setAudioDuration(Math.round(audioEl.duration));
    };
  }
  function handleRemoveAudio() {
    setAudio(null);
    setAudioDuration(0);
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
          {!video || !audio ? (
            <Dropfile
              acceptedExtensions={!video ? videoExtensions : audioExtensions}
              backgroundImg={!video ? uploadVideoBG : uploadAudioBG}
              dropfileDragMessage={`Arraste o arquivo de ${!video ? "vídeo" : "audio"}`}
              onUpload={!video ? handleVideoUpload : handleAudioUpload}
            />
          ) : (
            <BackgroundInstructionsContainer>
              <Image src={instructionsBG} layout="fixed" />
              <span>Depois adicionar instruções do que fazer (além de estilização) </span>
            </BackgroundInstructionsContainer>
          )}
        </LeftContainer>
        <RightContainer>
          <h2>Configurações</h2>

          <Form>
            <Label>Vídeo</Label>
            <FileInputContainer style={{ marginBottom: theme.spacing(2) }}>
              <IconStatus>{video ? <Check weight="bold" /> : "?"}</IconStatus>
              <FileInfoContainer>
                <FileTitle>{video ? video.name : "Faça upload de um arquivo de vídeo ao lado"}</FileTitle>
                <FileInfo>{videoDuration ? parseSecondsToTime(videoDuration) : "00:00:00"}</FileInfo>
              </FileInfoContainer>
              {video && (
                <RemoveFileButton onClick={handleRemoveVideo} type="button">
                  <X weight="bold" />
                </RemoveFileButton>
              )}
            </FileInputContainer>

            <Label>Audio</Label>
            <FileInputContainer style={!video ? { opacity: 0.6 } : {}}>
              <IconStatus>{audio ? <Check weight="bold" /> : "?"}</IconStatus>
              <FileInfoContainer>
                <FileTitle>{audio ? audio.name : "Faça upload de um arquivo de audio ao lado"}</FileTitle>
                <FileInfo>{audioDuration ? parseSecondsToTime(audioDuration) : "00:00:00"}</FileInfo>
              </FileInfoContainer>
              {audio && (
                <RemoveFileButton onClick={handleRemoveAudio} type="button">
                  <X weight="bold" />
                </RemoveFileButton>
              )}
            </FileInputContainer>

            <GroupFields>
              <div>
                <Label>Duração</Label>
                <DurationInput
                  disabled={!videoDuration || !audioDuration}
                  min={1}
                  max={!videoDuration || !audioDuration ? 1 : videoDuration}
                />
              </div>

              <div>
                <Label>Filtro</Label>
                <Input style={{ backgroundColor: theme.colors.background }} />
              </div>

              <div>
                <Label>Filtro de cor</Label>
                <ColorInput
                  value={colorFilter}
                  onChangeValue={(value) => {
                    setColorFilter(value);
                  }}
                />
              </div>
            </GroupFields>

            <SubmitButton type="submit" disabled>
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
`;
const BackgroundInstructionsContainer = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const RightContainer = styled.div`
  background-color: #fff;
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
