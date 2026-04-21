import { ComponentPropsWithoutRef } from "react";
import { Button } from "./Button";
import { uiStylingConstants } from "./Ui.config";

type ToggleProps = { onIncrement: () => void, onDecrement: () => void, isEnabled: boolean } & ComponentPropsWithoutRef<"div">;

//TODO add logic to disable toggles when at the edge of toggle steps
export function Toggle({ onIncrement, onDecrement, isEnabled, ...props}: ToggleProps) {
    return (
        <div {...props} style={{...styles.toggle, ...props.style}}>
            <Button style={styles.toggleButton} onClick={onDecrement} isEnabled={isEnabled}>-</Button>
            {props.children}
            <Button style={styles.toggleButton} onClick={onIncrement} isEnabled={isEnabled}>+</Button>
        </div>
    );
}

const styles = {
    toggle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    toggleButton: {
        borderRadius: "50%",
        borderColor: uiStylingConstants.borderColor,
        borderStyle: "solid",
        borderWidth: "3px",
        minWidth: "30px",
        minHeight: "30px",
    },
} as const satisfies Record<string, React.CSSProperties>;
