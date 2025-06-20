import type { DocumentData } from "firebase/firestore";

export class Post {
  id?: string;
  title: string = "";
  content: string = "";
  ownerId: string = "";
  createdAt: Date = new Date();

  static fromFirestore(id: string, data: DocumentData): Post {
    return {
      id,
      title: data.title || "",
      content: data.content || "",
      ownerId: data.ownerId || "",
      createdAt: data.createdAt?.toDate?.() || new Date(),
    };
  }
}
