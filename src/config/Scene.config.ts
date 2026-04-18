import { Orientation, ScreenSize } from "../stores/SystemStore";

/**
 * NOTE: would not store layout config inside .ts file if I were doing this without time constraint,
 * but for the sake of speed of work (not needing to load .json config, parse it properly etc.) it's done as is.
 */
export const screenConfig: { orientation: Orientation; config: ScreenSize }[] = [
    {
        orientation: Orientation.Landscape,
        config: {
            minWidth: 980,
            minHeight: 700,
            maxWidth: 2000,
            maxHeight: 1400,
        },
    } as const,
    {
        orientation: Orientation.Portrait,
        config: {
            minWidth: 700,
            minHeight: 980,
            maxWidth: 1400,
            maxHeight: 2000,
        },
    } as const,
];

export const sceneConfig = {
    orientationRatio: 4 / 5,
} as const;
