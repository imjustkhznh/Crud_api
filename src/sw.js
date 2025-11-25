self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || '/icon.png', // icon mặc định nếu không có
    data: data.data || {}, // chứa todoId
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', options)
  );
});

// Khi user bấm vào thông báo
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const todoId = event.notification.data?.todoId;
  const targetUrl = todoId
    ? `http://localhost:3000/todos/${todoId}`
    : 'http://localhost:3000/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
