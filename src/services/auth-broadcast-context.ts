import { createContext, useContext } from "react";
import { OutOfContextError } from "@/utils/out-of-context";

const AUTH_BROADCAST_CHANNEL_NAME = "auth";

type AuthBroadcastMessageType = "login" | "logout";

type AuthBroadcastMessage = {
  type: AuthBroadcastMessageType;
  timestamp: number;
  payload?: unknown;
};

type AuthBroadcastMessageListener = (
  message: AuthBroadcastMessage
) => void;

type AuthBroadcastController = {
  raiseLogin: (payload?: unknown) => void;
  raiseLogout: (payload?: unknown) => void;
  subscribe: (listener: AuthBroadcastMessageListener) => () => void;
};

const AuthBroadcastContext = createContext<AuthBroadcastController | null>(
  null
);

function useAuthBroadcast(): AuthBroadcastController {
  const controller = useContext(AuthBroadcastContext);

  if (!controller) {
    throw new OutOfContextError(
      "useAuthBroadcast",
      "AuthBroadcastProvider"
    );
  }

  return controller;
}

export type {
  AuthBroadcastController,
  AuthBroadcastMessage,
  AuthBroadcastMessageListener,
  AuthBroadcastMessageType,
};
export { AUTH_BROADCAST_CHANNEL_NAME, AuthBroadcastContext, useAuthBroadcast };
