import admin from "firebase-admin";
import fs from "fs/promises";
import express from "express";
import cors from "cors";

const serviceAccount = JSON.parse(
  await fs.readFile("firebase-adminsdk.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
  const { title, body } = req.body;

  const message = {
    notification: { title, body },
    topic: "all",
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notificación enviada:", response);
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error("❌ Error al enviar la notificación:", error);
    res.status(500).send({ success: false, error });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de notificaciones activo en http://localhost:${PORT}`);
});
