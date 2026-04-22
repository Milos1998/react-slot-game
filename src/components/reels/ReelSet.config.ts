import { ReelSetConfig } from "./ReelSet";

export const baseReelsConfig: ReelSetConfig = [
    {
        reelDefinition: {
            cellCount: 3,
            reelCellHeight: 112,
            reelCellWidth: 112,
            reelHeight: 336,
            reelWidth: 112,
        },
        spinDefinition: {
            spinDirection: "TopToBottom",
            spinDurationMs: 2500,
            spinSpeed: 1,
            spinStartDelaySec: 0,
            windDownDurationSec: 0.5,
            windDownEase: "none",
            windUpDurationSec: 0.5,
            windUpEase: "back.in(1.7)",
            spinStopDelayMs: 0,
        },
    },
    {
        reelDefinition: {
            cellCount: 3,
            reelCellHeight: 112,
            reelCellWidth: 112,
            reelHeight: 336,
            reelWidth: 112,
        },
        spinDefinition: {
            spinDirection: "BottomUp",
            spinDurationMs: 2500,
            spinSpeed: 1,
            spinStartDelaySec: 0.15,
            windDownDurationSec: 0.5,
            windDownEase: "none",
            windUpDurationSec: 0.5,
            windUpEase: "back.in(1.7)",
            spinStopDelayMs: 2000,
        },
    },
    {
        reelDefinition: {
            cellCount: 3,
            reelCellHeight: 112,
            reelCellWidth: 112,
            reelHeight: 336,
            reelWidth: 112,
        },
        spinDefinition: {
            spinDirection: "TopToBottom",
            spinDurationMs: 2500,
            spinSpeed: 1,
            spinStartDelaySec: 0.3,
            windDownDurationSec: 0.5,
            windDownEase: "none",
            windUpDurationSec: 0.5,
            windUpEase: "back.in(1.7)",
            spinStopDelayMs: 1000,
        },
    },
];
