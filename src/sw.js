self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Notification";
  const options = {
    body: data.body || "Bạn có thông báo mới!",
    icon: "/icon.png",
    badge: "/icon.png"
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('http://localhost:3000/')
  );
});
