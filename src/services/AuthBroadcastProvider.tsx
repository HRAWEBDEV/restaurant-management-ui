"use client";

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  AUTH_BROADCAST_CHANNEL_NAME,
  AuthBroadcastContext,
  type AuthBroadcastController,
  type AuthBroadcastMessage,
  type AuthBroadcastMessageListener,
  type AuthBroadcastMessageType,
} from "./auth-broadcast-context";

type AuthBroadcastProviderProps = {
  children: ReactNode;
};

function AuthBroadcastProvider({ children }: AuthBroadcastProviderProps) {
  const listenersRef = useRef<Set<AuthBroadcastMessageListener>>(new Set());
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    let channel: BroadcastChannel | null = null;

    try {
      channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL_NAME);
    } catch {
      channel = null;
    }

    channelRef.current = channel;

    const handleMessage = (event: MessageEvent<AuthBroadcastMessage>) => {
      listenersRef.current.forEach((listener) => listener(event.data));
    };

    channel?.addEventListener("message", handleMessage);

    return () => {
      channel?.removeEventListener("message", handleMessage);
      channel?.close();
      channelRef.current = null;
    };
  }, []);

  const postMessage = useCallback(
    (type: AuthBroadcastMessageType, payload?: unknown) => {
      const message: AuthBroadcastMessage = {
        type,
        timestamp: Date.now(),
        payload,
      };

      channelRef.current?.postMessage(message);
      listenersRef.current.forEach((listener) => listener(message));
    },
    [],
  );

  const raiseLogin = useCallback(
    (payload?: unknown) => postMessage("login", payload),
    [postMessage],
  );

  const raiseLogout = useCallback(
    (payload?: unknown) => postMessage("logout", payload),
    [postMessage],
  );

  const subscribe = useCallback((listener: AuthBroadcastMessageListener) => {
    listenersRef.current.add(listener);

    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const controller = useMemo<AuthBroadcastController>(
    () => ({
      raiseLogin,
      raiseLogout,
      subscribe,
    }),
    [raiseLogin, raiseLogout, subscribe],
  );

  return (
    <AuthBroadcastContext.Provider value={controller}>
      {children}
    </AuthBroadcastContext.Provider>
  );
}

export type { AuthBroadcastProviderProps };
export { AuthBroadcastProvider };
