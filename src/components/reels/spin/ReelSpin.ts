import { SymbolId } from "../symbols/Symbols.config";

export type ReelSpinType = "TopToBottom" | "BottomUp" | "Cascade";

export type ReelSpinProps = {
    spinStartDelaySec: number;
    spinStopDelayMs: number;
    spinSystemType: ReelSpinType;
};

export interface ReelSpin {
    startWindUp: () => Promise<void>;
    startWindDown(resultSymbolIds: SymbolId[], anticipate: boolean): Promise<void>;
}
