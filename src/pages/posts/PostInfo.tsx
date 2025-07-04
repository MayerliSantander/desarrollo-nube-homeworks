import { HandThumbsDown, HandThumbsUp, Trash } from "react-bootstrap-icons";
import Button from "../../components/Button";
import { Post } from "../../models/Post";
import { PostRepository } from "../../repositories/PostRepository";
import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "../../firebase/FirebaseConfig";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";

type Props = {
  post: Post;
  onDeleteCallback(): void;
};

export const PostInfo = ({ post, onDeleteCallback }: Props) => {
  const { user } = useFirebaseUser();

  const onDeleteClick = async () => {
    await new PostRepository().deletePost(post.id!);
    onDeleteCallback();
  };

  const onLikeDislike = async (type: "like" | "dislike") => {
    const notifyFn = httpsCallable(firebaseFunctions, "notifyPostOwnerOnReaction");
    await notifyFn({ postId: post.id, type });
    console.log(`✅ ${type} enviado y notificación solicitada`);
  };

  return (
    <div className="my-6 p-4 rounded-2xl shadow-lg bg-white border border-gray-200 relative overflow-hidden">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
      )}
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-800 text-base mb-4 whitespace-pre-line">{post.content}</p>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          👍 {post.likeCount || 0} &nbsp; | &nbsp; 👎 {post.dislikeCount || 0}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => onLikeDislike("like")}
            className="rounded-full bg-green-500 hover:bg-green-600 text-white p-3 shadow-md transition"
            aria-label="Like post"
          >
            <HandThumbsUp size={20} />
          </button>

          <button
            onClick={() => onLikeDislike("dislike")}
            className="rounded-full bg-red-500 hover:bg-red-600 text-white p-3 shadow-md transition"
            aria-label="Dislike post"
          >
            <HandThumbsDown size={20} />
          </button>
        </div>
      </div>

      {user?.uid === post.ownerId && (
        <Button onClick={onDeleteClick} variant="danger" className="w-full">
          <Trash size={16} className="mr-2" /> Eliminar
        </Button>
      )}
    </div>
  );
};
