export type SymbolId = "9" | "10" | "j" | "q" | "k" | "a" | "pistols" | "hat" | "bag" | "longhorn" | "wanted" | "sherif" | "wild";

export type SymbolMapping = { symbolId: SymbolId; assetName: string; payouts: number[] };

//NOTE: you can controll symbols present on the reels by (un)comenting certain symbol definitions
//NOTE: you can update payouts arrays to add multipliers for x matched symbols - array [0, 0, 1, 2] will pay out 2 x totalBet for 4 matching symbols
export const symbolsMapping: SymbolMapping[] = [
    {
        symbolId: "9",
        assetName: "9",
        payouts: [0, 0, 1],
    },
    // {
    //     symbolId: "10",
    //     assetName: "10",
    //     payouts: [0, 0, 1],
    // },
    // {
    //     symbolId: "j",
    //     assetName: "j",
    //     payouts: [0, 0, 1],
    // },
    // {
    //     symbolId: "q",
    //     assetName: "q",
    //     payouts: [0, 0, 1],
    // },
    // {
    //     symbolId: "k",
    //     assetName: "k",
    //     payouts: [0, 0, 1],
    // },
    // {
    //     symbolId: "a",
    //     assetName: "a",
    //     payouts: [0, 0, 1],
    // },
    {
        symbolId: "pistols",
        assetName: "pistols",
        payouts: [0, 1, 2],
    },
    {
        symbolId: "hat",
        assetName: "hat",
        payouts: [0, 1, 2],
    },
    {
        symbolId: "bag",
        assetName: "bag",
        payouts: [0, 1, 2],
    },
    {
        symbolId: "longhorn",
        assetName: "longhorn",
        payouts: [0, 1, 2],
    },
    {
        symbolId: "wanted",
        assetName: "wanted",
        payouts: [0, 3, 4],
    },
    {
        symbolId: "sherif",
        assetName: "sherif",
        payouts: [0, 3, 5],
    },
    {
        symbolId: "wild",
        assetName: "wild",
        payouts: [0, 1, 3],
    },
] as const;
