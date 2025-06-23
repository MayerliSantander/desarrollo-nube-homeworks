import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseDb } from "../firebase/FirebaseConfig";
import { Post } from "../models/Post";

export class PostRepository {
  collectionName = "posts";

  private getCollectionRef() {
    return collection(firebaseDb, this.collectionName);
  }

  addPost(post: Post): Promise<Post> {
    return new Promise((resolve, reject) => {
      if (post.id) delete post.id;
      addDoc(this.getCollectionRef(), post)
        .then((docRef) => {
          resolve({ ...post, id: docRef.id });
        })
        .catch(reject);
    });
  }

  deletePost(id: string): Promise<void> {
    return deleteDoc(doc(firebaseDb, this.collectionName, id));
  }

  getPostsByOwnerId(ownerId: string): Promise<Post[]> {
    return new Promise((resolve, reject) => {
      const q = query(this.getCollectionRef(), where("ownerId", "==", ownerId));
      getDocs(q)
        .then((snapshot) => {
          const posts: Post[] = [];
          snapshot.forEach((doc) => posts.push(Post.fromFirestore(doc.id, doc.data())));
          resolve(posts);
        })
        .catch(reject);
    });
  }
}
