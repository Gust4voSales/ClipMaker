import styled from "styled-components";

const STEP_SIZE = 3;

export const Container = styled.div`
  display: flex;
  align-self: center;
  overflow-x: auto;
  width: fit-content;
  @media (max-width: 760px) {
    width: 100%;
  }
`;

interface SeparatorProps {
  disabledConection: boolean;
}
export const Separator = styled.div<SeparatorProps>`
  margin: auto 0;
  width: 100%;
  max-width: 10rem;
  min-width: 2rem;
  height: 0.08rem;
  background-color: ${({ theme, disabledConection }) =>
    disabledConection ? theme.colors.disabledBG : theme.colors.primary};
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
