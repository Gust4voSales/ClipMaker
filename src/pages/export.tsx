import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ClipMaker } from "../ClipMaker";
import { Loading } from "../components/Loading";
import { Stepper } from "../components/Stepper";
import { useClip } from "../hooks/useClip";
import * as S from "../styles/pages/export";

export default function Export() {
  const router = useRouter();
  const { screenPlay, videoInput, audioInput } = useClip();

  const [output, setOutput] = useState<string | null>(null);
  const [clipMaker, setClipMaker] = useState<ClipMaker | null>(null);
  const [exportProgress, setExportProgress] = useState(-1);

  useEffect(() => {
    if (!screenPlay) {
      router.push("/");
      return;
    }

    exportClip();
  }, []);

  useEffect(() => {
    if (!clipMaker) return;

    const generateClip = async () => {
      const progressInterval = setInterval(() => {
        setExportProgress(clipMaker.getCurrentProgress()!);
      }, 0);

      // TRY CATCH MISSING (add error handling later)

      const videoData = await clipMaker.getVideoClip();
      const url = URL.createObjectURL(new Blob([videoData!.buffer]));

      setOutput(url);
      setExportProgress(clipMaker.getCurrentProgress()!);
      clearInterval(progressInterval);
    };

    generateClip();

    return () => {
      clipMaker.exitFFMPEG();
    };
  }, [clipMaker]);

  async function exportClip() {
    console.log("export");
    setClipMaker(new ClipMaker(videoInput!, audioInput!, screenPlay!));
  }

  return (
    <div>
      <Modal isOpen={true} ariaHideApp={false} style={S.customModalStyles}>
        <S.Container>
          <h1>Exportando</h1>
          {!output ? (
            <>
              <S.LoadingContainer>
                <Loading />
              </S.LoadingContainer>
              <S.LoadingSpan>Esse processo pode demorar vários minutos. Tenha paciência</S.LoadingSpan>

              {clipMaker && (
                <>
                  <Stepper
                    steps={clipMaker?.getProgressStates().map((s) => {
                      return { label: s };
                    })}
                    current={exportProgress}
                  />
                </>
              )}
            </>
          ) : (
            <S.OuputVideo width="auto" height={200} controls src={output}></S.OuputVideo>
          )}
        </S.Container>
      </Modal>
    </div>
  );
}
