import type { ChatEvents } from "@/types";
import { config, tokens } from "@/utils";
import { io } from "socket.io-client";

interface UseSocketParams {
  listeners: {
    [key in ChatEvents]?: (...args: any[]) => void;
  };
  emitOnConnect: Array<{
    event: ChatEvents;
    data: unknown;
  }>;
}

type Listeners = Array<`${ChatEvents}`>;

const noop = () => {
  return;
};

export const useSocket = ({ emitOnConnect, listeners }: UseSocketParams) => {
  const socket = io(config.get<string>("VITE_WS_URL"), {
    reconnectionDelayMax: 10000,
    auth: {
      agentToken: tokens.get("accessToken")
    }
  });

  socket.on("connect", () => {
    emitOnConnect.forEach(f => socket.emit(f.event, f.data));

    (Object.keys(listeners) as Listeners).forEach(event => {
      socket.on(event, listeners[event] || noop);
    });
  });

  const typedEmit = (event: ChatEvents, data: unknown) => {
    socket.emit(event, data);
  };

  return { socket, typedEmit };
};
