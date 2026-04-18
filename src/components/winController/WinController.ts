import { Text } from "pixi.js";
import { gameStore } from "../../stores/GameStore";
import { BaseComponent } from "../BaseComponent";
import gsap from "gsap";
import { symbolsMapping } from "../reels/symbols/Symbols.config";

const winControllerProps = {
    rollupDurationSec: 3,
    rollupHideDelaySec: 0.3,
};

export class WinController extends BaseComponent {
    private rollup: Text;

    private props = winControllerProps;

    constructor(layoutId: string) {
        super(layoutId);

        this.rollup = this.container.getChildByName(`${this.name}.rollup`) as Text;
    }

    public calculateWin() {
        const { spinResult } = gameStore.props;
        const wins = gameStore.props.currentWinLines().map((line) => {
            let hitCount = 0;
            const lineSym = spinResult[0][line.cellPositions[0]];
            for (let i = 1; i < line.cellPositions.length; i++) {
                const currPos = line.cellPositions[i];
                if (lineSym !== spinResult[i][currPos]) {
                    break;
                }
                hitCount++;
            }
            const payoutDef = symbolsMapping.find((mapping) => mapping.symbolId === lineSym);
            if (payoutDef === undefined) {
                throw new Error(`Symbol mapping for symbol ${lineSym} does not exist`);
            }

            return {
                cellPositions: line.cellPositions,
                payoutAmount: payoutDef.payouts[hitCount] * gameStore.props.currentBet(),
            };
        });
        gameStore.actions.setSpinWins(wins.filter((win) => win.payoutAmount > 0));
    }

    public async playRollup(endVal: number) {
        this.rollup.text = "";
        const fade = this.fadeIn();
        const rollupAnim = new Promise((res) => {
            const counter = { value: 0 };
            gsap.to(counter, {
                value: endVal,
                duration: this.props.rollupDurationSec,
                onUpdate: () => {
                    this.rollup.text = Math.round(counter.value);
                },
                onComplete: res,
            });
        });
        await Promise.all([fade, rollupAnim]);
        await this.fadeOut();
    }
}
