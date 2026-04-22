import { messages } from "../config/Message.config";
import { gameStore } from "../stores/GameStore";
import { systemStore } from "../stores/SystemStore";
import { ReelButtons } from "../ui/Ui.config";
import { BaseFlows } from "./Base.flows";

export class BaseGameFlows extends BaseFlows {
    public async *startupFlow() {
        yield gameStore.setPresentReelButton(ReelButtons.SpinButton, false);
        // yield await this.components.gameHeading.fadeIn();
        // yield await Promise.all([
        //     this.components.fpsMeter.fadeIn(),
        //     this.components.gameplaySpeedToggle.fadeIn(),
        //     this.components.gameUi.fadeIn(),
        // ]);
        yield systemStore.setIsSystemUiEnabled(true);
    }

    public async *introFlow() {
        yield gameStore.setPopupMessage(messages.gameUi_introMessage);
        yield await gameStore.blockGameFlow();
        yield gameStore.setPopupMessage(null);
    }

    public async *requestFlow() {
        yield gameStore.setSlamStopped(false);
        yield gameStore.setIsSkipped(false);
        yield gameStore.setIsGameUiEnabled(true);
        yield gameStore.setPresentReelButton(ReelButtons.SpinButton, true);
        yield await gameStore.blockGameFlow();
        yield gameStore.decrementBalance();
        yield gameStore.setIsGameUiEnabled(false);
        yield gameStore.setPresentReelButton(ReelButtons.SpinButton, false);
        // yield this.components.gameUi.updateWinMeter("");
        yield await this.components.reelSet.startReelSpin();
        // NOTE: added this just to demonstrate recovery flow, would obviously fetch data from dedicated component if done for real
        yield await fetch("https://jsonplaceholder.typicode.com/posts/1");
    }

    public async *responseFlow() {
        yield gameStore.setPresentReelButton(ReelButtons.StopButton, true);
        yield await this.components.reelSet.awaitMinSpinDelay();
        yield gameStore.setPresentReelButton(ReelButtons.StopButton, false);
        yield await this.components.reelSet.stopReelSpin();
        yield this.components.reelSet.setSpinResult();
        yield this.components.winController.calculateWin();
        if (gameStore.props.totalWin() > 0) {
            yield gameStore.setPresentReelButton(ReelButtons.SkipButton, true);
            // yield this.components.gameUi.updateWinMeter(gameStore.props.totalWin().toString());
            yield await this.components.winController.playRollup(gameStore.props.totalWin());
            yield await this.components.reelSet.animateWinCells();
            // TODO add to balance
            // yield gameStore.updateBalance();
        }
        yield gameStore.setPresentReelButton(ReelButtons.SpinButton, false);
    }

    public async *resetFlow() {}

    public async *outroFlow() {}

    public async *errorFlow() {
        yield await this.components.reelSet.stopReelSpin();
        yield gameStore.setPopupMessage(systemStore.props.systemError!.message);
        yield await gameStore.blockGameFlow();
        yield systemStore.setSystemError(null);
        yield gameStore.setPopupMessage(null);
    }
}
