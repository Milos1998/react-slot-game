import gsap from "gsap";
import { sceneController } from "../../../controllers/SceneController";
import { Reel } from "../Reel";
import { Timer } from "../../../utils/Timer";
import { SymbolId } from "../symbols/Symbols.config";
import { ReelSpin, ReelSpinProps, ReelSpinType } from "./ReelSpin";

export type NormalReelSpinProps = {
    spinSpeed: number;
    windUpEase: gsap.EaseString;
    windUpDurationSec: number;
    windDownEase: gsap.EaseString | gsap.EaseFunction;
    windDownDurationSec: number;
    anticipation: {
        spinSpeed: number;
        stopDelayMs: number;
        windDownDurationSec: number;
    };
    spinSystemType: Extract<ReelSpinType, "TopToBottom" | "BottomUp">;
} & ReelSpinProps;

export abstract class NormalReelSpin implements ReelSpin {
    protected reel: Reel;

    protected props: NormalReelSpinProps;

    protected currentSpinSpeed: number = 0;

    constructor(reel: Reel, spinProps: NormalReelSpinProps) {
        this.reel = reel;
        this.props = spinProps;
    }

    public async startWindUp() {
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
