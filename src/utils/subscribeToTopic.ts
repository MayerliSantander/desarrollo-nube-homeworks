import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "../firebase/FirebaseConfig";

export async function subscribeToTopic(token: string, topic: string) {
  const subscribeFn = httpsCallable(firebaseFunctions, "subscribeTokenToTopic");
  await subscribeFn({ token, topic });
  console.log(`Token suscrito al topic ${topic} mediante Cloud Function.`);
}
