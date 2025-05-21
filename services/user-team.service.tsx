// utils/socket.ts
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient: Client | null = null;

export const connectSocket = (onMessage: (msg: any) => void) => {
  const socket = new SockJS(process.env.NEXT_PUBLIC_API_URL + '/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient?.subscribe('/topic/teams', (message) => {
        onMessage(JSON.parse(message.body));
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
};

export const sendTeamPick = (action: any) => {
  stompClient?.publish({
    destination: '/app/team/pick',
    body: JSON.stringify(action),
  });
};

export const getAllUserTeams = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user-teams', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch race data');
  }

  return res.json();
};


const UserTeamService = {
  getAllUserTeams,
};

export default UserTeamService;