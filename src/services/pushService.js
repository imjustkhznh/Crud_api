import { getAllSubscriptions } from '../models/subscriptionModel.js';
import { sendWebPush } from '../config/push.js';

// Gửi 1 payload tới tất cả subscriptions
export const sendPushNotification = async (payload) => {
  const subs = await getAllSubscriptions();
  if (!subs.length) return { sent: 0 };

  let ok = 0;
  for (const s of subs) {
    try {
      await sendWebPush(s, payload);
      ok++;
    } catch (e) {

    }
  }
  return { sent: ok };
};