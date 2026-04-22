import { sceneController } from "../controllers/SceneController";

export class Timer {
    private currentTimeMs: number = 0;

    private currentRepeats: number = 0;

    public durationMs: number;

    public repeatCount: number;

    public onComplete?: () => any;

    public onRepeat?: () => any;

    public isTicking: boolean = false;

    constructor(durationMs: number, repeatCount: number = 1, onComplete?: () => any, onRepeat?: () => any) {
        this.durationMs = durationMs;
        this.repeatCount = repeatCount;
        this.onComplete = onComplete;
        this.onRepeat = onRepeat;
    }

    private tick() {
        this.currentTimeMs += sceneController.ticker.deltaMS;

        if (this.currentTimeMs >= this.durationMs) {
            if (this.onRepeat !== undefined) {
                this.onRepeat();
            }
            this.currentRepeats++;
            this.currentTimeMs = 0;
        }

        if (this.repeatCount >= 0 && this.currentRepeats >= this.repeatCount) {
            this.currentRepeats = 0;
            this.stop(true);
        }
    }

    public stop(completeOnStop: boolean) {
        this.isTicking = false;
        sceneController.ticker.remove(this.tick, this);
        if (completeOnStop && this.onComplete !== undefined) {
            this.onComplete();
        }
    }

    public start(reset: boolean) {
        if (reset) {
            this.currentRepeats = 0;
            this.currentTimeMs = 0;
        }
        this.isTicking = true;
        sceneController.ticker.add(this.tick, this);
    }

    public static async sleep(durationMs: number) {
        await new Promise<void>((res) => {
            const timer = new Timer(durationMs, 1, res);
            timer.start(false);
        });
    }
}
