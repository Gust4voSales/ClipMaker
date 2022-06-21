import { X } from "phosphor-react";
import styled from "styled-components";
import { useClip } from "../../hooks/useClip";
import { DisableableComponent } from "../../styles/DisableableComponent";
import { Input } from "../Input";

export function ColorInput() {
  const { colorFilter, setColorFilter, areInputsDisabled } = useClip();

  return (
    <Container disabled={areInputsDisabled()}>
      <ColorInputStyled
        type="color"
        value={colorFilter ? colorFilter : "#000000"}
        onChange={(e) => setColorFilter(e.target.value)}
        disabled={areInputsDisabled()}
      />
      <CurrentValue style={areInputsDisabled() ? { opacity: 0.75 } : {}}>{colorFilter}</CurrentValue>
      {colorFilter && (
        <RemoveColor
          weight="bold"
          onClickCapture={areInputsDisabled() ? () => {} : () => setColorFilter(null)}
          style={areInputsDisabled() ? { cursor: "default" } : {}}
        />
      )}
    </Container>
  );
}

const Container = styled.div<DisableableComponent>`
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.disabledBG : theme.colors.background)};
  opacity: ${({ disabled, theme }) => (disabled ? theme.disabledOpacity : 1)};
  width: 12rem;
  height: 3.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${(props) => props.theme.spacing(0.5)};
  border-radius: ${(props) => props.theme.spacing(0.5)};
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

const RemoveColor = styled(X)`
  margin-left: auto;
  color: ${(props) => props.theme.colors.error};
  cursor: pointer;
  width: 1.8rem;
  height: 1.8rem;
`;
