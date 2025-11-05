import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Khai báo VAPID key & subject
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:khanhshrimp171204@gmail.com";
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

// 🔹 Cấu hình web-push
webpush.setVapidDetails(
  VAPID_SUBJECT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// 🔹 Xuất hàm để các file khác dùng
export const getVapidPublicKey = () => VAPID_PUBLIC_KEY;

export const sendWebPush = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, payload);
  } catch (err) {
    console.error("❌ WebPush send error:", err.statusCode, err.body || err);
  }
};

export default webpush;
