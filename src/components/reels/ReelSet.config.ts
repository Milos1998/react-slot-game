import { ReelSetConfig } from "./ReelSet";

export const baseReelsConfig: ReelSetConfig = {
    minSpinDurationMs: 2500,
    spinStopReelOrder: [0, 1, 2],
    reels: [
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
                spinSpeed: 1,
                spinStartDelaySec: 0,
                windDownDurationSec: 0.5,
                windDownEase: "none",
                windUpDurationSec: 0.5,
                windUpEase: "back.in(1.7)",
                spinStopDelayMs: 0,
                anticipation: {
                    spinSpeed: 0.5,
                    stopDelayMs: 1500,
                    windDownDurationSec: 1,
                },
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
                spinSpeed: 1,
                spinStartDelaySec: 0.15,
                windDownDurationSec: 0.5,
                windDownEase: "none",
                windUpDurationSec: 0.5,
                windUpEase: "back.in(1.7)",
                spinStopDelayMs: 300,
                anticipation: {
                    spinSpeed: 0.5,
                    stopDelayMs: 1500,
                    windDownDurationSec: 1,
                },
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
                spinSpeed: 1,
                spinStartDelaySec: 0.3,
                windDownDurationSec: 0.5,
                windDownEase: "none",
                windUpDurationSec: 0.5,
                windUpEase: "back.in(1.7)",
                spinStopDelayMs: 300,
                anticipation: {
                    spinSpeed: 0.5,
                    stopDelayMs: 2500,
                    windDownDurationSec: 1,
                },
            },
        },
    ],
};
