import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import styled from "styled-components";

const Button = styled.button`
  margin-top: 10px;
  padding: 15px;
  background-color: tomato;
  border-radius: 25px;
  border: none;
  cursor: pointer;
`;

export default function Home() {
  const navigate = useNavigate();
  const onLogOut = async () => {
    const ok = confirm("Are you sure you want to log out?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };
  return (
    <>
      <h1>Logged In! 🎉</h1>
      <Button onClick={onLogOut}>Log out</Button>
    </>
  );
}
