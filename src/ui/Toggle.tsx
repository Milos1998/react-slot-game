type ToggleProps = { onIncrement: () => void, onDecrement: () => void } & React.HTMLProps<HTMLDivElement>;

//TODO add states for enabled, hover, disabled buttons
export function Toggle({ onIncrement, onDecrement, ...props}: ToggleProps) {
    return (
        <div {...props} style={{...styles.toggle, ...props.style}}>
            <button style={styles.toggleButton} onClick={onDecrement}>-</button>
            {props.children}
            <button style={styles.toggleButton} onClick={onIncrement}>+</button>
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
        pointerEvents: "auto",
        backgroundColor: "#004683",
        borderRadius: "50%",
        borderColor: "#000000",
        borderStyle: "solid",
        borderWidth: "4px",
        minWidth: "30px",
        minHeight: "30px",
    },
} as const satisfies Record<string, React.CSSProperties>;
