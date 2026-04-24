export type Win = {
    cellPositions: number[];
    payoutAmount: number;
};

export type WinLine = { cellPositions: number[] };

// NOTE: to add win line, just add another object similar to the bottom ones.
//This works by matching cellPositions index to reel index and cellPositions[index] to index of the reel cell.
//E.g. [0, 2, 1] would look at the symbols on reel0Cell0, reel1Cell2 and reel2Cell1
export const initialWinLines = [
    {
        cellPositions: [1, 1, 1],
    },
    {
        cellPositions: [0, 0, 0],
    },
    {
        cellPositions: [2, 2, 2],
    },
    {
        cellPositions: [0, 1, 2],
    },
    {
        cellPositions: [2, 1, 0],
    },
    {
        cellPositions: [2, 1, 2],
    },
    {
        cellPositions: [0, 1, 0],
    },
    {
        cellPositions: [0, 0, 1],
    },
    {
        cellPositions: [2, 2, 1],
    },
    {
        cellPositions: [1, 1, 0],
    },
    {
        cellPositions: [1, 1, 2],
    },
];
