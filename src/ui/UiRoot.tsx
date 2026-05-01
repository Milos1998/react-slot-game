import { useStore } from "zustand";
import { gameStore } from "../stores/GameStore";
import { messages } from "../config/Message.config";
import { Meter } from "./Meter";
import { Toggle } from "./Toggle";
import { Orientation, systemStore } from "../stores/SystemStore";
import { ReelButtons, uiStylingConstants } from "./Ui.config";
import { Button } from "./Button";

export function UiRoot() {
    const totalWin = useStore(gameStore.reactStore, (state) => state.totalWin());
    const bet = useStore(gameStore.reactStore, (state) => state.currentBet());
    const lines = useStore(gameStore.reactStore, (state) => state.activeWinLinesIdx);
    const balance = useStore(gameStore.reactStore, (state) => state.balance);
    const isGameUiEnabled = useStore(gameStore.reactStore, (state) => state.isGameUiEnabled);
    const presentReelButton = useStore(gameStore.reactStore, (state) => state.presentReelButton);
    const isReelButtonActive = useStore(gameStore.reactStore, (state) => state.isReelButtonActive);
    const slamStopped = useStore(gameStore.reactStore, (state) => state.slamStopped);
    const isSkipped = useStore(gameStore.reactStore, (state) => state.isSkipped);
    const popupMessage = useStore(gameStore.reactStore, (state) => state.popupMessage);
    const spinMode = useStore(gameStore.reactStore, (state) => state.spinMode);
    const tickerSpeed = useStore(systemStore.reactStore, (state) => state.getGameplaySpeed());
    const fps = useStore(systemStore.reactStore, (state) => state.fps);
    const safeAreaProps = useStore(systemStore.reactStore, (state) => state.safeAreaProps);
    const safeAreaAspectRatio = useStore(systemStore.reactStore, (state) => state.safeAreaAspectRatio);
    const orientation = useStore(systemStore.reactStore, (state) => state.orientation);
    const isSystemUiEnabled = useStore(systemStore.reactStore, (state) => state.isSystemUiEnabled);

    const rootStyle = { ...styles.uiRoot, ...safeAreaProps, transform: `scale(${safeAreaAspectRatio})` };
    if (orientation === Orientation.Landscape) {
        Object.assign(rootStyle, styles.uiRootLandscape);
    } else {
        Object.assign(rootStyle, styles.uiRootPortrait);
    }

    return (
        <div id="uiRoot" style={rootStyle}>
            {popupMessage !== null && (
                <div id="alertsPopup" style={styles.alertsPopup}>
                    <p style={styles.alertsPopupMessage}>{popupMessage}</p>
                    <Button id="alertsPopupButton" onClick={gameStore.unblockGameFlow} isEnabled={true} style={styles.aletrsPopupButton}>
                        {messages.gameUi_okLabel}
                    </Button>
                </div>
            )}
            <div className="systemUi" style={styles.systemUi}>
                <Meter id="fpsMeter" value={fps} label={messages.fps_meter_label} style={styles.fpsMeter} />

                <Button id="spinModeToggle" isEnabled={isGameUiEnabled} onClick={gameStore.toggleSpinMode} style={styles.spinModeToggle}>
                    {spinMode}
                </Button>

                <Toggle
                    id="gameplaySpeedToggle"
                    onDecrement={systemStore.decrementGameplaySpeed}
                    onIncrement={systemStore.incrementGameplaySpeed}
                    style={styles.gameplaySpeedToggle}
                    isEnabled={isSystemUiEnabled}
                >
                    <Meter value={tickerSpeed} label={messages.gameplay_speed} style={styles.gameplaySpeedToggleMeter} />
                </Toggle>
            </div>

            <div className="gameUi" style={styles.gameUi}>
                <Toggle
                    id="betToggle"
                    onDecrement={gameStore.decrementBet}
                    onIncrement={gameStore.incrementBet}
                    style={styles.gameUiElement}
                    isEnabled={isGameUiEnabled}
                >
                    <Meter value={bet} label={messages.gameUi_bet} />
                </Toggle>

                <Meter id="winMeter" value={totalWin} label={messages.gameUi_win} style={styles.gameUiElement} />

                <Toggle
                    id="winLinesToggle"
                    onDecrement={gameStore.decrementLinesPlayed}
                    onIncrement={gameStore.incrementLinesPlayed}
                    style={styles.gameUiElement}
                    isEnabled={isGameUiEnabled}
                >
                    <Meter value={lines + 1} label={messages.gameUi_lines} />
                </Toggle>

                <Meter id="balanceMeter" value={balance} label={messages.gameUi_balance} style={styles.gameUiElement} />
            </div>

            <div className="reelButtons" style={styles.reelButtons}>
                {presentReelButton === ReelButtons.SpinButton && (
                    <Button id="spinButton" onClick={gameStore.unblockGameFlow} isEnabled={isReelButtonActive} style={styles.reelButton}>
                        {messages.gameUi_spin}
                    </Button>
                )}

                {presentReelButton === ReelButtons.StopButton && (
                    <Button
                        id="slamStopButton"
                        onClick={() => gameStore.setSlamStopped(true)}
                        isEnabled={isReelButtonActive && !slamStopped}
                        style={styles.reelButton}
                    >
                        {messages.gameUi_stop}
                    </Button>
                )}

                {presentReelButton === ReelButtons.SkipButton && (
                    <Button
                        id="skipButton"
                        onClick={() => gameStore.setIsSkipped(true)}
                        isEnabled={isReelButtonActive && !isSkipped}
                        style={styles.reelButton}
                    >
                        {messages.gameUi_skip}
                    </Button>
                )}
            </div>
        </div>
    );
}

const styles = {
    uiRoot: {
        color: uiStylingConstants.fontColor,
        fontSize: "30px",
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
    },
    gameUi: {
        gridArea: "gameUi",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        gap: "10px",
    },
    uiRootLandscape: {
        gridTemplateColumns: "1fr auto",
        gridTemplateRows: "auto 1fr auto",
        gridTemplateAreas: `
            "systemUI systemUI"
            ".        reelButtons"
            "gameUi   gameUi"
        `,
    },
    uiRootPortrait: {
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto 1fr auto auto",
        gridTemplateAreas: `
            "systemUI"
            "."
            "gameUi"
            "reelButtons"
        `,
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
    systemUi: {
        gridArea: "systemUI",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    spinModeToggle: {
        color: uiStylingConstants.fontColor,
        fontSize: "30px",
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
    reelButtons: {
        gridArea: "reelButtons",
        justifySelf: "center",
    },
    reelButton: {
        borderRadius: "50%",
        borderColor: uiStylingConstants.borderColor,
        borderStyle: "solid",
        borderWidth: "6px",
        minWidth: "200px",
        minHeight: "200px",
        color: uiStylingConstants.fontColor,
        fontSize: "50px",
    },
    alertsPopup: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: uiStylingConstants.inactiveColor,
        minWidth: "650px",
        paddingBottom: "10px",
        borderRadius: "10px",
        borderColor: uiStylingConstants.borderColor,
        borderStyle: "solid",
        borderWidth: "6px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    alertsPopupMessage: {
        padding: "10px 40px 20px 40px",
        color: uiStylingConstants.fontColor,
        fontSize: "30px",
        whiteSpace: "pre-line",
    },
    aletrsPopupButton: {
        borderRadius: "10px",
        borderColor: uiStylingConstants.borderColor,
        borderStyle: "solid",
        borderWidth: "4px",
        color: uiStylingConstants.fontColor,
        padding: "10px 20px",
        fontSize: "30px",
    },
} as const satisfies Record<string, React.CSSProperties>;
