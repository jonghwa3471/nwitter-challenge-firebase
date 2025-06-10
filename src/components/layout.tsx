import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 860px;
`;

export default function Layout() {
  return (
    <Wrapper>
      <h1>This is Layout</h1>
      <Outlet />
    </Wrapper>
  );
}
