import { Check, X } from "phosphor-react";
import { MouseEvent, useState } from "react";
import { Popover } from "react-tiny-popover";
import styled from "styled-components";
import { OVERLAYS } from "../../utils/Overlays";

export function OverlayInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

  function toggleOverlaySelection(id: string) {
    if (selectedOverlayId === id) {
      setSelectedOverlayId(null);
    } else {
      setSelectedOverlayId(id);
    }
  }

  function removeOverlay(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setSelectedOverlayId(null);
  }

  return (
    <Popover
      isOpen={isOpen}
      positions={["left", "top"]} // if you'd like, you can limit the positions
      reposition={false} // prevents automatic readjustment of content position that keeps your popover content within its parent's bounds
      onClickOutside={() => setIsOpen(false)} // handle click events outside of the popover/target here!
      content={() => (
        <Container>
          <span>Selecione um filtro</span>
          {OVERLAYS.map((overlay) => (
            <OverlayContainer key={overlay.id}>
              <SelectOverlay onClick={() => toggleOverlaySelection(overlay.id)}>
                <Video src={overlay.url} autoPlay muted loop />

                {overlay.id === selectedOverlayId ? (
                  <X weight="bold" style={{ opacity: 1 }} />
                ) : (
                  <Check weight="bold" />
                )}
              </SelectOverlay>
            </OverlayContainer>
          ))}
        </Container>
      )}
    >
      <OpenButton onClick={() => setIsOpen(true)}>
        {selectedOverlayId ? OVERLAYS[Number(selectedOverlayId) - 1].name : "Selecionar filtro"}
        {selectedOverlayId && (
          <RemoveOverlayButton onClick={removeOverlay}>
            <X weight="bold" />
          </RemoveOverlayButton>
        )}
      </OpenButton>
    </Popover>
  );
}

const OpenButton = styled.button`
  width: 14rem;
  height: 3.2rem;
  border-radius: ${(props) => props.theme.spacing(0.5)};
  background-color: ${(props) => props.theme.colors.background};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing(0.5)};
`;
const Container = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing()};
  row-gap: ${(props) => props.theme.spacing()};
  max-height: 30rem;
  overflow-y: auto;
  margin-right: ${(props) => props.theme.spacing()};
  margin-bottom: 120%;
`;
const OverlayContainer = styled.li`
  position: relative;
  list-style: none;
  & svg {
    width: 3.2rem;
    height: 3.2rem;
    opacity: 0;
    position: absolute;
    top: calc(50% - (3.2rem / 2));
    right: calc(50% - (3.2rem / 2));
    top: ${(props) => props.theme.spacing()};
    right: ${(props) => props.theme.spacing()};
    padding: ${(props) => props.theme.spacing(0.5)};
    margin: auto;
    color: ${(props) => props.theme.colors.primary};
    background-color: #fff;
    border-radius: 50%;
  }
  &:hover {
    svg {
      opacity: 1;
    }
  }
`;
const SelectOverlay = styled.button`
  border: none;
  background: none;
  height: fit-content;
`;
const Video = styled.video`
  height: 10rem;
  width: auto;
  background-color: ${(props) => props.theme.colors.background};
`;
const RemoveOverlayButton = styled.button`
  background: none;
  margin-left: auto;
  border: none;
  display: flex;
  & svg {
    color: ${(props) => props.theme.colors.error};
    width: 1.6rem;
    height: 1.6rem;
  }
`;
