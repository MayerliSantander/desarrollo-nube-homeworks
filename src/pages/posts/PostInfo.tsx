import { Trash } from "react-bootstrap-icons";
import Button from "../../components/Button";
import { Post } from "../models/Post";
import { PostRepository } from "../../repositories/PostRepository";

type Props = {
  post: Post;
  onDeleteCallback(): void;
};

export const PostInfo = ({ post, onDeleteCallback }: Props) => {
  const onDeleteClick = async () => {
    await new PostRepository().deletePost(post.id!);
    onDeleteCallback();
  };

  return (
    <div className="my-3 border p-3 rounded">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <Button onClick={onDeleteClick} variant="danger">
        <Trash size={12} /> Delete
      </Button>
    </div>
  );
};
