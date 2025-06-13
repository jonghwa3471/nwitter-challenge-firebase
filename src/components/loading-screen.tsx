import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 42px;
`;

export default function LoadingScreen() {
  return <Wrapper>Loading...</Wrapper>;
}
