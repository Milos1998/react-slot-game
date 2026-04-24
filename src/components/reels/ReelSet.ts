import gsap from "gsap";
import { gameStore } from "../../stores/GameStore";
import { BaseComponent } from "../BaseComponent";
import { Reel, ReelProps } from "./Reel";
import { ReelCell } from "./ReelCell";
import { baseReelsConfig, cascadeReelsConfig } from "./ReelSet.config";
import { BottomUpSpin } from "./spin/BottomUpSpin";
import { TopToBottomSpin } from "./spin/TopToBottomSpin";
import { Timer } from "../../utils/Timer";
import { symbolSet } from "./symbols/SymbolSet";
import { SymbolId } from "./symbols/Symbols.config";
import { CascadeSpin, CascadeSpinProps } from "./spin/CascadeSpin";
import { playTimelineAsync } from "../../utils/UtilFunctions";
import { NormalReelSpinProps } from "./spin/NormalReelSpin";

export type ReelSetConfig = {
    minSpinDurationMs: number;
    spinStopReelOrder: number[];
    reels: {
        reelDefinition: ReelProps;
        spinDefinition: NormalReelSpinProps | CascadeSpinProps;
    }[];
};

export class ReelSet extends BaseComponent {
    private reels: Reel[] = [];

    private config!: ReelSetConfig;

    private minSpinDurationTimer = new Timer(0);

    constructor(layoutId: string) {
        super(layoutId);

        this.setReelSetConfig(cascadeReelsConfig);
    }

    public setReelSetConfig(reelSetConfig: ReelSetConfig) {
        this.config = reelSetConfig;
        this.config.reels.forEach((reelConfig, idx) => {
            const reel = new Reel(`reel${idx}`, reelConfig.reelDefinition);
            reel.initReelSymbols();
            if (reelConfig.spinDefinition.spinSystemType === "TopToBottom") {
                reel.spinSystem = new TopToBottomSpin(reel, reelConfig.spinDefinition);
            } else if (reelConfig.spinDefinition.spinSystemType === "BottomUp") {
                reel.spinSystem = new BottomUpSpin(reel, reelConfig.spinDefinition);
            } else if (reelConfig.spinDefinition.spinSystemType === "Cascade") {
                reel.spinSystem = new CascadeSpin(reel, reelConfig.spinDefinition);
            }
            this.reels.push(reel);
        });
    }

    public async startReelSpin() {
        await Promise.all(this.reels.map((reel) => reel.spinSystem.startWindUp()));
    }

    public async awaitMinSpinDelay() {
        const unsub = gameStore.subscribe(
            (state) => state.slamStopped,
            () => {
                if (this.minSpinDurationTimer.isTicking) {
                    this.minSpinDurationTimer.stop(true);
                }
            },
        );
        await new Promise<void>((res) => {
            this.minSpinDurationTimer.durationMs = this.config.minSpinDurationMs;
            this.minSpinDurationTimer.onComplete = res;
            this.minSpinDurationTimer.start(true);
        });
        unsub();
    }

    public async stopReelSpin() {
        const { spinResult, anticipationReels } = gameStore.props;
        for (let i = 0; i < this.config.spinStopReelOrder.length; i++) {
            const reelIdx = this.config.spinStopReelOrder[i];
            await this.reels[reelIdx].spinSystem.startWindDown(spinResult[reelIdx], anticipationReels[reelIdx]);
        }
    }

    public setRandomSpinResult() {
        const resultSymbolIds: SymbolId[][] = [];
        for (let i = 0; i < this.reels.length; i++) {
            const reelResultIds: SymbolId[] = [];
            for (let j = 0; j < this.reels[i].props.cellCount; j++) {
                reelResultIds.push(symbolSet.getRandomSymbolId());
            }
            resultSymbolIds.push(reelResultIds);
        }
        gameStore.setSpinResult(resultSymbolIds);
    }

    public async animateWinCells() {
        if (gameStore.props.isSkipped) {
            return;
        }

        const resultCells = this.reels.map((reel) => reel.resultCells);

        const { spinWins } = gameStore.props;
        const tl = gsap.timeline({ paused: true });
        spinWins.forEach((win) => {
            const winningCells = win.cellPositions.map((cellIdx, reelIdx) => resultCells[reelIdx][cellIdx]);
            tl.add(this.animateCells(winningCells));
        });

        const unsub = gameStore.subscribe(
            (state) => state.isSkipped,
            () => {
                tl.totalProgress(1).pause(0);
            },
        );
        await playTimelineAsync(tl, true);
        unsub();
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
