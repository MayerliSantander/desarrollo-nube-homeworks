import { useContext } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import { PostRepository } from "../../repositories/PostRepository";
import { PostContext } from "./PostContext";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import { Dialog } from "../../components/Dialog";

type Inputs = {
  title: string;
  content: string;
};

export const PostDialog = () => {
  const { isDialogOpen, setIsDialogOpen, reloadFlag, setReloadFlag } =
    useContext(PostContext);
  const { user } = useFirebaseUser();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const newPost = {
      title: data.title,
      content: data.content,
      ownerId: user!.uid,
      createdAt: new Date(),
    };
    await new PostRepository().addPost(newPost);
    setIsDialogOpen(false);
    setReloadFlag(reloadFlag + 1);
    reset();
  };

  return (
    <Dialog isOpen={isDialogOpen} onClose={() => { setIsDialogOpen(false); reset(); }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Title" {...register("title", { required: true })} error={errors.title ? "Required" : ""} />
        <Input label="Content" {...register("content", { required: true })} error={errors.content ? "Required" : ""} />
        <div className="mt-4">
          <Button variant="primary" type="submit">Save Post</Button>
        </div>
      </form>
    </Dialog>
  );
};
