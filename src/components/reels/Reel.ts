import { Graphics } from "pixi.js";
import { BaseComponent } from "../BaseComponent";
import { ReelCell } from "./ReelCell";
import { symbolSet } from "./symbols/SymbolSet";
import { SymbolId } from "./symbols/Symbols.config";
import { ReelSpin } from "./spin/ReelSpin";

export type ReelProps = {
    reelHeight: number;
    reelWidth: number;
    reelCellWidth: number;
    reelCellHeight: number;
    cellCount: number;
};

export class Reel extends BaseComponent {
    public props: ReelProps;

    public reelCells: ReelCell[] = [];

    public spinSystem!: ReelSpin;

    public readonly reelIndex: number;

    constructor(layoutId: string, props: ReelProps, reelIndex: number) {
        super(layoutId);

        this.props = props;
        const mask = new Graphics().beginFill(0xfff).drawRect(-this.props.reelWidth / 2, 0, this.props.reelWidth, this.props.reelHeight);
        this.container.mask = mask;
        this.container.addChild(mask);
        this.reelIndex = reelIndex;
    }

    public initReelSymbols() {
        const { cellCount } = this.props;
        for (let i = 0; i < cellCount; i++) {
            const randomSymbol = symbolSet.getRandomSymbol();
            const reelCell = new ReelCell(randomSymbol);
            this.reelCells.push(reelCell);
            this.container.addChild(reelCell);
            reelCell.position.y = this.getCellYPosition(i);
        }
    }

    public addReelCell(symbolId?: SymbolId) {
        let symbol;
        if (symbolId === undefined) {
            symbol = symbolSet.getRandomSymbol();
        } else {
            symbol = symbolSet.getSymbol(symbolId);
        }
        const newCell = new ReelCell(symbol);
        this.container.addChild(newCell);
        this.reelCells.push(newCell);
        return newCell;
    }

    public removeOldestCell() {
        const cell = this.reelCells.shift();
        if (cell === undefined) {
            return;
        }
        this.container.removeChild(cell);
        symbolSet.returnSymbol(cell.symbolPoolItem);
    }

    public removeCell(cellIdx: number) {
        const cell = this.reelCells.splice(cellIdx, 1)[0];
        if (cell === undefined) {
            return;
        }
        this.container.removeChild(cell);
        symbolSet.returnSymbol(cell.symbolPoolItem);
    }

    public get resultCells() {
        //would do this differently in real life...
        const cellsCpy = [...this.reelCells];
        cellsCpy.sort((a, b) => a.y - b.y);
        return cellsCpy;
    }

    public getCellYPosition(cellIdx: number) {
        const { reelCellHeight } = this.props;
        return cellIdx * reelCellHeight + reelCellHeight / 2;
    }
}
