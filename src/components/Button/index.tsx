import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

export function Button({ children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <ButtonComponent {...rest}>{children}</ButtonComponent>;
}

const ButtonComponent = styled.button`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22rem;
  height: 4rem;
  border: none;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.spacing(0.5)};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
`;
