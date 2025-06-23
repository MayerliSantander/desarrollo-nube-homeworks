import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { FileUploadResult } from "../pages/models/FileUploadResult";
import { firebaseStorage } from "../firebase/FirebaseConfig";

export class ProfilePictureRepository {
  setProfilePicture(userId: string, file: File): Promise<FileUploadResult> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(firebaseStorage, "profile/" + userId + ".jpg");
      uploadBytes(storageRef, file)
        .then(async (snapshot) => {
          const downloadUrl = await getDownloadURL(snapshot.ref);
          resolve({
            downloadUrl,
          });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          reject(error);
        });
    });
  }

  //   getProfilePicture(userId: string): string | undefined {}

  //   deleteProfilePicture(userId: string): void {}
}
