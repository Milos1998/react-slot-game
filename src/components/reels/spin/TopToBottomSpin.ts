import gsap from "gsap";
import { sceneController } from "../../../controllers/SceneController";
import { Reel } from "../Reel";
import { ReelSpinProps, SpinSystem } from "./SpinSystem";
import { SymbolId } from "../symbols/Symbols.config";

export class TopToBottomSpin extends SpinSystem {
    constructor(reel: Reel, spinProps: ReelSpinProps) {
        super(reel, spinProps);

        this.reel.reelCells.sort((a, b) => b.y - a.y);
    }

    public async startWindUp() {
        this.addCellToTheTop();
        await super.startWindUp();
    }

    public async startWindDown(resultSymbolIds: SymbolId[], anticipate: boolean) {
        await super.startWindDown(resultSymbolIds, anticipate);

        const { cellCount, reelCellHeight } = this.reel.props;

        for (let i = 0; i < cellCount; i++) {
            const symbolIdx = resultSymbolIds.length - i - 1;
            this.addCellToTheTop(resultSymbolIds[symbolIdx]);
        }
        const topMostCell = this.reel.reelCells[this.reel.reelCells.length - 1];
        const remainingTravelDist = -topMostCell.y + reelCellHeight / 2;
        const duration = anticipate ? this.props.anticipation.windDownDurationSec : this.props.windDownDurationSec;
        await new Promise((res) => {
            gsap.to(this.reel.reelCells, {
                pixi: {
                    y: `+=${remainingTravelDist}`,
                },
                duration,
                ease: this.props.windDownEase,
                onComplete: res,
            });
        });

        while (cellCount < this.reel.reelCells.length) {
            this.reel.removeOldestCell();
        }
    }

    protected onSpinTick(): void {
        this.updateCellPositions(sceneController.ticker.deltaMS);
        this.checkMovementThreshold();
    }

    private updateCellPositions(dt: number) {
        this.reel.reelCells.forEach((cell) => {
            cell.y += this.currentSpinSpeed * dt;
        });
    }

    private checkMovementThreshold() {
        const bottomCell = this.reel.reelCells[0];
        const { reelCellHeight, reelHeight } = this.reel.props;
        if (bottomCell.y - reelCellHeight / 2 <= reelHeight) {
            return;
        }

        this.reel.removeOldestCell();
        this.addCellToTheTop();
    }

    private addCellToTheTop(symbolId?: SymbolId) {
        const topCell = this.reel.reelCells[this.reel.reelCells.length - 1];
        const newCell = this.reel.addReelCell(symbolId);
        newCell.position.y = topCell.y - this.reel.props.reelCellHeight;
    }

    public dispose() {
        const reelCell = this.reel.reelCells.pop();
        if (reelCell) {
            this.reel.container.removeChild(reelCell);
        }
    }
}
