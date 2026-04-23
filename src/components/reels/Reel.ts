import { Graphics } from "pixi.js";
import { BaseComponent } from "../BaseComponent";
import { ReelCell } from "./ReelCell";
import { SpinSystem } from "./spin/SpinSystem";
import { symbolSet } from "./symbols/SymbolSet";
import { SymbolId } from "./symbols/Symbols.config";

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

    public spinSystem!: SpinSystem;

    constructor(layoutId: string, props: ReelProps) {
        super(layoutId);

        this.props = props;
        const mask = new Graphics().beginFill(0xfff).drawRect(-this.props.reelWidth / 2, 0, this.props.reelWidth, this.props.reelHeight);
        this.container.mask = mask;
        this.container.addChild(mask);
    }

    public initReelSymbols() {
        const { cellCount, reelCellHeight } = this.props;
        for (let i = 0; i < cellCount; i++) {
            const randomSymbol = symbolSet.getRandomSymbol();
            const reelCell = new ReelCell(randomSymbol);
            this.reelCells.push(reelCell);
            this.container.addChild(reelCell);
            reelCell.position.y = i * reelCellHeight + reelCellHeight / 2;
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

    public get resultCells() {
        //would do this differently in real life...
        const cellsCpy = [...this.reelCells];
        cellsCpy.sort((a, b) => a.y - b.y);
        return cellsCpy;
    }
}
