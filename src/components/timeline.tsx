import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import styled from "styled-components";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import type { Unsubscribe } from "firebase/auth";
import Tweet from "./tweet";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export interface TweetInfo {
  id: string;
  tweet: string;
  photoUrl?: string;
  userId: string;
  username: string;
  createdAt: string;
}

export default function Timeline() {
  const [tweets, setTweets] = useState<TweetInfo[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("order", "desc"),
        limit(25)
      );
      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, photoUrl, userId, username, createdAt } = doc.data();
          return {
            tweet,
            photoUrl,
            userId,
            username,
            id: doc.id,
            createdAt,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe?.();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
