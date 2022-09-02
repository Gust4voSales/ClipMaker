import styled, { keyframes } from "styled-components";
import { Button } from "../Button";

export const OpenModalBtn = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
  border-color: ${(props) => props.theme.colors.primary};
  width: 16rem;
  height: 3rem;
  font-size: 1.2rem;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 70rem;
  height: 50%;
  max-height: 60rem;
  padding: ${(props) => props.theme.spacing(1)};
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const CloseModalBtn = styled.button`
  border: none;
  background: none;
  color: ${(props) => props.theme.colors.error};
  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

export const ClipsList = styled.ul`
  display: flex;
  width: 100%;
  margin-top: ${(props) => props.theme.spacing(2)};
  list-style: none;
  justify-content: space-evenly;
  flex-wrap: wrap;
  column-gap: ${(props) => props.theme.spacing(2)};
  row-gap: ${(props) => props.theme.spacing(2)};
  overflow-y: auto;
  & > li {
    display: flex;
    flex-direction: column;
    & > video {
      height: auto;
      width: 32rem;
    }
  }
`;

const marquee = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
`;
interface ClipTitleProps {
  marquee: boolean;
}
export const ClipTitleMarquee = styled.div`
  font-weight: normal;
  font-size: 1.7rem;
  color: ${(props) => props.theme.colors.primary};
  max-width: 31.9rem;
  overflow: hidden;
  white-space: nowrap;
  /* border: 0.1rem solid ${(props) => props.theme.colors.secondary}; */
  border-bottom: none;
`;

export const ClipTitle = styled.span<ClipTitleProps>`
  display: inline-block;
  animation: ${(props) => (props.marquee ? marquee : "none")} 6s linear infinite;
  padding-left: ${(props) => (props.marquee ? "100%" : "none")};
`;
