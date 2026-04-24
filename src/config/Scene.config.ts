import { Orientation, ScreenSize } from "../stores/SystemStore";

/**
 * NOTE: would not store screenConfig inside .ts file if I were doing this without time constraint,
 * but for the sake of speed of work (not needing to load .json config, parse it properly etc.) it's done as is.
 */
/**
 * NOTE: minWidth and minHeight are the "safe area" - these won't ever be cropped
 * maxWidth and maxHeight are the max allowed values canvas can reach before side black bars start appearing
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
    },
    {
        orientation: Orientation.Portrait,
        config: {
            minWidth: 700,
            minHeight: 980,
            maxWidth: 1400,
            maxHeight: 2000,
        },
    },
] as const;

//NOTE: update to change after what ratio does the game toggle orientation
export const sceneConfig = {
    orientationRatio: 4 / 5,
} as const;
