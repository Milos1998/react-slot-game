export type SymbolId = "9" | "10" | "j" | "q" | "k" | "a" | "pistols" | "hat" | "bag" | "longhorn" | "wanted" | "sherif" | "wild";

export type SymbolMapping = { symbolId: SymbolId; assetName: string; payouts: number[] };

//NOTE: you can controll symbols present on the reels by (un)comenting certain symbol definitions
export const symbolsMapping: SymbolMapping[] = [
    {
        symbolId: "9",
        assetName: "9",
        payouts: [0, 0, 1, 2, 3],
    },
    // {
    //     symbolId: "10",
    //     assetName: "10",
    //     payouts: [0, 0, 1, 2, 3],
    // },
    // {
    //     symbolId: "j",
    //     assetName: "j",
    //     payouts: [0, 0, 1, 2, 3],
    // },
    // {
    //     symbolId: "q",
    //     assetName: "q",
    //     payouts: [0, 0, 1, 2, 3],
    // },
    // {
    //     symbolId: "k",
    //     assetName: "k",
    //     payouts: [0, 0, 1, 2, 3],
    // },
    // {
    //     symbolId: "a",
    //     assetName: "a",
    //     payouts: [0, 0, 1, 2, 3],
    // },
    {
        symbolId: "pistols",
        assetName: "pistols",
        payouts: [0, 1, 2, 3, 5],
    },
    // {
    //     symbolId: "hat",
    //     assetName: "hat",
    //     payouts: [0, 1, 2, 3, 5],
    // },
    // {
    //     symbolId: "bag",
    //     assetName: "bag",
    //     payouts: [0, 1, 2, 3, 5],
    // },
    {
        symbolId: "longhorn",
        assetName: "longhorn",
        payouts: [0, 1, 2, 3, 5],
    },
    {
        symbolId: "wanted",
        assetName: "wanted",
        payouts: [0, 2, 4, 6, 8],
    },
    {
        symbolId: "sherif",
        assetName: "sherif",
        payouts: [0, 3, 5, 7, 10],
    },
    {
        symbolId: "wild",
        assetName: "wild",
        payouts: [0, 1, 3, 5, 10],
    },
] as const;
