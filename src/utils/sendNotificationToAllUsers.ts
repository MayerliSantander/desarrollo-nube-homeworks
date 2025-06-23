export async function sendNotificationToAllUsers(title: string, body: string) {
  const res = await fetch("http://localhost:4000/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });

  const data = await res.json();
  console.log("Notification response:", data);
}
