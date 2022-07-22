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

export const LoadingContainer = styled.div`
  height: 30%;
  /* background-color: red; */
`;

export const LoadingSpan = styled.span`
  margin: ${(props) => props.theme.spacing(5)} auto auto auto;
  color: ${(props) => props.theme.colors.primary};
`;
