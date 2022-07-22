import styled, { keyframes } from "styled-components";

export const LoadingContainer = styled.div`
  position: sticky;
  top: 50%;
  left: 50%;
  height: 2rem;
  width: 2rem;
  transform: translateX(-50%) translateY(-50%);
`;

const move = keyframes`
  0% {
    transform: rotate(0) scale(1);
    animation-timing-function: ease-in;
  }
  10% {
    transform: rotate(90deg) scale(0);
  }
  50% {
    transform: rotate(90deg) scale(0);
    animation-timing-function: ease-out;
}
  60% {
    transform: rotate(180deg) scale(1);
  }
  100% {
    transform: rotate(180deg) scale(1);
  }
`;

export const Block = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 2rem;
  width: 2rem;

  & div {
    position: absolute;
    height: 2rem;
    width: 2rem;
    background-color: black;
    background-color: ${(props) => props.theme.colors.primary};
    animation: ${move} 2s linear infinite;

    &:nth-of-type(1) {
      top: -2rem;
      left: -2rem;
      animation-delay: ${(-7 * 2) / 8}s;
    }

    &:nth-of-type(2) {
      top: -2rem;
      left: 0;
      animation-delay: ${(-6 * 2) / 8}s;
    }

    &:nth-of-type(3) {
      top: -2rem;
      left: 2rem;
      animation-delay: ${(-5 * 2) / 8}s;
    }

    &:nth-of-type(4) {
      top: 0;
      left: 2rem;
      animation-delay: ${(-4 * 2) / 8}s;
    }

    &:nth-of-type(5) {
      top: 2rem;
      left: 2rem;
      animation-delay: ${(-3 * 2) / 8}s;
    }

    &:nth-of-type(6) {
      top: 2rem;
      left: 0;
      animation-delay: ${(-2 * 2) / 8}s;
    }

    &:nth-of-type(7) {
      top: 2rem;
      left: -2rem;
      animation-delay: ${(-1 * 2) / 8}s;
    }

    &:nth-of-type(8) {
      top: 0;
      left: -2rem;
      animation-delay: ${(0 * 2) / 8}s;
    }
  }
`;
