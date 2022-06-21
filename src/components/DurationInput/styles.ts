import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing()};
`;

export const DurationRange = styled.input`
  margin-bottom: ${(props) => props.theme.spacing(0.5)};
  width: 20rem;
  & {
    -webkit-appearance: none;
    height: 0.6rem;
    background: ${(props) => props.theme.colors.background};
    border-radius: 5px;
    background-image: linear-gradient(
      ${(props) => props.theme.colors.primary},
      ${(props) => props.theme.colors.primary}
    );
    background-repeat: no-repeat;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 1.2rem;
    width: 1.2rem;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 0 2px 0 #555;
    transition: background 0.3s ease-in-out;
  }

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  &:enabled {
    &::-webkit-slider-thumb:hover {
      box-shadow: ${(props) => props.theme.colors.primary}50 0px 0px 0px 8px;
    }

    &::-webkit-slider-thumb:active {
      box-shadow: ${(props) => props.theme.colors.primary}50 0px 0px 0px 11px;
      transition: box-shadow 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, left 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        bottom 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }
  }
  &:disabled {
    &::-webkit-slider-thumb {
      cursor: default;
    }
  }
`;

export const SelectedDuration = styled.span`
  font-size: 1.6rem;
  font-weight: 700;
`;
