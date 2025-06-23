import { useContext, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import { PostRepository } from "../../repositories/PostRepository";
import { PostContext } from "./PostContext";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import { Dialog } from "../../components/Dialog";
import { uploadPostImageToCloudinary } from "../../utils/uploadPostImageToCloudinary";
import FileInput from "../../components/FileInput";
import { sendNotificationToAllUsers } from "../../utils/sendNotificationToAllUsers";

type Inputs = {
  title: string;
  content: string;
  image: FileList;
};

export const PostDialog = () => {
  const { isDialogOpen, setIsDialogOpen, reloadFlag, setReloadFlag } =
    useContext(PostContext);
  const { user } = useFirebaseUser();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<Inputs>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setPreviewUrl(URL.createObjectURL(file));
      setUploadSuccess(false);
    }
  }, [imageFile]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setUploading(true);
    let imageUrl = "";
    try {
      if (data.image && data.image[0]) {
        imageUrl = await uploadPostImageToCloudinary(data.image[0]);
        setUploadSuccess(true);
      }
      const newPost = {
        title: data.title,
        content: data.content,
        imageUrl,
        ownerId: user!.uid,
        createdAt: new Date(),
      };
      await new PostRepository().addPost(newPost);
      await sendNotificationToAllUsers(
        "Nuevo post publicado",
        `${user!.displayName || "Alguien"} publicó: ${data.title}`
      );
      setIsDialogOpen(false);
      setReloadFlag(reloadFlag + 1);
      reset();
      setPreviewUrl(null);
    } catch (e) {
       console.error("Error uploading post:", e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog isOpen={isDialogOpen} onClose={() => { setIsDialogOpen(false); reset(); }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input 
          label="Title" 
          {...register("title", { required: true })} 
          error={errors.title ? "Required" : ""} 
        />
        <Input 
          label="Content" 
          {...register("content", { required: true })} 
          error={errors.content ? "Required" : ""} 
        />
        <FileInput
          label="Image"
          type="file"
          {...register("image")}
          error={errors.image ? "This field is required" : ""}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 w-full max-h-48 object-cover rounded shadow"
          />
        )}
        {uploading && <p className="text-sm text-blue-600 mt-1">Subiendo imagen...</p>}
        {uploadSuccess && <p className="text-sm text-green-600 mt-1">Imagen subida correctamente</p>}
        <div className="mt-4">
          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
