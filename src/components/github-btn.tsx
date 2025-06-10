import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: black;
  margin-top: 50px;
  padding: 10px 20px;
  font-weight: 500;
  gap: 5px;
  border-radius: 50px;
  cursor: pointer;
  user-select: none;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubBtn() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Wrapper onClick={onClick}>
      <Logo src="/github-logo.svg" />
      <span>Continue with Github</span>
    </Wrapper>
  );
}
