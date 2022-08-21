import styled from "styled-components";

export function Footer() {
  return (
    <Container>
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
  position: sticky;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing()} 0;
  margin-top: ${(props) => props.theme.spacing(3)};
`;

const Text = styled.span`
  font-size: 1.4rem;
`;

const Link = styled.a`
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.primary};
`;
