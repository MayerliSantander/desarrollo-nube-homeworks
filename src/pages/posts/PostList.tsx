import { Post } from "../../models/Post";
import { PostInfo } from "./PostInfo";
import { firebaseDb } from "../../firebase/FirebaseConfig";
import { useState, useEffect } from "react";
import { onSnapshot, query, collection } from "firebase/firestore";

export const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(firebaseDb, "posts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts: Post[] = [];
      snapshot.forEach((doc) => newPosts.push(Post.fromFirestore(doc.id, doc.data())));
      setPosts(newPosts);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>{posts.map((post) => (
      <PostInfo key={post.id} post={post} onDeleteCallback={() => {}}  />
    ))}</>
  );
};
