import { TextStyle, Texture } from "pixi.js";
import { messages } from "./Message.config";
import { Orientation } from "../stores/SystemStore";

export type Position = {
    x: number;
    y: number;
};

export type Scale = {
    x: number;
    y: number;
};

export type Anchor = {
    x: number;
    y: number;
};

export abstract class LayoutNode {
    public name: string = "";
    public position?: Position;
    public scale?: Scale;
    public alpha?: number;
    public visible?: boolean = true;

    constructor(configNode: LayoutConfigNode) {
        this.name = configNode.name;
        this.position = configNode.position;
        this.scale = configNode.scale;
        this.alpha = configNode.alpha;
        this.visible = configNode.visible;
    }
}

export class ContainerNode extends LayoutNode {}

export class SpriteNode extends LayoutNode {
    public anchor?: Anchor;
    public texture?: Texture;

    constructor(configNode: LayoutConfigNode) {
        super(configNode);
        this.anchor = configNode.anchor;
    }
}

export class TextNode extends LayoutNode {
    public anchor?: Anchor;
    public text?: string;
    public textStyle?: Partial<TextStyle>;

    constructor(configNode: LayoutConfigNode) {
        super(configNode);
        this.anchor = configNode.anchor;
        this.text = configNode.text;
        this.textStyle = configNode.textStyle;
    }
}

export interface LayoutConfigNode {
    name: string;
    position?: Position;
    scale?: Scale;
    alpha?: number;
    anchor?: Anchor;
    text?: string;
    texture?: string;
    visible?: boolean;
    textStyle?: Partial<TextStyle>;
}

export interface LayoutHierarchyNode extends LayoutConfigNode {
    type: "sprite" | "text" | "container";
    parent?: LayoutHierarchyNode | undefined;
    children?: LayoutHierarchyNode[];
}

/**
 * NOTE: would not store layout config inside .ts file if I were doing this without time constraint,
 * but for the sake of speed of work (not needing to load .json config, parse it properly etc.) it's done as is.
 */
