import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";

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

type SystemStoreActions = {
    setOrientation: (orientation: Orientation) => void;
    setSafeAreaProps: (newProps: { width: number; height: number }) => void;
    setCanvasAreaProps: (newProps: { width: number; height: number }) => void;
    setFps: (newVal: number) => void;
    incrementGameplaySpeed: () => void;
    decrementGameplaySpeed: () => void;
    setSystemError: (newProps: Error | null) => void;
};

class SystemStore {
    private store;

    constructor() {
        this.store = createStore<SystemStoreProps & SystemStoreActions>()(
            subscribeWithSelector((set, get) => ({
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

                setOrientation: (orientation) => {
                    set((state) => ({
                        ...state,
                        orientation,
                    }));
                },
                setSafeAreaProps: (newProps) => {
                    set((state) => ({
                        ...state,
                        safeAreaProps: newProps,
                    }));
                },
                setCanvasAreaProps: (newProps) => {
                    set((state) => ({
                        ...state,
                        canvasAreaProps: newProps,
                    }));
                },
                setFps: (newVal) => {
                    set((state) => ({
                        ...state,
                        fps: newVal,
                    }));
                },
                incrementGameplaySpeed: () => {
                    set((state) => {
                        if (state.gameplaySpeedIdx < state.gameplaySpeeds.length - 1) {
                            return {
                                ...state,
                                gameplaySpeedIdx: state.gameplaySpeedIdx + 1,
                            };
                        }
                        return state;
                    });
                },
                decrementGameplaySpeed: () => {
                    set((state) => {
                        if (state.gameplaySpeedIdx > 0) {
                            return {
                                ...state,
                                gameplaySpeedIdx: state.gameplaySpeedIdx - 1,
                            };
                        }
                        return state;
                    });
                },
                setSystemError: (newProps) => {
                    set((state) => ({
                        ...state,
                        systemError: newProps,
                    }));
                },
            })),
        );
    }

    get props(): SystemStoreProps {
        return this.store.getState();
    }

    get actions(): SystemStoreActions {
        return this.store.getState();
    }

    get subscribe() {
        return this.store.subscribe;
    }
}

export const systemStore = new SystemStore();
