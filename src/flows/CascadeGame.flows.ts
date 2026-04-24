import { messages } from "../config/Message.config";
import { GameFlowName, gameStore } from "../stores/GameStore";
import { systemStore } from "../stores/SystemStore";
import { ReelButtons } from "../ui/Ui.config";
import { BaseFlows } from "./Base.flows";

export class CascadeGameFlows extends BaseFlows {
    public async *startupFlow() {
        yield gameStore.setPresentReelButton(ReelButtons.SpinButton, false);
        yield systemStore.setIsSystemUiEnabled(true);
        yield gameStore.setPopupMessage(messages.gameUi_introMessage);
        yield await gameStore.blockGameFlow();
        yield gameStore.setPopupMessage(null);
    }

    public async *introFlow() {
        yield gameStore.setIsGameUiEnabled(false);
        yield gameStore.setPresentReelButton(ReelButtons.SpinButton, false);
        yield gameStore.setSpinMode("Cascade");
    }

    public async *requestFlow() {
        yield gameStore.setSlamStopped(false);
        yield gameStore.setIsSkipped(false);
        yield await this.components.reelSet.startReelSpin();
    }

    public async *responseFlow() {
        yield gameStore.setPresentReelButton(ReelButtons.StopButton, true);
        yield this.components.reelSet.setRandomSpinResult();
        yield this.components.winController.calculateWin();
        yield await this.components.reelSet.awaitMinSpinDelay();
        yield gameStore.setPresentReelButton(ReelButtons.StopButton, false);
        yield await this.components.reelSet.stopReelSpin();
        if (gameStore.props.totalWin() > 0) {
            yield gameStore.setPresentReelButton(ReelButtons.SkipButton, true);
            yield await this.components.winController.playRollup(gameStore.props.totalWin());
            yield await this.components.reelSet.animateWinCells();
        } else {
            yield gameStore.setNextFlows(GameFlowName.BaseGame);
        }
        yield gameStore.setPresentReelButton(ReelButtons.SpinButton, false);
    }

    public async *resetFlow() {}

    public async *outroFlow() {
        yield gameStore.setSpinMode("Normal");
        //TODO display total feature win
    }

    public async *errorFlow() {
        // TODO fix error scenario (can revert to previous result symbols)
        yield await this.components.reelSet.stopReelSpin();
        yield gameStore.setPopupMessage(systemStore.props.systemError!.message);
        yield await gameStore.blockGameFlow();
        yield systemStore.setSystemError(null);
        yield gameStore.setPopupMessage(null);
    }
}
