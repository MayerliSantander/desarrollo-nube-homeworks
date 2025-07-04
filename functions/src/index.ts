import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { https } from "firebase-functions/v2";
import { getFirestore } from "firebase-admin/firestore";

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

export const notifyPostOwnerOnReaction = https.onCall(async (request) => {
  const { postId, type } = request.data;

  if (!postId || !type) {
    throw new https.HttpsError("invalid-argument", "postId y type son requeridos");
  }

  const postRef = getFirestore().collection("posts").doc(postId);
  const postDoc = await postRef.get();
  if (!postDoc.exists) {
    throw new https.HttpsError("not-found", "El post no existe");
  }

  const postData = postDoc.data();
  if (!postData || !postData.ownerId) {
    throw new https.HttpsError("internal", "Datos del post inválidos");
  }

  const ownerId = postData.ownerId;

  await postRef.update({
    [`${type}Count`]: admin.firestore.FieldValue.increment(1),
  });

  const userDoc = await getFirestore().collection("profiles").doc(ownerId).get();
  const ownerData = userDoc.data();
  const ownerTokens = ownerData?.notificationTokens;

  if (!ownerTokens || ownerTokens.length === 0) {
    logger.warn(`Usuario ${ownerId} no tiene token de notificación`);
    return { success: false, message: "Usuario sin token" };
  }

  const title = type === "like" ? "¡Nuevo like!" : "¡Nuevo dislike!";
  const body = `Tu post "${postData.title}" recibió un ${type}.`;

  const message = {
    notification: { title, body },
    tokens: ownerTokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    logger.info(`✅ Notificación enviada al autor del post: ${response.successCount} éxito, ${response.failureCount} fallos`);

    const tokensToRemove: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error?.code === "messaging/registration-token-not-registered") {
        tokensToRemove.push(ownerTokens[idx]);
      }
    });

    if (tokensToRemove.length > 0) {
      logger.warn(`Eliminando ${tokensToRemove.length} tokens inválidos para el usuario ${ownerId}`);
      await getFirestore().collection("profiles").doc(ownerId).update({
        notificationTokens: admin.firestore.FieldValue.arrayRemove(...tokensToRemove),
      });
    }

    return { success: true };
  } catch (error: any) {
    logger.error("❌ Error enviando la notificación:", error);
    throw new https.HttpsError("internal", "Error enviando la notificación");
  }
});

const BAD_WORDS = ["fruta", "mala palabra"];

export const moderatePostContent = onDocumentWritten("posts/{postId}", async (event) => {
  const postRef = event.data?.after?.ref;
  const postData = event.data?.after?.data();
  if (!postRef || !postData) return;

  let updatedContent = postData.content;

  BAD_WORDS.forEach(word => {
    const regex = new RegExp(word, "gi");
    updatedContent = updatedContent.replace(regex, "[redacted]");
  });

  if (updatedContent !== postData.content) {
    await postRef.update({ content: updatedContent });
    logger.info(`🛡 Post ${postRef.id} moderado automáticamente`);
  }
});
