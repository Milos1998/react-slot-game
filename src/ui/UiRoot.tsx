import { useStore } from "zustand";
import { gameStore } from "../stores/GameStore";
import { messages } from "../config/Message.config";
import { Meter } from "./Meter";
import { Toggle } from "./Toggle";
import { systemStore } from "../stores/SystemStore";

export function UiRoot() {
    const totalWin = useStore(gameStore.reactStore, state => state.totalWin());
    const bet = useStore(gameStore.reactStore, state => state.currentBet());
    const lines = useStore(gameStore.reactStore, state => state.activeWinLinesIdx);
    const tickerSpeed = useStore(systemStore.reactStore, state => state.getGameplaySpeed());
    const fps = useStore(systemStore.reactStore, state => state.fps);

    return (
        <div id="uiRoot" style={styles.uiRoot}>
            <Toggle id="betToggle" onDecrement={gameStore.decrementBet} onIncrement={gameStore.incrementBet} style={styles.gameUiElement}>
                <Meter value={bet} label={messages.gameUi_bet} />
            </Toggle>
            <Meter id="winMeter" value={totalWin} label={messages.gameUi_win} style={styles.gameUiElement} />
            <Toggle id="winLinesToggle" onDecrement={gameStore.decrementLinesPlayed} onIncrement={gameStore.incrementLinesPlayed} style={styles.gameUiElement}>
                <Meter value={lines + 1} label={messages.gameUi_lines} />
            </Toggle>
            <Toggle id="gameplaySpeedToggle" onDecrement={systemStore.decrementGameplaySpeed} onIncrement={systemStore.incrementGameplaySpeed} style={styles.gameplaySpeedToggle} >
                <Meter value={tickerSpeed} label={messages.gameplay_speed} style={styles.gameplaySpeedToggleMeter} />
            </Toggle>
            <Meter id="fpsMeter" value={fps} label={messages.fps_meter_label} style={styles.fpsMeter} />
        </div>
    );
}

const styles = {
    //TODO fix positioning
    uiRoot: {
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
        backgroundColor: "#004683",
        borderRadius: "5px",
        borderColor: "#000000",
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
    }
} as const satisfies Record<string, React.CSSProperties>;
