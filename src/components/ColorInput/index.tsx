import { X } from "phosphor-react";
import styled from "styled-components";
import { useClip } from "../../hooks/useClip";
import { Input } from "../Input";

export function ColorInput() {
  const { colorFilter, setColorFilter, areInputsDisabled } = useClip();

  return (
    <Container>
      <ColorInputStyled
        type="color"
        value={colorFilter ? colorFilter : "#000000"}
        onChange={(e) => setColorFilter(e.target.value)}
        disabled={areInputsDisabled()}
      />
      <CurrentValue>{colorFilter}</CurrentValue>
      {colorFilter && (
        <RemoveColorBtn disabled={areInputsDisabled()} onClick={() => setColorFilter(null)}>
          <X weight="bold" />
        </RemoveColorBtn>
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  width: 12rem;
  height: 3.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${(props) => props.theme.spacing(0.5)};
`;
const ColorInputStyled = styled(Input)`
  -webkit-appearance: none;
  height: 3rem;
  width: 3rem;
  background: ${(props) => props.theme.colors.background};
  display: flex;
  align-items: center;
  padding: 0;
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border-radius: ${(props) => props.theme.spacing(0.5)};
  }
  &:focus {
    border: none;
  }
`;
const CurrentValue = styled.span`
  font-size: 1.2rem;
  margin-left: ${(props) => props.theme.spacing(0.5)};
`;

const RemoveColorBtn = styled.button`
  margin-left: auto;
  border: none;
  background: none;
  color: ${(props) => props.theme.colors.error};
  display: flex;
  align-items: center;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;
