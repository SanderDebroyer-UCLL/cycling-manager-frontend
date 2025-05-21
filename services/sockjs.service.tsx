import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function connectToStompServer(): Client {
  const token = localStorage.getItem('jwt');

  const socket = new SockJS(process.env.NEXT_PUBLIC_API_URL + '/ws');

  const stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      console.log('Connected to STOMP server');
      stompClient.subscribe('/topic/picks', (msg) => {
        console.log(JSON.parse(msg.body));
      });
    },
    onStompError: (frame) => {
      console.error('Broker error:', frame.headers['message']);
      console.error('Details:', frame.body);
    },
    onWebSocketError: (error) => {
      console.error('WebSocket error:', error);
    },
  });

  stompClient.activate();

  return stompClient;
}
