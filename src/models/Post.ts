import type { DocumentData } from "firebase/firestore";

export class Post {
  id?: string;
  title: string = "";
  content: string = "";
  ownerId: string = "";
  createdAt: Date = new Date();
  imageUrl: string = "";
  likeCount: number = 0;
  dislikeCount: number = 0;

  static fromFirestore(id: string, data: DocumentData): Post {
    return {
      id,
      title: data.title || "",
      content: data.content || "",
      ownerId: data.ownerId || "",
      createdAt: data.createdAt?.toDate?.() || new Date(),
      imageUrl: data.imageUrl || "",
      likeCount: data.likeCount || 0,
      dislikeCount: data.dislikeCount || 0,
    };
  }
}
