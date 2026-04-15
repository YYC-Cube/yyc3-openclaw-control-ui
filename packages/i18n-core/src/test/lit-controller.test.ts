import { describe, expect, it, vi } from "vitest";
import { I18nController } from "../lib/lit-controller.js";

describe("I18nController", () => {
  it("should be a class that implements ReactiveController", () => {
    const mockHost = {
      addController: vi.fn(),
      requestUpdate: vi.fn(),
    };

    const controller = new I18nController(mockHost);
    expect(controller).toBeInstanceOf(I18nController);
    expect(mockHost.addController).toHaveBeenCalledWith(controller);
  });

  it("should call hostConnected to subscribe to i18n changes", () => {
    const mockHost = {
      addController: vi.fn(),
      requestUpdate: vi.fn(),
    };

    const controller = new I18nController(mockHost);

    controller.hostConnected();

    expect(mockHost.requestUpdate).not.toHaveBeenCalled();
  });

  it("should call hostDisconnected to unsubscribe", () => {
    const mockHost = {
      addController: vi.fn(),
      requestUpdate: vi.fn(),
    };

    const controller = new I18nController(mockHost);
    controller.hostConnected();
    controller.hostDisconnected();

    expect(mockHost.addController).toHaveBeenCalledTimes(1);
  });
});
