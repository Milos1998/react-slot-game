import gsap from "gsap";
import { sceneController } from "../../../controllers/SceneController";
import { Reel } from "../Reel";
import { gameStore } from "../../../stores/GameStore";
import { Timer } from "../../../utils/Timer";

export type ReelSpinProps = {
    spinSpeed: number;
    spinStartDelaySec: number;
    windUpEase: gsap.EaseString;
    windUpDurationSec: number;
    windDownEase: gsap.EaseString | gsap.EaseFunction;
    windDownDurationSec: number;
    spinDurationMs: number;
    spinStopDelayMs: number;
};

export abstract class SpinSystem {
    protected reel: Reel;

    protected currentSpinDurationMs: number = 0;

    protected currentSpinSpeed: number = 0;

    protected props: ReelSpinProps;

    protected spinDelayResolve: (() => void) | null = null;

    constructor(reel: Reel, spinProps: ReelSpinProps) {
        this.reel = reel;
        this.props = spinProps;
    }

    public async startWindUp() {
        this.currentSpinDurationMs = 0;
        this.currentSpinSpeed = 0;
        sceneController.ticker.add(this.onSpinTick, this);
        await new Promise((res) => {
            gsap.to(this, {
                currentSpinSpeed: this.props.spinSpeed,
                duration: this.props.windUpDurationSec,
                delay: this.props.spinStartDelaySec,
                ease: this.props.windUpEase,
                onComplete: res,
            });
        });
    }

    public async startWindDown() {
        await Timer.sleep(this.props.spinStopDelayMs);
        sceneController.ticker.remove(this.onSpinTick, this);
    }

    public async awaitMinSpinDelay() {
        const unsubscribe = gameStore.subscribe(
            (state) => state.slamStopped,
            () => {
                if (this.spinDelayResolve !== null) {
                    this.spinDelayResolve();
                }
            },
        );
        await new Promise<void>((res) => {
            this.spinDelayResolve = res;
        });
        this.spinDelayResolve = null;
        unsubscribe();
    }

    protected onSpinTick() {
        this.currentSpinDurationMs += sceneController.ticker.deltaMS;
        if (this.currentSpinDurationMs >= this.props.spinDurationMs && this.spinDelayResolve !== null) {
            this.spinDelayResolve();
        }
    }
}
