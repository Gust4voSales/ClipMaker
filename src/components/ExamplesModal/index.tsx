import { X } from "phosphor-react";
import { useState } from "react";
import ReactModal from "react-modal";
import theme from "../../styles/theme";
import { clips } from "./clips";
import * as S from "./styles";

export function ExamplesModal() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <S.OpenModalBtn onClick={() => setIsOpen((old) => !old)}>Exemplos de Clipes</S.OpenModalBtn>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={customModalStyles}
      >
        <S.Container>
          <S.Header>
            <h3>Exemplos de Clipes</h3>
            <S.CloseModalBtn onClick={() => setIsOpen(false)}>
              <X weight="bold" />
            </S.CloseModalBtn>
          </S.Header>

          <S.ClipsList>
            {clips.map((clip) => (
              <li key={clip.id}>
                <S.ClipTitleMarquee>
                  <S.ClipTitle marquee={clip.name.length > 40}>{clip.name}</S.ClipTitle>
                </S.ClipTitleMarquee>
                <video controls src={clip.filename}></video>
              </li>
            ))}
          </S.ClipsList>
        </S.Container>
      </ReactModal>
    </div>
  );
}
export const customModalStyles = {
  content: {
    margin: "auto",
    width: "fit-content",
    height: "fit-content",
    borderRadius: theme.spacing(0.5),
    padding: 0,
  },
  overlay: {
    backgroundColor: theme.colors.background + "CC", // transparency 80% added
  },
};
