import styled from "styled-components";
import theme from "../theme";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  /* width: 100vw; */
  max-width: 100%;
  overflow-x: hidden;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 50vw;
  align-items: center;
  height: 50vh;
  padding: ${(props) => props.theme.spacing(2)};
  background-color: #fff;
  border: 0.1rem solid ${(props) => props.theme.colors.disabledBG};
  border-radius: ${(props) => props.theme.spacing(0.5)};

  @media (max-width: 760px) {
    width: 100%;
    height: 46vh;

    padding: ${(props) => props.theme.spacing(1)};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

export const Back = styled.a`
  color: ${(props) => props.theme.colors.secondary};
`;

export const LoadingContainer = styled.div`
  height: 30%;
`;

export const LoadingSpan = styled.span`
  margin: ${(props) => props.theme.spacing(5)} auto auto auto;
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
`;

export const OuputVideo = styled.video`
  margin: auto;
`;

export const OutputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const OutputLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22rem;
  height: 4rem;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.background};
  border: 0.2rem solid ${(props) => props.theme.colors.secondary};
  border-radius: ${(props) => props.theme.spacing(0.5)};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  margin-top: ${(props) => props.theme.spacing(2)};
`;
