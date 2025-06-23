export async function subscribeToTopic(token: string, topic: string) {
  const SERVER_KEY = import.meta.env.VITE_FIREBASE_SERVER_KEY;

  const response = await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
    method: "POST",
    headers: {
      Authorization: `key=${SERVER_KEY}`,
    },
  });

  if (response.ok) {
    console.log(`Token suscrito al topic ${topic}`);
  } else {
    console.error("Error suscribiendo al topic:", await response.text());
  }
}
