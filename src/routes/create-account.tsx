import { Link, useNavigate } from "react-router-dom";
import {
  ErrorMessage,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GithubBtn from "../components/github-btn";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";

interface JoinForm {
  name: string;
  email: string;
  password: string;
  error: string;
}

export default function CreateAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<JoinForm>();
  const navigate = useNavigate();
  const onValid = async ({ name, email, password }: JoinForm) => {
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError("error", {
          message: error.message,
        });
      }
    }
  };
  return (
    <Wrapper>
      <Title>Join 𝕏</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register("name", {
            required: true,
          })}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          {...register("email", {
            required: true,
          })}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          {...register("password", {
            required: true,
            minLength: {
              value: 6,
              message: "Password should be longer than 6.",
            },
          })}
          placeholder="Password"
          type="password"
          required
        />
        <ErrorMessage>{errors.password?.message}</ErrorMessage>
        <ErrorMessage>{errors.error?.message}</ErrorMessage>
        <Input type="submit" value="Create Account" />
      </Form>
      <Switcher>
        Already have an account? &nbsp;
        <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubBtn />
    </Wrapper>
  );
}
