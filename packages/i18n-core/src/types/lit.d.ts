/**
 * Type declarations for optional peer dependencies
 */

declare module 'lit' {
    export interface ReactiveControllerHost {
        addController(controller: unknown): void;
        requestUpdate(): void;
    }

    export interface ReactiveController {
        hostConnected?(): void;
        hostDisconnected?(): void;
    }
}
