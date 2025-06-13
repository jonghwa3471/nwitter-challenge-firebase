import styled from "styled-components";
import type { TweetInfo } from "./timeline";
import { auth, db, storage } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { BLUE } from "../colors/colors";
import { useForm } from "react-hook-form";
import type { TweetForm } from "./post-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Photo = styled.div<{ url?: string }>`
  width: 100px;
  height: 100px;
  background-image: url(${(prop) => prop.url});
  background-position: center;
  background-size: cover;
`;

const EditModal = styled.div<{ url?: string }>`
  z-index: 9999;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  background-color: black;
  border-radius: 15px;
  ${Photo} {
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5)
      ),
      url(${(prop) => prop.url});

    &:hover {
      background-image: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.2),
          rgba(0, 0, 0, 0.2)
        ),
        url(${(prop) => prop.url});
    }
  }
`;

const Column = styled.div`
  &:first-child {
    align-self: center;
  }
  &:last-child {
    justify-self: end;
    align-self: center;
  }
`;

const CreatedAt = styled.h6`
  font-size: 12px;
  color: gray;
  margin-bottom: 10px;
`;

const Username = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const Payload = styled.p`
  margin: 10px 0;
  font-size: 18px;
`;

const DeleteBtn = styled.button`
  border: none;
  background-color: tomato;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const EditBtn = styled.button`
  border: none;
  background-color: lightgreen;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  margin-right: 10px;
`;

const OkBtn = styled.button`
  border: none;
  color: white;
  background-color: aqua;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  margin-right: 10px;
`;

const CancelBtn = styled.button`
  border: none;
  color: white;
  background-color: orangered;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  margin-right: 10px;
`;

const Overlay = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  z-index: 5;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
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
  margin-top: 20px;
`;

const Logo = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  svg {
    width: 42px;
    color: white;
  }
`;

const AddPhotoInput = styled.input`
  display: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Tweet({
  id,
  tweet,
  photoUrl,
  userId,
  username,
  createdAt,
}: TweetInfo) {
  const [isEdit, setIsEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<TweetForm>();
  const user = auth.currentUser;
  const onDelete = async () => {
    if (user?.uid !== userId) return;
    await deleteDoc(doc(db, "tweets", id));
    if (photoUrl) {
      const photoRef = ref(storage, `tweets/${userId}/${id}`);
      await deleteObject(photoRef);
    }
  };
  const onEdit = () => {
    setIsEdit(true);
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
  const onValid = async ({ tweet }: TweetForm) => {
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);
      await updateDoc(doc(db, "tweets", id), {
        tweet,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const uploadResult = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        await updateDoc(doc(db, "tweets", id), {
          photoUrl: url,
        });
      }
      reset();
      setFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsEdit(false);
    }
  };
  return (
    <Wrapper>
      {isEdit ? (
        <>
          <Overlay
            onClick={() => {
              setIsEdit(false);
              setFile(null);
              reset();
            }}
          />
          <EditModal url={photoUrl}>
            <Wrapper>
              <Column>
                <CreatedAt>{createdAt}</CreatedAt>
                <Username>{username}</Username>
                <Form onSubmit={handleSubmit(onValid)}>
                  <TextArea
                    {...register("tweet", {
                      required: true,
                    })}
                    autoFocus
                    placeholder={tweet}
                    rows={5}
                    maxLength={180}
                    defaultValue={tweet}
                    required
                  ></TextArea>
                  {userId === user?.uid && (
                    <>
                      <OkBtn>{isLoading ? "Posting..." : "OK"}</OkBtn>
                      <CancelBtn
                        onClick={() => {
                          setIsEdit(false);
                          setFile(null);
                          reset();
                        }}
                      >
                        CANCEL
                      </CancelBtn>
                    </>
                  )}
                </Form>
              </Column>
              <Column>
                {photoUrl && (
                  <Photo url={photoUrl} style={{ position: "relative" }}>
                    <Logo>
                      {file ? (
                        <svg
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm6.713 4.16a.75.75 0 0 1 .127 1.053l-2.75 3.5a.75.75 0 0 1-1.078.106l-1.75-1.5a.75.75 0 1 1 .976-1.138l1.156.99L9.66 6.287a.75.75 0 0 1 1.053-.127Z"
                          />
                        </svg>
                      ) : (
                        <svg
                          fill="none"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      )}
                      <AddPhotoInput
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                      />
                    </Logo>
                  </Photo>
                )}
              </Column>
            </Wrapper>
          </EditModal>
        </>
      ) : null}
      <Column>
        <CreatedAt>{createdAt}</CreatedAt>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {userId === user?.uid && (
          <>
            <EditBtn onClick={onEdit}>EDIT</EditBtn>
            <DeleteBtn onClick={onDelete}>DELETE</DeleteBtn>
          </>
        )}
      </Column>
      <Column>{photoUrl && <Photo url={photoUrl} />}</Column>
    </Wrapper>
  );
}
