import { TextStyle, Texture } from "pixi.js";
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
 *
 * Added advantage of this approach (rather than having .json config) is that we can reuse common configs. E.g. define textStyle
 * outside of tree and reuse it through this config. Similar can be done for any set of properties.
 */
/**
 * NOTE: here you define the hierarchy tree of the pixi.js elements.
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
    ],
};

/**
 * NOTE: here you define properties of each pixi.js element - for each orientation.
 * Don't want element visible on landscape, but want it visible on portrait, just set appropriate visible values. Similar can be done
 * for any set of properties.
 */
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
        ],
    },
];

/**
 * NOTE: here you define your asset bundles etc.
 */
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
