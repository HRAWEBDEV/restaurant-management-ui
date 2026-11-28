import { describe, expect, it, vi, afterEach } from "vitest";
import { useEffect } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { OutOfContextError } from "@/utils/out-of-context";
import { AuthBroadcastProvider } from "../AuthBroadcastProvider";
import {
  AUTH_BROADCAST_CHANNEL_NAME,
  useAuthBroadcast,
  type AuthBroadcastMessage,
} from "../auth-broadcast-context";

type ProbeProps = {
  onMessage?: (message: AuthBroadcastMessage) => void;
};

function Probe({ onMessage }: ProbeProps) {
  const { raiseLogin, raiseLogout, subscribe } = useAuthBroadcast();

  useEffect(() => {
    if (!onMessage) return;
    return subscribe(onMessage);
  }, [onMessage, subscribe]);

  return (
    <div>
      <button type="button" onClick={() => raiseLogin()}>
        raise login
      </button>
      <button type="button" onClick={() => raiseLogout({ reason: "manual" })}>
        raise logout
      </button>
    </div>
  );
}

describe("AuthBroadcastProvider", () => {
  afterEach(cleanup);

  it("raises a login event to local subscribers", () => {
    const onMessage = vi.fn();

    render(
      <AuthBroadcastProvider>
        <Probe onMessage={onMessage} />
      </AuthBroadcastProvider>
    );

    fireEvent.click(screen.getByText("raise login"));

    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: "login" })
    );
  });

  it("raises a logout event with a payload to local subscribers", () => {
    const onMessage = vi.fn();

    render(
      <AuthBroadcastProvider>
        <Probe onMessage={onMessage} />
      </AuthBroadcastProvider>
    );

    fireEvent.click(screen.getByText("raise logout"));

    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "logout",
        payload: { reason: "manual" },
      })
    );
  });

  it("delivers messages posted by another channel instance", async () => {
    const onMessage = vi.fn();

    render(
      <AuthBroadcastProvider>
        <Probe onMessage={onMessage} />
      </AuthBroadcastProvider>
    );

    const externalChannel = new BroadcastChannel(
      AUTH_BROADCAST_CHANNEL_NAME
    );

    await act(async () => {
      externalChannel.postMessage({
        type: "logout",
        timestamp: Date.now(),
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    externalChannel.close();

    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: "logout" })
    );
  });

  it("throws OutOfContextError when the hook is used outside the provider", () => {
    expect(() => render(<Probe />)).toThrow(OutOfContextError);
  });
});
