import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ClipMaker } from "../ClipMaker";
import { Loading } from "../components/Loading";
import { Step, Stepper } from "../components/Stepper";
import { useClip } from "../hooks/useClip";
import * as S from "../styles/pages/export";

export default function Export() {
  const router = useRouter();
  const { screenPlay, videoInput, audioInput } = useClip();

  const [output, setOutput] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!screenPlay) {
  //     router.push("/");
  //     return;
  //   }

  //   exportClip();
  // }, []);

  async function exportClip() {
    console.log("export");
    const clipMaker = new ClipMaker(videoInput!, audioInput!, screenPlay!);

    const progressInterval = setInterval(() => {
      setExportProgress(clipMaker.getCurrentProgress());
    }, 200);

    const videoData = await clipMaker.getVideoClip();
    const url = URL.createObjectURL(new Blob([videoData!.buffer]));

    setOutput(url);
    setExportProgress(null);
    clearInterval(progressInterval);
  }

  return (
    <div>
      <Modal isOpen={true} ariaHideApp={false} style={S.customModalStyles}>
        <S.Container>
          <h1>Exportando</h1>
          <S.LoadingContainer>
            <Loading />
          </S.LoadingContainer>
          <S.LoadingSpan>Esse processo pode demorar vários minutos. Tenha paciência</S.LoadingSpan>

          <Stepper
            steps={[
              { label: "Primeiro passo" },
              { label: "Segundo passo" },
              { label: "Terceiro passo" },
              { label: "Quarto passo" },
              { label: "Quinto passo" },
            ]}
            current={1}
          />
          {exportProgress && <span>{exportProgress}</span>}
          {output && <video src={output} controls></video>}
        </S.Container>
      </Modal>
    </div>
  );
}
