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
    <div className="my-4 border p-4 rounded shadow-md bg-white">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-auto mb-3 rounded-lg border"
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
      )}
      <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
      <p className="text-gray-700 mb-2">{post.content}</p>
      <Button onClick={onDeleteClick} variant="danger">
        <Trash size={12} /> Delete
      </Button>
    </div>
  );
};
