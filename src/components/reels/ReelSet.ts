import gsap from "gsap";
import { gameStore } from "../../stores/GameStore";
import { BaseComponent } from "../BaseComponent";
import { Reel, ReelProps } from "./Reel";
import { ReelCell } from "./ReelCell";
import { baseReelsConfig } from "./ReelSet.config";
import { BottomUpSpin } from "./spin/BottomUpSpin";
import { ReelSpinProps } from "./spin/SpinSystem";
import { TopToBottomSpin } from "./spin/TopToBottomSpin";

export type SpinDirection = "TopToBottom" | "BottomUp";

export type ReelSetConfig = {
    reelDefinition: ReelProps;
    spinDefinition: ReelSpinProps & { spinDirection: SpinDirection };
}[];

export class ReelSet extends BaseComponent {
    private reels: Reel[] = [];

    //NOTE: would have multiple configs defined in some kind of map and update this one when entering the bonus etc.
    private config: ReelSetConfig = baseReelsConfig;

    constructor(layoutId: string) {
        super(layoutId);

        this.config.forEach((reelConfig, idx) => {
            const reel = new Reel(`reel${idx}`, reelConfig.reelDefinition);
            reel.initReelSymbols();
            if (reelConfig.spinDefinition.spinDirection === "TopToBottom") {
                reel.spinSystem = new TopToBottomSpin(reel, reelConfig.spinDefinition);
            } else if (reelConfig.spinDefinition.spinDirection === "BottomUp") {
                reel.spinSystem = new BottomUpSpin(reel, reelConfig.spinDefinition);
            }
            this.reels.push(reel);
        });
    }

    public async startReelSpin() {
        await Promise.all(this.reels.map((reel) => reel.spinSystem.startWindUp()));
    }

    public async awaitMinSpinDelay() {
        await Promise.all(this.reels.map((reel) => reel.spinSystem.awaitMinSpinDelay()));
    }

    public async stopReelSpin() {
        await Promise.all(this.reels.map((reel) => reel.spinSystem.startWindDown()));
    }

    public setSpinResult() {
        const resultSymbolIds = this.reels.map((reel) => reel.resultCells.map((cell) => cell.symbolPoolItem.symbolId));
        gameStore.actions.setSpinResult(resultSymbolIds);
    }

    public async animateWinCells() {
        const resultCells = this.reels.map((reel) => reel.resultCells);

        const { spinWins } = gameStore.props;
        const tl = gsap.timeline({ paused: true });
        spinWins.forEach((win) => {
            const winningCells = win.cellPositions.map((cellIdx, reelIdx) => resultCells[reelIdx][cellIdx]);
            tl.add(this.animateCells(winningCells));
        });
        await new Promise((res) => {
            tl.eventCallback("onComplete", res);
            tl.play();
        });
        tl.clear();
        tl.kill();
    }

    private animateCells(reelCells: ReelCell[]) {
        //would read from some config, hardcoding for the sake of time
        return gsap.to(reelCells, {
            duration: 0.5,
            repeat: 3,
            yoyo: true,
            pixi: {
                scale: 1.3,
            },
        });
    }
}
