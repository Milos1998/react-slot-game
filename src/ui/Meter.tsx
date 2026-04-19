type MeterProps = { label: string, value: number } & React.HTMLProps<HTMLDivElement>;

export function Meter({ label, value, ...props}: MeterProps) {
    return (<div {...props} style={{...styles.meter, ...props.style}}>
        <span>{value}</span>
        <span style={styles.meterLabel}>{label}</span>
    </div>);
}

const styles = {
    meter: {
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px"
    },
    meterLabel: {
        fontSize: "0.7em",
    },
} as const satisfies Record<string, React.CSSProperties>;
