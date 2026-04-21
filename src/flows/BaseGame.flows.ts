import { GameUiReelButton } from "../components/gameUi/GameUi";
import { messages } from "../config/Message.config";
import { gameStore } from "../stores/GameStore";
import { systemStore } from "../stores/SystemStore";
import { BaseFlows } from "./Base.flows";

export class BaseGameFlows extends BaseFlows {
    public async *startupFlow() {
        yield this.components.gameUi.setReelButton(GameUiReelButton.SpinButton, false);
        yield await Promise.all([
            this.components.fpsMeter.fadeIn(),
            this.components.gameHeading.fadeIn(),
            this.components.gameplaySpeedToggle.fadeIn(),
            this.components.gameUi.fadeIn(),
        ]);
        yield systemStore.setIsSystemUiEnabled(true);
    }

    public async *introFlow() {
        yield await this.components.alertsPopup.displayMessage(messages.ui_introMessage);
    }

    public async *requestFlow() {
        yield gameStore.setSlamStopped(false);
        yield gameStore.setIsGameUiEnabled(true);
        yield await this.components.gameUi.awaitSpinPress();
        yield gameStore.setIsGameUiEnabled(false);
        yield this.components.gameUi.updateWinMeter("");
        yield await this.components.reelSet.startReelSpin();
        // NOTE: added this just to demonstrate recovery flow, would obviously fetch data from dedicated component if done for real
        yield await fetch("https://jsonplaceholder.typicode.com/posts/1");
    }

    public async *responseFlow() {
        yield this.components.gameUi.setReelButton(GameUiReelButton.SlamStopButton, true);
        yield await this.components.reelSet.awaitMinSpinDelay();
        yield this.components.gameUi.setReelButton(GameUiReelButton.SlamStopButton, false);
        yield await this.components.reelSet.stopReelSpin();
        yield this.components.gameUi.setReelButton(GameUiReelButton.SpinButton, false);
        yield this.components.reelSet.setSpinResult();
        yield this.components.winController.calculateWin();
        if (gameStore.props.totalWin() > 0) {
            yield this.components.gameUi.updateWinMeter(gameStore.props.totalWin().toString());
            yield await this.components.winController.playRollup(gameStore.props.totalWin());
            yield await this.components.reelSet.animateWinCells();
        }
    }

    public async *resetFlow() {}

    public async *outroFlow() {}

    public async *errorFlow() {
        yield await this.components.reelSet.stopReelSpin();
        yield await this.components.alertsPopup.displayMessage(systemStore.props.systemError);
        yield systemStore.setSystemError(null);
    }
}
