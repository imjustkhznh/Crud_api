// src/controllers/pushController.js
import { upsertSubscription } from '../models/subscriptionModel.js';
import { getVapidPublicKey } from '../config/push.js';

export const getPublicKey = (req, res) => res.json({ publicKey: getVapidPublicKey() });

export const subscribe = async (req, res) => {
  const sub = req.body;
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }
  await upsertSubscription(sub);
  res.status(201).json({ success: true });
};