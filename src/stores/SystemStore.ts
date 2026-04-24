import { createStore, StoreApi } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export enum Orientation {
    None,
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
    safeAreaAspectRatio: number;
    tickerSettings: {
        minFps: number;
        maxFps: number;
    };
    fps: number;
    gameplaySpeeds: number[];
    gameplaySpeedIdx: number;
    getGameplaySpeed: () => number;
    systemError: Error | null;
    isSystemUiEnabled: boolean;
};

class SystemStore {
    private store;

    constructor() {
        this.store = createStore<SystemStoreProps>()(
            subscribeWithSelector(
                immer((set, get) => ({
                    orientation: Orientation.None,
                    safeAreaProps: { width: 0, height: 0 },
                    canvasAreaProps: { width: 0, height: 0 },
                    safeAreaAspectRatio: -1,
                    tickerSettings: { minFps: 40, maxFps: 60 },
                    fps: 0,
                    gameplaySpeeds: [0.1, 0.5, 1, 2, 5, 10],
                    gameplaySpeedIdx: 2,
                    systemError: null,
                    getGameplaySpeed: () => get().gameplaySpeeds[get().gameplaySpeedIdx],
                    isSystemUiEnabled: false,
                })),
            ),
        );
    }

    get reactStore(): StoreApi<SystemStoreProps> {
        return this.store;
    }

    //NOTE: using "get props" for: a) brevity (it's easier to type store.props.abc than store.store.getState().abc)
    //b) for splitting technology from interface (to be able to swap store to e.g. MboX without change impacting the whole codebase).
    //Intention was the same with reactStore but I didn't really get there...
    get props(): SystemStoreProps {
        return this.store.getState();
    }

    get subscribe() {
        return this.store.subscribe;
    }

    public setOrientation = (orientation: Orientation) => {
        this.store.setState((state) => {
            state.orientation = orientation;
        });
    };

    public setSafeAreaProps = (safeAreaProps: { width: number; height: number }) => {
        this.store.setState((state) => {
            state.safeAreaProps = safeAreaProps;
        });
    };

    public setCanvasAreaProps = (canvasAreaProps: { width: number; height: number }) => {
        this.store.setState((state) => {
            state.canvasAreaProps = canvasAreaProps;
        });
    };

    public setSafeAreaAspectRatio = (safeAreaAspectRatio: number) => {
        this.store.setState((state) => {
            state.safeAreaAspectRatio = safeAreaAspectRatio;
        });
    };

    public setFps = (fps: number) => {
        this.store.setState((state) => {
            state.fps = fps;
        });
    };

    public incrementGameplaySpeed = () => {
        this.store.setState((state) => {
            if (state.gameplaySpeedIdx < state.gameplaySpeeds.length - 1) {
                state.gameplaySpeedIdx++;
            }
        });
    };

    public decrementGameplaySpeed = () => {
        this.store.setState((state) => {
            if (state.gameplaySpeedIdx > 0) {
                state.gameplaySpeedIdx--;
            }
        });
    };

    public setSystemError = (systemError: Error | null) => {
        this.store.setState((state) => {
            state.systemError = systemError;
        });
    };

    public setIsSystemUiEnabled = (isSystemUiEnabled: boolean) => {
        this.store.setState((state) => {
            state.isSystemUiEnabled = isSystemUiEnabled;
        });
    };
}

export const systemStore = new SystemStore();
