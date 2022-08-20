import styled from "styled-components";

export function Footer() {
  return (
    <Container style={{ position: "absolute", bottom: 0 }}>
      <Text>
        Criado por{" "}
        <Link rel="noreferrer noopener" target="_blank" href="https://www.linkedin.com/in/gust4vo-sales/">
          Gust4vo Sales
        </Link>{" "}
        🚀
      </Text>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: ${(props) => props.theme.spacing()};
`;

const Text = styled.span`
  font-size: 1.4rem;
`;

const Link = styled.a`
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.primary};
`;
