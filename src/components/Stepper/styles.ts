import styled from "styled-components";

const STEP_SIZE = 3;

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

interface SeparatorProps {
  disabledConection: boolean;
}
export const Separator = styled.div<SeparatorProps>`
  width: 100%;
  max-width: 10rem;
  height: 0.08rem;
  background-color: ${({ theme, disabledConection }) =>
    disabledConection ? theme.colors.disabledBG : theme.colors.primary};
  margin-top: ${STEP_SIZE / 2}rem;
`;

// STEP STYLES
export const StepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 ${(props) => props.theme.spacing()};
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }

  & > span {
    max-width: 12rem;
    margin-left: ${(props) => props.theme.spacing()};
  }
`;

interface StepContentProps {
  disabled: boolean;
}
export const StepContent = styled.div<StepContentProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${STEP_SIZE}rem;
  min-height: ${STEP_SIZE}rem;
  border-radius: 50%;
  font-size: 1.4rem;
  font-weight: 500;
  user-select: none;

  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.disabledBG : theme.colors.primary)};
  color: ${(props) => props.theme.colors.background};

  & > svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

export const StepLabel = styled.span`
  font-size: 1.2rem;
`;
