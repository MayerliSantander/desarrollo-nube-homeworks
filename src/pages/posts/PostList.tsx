import { useContext, useEffect, useState, useCallback } from "react";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import { PostContext } from "./PostContext";
import { PostRepository } from "../../repositories/PostRepository";
import type { Post } from "../../models/Post";
import { PostInfo } from "./PostInfo";

export const PostList = () => {
  const { user } = useFirebaseUser();
  const { reloadFlag, setReloadFlag } = useContext(PostContext);
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = useCallback(async () => {
    const thePosts = await new PostRepository().getAllPosts();
    setPosts(thePosts);
  }, []);

  useEffect(() => {
    if (user) loadPosts();
  }, [user, reloadFlag, loadPosts]);

  return (
    <>{posts.map((post) => (
      <PostInfo key={post.id} post={post} onDeleteCallback={() => setReloadFlag(reloadFlag + 1)} />
    ))}</>
  );
};
