export const uiStylingConstants = {
    activeColor: "#00AAE5",
    inactiveColor: "#004683",
    hoverColor: "#00C8E6",
    fontColor: "#ffffff",
    borderColor: "#000000",
    baseFontSize: "30px",
} as const;

export const uiCommonStyles = {
    buttonActive: {
        backgroundColor: uiStylingConstants.activeColor,
    },
    buttonInactive: {
        backgroundColor: uiStylingConstants.inactiveColor,
    },
    buttonHover: {
        backgroundColor: uiStylingConstants.hoverColor,
    },
} as const satisfies Record<string, React.CSSProperties>;

export enum ReelButtons {
    None,
    SpinButton,
    StopButton,
    SkipButton,
}
