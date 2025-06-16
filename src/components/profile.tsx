import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { BLUE } from "../colors/colors";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { TweetInfo } from "./timeline";
import Tweet from "./tweet";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 50px;
  overflow-y: scroll;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const ProfileImgCover = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: ${BLUE};
  border-radius: 50%;
  overflow: hidden;
  svg {
    width: 50px;
  }
  cursor: pointer;
`;

const ProfileInput = styled.input`
  display: none;
`;

const ProfileImg = styled.img`
  width: 100%;
`;

const ProfileInfo = styled.span`
  font-size: 24px;
`;

const Tweets = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<TweetInfo[]>([]);
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        alert("File is too big! max size is 1MB.");
        return;
      }
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  useEffect(() => {
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      const snapshot = await getDocs(tweetsQuery);
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, photo } = doc.data();
        return {
          tweet,
          createdAt,
          userId,
          username,
          photo,
          id: doc.id,
        };
      });
      setTweets(tweets);
    };
    fetchTweets();
  }, [user?.uid]);
  return (
    <Wrapper>
      <ProfileWrapper>
        <ProfileImgCover>
          {avatar ? (
            <ProfileImg src={avatar} />
          ) : (
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
            </svg>
          )}
          <ProfileInput type="file" accept="image/*" onChange={onFileChange} />
        </ProfileImgCover>
        <ProfileInfo>{user?.displayName ?? "Anonymous"}</ProfileInfo>
      </ProfileWrapper>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