export const hierarchyTree: LayoutHierarchyNode = {
    name: "game",
    type: "container",
    children: [
        {
            name: "backgroundContainer",
            type: "container",
            children: [
                {
                    name: "base-backing",
                    type: "sprite",
                },
            ],
        },
        {
            name: "reelSet",
            type: "container",
            children: [
                {
                    name: "reel0",
                    type: "sprite",
                    texture: "reel-backing",
                    anchor: {
                        x: 0.5,
                        y: 0,
                    },
                    position: {
                        x: -120,
                        y: -168,
                    },
                },
                {
                    name: "reel1",
                    type: "sprite",
                    texture: "reel-backing",
                    anchor: {
                        x: 0.5,
                        y: 0,
                    },
                    position: {
                        x: 0,
                        y: -168,
                    },
                },
                {
                    name: "reel2",
                    type: "sprite",
                    texture: "reel-backing",
                    anchor: {
                        x: 0.5,
                        y: 0,
                    },
                    position: {
                        x: 120,
                        y: -168,
                    },
                },
            ],
        },
        {
            name: "winController",
            type: "container",
            visible: false,
            children: [
                {
                    name: "winController.backing",
                    type: "sprite",
                    texture: "button-disabled",
                    anchor: {
                        x: 0.5,
                        y: 0.5,
                    },
                },
                {
                    name: "winController.rollup",
                    type: "text",
                    anchor: {
                        x: 0.5,
                        y: 0.5,
                    },
                    textStyle: {
                        fontSize: 75,
                        fill: "#ffe600",
                        dropShadow: true,
                        dropShadowColor: 0x0,
                        dropShadowDistance: 4,
                        dropShadowBlur: 3,
                        dropShadowAngle: 2,
                        padding: 10,
                    },
                },
            ],
        },
        {
            name: "gameUi",
            type: "container",
            visible: false,
            children: [
                {
                    name: "spinButton",
                    type: "container",
                    children: [
                        {
                            name: "spinButton.enabled",
                            type: "sprite",
                            texture: "spin-enabled",
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                        },
                        {
                            name: "spinButton.over",
                            type: "sprite",
                            texture: "spin-hover",
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                        },
                        {
                            name: "spinButton.disabled",
                            type: "sprite",
                            texture: "spin-disabled",
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                        },
                    ],
                },
                {
                    name: "slamStopButton",
                    type: "container",
                    children: [
                        {
                            name: "slamStopButton.enabled",
                            type: "sprite",
                            texture: "slam-stop-enabled",
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                        },
                        {
                            name: "slamStopButton.over",
                            type: "sprite",
                            texture: "slam-stop-hover",
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                        },
                        {
                            name: "slamStopButton.disabled",
                            type: "sprite",
                            texture: "slam-stop-disabled",
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                        },
                    ],
                },
                {
                    name: "betToggle",
                    type: "sprite",
                    texture: "button-disabled",
                    anchor: {
                        x: 0.5,
                        y: 0.5,
                    },
                    scale: {
                        x: 0.8,
                        y: 0.8,
                    },
                    children: [
                        {
                            name: "betToggle.label",
                            type: "text",
                            text: messages.gameUi_bet,
                            position: {
                                x: 0,
                                y: 25,
                            },
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 25,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                        },
                        {
                            name: "betToggle.value",
                            type: "text",
                            position: {
                                x: 0,
                                y: -15,
                            },
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 35,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                            text: "0",
                        },
                        {
                            name: "betToggle.plus",
                            type: "container",
                            position: {
                                x: 120,
                                y: 0,
                            },
                            scale: {
                                x: 0.6,
                                y: 0.6,
                            },
                            children: [
                                {
                                    name: "betToggle.plus.enabled",
                                    type: "sprite",
                                    texture: "plus-enabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "betToggle.plus.over",
                                    type: "sprite",
                                    texture: "plus-hover",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "betToggle.plus.disabled",
                                    type: "sprite",
                                    texture: "plus-disabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                            ],
                        },
                        {
                            name: "betToggle.minus",
                            type: "container",
                            position: {
                                x: -120,
                                y: 0,
                            },
                            scale: {
                                x: 0.6,
                                y: 0.6,
                            },
                            children: [
                                {
                                    name: "betToggle.minus.enabled",
                                    type: "sprite",
                                    texture: "minus-enabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "betToggle.minus.over",
                                    type: "sprite",
                                    texture: "minus-hover",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "betToggle.minus.disabled",
                                    type: "sprite",
                                    texture: "minus-disabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "winLinesToggle",
                    type: "sprite",
                    texture: "button-disabled",
                    anchor: {
                        x: 0.5,
                        y: 0.5,
                    },
                    scale: {
                        x: 0.8,
                        y: 0.8,
                    },
                    children: [
                        {
                            name: "winLinesToggle.label",
                            type: "text",
                            text: messages.gameUi_lines,
                            position: {
                                x: 0,
                                y: 25,
                            },
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 25,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                        },
                        {
                            name: "winLinesToggle.value",
                            type: "text",
                            position: {
                                x: 0,
                                y: -15,
                            },
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 35,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                            text: "0",
                        },
                        {
                            name: "winLinesToggle.plus",
                            type: "container",
                            position: {
                                x: 120,
                                y: 0,
                            },
                            scale: {
                                x: 0.6,
                                y: 0.6,
                            },
                            children: [
                                {
                                    name: "winLinesToggle.plus.enabled",
                                    type: "sprite",
                                    texture: "plus-enabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "winLinesToggle.plus.over",
                                    type: "sprite",
                                    texture: "plus-hover",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "winLinesToggle.plus.disabled",
                                    type: "sprite",
                                    texture: "plus-disabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                            ],
                        },
                        {
                            name: "winLinesToggle.minus",
                            type: "container",
                            position: {
                                x: -120,
                                y: 0,
                            },
                            scale: {
                                x: 0.6,
                                y: 0.6,
                            },
                            children: [
                                {
                                    name: "winLinesToggle.minus.enabled",
                                    type: "sprite",
                                    texture: "minus-enabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "winLinesToggle.minus.over",
                                    type: "sprite",
                                    texture: "minus-hover",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "winLinesToggle.minus.disabled",
                                    type: "sprite",
                                    texture: "minus-disabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "winMeter",
                    type: "sprite",
                    texture: "button-disabled",
                    anchor: {
                        x: 0.5,
                        y: 0.5,
                    },
                    scale: {
                        x: 0.8,
                        y: 0.8,
                    },
                    children: [
                        {
                            name: "winMeter.label",
                            type: "text",
                            text: messages.gameUi_win,
                            position: {
                                x: 0,
                                y: 25,
                            },
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 25,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                        },
                        {
                            name: "winMeter.value",
                            type: "text",
                            position: {
                                x: 0,
                                y: -15,
                            },
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 35,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                            text: "0",
                        },
                    ],
                },
            ],
        },
        {
            name: "ui",
            type: "container",
            children: [
                {
                    name: "gameHeading",
                    type: "container",
                    visible: false,
                    position: {
                        x: 130,
                        y: 0,
                    },
                    children: [
                        {
                            name: "gameHeading.label",
                            type: "text",
                            text: messages.gameHeadingLabel,
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 80,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                        },
                        {
                            name: "gameHeading.author",
                            type: "text",
                            position: {
                                x: 0,
                                y: 80,
                            },
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 40,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                            text: messages.gameHeadingAuthor,
                        },
                    ],
                },
                {
                    name: "fpsMeter",
                    type: "container",
                    visible: false,
                    position: {
                        x: 130,
                        y: 0,
                    },
                    children: [
                        {
                            name: "fpsMeter.label",
                            type: "text",
                            text: messages.fps_meter_label,
                            anchor: {
                                x: 1,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 40,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                        },
                        {
                            name: "fpsMeter.value",
                            type: "text",
                            position: {
                                x: 10,
                                y: 0,
                            },
                            anchor: {
                                x: 0,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 40,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                            text: "NaN",
                        },
                    ],
                },
                {
                    name: "gameplaySpeedToggle",
                    type: "container",
                    visible: false,
                    children: [
                        {
                            name: "gameplaySpeedToggle.label",
                            type: "text",
                            text: messages.gameplay_speed,
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 25,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                        },
                        {
                            name: "gameplaySpeedToggle.value",
                            type: "text",
                            position: {
                                x: 0,
                                y: 40,
                            },
                            anchor: {
                                x: 0.5,
                                y: 0.5,
                            },
                            textStyle: {
                                fontSize: 25,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                            },
                            text: "NaN",
                        },
                        {
                            name: "gameplaySpeedToggle.plus",
                            type: "container",
                            position: {
                                x: 40,
                                y: 40,
                            },
                            scale: {
                                x: 0.4,
                                y: 0.4,
                            },
                            children: [
                                {
                                    name: "gameplaySpeedToggle.plus.enabled",
                                    type: "sprite",
                                    texture: "plus-enabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "gameplaySpeedToggle.plus.over",
                                    type: "sprite",
                                    texture: "plus-hover",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "gameplaySpeedToggle.plus.disabled",
                                    type: "sprite",
                                    texture: "plus-disabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                            ],
                        },
                        {
                            name: "gameplaySpeedToggle.minus",
                            type: "container",
                            position: {
                                x: -40,
                                y: 40,
                            },
                            scale: {
                                x: 0.4,
                                y: 0.4,
                            },
                            children: [
                                {
                                    name: "gameplaySpeedToggle.minus.enabled",
                                    type: "sprite",
                                    texture: "minus-enabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "gameplaySpeedToggle.minus.over",
                                    type: "sprite",
                                    texture: "minus-hover",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "gameplaySpeedToggle.minus.disabled",
                                    type: "sprite",
                                    texture: "minus-disabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "alerts",
                    visible: false,
                    type: "sprite",
                    texture: "alert-backing",
                    anchor: {
                        x: 0.5,
                        y: 0.5,
                    },
                    children: [
                        {
                            name: "alerts.message",
                            type: "text",
                            text: "",
                            position: {
                                x: 0,
                                y: -240,
                            },
                            anchor: {
                                x: 0.5,
                                y: 0,
                            },
                            textStyle: {
                                fontSize: 25,
                                fill: "#FFFFFF",
                                dropShadow: true,
                                dropShadowColor: 0x0,
                                dropShadowDistance: 4,
                                dropShadowBlur: 3,
                                dropShadowAngle: 2,
                                padding: 10,
                                wordWrap: true,
                                wordWrapWidth: 470,
                                align: "justify",
                            },
                        },
                        {
                            name: "alerts.okButton",
                            type: "container",
                            scale: {
                                x: 0.6,
                                y: 0.6,
                            },
                            position: {
                                x: 0,
                                y: 205,
                            },
                            children: [
                                {
                                    name: "alerts.okButton.enabled",
                                    type: "sprite",
                                    texture: "button-enabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "alerts.okButton.over",
                                    type: "sprite",
                                    texture: "button-hover",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "alerts.okButton.disabled",
                                    type: "sprite",
                                    texture: "button-disabled",
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                },
                                {
                                    name: "alerts.okButton.label",
                                    type: "text",
                                    text: messages.ui_okLabel,
                                    anchor: {
                                        x: 0.5,
                                        y: 0.5,
                                    },
                                    textStyle: {
                                        fontSize: 35,
                                        fill: "#FFFFFF",
                                        dropShadow: true,
                                        dropShadowColor: 0x0,
                                        dropShadowDistance: 4,
                                        dropShadowBlur: 3,
                                        dropShadowAngle: 2,
                                        padding: 10,
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

export const layoutConfigurations: { orientation: Orientation; layoutConfigNodes: LayoutConfigNode[] }[] = [
    {
        orientation: Orientation.Landscape,
        layoutConfigNodes: [
            {
                name: "base-backing",
                texture: "base-backing-landscape",
            },
            {
                name: "reelSet",
                position: {
                    x: 920,
                    y: 700,
                },
            },
            {
                name: "winController",
                position: {
                    x: 1000,
                    y: 700,
                },
            },
            {
                name: "spinButton",
                position: {
                    x: 1350,
                    y: 700,
                },
            },
            {
                name: "slamStopButton",
                position: {
                    x: 1350,
                    y: 700,
                },
            },
            {
                name: "betToggle",
                position: {
                    x: 720,
                    y: 950,
                },
            },
            {
                name: "winLinesToggle",
                position: {
                    x: 1280,
                    y: 950,
                },
            },
            {
                name: "winMeter",
                position: {
                    x: 1000,
                    y: 950,
                },
            },
            {
                name: "fpsMeter",
                position: {
                    x: 640,
                    y: 400,
                },
            },
            {
                name: "alerts",
                position: {
                    x: 1000,
                    y: 700,
                },
            },
            {
                name: "gameHeading",
                scale: {
                    x: 0.6,
                    y: 0.6,
                },
                position: {
                    x: 1000,
                    y: 430,
                },
            },
            {
                name: "gameplaySpeedToggle",
                position: {
                    x: 1410,
                    y: 380,
                },
            },
        ],
    },
    {
        orientation: Orientation.Portrait,
        layoutConfigNodes: [
            {
                name: "base-backing",
                texture: "base-backing-portrait",
            },
            {
                name: "reelSet",
                position: {
                    x: 700,
                    y: 890,
                },
            },
            {
                name: "winController",
                position: {
                    x: 700,
                    y: 890,
                },
            },
            {
                name: "spinButton",
                position: {
                    x: 700,
                    y: 1380,
                },
            },
            {
                name: "slamStopButton",
                position: {
                    x: 700,
                    y: 1380,
                },
            },
            {
                name: "betToggle",
                position: {
                    x: 540,
                    y: 1120,
                },
            },
            {
                name: "winLinesToggle",
                position: {
                    x: 860,
                    y: 1120,
                },
            },
            {
                name: "winMeter",
                position: {
                    x: 700,
                    y: 1220,
                },
            },
            {
                name: "fpsMeter",
                position: {
                    x: 480,
                    y: 600,
                },
            },
            {
                name: "alerts",
                position: {
                    x: 700,
                    y: 1000,
                },
            },
            {
                name: "gameHeading",
                scale: {
                    x: 0.75,
                    y: 0.75,
                },
                position: {
                    x: 715,
                    y: 610,
                },
            },
            {
                name: "gameplaySpeedToggle",
                position: {
                    x: 960,
                    y: 580,
                },
            },
        ],
    },
];

export const manifest = {
    bundles: [
        {
            name: "sprites",
            assets: [
                {
                    src: "./assets/sprites/reel-backing.png",
                    alias: "reel-backing",
                },
                {
                    src: "./assets/sprites/base-backing-landscape.jpg",
                    alias: "base-backing-landscape",
                },
                {
                    src: "./assets/sprites/base-backing-portrait.jpg",
                    alias: "base-backing-portrait",
                },
                {
                    src: "./assets/sprites/slam-stop-disabled.webp",
                    alias: "slam-stop-disabled",
                },
                {
                    src: "./assets/sprites/slam-stop-enabled.webp",
                    alias: "slam-stop-enabled",
                },
                {
                    src: "./assets/sprites/slam-stop-hover.webp",
                    alias: "slam-stop-hover",
                },
                {
                    src: "./assets/sprites/spin-disabled.webp",
                    alias: "spin-disabled",
                },
                {
                    src: "./assets/sprites/spin-enabled.webp",
                    alias: "spin-enabled",
                },
                {
                    src: "./assets/sprites/spin-hover.webp",
                    alias: "spin-hover",
                },
                {
                    src: "./assets/sprites/button-disabled.webp",
                    alias: "button-disabled",
                },
                {
                    src: "./assets/sprites/button-enabled.webp",
                    alias: "button-enabled",
                },
                {
                    src: "./assets/sprites/button-hover.webp",
                    alias: "button-hover",
                },
                {
                    src: "./assets/sprites/minus-disabled.webp",
                    alias: "minus-disabled",
                },
                {
                    src: "./assets/sprites/minus-enabled.webp",
                    alias: "minus-enabled",
                },
                {
                    src: "./assets/sprites/minus-hover.webp",
                    alias: "minus-hover",
                },
                {
                    src: "./assets/sprites/plus-disabled.webp",
                    alias: "plus-disabled",
                },
                {
                    src: "./assets/sprites/plus-enabled.webp",
                    alias: "plus-enabled",
                },
                {
                    src: "./assets/sprites/plus-hover.webp",
                    alias: "plus-hover",
                },
                {
                    src: "./assets/sprites/alert-backing.webp",
                    alias: "alert-backing",
                },
            ],
        },
        {
            name: "spritesheets",
            assets: [
                {
                    src: "./assets/spritesheets/symbols.json",
                    alias: "symbols",
                },
            ],
        },
        {
            name: "sounds",
            assets: [
                {
                    src: "./assets/sounds/card-movement-sfx.mp3",
                    alias: "card-movement-sfx",
                },
            ],
        },
    ],
};
