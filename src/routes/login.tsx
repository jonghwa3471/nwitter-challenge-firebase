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
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface LogInForm {
  name: string;
  email: string;
  password: string;
  error: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LogInForm>();
  const navigate = useNavigate();
  const onValid = async ({ email, password }: LogInForm) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      <Title>Log into 𝕏</Title>
      <Form onSubmit={handleSubmit(onValid)}>
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
        <Input type="submit" value="Log in" />
      </Form>
      <Switcher>
        Don't have an account? &nbsp;
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
      <GithubBtn />
    </Wrapper>
  );
}
