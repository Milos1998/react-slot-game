import { SymbolPool, SymbolPoolItem } from "./SymbolPool";
import { SymbolId, symbolsMapping } from "./Symbols.config";

class SymbolSet {
    private readonly initialPoolSizes = 7;

    private symbolPools: Map<SymbolId, SymbolPool> = new Map();

    public init() {
        symbolsMapping.forEach((mapping) => {
            this.symbolPools.set(mapping.symbolId, new SymbolPool(mapping, this.initialPoolSizes));
        });
    }

    public getRandomSymbolId() {
        const randomIdx = Math.floor(Math.random() * symbolsMapping.length);
        return symbolsMapping[randomIdx].symbolId;
    }

    public getRandomSymbol() {
        return this.getSymbol(this.getRandomSymbolId());
    }

    public getSymbol(symbolId: SymbolId) {
        const symbolPool = this.symbolPools.get(symbolId);
        if (symbolPool === undefined) {
            throw new Error(`Could not fetch symbol with id: ${symbolId}`);
        }
        return symbolPool.getItem();
    }

    public returnSymbol(symbolPoolItem: SymbolPoolItem) {
        const symbolPool = this.symbolPools.get(symbolPoolItem.symbolId);
        if (symbolPool === undefined) {
            throw new Error(`Could not fetch symbol with id: ${symbolPoolItem.symbolId}`);
        }
        return symbolPool.returnItem(symbolPoolItem);
    }
}

export const symbolSet = new SymbolSet();
