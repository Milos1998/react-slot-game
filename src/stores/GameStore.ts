import { createStore, StoreApi } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { SymbolId } from "../components/reels/symbols/Symbols.config";
import { initialWinLines, Win, WinLine } from "../components/winController/Win.config";
import { ReelButtons as ReelButton } from "../ui/Ui.config";

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
    anticipationReels: boolean[];
    totalWin: () => number;
    winLines: WinLine[];
    activeWinLinesIdx: number;
    currentWinLines: () => WinLine[];
    isGameUiEnabled: boolean;
    balance: number;
    presentReelButton: ReelButton;
    isReelButtonActive: boolean;
    isSkipped: boolean;
    popupMessage: string | null;
};

class GameStore {
    private store;

    private flowBlockerResolve: null | (() => void) = null;
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
                    anticipationReels: [],
                    winLines: initialWinLines,
                    activeWinLinesIdx: initialWinLines.length - 1,
                    currentWinLines: () => get().winLines.slice(0, get().activeWinLinesIdx + 1),
                    currentBet: () => get().betSteps[get().currentBetIdx],
                    totalWin: () => get().spinWins.reduce((prevSum, win) => prevSum + win.payoutAmount, 0),
                    isGameUiEnabled: false,
                    balance: 1000,
                    presentReelButton: ReelButton.None,
                    isReelButtonActive: false,
                    isSkipped: false,
                    popupMessage: null,
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

    public incrementBet = () => {
        this.store.setState((state) => {
            if (state.currentBetIdx < state.betSteps.length - 1) {
                state.currentBetIdx++;
            }
        });
    };

    public decrementBet = () => {
        this.store.setState((state) => {
            if (state.currentBetIdx > 0) {
                state.currentBetIdx--;
            }
        });
    };

    public setSlamStopped = (slamStopped: boolean) => {
        this.store.setState((state) => {
            state.slamStopped = slamStopped;
        });
    };

    public setCurrentFlows = (currentFlows: GameFlowName) => {
        this.store.setState((state) => {
            state.currentFlows = currentFlows;
            state.nextFlows = GameFlowName.None;
        });
    };

    public setNextFlows = (nextFlows: GameFlowName) => {
        this.store.setState((state) => {
            state.nextFlows = nextFlows;
        });
    };

    public setSpinResult = (spinResult: SymbolId[][]) => {
        this.store.setState((state) => {
            state.spinResult = spinResult;
        });
    };

    public setSpinWins = (spinWins: Win[]) => {
        this.store.setState((state) => {
            state.spinWins = spinWins;
        });
    };

    public setAnticipationReels = (anticipationReels: boolean[]) => {
        this.store.setState((state) => {
            state.anticipationReels = anticipationReels;
        });
    };

    public incrementLinesPlayed = () => {
        this.store.setState((state) => {
            if (state.activeWinLinesIdx < state.winLines.length - 1) {
                state.activeWinLinesIdx++;
            }
        });
    };

    public decrementLinesPlayed = () => {
        this.store.setState((state) => {
            if (state.activeWinLinesIdx > 0) {
                state.activeWinLinesIdx--;
            }
        });
    };

    public setIsGameUiEnabled = (isGameUiEnabled: boolean) => {
        this.store.setState((state) => {
            state.isGameUiEnabled = isGameUiEnabled;
        });
    };

    public decrementBalance = () => {
        this.store.setState((state) => {
            state.balance -= state.currentBet() * (state.activeWinLinesIdx + 1);
        });
    };

    public setPresentReelButton = (button: ReelButton, isActive: boolean) => {
        this.store.setState((state) => {
            state.isReelButtonActive = isActive;
            state.presentReelButton = button;
        });
    };

    public blockGameFlow = () => {
        return new Promise<void>((res) => {
            this.flowBlockerResolve = res;
        });
    };

    public unblockGameFlow = () => {
        if (this.flowBlockerResolve !== null) {
            this.flowBlockerResolve();
        }
    };

    public setIsSkipped = (isSkipped: boolean) => {
        this.store.setState((state) => {
            state.isSkipped = isSkipped;
        });
    };

    public setPopupMessage = (popupMessage: string | null) => {
        this.store.setState((state) => {
            state.popupMessage = popupMessage;
        });
    };
}

export const gameStore = new GameStore();
