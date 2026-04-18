import { Sprite } from "pixi.js";
import { SymbolId, SymbolMapping } from "./Symbols.config";

export type SymbolPoolItem = {
    itemIdx: number;
    object: Sprite;
    isUsed: boolean;
    symbolId: SymbolId;
};

export class SymbolPool {
    private readonly poolSizeIncrement = 3;

    private pool: SymbolPoolItem[] = [];

    public symbolMapping: SymbolMapping;

    constructor(symbolMapping: SymbolMapping, initialSize: number) {
        this.symbolMapping = symbolMapping;
        for (let i = 0; i < initialSize; i++) {
            this.addPoolItem();
        }
    }

    public getItem() {
        let poolItem = this.pool.find((item) => item.isUsed === false);
        if (poolItem !== undefined) {
            poolItem.isUsed = true;
            return poolItem;
        }

        for (let i = 0; i < this.poolSizeIncrement; i++) {
            this.addPoolItem();
        }

        poolItem = this.pool[this.pool.length - 1];
        poolItem.isUsed = true;
        return poolItem;
    }

    public returnItem(item: SymbolPoolItem) {
        this.pool[item.itemIdx].isUsed = false;
    }

    private addPoolItem() {
        const symbolSprite = Sprite.from(this.symbolMapping.assetName);
        symbolSprite.anchor.set(0.5);

        this.pool.push({
            itemIdx: this.pool.length,
            isUsed: false,
            object: symbolSprite,
            symbolId: this.symbolMapping.symbolId,
        });
    }
}
