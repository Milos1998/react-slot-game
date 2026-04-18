import { Container } from "pixi.js";
import { SymbolPoolItem } from "./symbols/SymbolPool";

export class ReelCell extends Container {
    public symbolPoolItem: SymbolPoolItem;

    constructor(symbolPoolItem: SymbolPoolItem) {
        super();

        this.symbolPoolItem = symbolPoolItem;
        this.addChild(symbolPoolItem.object);
    }
}
