import { useStore } from "zustand";
import { gameStore } from "../stores/GameStore";
import { messages } from "../config/Message.config";
import { Meter } from "./Meter";
import { Toggle } from "./Toggle";
import { systemStore } from "../stores/SystemStore";
import { uiStylingConstants } from "./Ui.config";
import { Button } from "./Button";

export function UiRoot() {
    const totalWin = useStore(gameStore.reactStore, state => state.totalWin());
    const bet = useStore(gameStore.reactStore, state => state.currentBet());
    const lines = useStore(gameStore.reactStore, state => state.activeWinLinesIdx);
    const isGameUiEnabled = useStore(gameStore.reactStore, state => state.isGameUiEnabled);
    const tickerSpeed = useStore(systemStore.reactStore, state => state.getGameplaySpeed());
    const fps = useStore(systemStore.reactStore, state => state.fps);
    const isSystemUiEnabled = useStore(systemStore.reactStore, state => state.isSystemUiEnabled);

    return (
        <div id="uiRoot" style={styles.uiRoot}>
            <Toggle id="betToggle" onDecrement={gameStore.decrementBet} onIncrement={gameStore.incrementBet} style={styles.gameUiElement} isEnabled={isGameUiEnabled}>
                <Meter value={bet} label={messages.gameUi_bet} />
            </Toggle>
            <Meter id="winMeter" value={totalWin} label={messages.gameUi_win} style={styles.gameUiElement} />
            <Toggle id="winLinesToggle" onDecrement={gameStore.decrementLinesPlayed} onIncrement={gameStore.incrementLinesPlayed} style={styles.gameUiElement} isEnabled={isGameUiEnabled}>
                <Meter value={lines + 1} label={messages.gameUi_lines} />
            </Toggle>
            <Toggle id="gameplaySpeedToggle" onDecrement={systemStore.decrementGameplaySpeed} onIncrement={systemStore.incrementGameplaySpeed} style={styles.gameplaySpeedToggle} isEnabled={isSystemUiEnabled} >
                <Meter value={tickerSpeed} label={messages.gameplay_speed} style={styles.gameplaySpeedToggleMeter} />
            </Toggle>
            <Meter id="fpsMeter" value={fps} label={messages.fps_meter_label} style={styles.fpsMeter} />
            <div>
                <Button id="spinButton" isEnabled={isGameUiEnabled} style={styles.spinButtons}>{messages.gameUi_spin}</Button>
                <Button id="slamStopButton" onClick={() => gameStore.setSlamStopped(true)} isEnabled={isGameUiEnabled} style={styles.spinButtons}>{messages.gameUi_stop}</Button>
            </div>
        </div>
    );
}

const styles = {
    //TODO fix positioning
    uiRoot: {
        color: uiStylingConstants.fontColor,
        display: "flex",
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        top: "800px",
        left: "720px",
        fontSize: "30px",
    },
    gameUiElement: {
        backgroundColor: uiStylingConstants.inactiveColor,
        borderRadius: "10px",
        borderColor: uiStylingConstants.borderColor,
        borderStyle: "solid",
        borderWidth: "6px",
        minWidth: "240px",
        minHeight: "70px",
    },
    gameplaySpeedToggle: {
        minWidth: "240px",
    },
    gameplaySpeedToggleMeter: {
        flexDirection: "column-reverse",
    },
    fpsMeter: {
        flexDirection: "row-reverse",
    },
    spinButtons: {
        borderRadius: "50%",
        borderColor: uiStylingConstants.borderColor,
        borderStyle: "solid",
        borderWidth: "6px",
        minWidth: "200px",
        minHeight: "200px",
        color: uiStylingConstants.fontColor,
        fontSize: "50px",
    }
} as const satisfies Record<string, React.CSSProperties>;
