import styled from "styled-components";
import { BLUE } from "../colors/colors";

export const Wrapper = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
`;

export const Title = styled.div`
  font-size: 42px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 50px;
  margin-bottom: 10px;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  &[type="submit"] {
    background-color: ${BLUE};
    cursor: pointer;
    color: white;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const ErrorMessage = styled.span`
  color: red;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: ${BLUE};
  }
`;
