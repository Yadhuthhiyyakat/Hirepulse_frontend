import { Notification } from '@/types';

type NotificationCallback = (notification: Notification) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private subscribers: NotificationCallback[] = [];
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/notifications';
    const fullUrl = `${wsUrl}/?token=${token}`;

    try {
      this.socket = new WebSocket(fullUrl);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'notification' && payload.data) {
            this.notifySubscribers(payload.data);
          }
        } catch {
          // ignore non-json
        }
      };

      this.socket.onclose = (event) => {
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
          }, delay);
        }
      };

      this.socket.onerror = () => {
        if (this.socket) {
          this.socket.close();
        }
      };
    } catch {
      // ignore
    }
  }

  subscribe(callback: NotificationCallback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private notifySubscribers(notification: Notification) {
    this.subscribers.forEach((cb) => cb(notification));
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.socket) {
      this.socket.close(1000, 'User logged out');
      this.socket = null;
    }
    this.subscribers = [];
  }
}

export const socketService = new SocketService();

