import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";
import { SymbolId } from "../components/reels/symbols/Symbols.config";

export enum GameFlowName {
    BaseGame,
    None,
}

export type Win = {
    cellPositions: number[];
    payoutAmount: number;
};

type WinLine = { cellPositions: number[] };

const initialWinLines = [
    {
        cellPositions: [1, 1, 1, 1, 1],
    },
    {
        cellPositions: [0, 0, 0, 0, 0],
    },
    {
        cellPositions: [2, 2, 2, 2, 2],
    },
    {
        cellPositions: [0, 1, 2, 1, 0],
    },
    {
        cellPositions: [2, 1, 0, 1, 2],
    },
    {
        cellPositions: [0, 0, 1, 0, 0],
    },
    {
        cellPositions: [2, 2, 1, 2, 2],
    },
    {
        cellPositions: [0, 0, 1, 2, 2],
    },
    {
        cellPositions: [2, 2, 1, 0, 0],
    },
    {
        cellPositions: [1, 1, 0, 1, 1],
    },
    {
        cellPositions: [1, 1, 2, 1, 1],
    },
    {
        cellPositions: [2, 2, 2, 2, 0],
    },
];

type GameStoreProps = {
    currentFlows: GameFlowName;
    nextFlows: GameFlowName;
    slamStopped: boolean;
    betSteps: number[];
    currentBetIdx: number;
    currentBet: () => number;
    spinResult: SymbolId[][];
    spinWins: Win[];
    totalWin: () => number;
    winLines: WinLine[];
    activeWinLinesIdx: number;
    currentWinLines: () => WinLine[];
};

type GameStoreActions = {
    setCurrentFlows: (newProps: GameFlowName) => void;
    setNextFlows: (newProps: GameFlowName) => void;
    setSlamStopped: (newProps: boolean) => void;
    incrementBet: () => void;
    decrementBet: () => void;
    setSpinResult: (newProps: SymbolId[][]) => void;
    setSpinWins: (newProps: Win[]) => void;
    incrementLinesPlayed: () => void;
    decrementLinesPlayed: () => void;
};

class GameStore {
    private store;

    constructor() {
        this.store = createStore<GameStoreProps & GameStoreActions>()(
            subscribeWithSelector((set, get) => ({
                currentFlows: GameFlowName.None,
                nextFlows: GameFlowName.None,
                slamStopped: false,
                betSteps: [0.1, 0.2, 0.5, 1, 2, 3, 4, 5, 10],
                currentBetIdx: 6,
                spinResult: [],
                spinWins: [],
                winLines: initialWinLines,
                activeWinLinesIdx: initialWinLines.length - 1,
                currentWinLines: () => {
                    return get().winLines.slice(0, get().activeWinLinesIdx + 1);
                },
                currentBet: () => {
                    return get().betSteps[get().currentBetIdx];
                },
                totalWin: () => {
                    return get().spinWins.reduce((prevSum, win) => prevSum + win.payoutAmount, 0);
                },
                incrementBet: () => {
                    set((state) => {
                        if (state.currentBetIdx < state.betSteps.length - 1) {
                            return {
                                ...state,
                                currentBetIdx: state.currentBetIdx + 1,
                            };
                        }
                        return state;
                    });
                },
                decrementBet: () => {
                    set((state) => {
                        if (state.currentBetIdx > 0) {
                            return {
                                ...state,
                                currentBetIdx: state.currentBetIdx - 1,
                            };
                        }
                        return state;
                    });
                },
                setSlamStopped: (newVal) => {
                    set((state) => ({
                        ...state,
                        slamStopped: newVal,
                    }));
                },
                setCurrentFlows: (newVal) => {
                    set((state) => ({
                        ...state,
                        currentFlows: newVal,
                        nextFlows: GameFlowName.None,
                    }));
                },
                setNextFlows: (newVal) => {
                    set((state) => ({
                        ...state,
                        nextFlows: newVal,
                    }));
                },
                setSpinResult: (newVal) => {
                    set((state) => ({
                        ...state,
                        spinResult: newVal,
                    }));
                },
                setSpinWins: (newVal) => {
                    set((state) => ({
                        ...state,
                        spinWins: newVal,
                    }));
                },
                incrementLinesPlayed: () => {
                    set((state) => {
                        if (state.activeWinLinesIdx < state.winLines.length - 1) {
                            return {
                                ...state,
                                activeWinLinesIdx: state.activeWinLinesIdx + 1,
                            };
                        }
                        return state;
                    });
                },
                decrementLinesPlayed: () => {
                    set((state) => {
                        if (state.activeWinLinesIdx > 0) {
                            return {
                                ...state,
                                activeWinLinesIdx: state.activeWinLinesIdx - 1,
                            };
                        }
                        return state;
                    });
                },
            })),
        );
    }

    get props(): GameStoreProps {
        return this.store.getState();
    }

    get actions(): GameStoreActions {
        return this.store.getState();
    }

    get subscribe() {
        return this.store.subscribe;
    }
}

export const gameStore = new GameStore();
