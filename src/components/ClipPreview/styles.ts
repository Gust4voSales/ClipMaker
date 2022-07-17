import styled, { css } from "styled-components";

export const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: fit-content;
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

export const VideoControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.secondary};

  & > div {
    display: flex;
    /* justify-content: space-between; */
    margin: 0 ${(props) => props.theme.spacing(3)};
    padding: ${(props) => props.theme.spacing(1)} 0;
  }
`;

export const CustomRangeInput = css`
  -webkit-appearance: none;
  height: 1rem;
  cursor: pointer;

  background: ${(props) => props.theme.colors.background};
  background-image: linear-gradient(${(props) => props.theme.colors.primary}, ${(props) => props.theme.colors.primary});
  background-repeat: no-repeat;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 0;
    width: 0;
  }
  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  &:hover {
    filter: brightness(0.95);
  }
`;

export const TimelineInput = styled.input`
  ${CustomRangeInput}
  background-size: 0% 100%;
`;

export const TogglePlayButton = styled.button`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-right: ${(props) => props.theme.spacing(3)};
  & > svg {
    width: 2rem;
    height: 2rem;
    color: ${(props) => props.theme.colors.background};
  }
`;

export const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  margin: auto 0;
  column-gap: ${(props) => props.theme.spacing(1)};

  & > svg {
    color: ${(props) => props.theme.colors.background};
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    &:hover {
      filter: brightness(0.95);
    }
  }
`;

export const VolumeInput = styled.input`
  ${CustomRangeInput}
  border-radius: ${(props) => props.theme.spacing(0.75)};
  width: 12rem;
`;

export const VideoProgressTime = styled.span`
  color: ${(props) => props.theme.colors.background};
  font-size: 1.2rem;
  margin-left: auto;
`;
