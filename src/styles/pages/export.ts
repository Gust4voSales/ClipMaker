import styled from "styled-components";
import theme from "../theme";

export const customModalStyles = {
  content: {
    margin: "auto",
    width: "fit-content",
    height: "fit-content",
    borderRadius: theme.spacing(0.5),
    padding: 0,
  },
  overlay: {
    backgroundColor: theme.colors.background,
  },
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 50vh;
  padding: ${(props) => props.theme.spacing(2)};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Back = styled.a`
  color: ${(props) => props.theme.colors.secondary};
`;

export const LoadingContainer = styled.div`
  height: 30%;
  /* background-color: red; */
`;

export const LoadingSpan = styled.span`
  margin: ${(props) => props.theme.spacing(5)} auto auto auto;
  color: ${(props) => props.theme.colors.primary};
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
