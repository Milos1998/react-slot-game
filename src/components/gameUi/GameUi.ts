import { gameStore } from "../../stores/GameStore";
import { BaseComponent } from "../BaseComponent";
import { Button } from "../button/Button";
import { Toggle } from "../button/Toggle";
import { WinMeter } from "./WinMeter";

export enum GameUiReelButton {
    SpinButton,
    SlamStopButton,
}

export class GameUi extends BaseComponent {
    private spinButton: Button;

    private slamStopButton: Button;

    private gameReelButtons: Map<GameUiReelButton, Button> = new Map();

    private betToggle: Toggle;

    private winLinesToggle: Toggle;

    private winMeter: WinMeter;

    constructor(layoutId: string) {
        super(layoutId);

        this.spinButton = new Button("spinButton");
        this.gameReelButtons.set(GameUiReelButton.SpinButton, this.spinButton);

        this.slamStopButton = new Button("slamStopButton");
        this.slamStopButton.setOnClick(() => {
            gameStore.actions.setSlamStopped(true);
            this.slamStopButton.enabled = false;
        });
        this.gameReelButtons.set(GameUiReelButton.SlamStopButton, this.slamStopButton);

        this.betToggle = new Toggle(
            "betToggle",
            gameStore.props.betSteps,
            gameStore.actions.incrementBet,
            gameStore.actions.decrementBet,
            gameStore.props.currentBetIdx,
        );
        this.winLinesToggle = new Toggle(
            "winLinesToggle",
            gameStore.props.winLines.map((line, idx) => idx + 1),
            gameStore.actions.incrementLinesPlayed,
            gameStore.actions.decrementLinesPlayed,
            gameStore.props.activeWinLinesIdx,
        );

        this.winMeter = new WinMeter("winMeter");
    }

    public updateWinMeter(value: string) {
        this.winMeter.meterText = value;
    }

    public unsetWinMeter() {
        this.winMeter.meterText = "";
    }

    public setEnabled(enabled: boolean) {
        this.betToggle.enabled = enabled;
        this.winLinesToggle.enabled = enabled;
    }

    public setReelButton(buttonId: GameUiReelButton, enabled: boolean) {
        this.gameReelButtons.forEach((button, id) => {
            button.container.visible = id === buttonId;
            button.enabled = id === buttonId ? enabled : false;
        });
    }

    public async awaitSpinPress() {
        await new Promise((res) => {
            this.spinButton.setOnClick(res);
            this.spinButton.enabled = true;
        });
        this.spinButton.enabled = false;
        this.spinButton.setOnClick(null);
    }
}
