export type AdminNotification = { id: string; type: "quote"; message: string; quoteId: string; createdAt: string; read: boolean };

const notifications: AdminNotification[] = [];

export const notificationService = {
  notifyNewQuote(quoteId: string, carName: string) {
    notifications.unshift({ id: `${Date.now()}-${quoteId}`, type: "quote", quoteId, message: `New quote request received for ${carName}`, createdAt: new Date().toISOString(), read: false });
  },
  list() { return notifications.slice(0, 30); },
  markRead() { notifications.forEach((notification) => { notification.read = true; }); }
};
