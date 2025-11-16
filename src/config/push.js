
import webpush from 'web-push';

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;

webpush.setVapidDetails(
  VAPID_SUBJECT || 'mailto:khanhshrimp171204@gmail.com',
  VAPID_PUBLIC_KEY || '',
  VAPID_PRIVATE_KEY || ''
);

export const getVapidPublicKey = () => VAPID_PUBLIC_KEY;
export const sendWebPush = (subscription, payload) =>
  webpush.sendNotification(subscription, JSON.stringify(payload));