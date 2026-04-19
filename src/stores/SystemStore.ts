import { createStore, StoreApi } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export enum Orientation {
    Landscape,
    Portrait,
}

export type ScreenSize = {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
};

type SystemStoreProps = {
    orientation: Orientation;
    safeAreaProps: {
        width: number;
        height: number;
    };
    canvasAreaProps: {
        width: number;
        height: number;
    };
    tickerSettings: {
        minFps: number;
        maxFps: number;
    };
    fps: number;
    gameplaySpeeds: number[];
    gameplaySpeedIdx: number;
    getGameplaySpeed: () => number;
    systemError: Error | null;
};

class SystemStore {
    private store;

    constructor() {
        this.store = createStore<SystemStoreProps>()(
            subscribeWithSelector(
                immer((set, get) => ({
                    orientation: Orientation.Portrait,
                    safeAreaProps: { width: 0, height: 0 },
                    canvasAreaProps: { width: 0, height: 0 },
                    tickerSettings: { minFps: 40, maxFps: 60 },
                    fps: 0,
                    gameplaySpeeds: [0.1, 0.5, 1, 2, 5, 10],
                    gameplaySpeedIdx: 2,
                    systemError: null,
                    getGameplaySpeed: () => {
                        return get().gameplaySpeeds[get().gameplaySpeedIdx];
                    },
                })),
            ),
        );
    }

    get reactStore(): StoreApi<SystemStoreProps> {
        return this.store;
    }

    get props(): SystemStoreProps {
        return this.store.getState();
    }

    get subscribe() {
        return this.store.subscribe;
    }

    setOrientation = (orientation: Orientation) => {
        this.store.setState((state) => {
            state.orientation = orientation;
        });
    };
    setSafeAreaProps = (safeAreaProps: { width: number; height: number }) => {
        this.store.setState((state) => {
            state.safeAreaProps = safeAreaProps;
        });
    };
    setCanvasAreaProps = (canvasAreaProps: { width: number; height: number }) => {
        this.store.setState((state) => {
            state.canvasAreaProps = canvasAreaProps;
        });
    };
    setFps = (fps: number) => {
        this.store.setState((state) => {
            state.fps = fps;
        });
    };
    incrementGameplaySpeed = () => {
        this.store.setState((state) => {
            if (state.gameplaySpeedIdx < state.gameplaySpeeds.length - 1) {
                state.gameplaySpeedIdx++;
            }
        });
    };
    decrementGameplaySpeed = () => {
        this.store.setState((state) => {
            if (state.gameplaySpeedIdx > 0) {
                state.gameplaySpeedIdx--;
            }
        });
    };
    setSystemError = (systemError: Error | null) => {
        this.store.setState((state) => {
            state.systemError = systemError;
        });
    };
}

export const systemStore = new SystemStore();
