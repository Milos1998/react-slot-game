import { Text } from "pixi.js";
import { gameStore } from "../../stores/GameStore";
import { BaseComponent } from "../BaseComponent";
import gsap from "gsap";
import { SymbolMapping, symbolsMapping } from "../reels/symbols/Symbols.config";

const winControllerProps = {
    rollupDurationSec: 3,
    rollupHideDelaySec: 0.3,
    minAnticipationMultiplier: 2,
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
        const anticipationReels = new Array(spinResult.length).fill(false);
        const wins = gameStore.props.currentWinLines().map((line) => {
            const lineSym = spinResult[0][line.cellPositions[0]];

            const payoutDef = symbolsMapping.find((mapping) => mapping.symbolId === lineSym);
            if (payoutDef === undefined) {
                throw new Error(`Symbol mapping for symbol ${lineSym} does not exist`);
            }

            let hitCount = 0;
            for (let i = 1; i < line.cellPositions.length; i++) {
                const currPos = line.cellPositions[i];
                anticipationReels[i] = this.checkAnticipation(hitCount, payoutDef);
                if (lineSym !== spinResult[i][currPos]) {
                    break;
                }
                hitCount++;
            }

            return {
                cellPositions: line.cellPositions,
                payoutAmount: payoutDef.payouts[hitCount] * gameStore.props.currentBet(),
            };
        });
        gameStore.setSpinWins(wins.filter((win) => win.payoutAmount > 0));
        gameStore.setAnticipationReels(anticipationReels);
    }

    private checkAnticipation(matches: number, payoutDef: SymbolMapping) {
        return payoutDef.payouts[matches] > winControllerProps.minAnticipationMultiplier;
    }

    public async playRollup(endVal: number) {
        if (gameStore.props.isSkipped) {
            return;
        }

        this.rollup.text = "";
        const counter = { value: 0 };
        const rollupAnim = gsap.to(counter, {
            value: endVal,
            duration: this.props.rollupDurationSec,
            onUpdate: () => {
                this.rollup.text = Math.round(counter.value);
            },
        });
        const rollupPromise = new Promise((res) => {
            rollupAnim.eventCallback("onComplete", res);
        });

        const unsub = gameStore.subscribe(
            (state) => state.isSkipped,
            () => {
                rollupAnim.totalProgress(1).pause(0);
            },
        );

        await Promise.all([this.fadeIn(), rollupPromise]);
        unsub();
        await this.fadeOut();
    }
}
