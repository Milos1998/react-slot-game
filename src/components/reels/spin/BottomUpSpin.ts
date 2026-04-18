import gsap from "gsap";
import { sceneController } from "../../../controllers/SceneController";
import { Reel } from "../Reel";
import { ReelSpinProps, SpinSystem } from "./SpinSystem";

export class BottomUpSpin extends SpinSystem {
    constructor(reel: Reel, spinProps: ReelSpinProps) {
        super(reel, spinProps);

        this.reel.reelCells.sort((a, b) => a.y - b.y);
    }

    public async startWindUp() {
        this.addRandomCellToTheBottom();
        await super.startWindUp();
    }

    public async startWindDown() {
        await super.startWindDown();

        const { cellCount, reelCellHeight, reelHeight } = this.reel.props;

        //NOTE: can add result cells here if needed
        for (let i = 0; i < cellCount; i++) {
            this.addRandomCellToTheBottom();
        }
        const bottomMostCell = this.reel.reelCells[this.reel.reelCells.length - 1];
        const remainingTravelDist = -bottomMostCell.y - reelCellHeight / 2 + reelHeight;
        await new Promise((res) => {
            gsap.to(this.reel.reelCells, {
                pixi: {
                    y: `+=${remainingTravelDist}`,
                },
                duration: this.props.windDownDurationSec,
                ease: this.props.windDownEase,
                onComplete: res,
            });
        });

        while (cellCount < this.reel.reelCells.length) {
            this.reel.removeOldestCell();
        }
    }

    protected onSpinTick(): void {
        super.onSpinTick();
        this.updateCellPositions(sceneController.ticker.deltaMS);
        this.checkMovementThreshold();
    }

    private updateCellPositions(dt: number) {
        this.reel.reelCells.forEach((cell) => {
            cell.y -= this.currentSpinSpeed * dt;
        });
    }

    private checkMovementThreshold() {
        const topCell = this.reel.reelCells[0];
        const { reelCellHeight } = this.reel.props;
        if (topCell.y + reelCellHeight / 2 > 0) {
            return;
        }

        this.reel.removeOldestCell();
        this.addRandomCellToTheBottom();
    }

    private addRandomCellToTheBottom() {
        const bottomCell = this.reel.reelCells[this.reel.reelCells.length - 1];
        const newCell = this.reel.addRandomCell();
        newCell.position.y = bottomCell.y + this.reel.props.reelCellHeight;
    }

    public dispose() {
        const reelCell = this.reel.reelCells.pop();
        if (reelCell) {
            this.reel.container.removeChild(reelCell);
        }
    }
}
