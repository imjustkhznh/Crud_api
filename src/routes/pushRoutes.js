import express from 'express';
import webpush from 'web-push';
import { getAllSubscriptions } from '../models/subscriptionModel.js';
import { getPublicKey, subscribe } from "../controllers/pushController.js";

const router = express.Router();

router.get("/public-key", getPublicKey);
router.post("/subscribe", subscribe);

router.post('/test', async (req, res) => {
  const subs = await getAllSubscriptions();
  const payload = JSON.stringify({
    title: " Test Notification",
    body: "this is a test push notification",
  });

  for (const sub of subs) {
    await webpush.sendNotification(sub, payload).catch(err => console.error(err));
  }

  res.json({ success: true, sent: subs.length });
});

export default router;
