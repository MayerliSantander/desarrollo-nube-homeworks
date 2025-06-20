export const uploadPostImageToCloudinary = async (file: File): Promise<string> => {
  const CLOUD_NAME = "dzvb2ljzp";
  const UPLOAD_PRESET = "nube-homeworks";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};
