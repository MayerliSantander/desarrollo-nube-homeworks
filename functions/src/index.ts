import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

interface SubscribeData {
  token: string;
  topic: string;
}

export const subscribeTokenToTopic = functions.https.onCall(
  async (request: functions.https.CallableRequest<SubscribeData>, context) => {
    const { token, topic } = request.data;

    if (!token || !topic) {
      throw new functions.https.HttpsError("invalid-argument", "Token y topic son requeridos");
    }

    try {
      const response = await admin.messaging().subscribeToTopic(token, topic);
      console.log(`✅ Token ${token} suscrito al topic ${topic}:`, response);
      return { success: true, response };
    } catch (error) {
      console.error("❌ Error al suscribir token al topic:", error);
      throw new functions.https.HttpsError("internal", "Error al suscribir el token");
    }
  }
);

export const sendNotificationOnNewPost = onDocumentCreated("posts/{postId}", async (event) => {
  const postData = event.data?.data();
  if (!postData) {
    logger.error("❌ Post sin datos.");
    return;
  }

  const title = "Nuevo post publicado";
  const body = `${postData.title} - ${postData.content.slice(0, 30)}...`;

  const message = {
    notification: { title, body },
    topic: "all",
  };

  try {
    const response = await admin.messaging().send(message);
    logger.info(`✅ Notificación enviada: ${response}`);
  } catch (error) {
    logger.error("❌ Error al enviar la notificación:", error);
  }
});
