export type Win = {
    cellPositions: number[];
    payoutAmount: number;
};

export type WinLine = { cellPositions: number[] };

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
