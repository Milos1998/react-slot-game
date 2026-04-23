import gsap from "gsap";
import { sceneController } from "../../../controllers/SceneController";
import { Reel } from "../Reel";
import { Timer } from "../../../utils/Timer";
import { SymbolId } from "../symbols/Symbols.config";

export type ReelSpinProps = {
    spinSpeed: number;
    spinStartDelaySec: number;
    windUpEase: gsap.EaseString;
    windUpDurationSec: number;
    windDownEase: gsap.EaseString | gsap.EaseFunction;
    windDownDurationSec: number;
    spinStopDelayMs: number;
    anticipation: {
        spinSpeed: number;
        stopDelayMs: number;
        windDownDurationSec: number;
    };
};

export abstract class SpinSystem {
    protected reel: Reel;

    protected currentSpinDurationMs: number = 0;

    protected currentSpinSpeed: number = 0;

    protected props: ReelSpinProps;

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

    public async startWindDown(resultSymbolIds: SymbolId[], anticipate: boolean) {
        if (anticipate) {
            this.currentSpinSpeed = this.props.anticipation.spinSpeed;
            await Timer.sleep(this.props.anticipation.stopDelayMs);
        } else {
            await Timer.sleep(this.props.spinStopDelayMs);
        }
        sceneController.ticker.remove(this.onSpinTick, this);
    }

    protected onSpinTick() {}
}
