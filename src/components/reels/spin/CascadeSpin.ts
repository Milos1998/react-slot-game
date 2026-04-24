import gsap from "gsap";
import { Reel } from "../Reel";
import { SymbolId } from "../symbols/Symbols.config";
import { ReelCell } from "../ReelCell";
import { playTimelineAsync } from "../../../utils/UtilFunctions";
import { ReelSpin, ReelSpinProps, ReelSpinType } from "./ReelSpin";
import { gameStore } from "../../../stores/GameStore";

export type CascadeSpinProps = {
    disappearAnimProps: {
        maxScale: number;
        scaleDurationSec: number;
        rotation: number;
        rotationRepeats: number;
        rotationDurSec: number;
    };
    gravity: number;
    gravityEase: gsap.EaseString | gsap.EaseFunction;
    spinSystemType: Extract<ReelSpinType, "Cascade">;
} & ReelSpinProps;

export class CascadeSpin implements ReelSpin {
    private reel: Reel;

    private props: CascadeSpinProps;

    private cellsToRemove: number[] = [];

    constructor(reel: Reel, spinProps: CascadeSpinProps) {
        this.reel = reel;
        this.props = spinProps;
        this.reel.reelCells.sort((a, b) => a.y - b.y);
    }

    public calcCellsToRemove() {
        const { spinWins } = gameStore.props;

        const removeAtIdx = new Array(this.reel.props.cellCount).fill(false);
        if (spinWins.length === 0) {
            removeAtIdx.fill(true);
        } else {
            spinWins.forEach((win) => {
                const cellIdx = win.cellPositions[this.reel.reelIndex];
                removeAtIdx[cellIdx] = true;
            });
        }
        this.cellsToRemove = [];
        removeAtIdx.forEach((shouldRemove, idx) => {
            if (shouldRemove) {
                this.cellsToRemove.push(idx);
            }
        });
    }

    public async startWindUp() {
        this.calcCellsToRemove();
        if (this.cellsToRemove.length === 0) {
            return;
        }

        const tl = gsap.timeline({ paused: true });
        this.cellsToRemove.forEach((idx) => {
            const cell = this.reel.reelCells[idx];
            tl.add(this.makeDisappearAnim(cell), 0);
        });
        await playTimelineAsync(tl, true);

        await this.settleCells();
    }

    private makeDisappearAnim(cell: ReelCell) {
        const tl = gsap.timeline();
        const { maxScale, scaleDurationSec, rotation, rotationDurSec, rotationRepeats } = this.props.disappearAnimProps;
        tl.to(cell, { duration: scaleDurationSec, pixi: { scale: maxScale } });
        tl.to(cell, { duration: rotationDurSec, pixi: { rotation: rotation } });
        tl.to(cell, { duration: rotationDurSec, yoyo: true, repeat: rotationRepeats, pixi: { rotation: -rotation } });
        tl.to(cell, { duration: rotationDurSec, pixi: { rotation: 0 } });
        tl.to(cell, { duration: scaleDurationSec, pixi: { scale: 0 } });
        return tl;
    }

    private async settleCells() {
        for (let i = this.cellsToRemove.length - 1; i >= 0; i--) {
            this.reel.removeCell(this.cellsToRemove[i]);
        }
        if (this.reel.reelCells.length === 0) {
            return;
        }

        const cellsRemoved = this.reel.props.cellCount - this.reel.reelCells.length;
        const newCellPositions = new Array(this.reel.reelCells.length);
        this.reel.reelCells.forEach((cell, idx) => {
            newCellPositions[idx] = this.reel.getCellYPosition(cellsRemoved + idx);
        });

        const tl = gsap.timeline({ paused: true });
        this.reel.reelCells.forEach((cell, idx) => {
            tl.add(this.makeSettleAnim(cell, newCellPositions[idx]), 0);
        });
        await playTimelineAsync(tl, true);
    }

    private makeSettleAnim(cell: ReelCell, position: number) {
        const totalDist = Math.abs(cell.y - position);
        const duration = Math.sqrt((2 * totalDist) / this.props.gravity);
        return gsap.to(cell, { duration, pixi: { y: position }, ease: this.props.gravityEase });
    }

    public async startWindDown(resultSymbolIds: SymbolId[]) {
        const cellsToAdd = resultSymbolIds.length - this.reel.reelCells.length;
        if (cellsToAdd === 0) {
            return;
        }

        const newCells = [];
        for (let i = 0; i < cellsToAdd; i++) {
            const cell = this.reel.addReelCell(resultSymbolIds[i]);
            newCells.push(cell);
        }

        const tl = gsap.timeline({ paused: true });
        newCells.forEach((cell, idx) => {
            cell.y = -this.reel.getCellYPosition(cellsToAdd - idx - 1);
            tl.add(this.makeSettleAnim(cell, this.reel.getCellYPosition(idx)), 0);
        });
        await playTimelineAsync(tl, true);

        this.reel.reelCells.sort((a, b) => a.y - b.y);
    }
}
