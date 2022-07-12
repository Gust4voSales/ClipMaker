import styled from "styled-components";
import { Button } from "../../components/Button";
import { DisableableComponent } from "../DisableableComponent";

export const Title = styled.h1``;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: ${(props) => props.theme.spacing(2)};
  margin-top: ${(props) => props.theme.spacing(2)};
  & > div:first-child,
  & > div:first-child + div {
    flex: 1;
    padding: ${(props) => props.theme.spacing(2)};
    border-radius: ${(props) => props.theme.spacing()};
  }
`;

export const LeftContainer = styled.div`
  user-select: none;
  width: 49%;
`;

export const InstructionsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: ${(props) => props.theme.spacing(4)};
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
  & > div {
    width: 50%;
    height: 50%;
  }
`;

export const RightContainer = styled.div`
  background-color: #fff;
  width: 49%;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => props.theme.spacing(2)};
`;

export const Label = styled.label`
  font-size: 1.8rem;
  font-weight: 500;
`;

export const FileInputContainer = styled.div<DisableableComponent>`
  display: flex;
  background-color: ${({ disabled, theme }) => (disabled ? theme.colors.disabledBG : theme.colors.background)};
  opacity: ${({ disabled, theme }) => (disabled ? theme.disabledOpacity : 1)};
  align-items: center;
  padding: ${(props) => props.theme.spacing(2)};
  height: 8rem;
  border-radius: ${(props) => props.theme.spacing()};
`;

export const IconStatus = styled.span`
  background-color: ${(props) => props.theme.colors.primary};
  height: 100%;
  width: calc(8rem - (2 * ${(props) => props.theme.spacing(2)}));
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${(props) => props.theme.spacing(0.5)};
  margin-right: ${(props) => props.theme.spacing(2)};
  color: #fff;
  font-size: 1.8rem;
  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

export const FileInfoContainer = styled.div<DisableableComponent>`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  color: ${({ disabled, theme }) => (disabled ? theme.colors.disabledColor : theme.colors.primary)};
`;

export const FileTitle = styled.h4`
  font-weight: 500;
`;

export const FileInfo = styled.span``;

export const RemoveFileButton = styled.button`
  margin-left: auto;
  border: none;
  background: none;
  color: ${(props) => props.theme.colors.error};
  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

export const GroupFields = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing(2)};
  & > div {
    display: flex;
    flex-direction: column;
  }
`;

export const SubmitButton = styled(Button)`
  margin: ${(props) => props.theme.spacing(4)} auto ${(props) => props.theme.spacing()} auto;
`;
