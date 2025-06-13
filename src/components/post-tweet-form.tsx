import styled from "styled-components";
import { BLUE } from "../colors/colors";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import FormatDate from "../formatDate";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 2px solid white;
  border-radius: 20px;
  padding: 20px;
  resize: none;
  background-color: black;
  color: white;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  &:focus {
    border-color: ${BLUE};
    outline: none;
  }
  &::placeholder {
    font-size: 16px;
  }
`;

const AddPhotoBtn = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 1px solid ${BLUE};
  border-radius: 25px;
  color: ${BLUE};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AddPhotoInput = styled.input`
  display: none;
`;

const PostTweetBtn = styled.input`
  background-color: ${BLUE};
  padding: 10px;
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

export interface TweetForm {
  tweet: string;
}

export default function PostTweetForm() {
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, reset } = useForm<TweetForm>();
  const [isLoading, setIsLoading] = useState(false);
  const user = auth.currentUser;
  const onValid = async ({ tweet }: TweetForm) => {
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        order: Date.now(),
        createdAt: FormatDate(),
        username: user.displayName || "익명",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const uploadResult = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        await updateDoc(doc, {
          photoUrl: url,
        });
      }
      reset();
      setFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (files && files.length === 1) {
      const file = files[0];
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        alert("File is too big! max size is 1MB.");
        return;
      }
      setFile(file);
    }
  };
  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <TextArea
        {...register("tweet", {
          required: true,
        })}
        rows={5}
        placeholder="What is happening?!"
        maxLength={180}
        required
      ></TextArea>
      <AddPhotoBtn>
        {file ? <span>Add Photo ✅</span> : <span>Add Photo</span>}
        <AddPhotoInput type="file" accept="image/*" onChange={onFileChange} />
      </AddPhotoBtn>
      {isLoading ? (
        <PostTweetBtn type="submit" value="Posting..." />
      ) : (
        <PostTweetBtn type="submit" value="Post Tweet" />
      )}
    </Form>
  );
}
