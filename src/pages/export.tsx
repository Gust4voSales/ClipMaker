import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ClipMaker } from "../ClipMaker";
import { Loading } from "../components/Loading";
import { Stepper } from "../components/Stepper";
import { useClip } from "../hooks/useClip";
import { toast } from "react-toastify";
import * as S from "../styles/pages/export";
import Link from "next/link";

export default function Export() {
  const router = useRouter();
  const { screenPlay, videoInput, audioInput } = useClip();

  const [ouputURL, setOuputURL] = useState<string | null>(null);
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

      try {
        const videoData = await clipMaker.getVideoClip();
        const url = URL.createObjectURL(new Blob([videoData!.buffer], { type: "video/mp4" }));

        setOuputURL(url);
        setExportProgress(clipMaker.getCurrentProgress()!);
      } catch (err) {
        console.log(err);
        toast.error("Ocorreu um problema ao tentar exportar o vídeo. Atualize a página e tente novamente.", {
          autoClose: false,
        });
      }
      clearInterval(progressInterval);
    };

    generateClip();

    return () => {
      clipMaker.exitFFMPEG();
      toast.dismiss();
    };
  }, [clipMaker]);

  async function exportClip() {
    setClipMaker(new ClipMaker(videoInput!, audioInput!, screenPlay!));
  }

  return (
    <div>
      <Modal isOpen={true} ariaHideApp={false} style={S.customModalStyles}>
        <S.Container>
          <S.Header>
            <h1>Exportando</h1>

            <Link prefetch href="/" passHref>
              <S.Back>Voltar</S.Back>
            </Link>
          </S.Header>

          {ouputURL ? (
            <S.OutputContainer>
              <video src={ouputURL} height={160} width="auto" controls />
              <S.OutputLink href={ouputURL} download>
                BAIXAR
              </S.OutputLink>
            </S.OutputContainer>
          ) : (
            <>
              <S.LoadingContainer>
                <Loading />
              </S.LoadingContainer>
              <S.LoadingSpan>Esse processo pode demorar vários minutos. Tenha paciência</S.LoadingSpan>
            </>
          )}

          {clipMaker && (
            <>
              <Stepper
                steps={clipMaker?.getProgressStates().map((s) => {
                  return { label: s };
                })}
                current={ouputURL ? exportProgress + 1 : exportProgress}
              />
            </>
          )}
        </S.Container>
      </Modal>
    </div>
  );
}
