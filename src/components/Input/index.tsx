import { InputHTMLAttributes } from "react";
import styled from "styled-components";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <InputComponent {...props} />;
}

const InputComponent = styled.input`
  background-color: #fff;
  border: 0.2rem solid #fff;
  padding: ${(props) => props.theme.spacing()};
  border-radius: ${(props) => props.theme.spacing(0.5)};
  /* width: 100%; */
  height: 3.4rem;
  outline: none;
  &:focus {
    border: 0.2rem solid ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;
