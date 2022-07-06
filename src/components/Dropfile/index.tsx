import Image from "next/image";
import { FileX } from "phosphor-react";
import { useEffect, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import styled from "styled-components";

interface DropfileProps {
  acceptedExtensions: Accept;
  backgroundImg: string;
  dropfileDragMessage: string;
  onUpload: (file: File) => void;
}
export function Dropfile({ acceptedExtensions, backgroundImg, dropfileDragMessage, onUpload }: DropfileProps) {
  const { getInputProps, getRootProps, isDragActive, isDragReject, acceptedFiles } = useDropzone({
    accept: acceptedExtensions,
    multiple: false,
  });

  const [entity, setEntity] = useState("");

  useEffect(() => {
    setEntity(dropfileDragMessage.split(" ")[dropfileDragMessage.split(" ").length - 1]);
  }, [dropfileDragMessage]);

  useEffect(() => {
    if (acceptedFiles.length > 0) onUpload(acceptedFiles[0]);
  }, [acceptedFiles]);

  return (
    <Container {...getRootProps()} state={!isDragActive ? "neutral" : isDragReject ? "reject" : "success"}>
      <input {...getInputProps()} />
      <Content>
        <BackgroundImgContainer>
          {!isDragReject ? <BackgroundImg src={backgroundImg} priority layout="fill" /> : <FileX weight="fill" />}
        </BackgroundImgContainer>
        {isDragReject ? (
          <ErrorMessage>Arquivo não suportado</ErrorMessage>
        ) : (
          <div>
            {dropfileDragMessage.replace(entity, "")} <span>{entity}</span> ou clique para procurar
          </div>
        )}
      </Content>
    </Container>
  );
}

interface ContainerProps {
  state: string;
}
const Container = styled.div<ContainerProps>`
  height: 36rem;
  width: 90%;
  margin: 0 auto;
  border: 0.2rem dashed
    ${(props) =>
      props.state === "neutral"
        ? props.theme.colors.secondary
        : props.state === "success"
        ? props.theme.colors.success
        : props.theme.colors.error};
  border-radius: ${(props) => props.theme.spacing(0.5)};
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  width: 100%;
  height: 100%;
  text-align: center;
  justify-content: space-evenly;
  & span {
    font-weight: 700;
    text-transform: uppercase;
  }
`;
const BackgroundImgContainer = styled.div`
  width: 100%;
  height: 80%;
  position: relative;
  & svg {
    width: 100%;
    height: 100%;
    color: ${(props) => props.theme.colors.error};
  }
`;
const BackgroundImg = styled(Image)`
  /* width: 100%; */
  height: 100%;
  position: relative !important;
  object-fit: fill;
`;
const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.error};
`;
