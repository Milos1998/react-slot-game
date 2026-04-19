import { createStore, StoreApi } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { SymbolId } from "../components/reels/symbols/Symbols.config";
import { initialWinLines, Win, WinLine } from "../components/winController/Win.config";

export enum GameFlowName {
    BaseGame,
    None,
}

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

class GameStore {
    private store;

    constructor() {
        this.store = createStore<GameStoreProps>()(
            subscribeWithSelector(
                immer((set, get) => ({
                    currentFlows: GameFlowName.None,
                    nextFlows: GameFlowName.None,
                    slamStopped: false,
                    betSteps: [0.1, 0.2, 0.5, 1, 2, 3, 4, 5, 10],
                    currentBetIdx: 7,
                    spinResult: [],
                    spinWins: [],
                    winLines: initialWinLines,
                    activeWinLinesIdx: initialWinLines.length - 1,
                    currentWinLines: () => get().winLines.slice(0, get().activeWinLinesIdx + 1),
                    currentBet: () => get().betSteps[get().currentBetIdx],
                    totalWin: () => get().spinWins.reduce((prevSum, win) => prevSum + win.payoutAmount, 0),
                })),
            ),
        );
    }

    get reactStore(): StoreApi<GameStoreProps> {
        return this.store;
    }

    get props(): GameStoreProps {
        return this.store.getState();
    }

    get subscribe() {
        return this.store.subscribe;
    }

    incrementBet = () => {
        this.store.setState((state) => {
            if (state.currentBetIdx < state.betSteps.length - 1) {
                state.currentBetIdx++;
            }
        });
    };

    decrementBet = () => {
        this.store.setState((state) => {
            if (state.currentBetIdx > 0) {
                state.currentBetIdx--;
            }
        });
    };

    setSlamStopped = (slamStopped: boolean) => {
        this.store.setState((state) => {
            state.slamStopped = slamStopped;
        });
    };

    setCurrentFlows = (currentFlows: GameFlowName) => {
        this.store.setState((state) => {
            state.currentFlows = currentFlows;
            state.nextFlows = GameFlowName.None;
        });
    };

    setNextFlows = (nextFlows: GameFlowName) => {
        this.store.setState((state) => {
            state.nextFlows = nextFlows;
        });
    };

    setSpinResult = (spinResult: SymbolId[][]) => {
        this.store.setState((state) => {
            state.spinResult = spinResult;
        });
    };

    setSpinWins = (spinWins: Win[]) => {
        this.store.setState((state) => {
            state.spinWins = spinWins;
        });
    };

    incrementLinesPlayed = () => {
        this.store.setState((state) => {
            if (state.activeWinLinesIdx < state.winLines.length - 1) {
                state.activeWinLinesIdx++;
            }
        });
    };

    decrementLinesPlayed = () => {
        this.store.setState((state) => {
            if (state.activeWinLinesIdx > 0) {
                state.activeWinLinesIdx--;
            }
        });
    };
}

export const gameStore = new GameStore();
