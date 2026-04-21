import { ComponentPropsWithoutRef, useState } from "react";
import { uiCommonStyles } from "./Ui.config";

type ButtonProps = { isEnabled: boolean } & ComponentPropsWithoutRef<"button">;

export function Button({ isEnabled, ...props }: ButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    const buttonStyle: React.CSSProperties = {
        ...(isEnabled ? styles.active : styles.inactive),
        ...(isEnabled && isHovered ? styles.hover : {}),
        ...props.style,
    };

    return (
        <button
            {...props}
            style={buttonStyle}
            disabled={!isEnabled}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        ></button>
    );
}

const styles = {
    active: {
        pointerEvents: "auto",
        ...uiCommonStyles.buttonActive,
    },
    hover: {
        pointerEvents: "auto",
        cursor: "pointer",
        ...uiCommonStyles.buttonHover,
    },
    inactive: {
        pointerEvents: "none",
        ...uiCommonStyles.buttonInactive,
    },
} as const satisfies Record<string, React.CSSProperties>;
