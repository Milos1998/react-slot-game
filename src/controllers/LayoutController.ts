import { Assets, Container, Sprite, Text } from "pixi.js";
import {
    ContainerNode,
    hierarchyTree,
    LayoutConfigNode,
    layoutConfigurations,
    LayoutHierarchyNode,
    LayoutNode,
    SpriteNode,
    TextNode,
} from "../config/Layout.config";
import { Orientation, systemStore } from "../stores/SystemStore";

type LayoutItem = {
    container: Container;
    layoutNodes: Map<Orientation, ContainerNode | SpriteNode | TextNode>;
};

/**
 * Concerned with where everything is on the screen
 */
class LayoutController {
    public layoutMap: Map<string, LayoutItem> = new Map();

    public init() {
        this.createAllPixiObjects();
        this.fillAllLayoutNodes();
        this.orientationUpdate(systemStore.props.orientation);
    }

    private createAllPixiObjects() {
        const nodes: LayoutHierarchyNode[] = [];
        nodes.push(hierarchyTree);

        while (nodes.length > 0) {
            const node = nodes.pop();
            if (node === undefined) {
                break;
            }

            const layoutItem: LayoutItem = {
                container: this.createPixiObject(node),
                layoutNodes: new Map(),
            };
            this.layoutMap.set(node.name, layoutItem);

            node.children?.forEach((child) => {
                nodes.push(child);
            });
        }

        nodes.push(hierarchyTree);
        while (nodes.length > 0) {
            const node = nodes.pop();
            if (node === undefined) {
                break;
            }

            const layoutItem = this.getLayoutItem(node.name);
            node.children?.forEach((child) => {
                nodes.push(child);
                const layoutChild = this.getLayoutItem(child.name);
                layoutChild.container.parent = layoutItem.container;
                layoutItem.container.addChild(layoutChild.container);
            });
        }
    }

    private createPixiObject(hierarchyNode: LayoutHierarchyNode) {
        let object;
        if (hierarchyNode.type === "container") {
            object = new Container();
        } else if (hierarchyNode.type === "text") {
            object = new Text();
        } else if (hierarchyNode.type === "sprite") {
            object = new Sprite();
        } else {
            throw new Error(`Invalid config node type ${hierarchyNode.type}`);
        }

        object.name = hierarchyNode.name;
        if (hierarchyNode.alpha !== undefined) {
            object.alpha = hierarchyNode.alpha;
        }
        if (hierarchyNode.visible !== undefined) {
            object.visible = hierarchyNode.visible;
        }
        if (hierarchyNode.position !== undefined) {
            object.position = { ...hierarchyNode.position };
        }
        if (hierarchyNode.scale !== undefined) {
            object.scale = { ...hierarchyNode.scale };
        }
        if (object instanceof Text) {
            if (hierarchyNode.anchor !== undefined) {
                object.anchor.set(hierarchyNode.anchor.x, hierarchyNode.anchor.y);
            }
            if (hierarchyNode.text !== undefined) {
                object.text = hierarchyNode.text;
            }
            if (hierarchyNode.textStyle !== undefined) {
                object.style = hierarchyNode.textStyle;
            }
        } else if (object instanceof Sprite) {
            if (hierarchyNode.anchor !== undefined) {
                object.anchor.set(hierarchyNode.anchor.x, hierarchyNode.anchor.y);
            }
            if (hierarchyNode.texture !== undefined) {
                object.texture = Assets.get(hierarchyNode.texture);
            }
        }

        return object;
    }

    private fillAllLayoutNodes() {
        layoutConfigurations.forEach((config) => {
            config.layoutConfigNodes.forEach((configNode) => {
                this.fillLayoutNode(configNode, config.orientation);
            });
        });
    }

    private fillLayoutNode(configNode: LayoutConfigNode, orientation: Orientation) {
        const layoutItem = this.getLayoutItem(configNode.name);

        let layoutNode;
        if (layoutItem.container instanceof Text) {
            layoutNode = new TextNode(configNode);
        } else if (layoutItem.container instanceof Sprite) {
            layoutNode = new SpriteNode(configNode);
            if (configNode.texture !== undefined) {
                layoutNode.texture = Assets.get(configNode.texture);
            }
        } else if (layoutItem.container instanceof Container) {
            layoutNode = new ContainerNode(configNode);
        } else {
            throw new Error(`Config node can't be initialized for: ${layoutItem.container}`);
        }

        layoutItem.layoutNodes.set(orientation, layoutNode);
    }

    public orientationUpdate(orientation: Orientation) {
        this.layoutMap.forEach((layoutItem) => {
            const layoutNode = layoutItem.layoutNodes.get(orientation);
            if (layoutNode === undefined) {
                return;
            }

            this.updateDisplayNode(layoutItem.container, layoutNode);
        });
    }

    private updateDisplayNode(node: Container, layoutNode: LayoutNode) {
        if (layoutNode.position !== undefined) {
            node.position.x = layoutNode.position.x;
            node.position.y = layoutNode.position.y;
        }
        if (layoutNode.scale !== undefined) {
            node.scale.x = layoutNode.scale.x;
            node.scale.y = layoutNode.scale.y;
        }
        if (layoutNode.alpha !== undefined) {
            node.alpha = layoutNode.alpha;
        }
        if (layoutNode.visible) {
            node.visible = layoutNode.visible;
        }
        if (node instanceof Text && layoutNode instanceof TextNode) {
            if (layoutNode.anchor !== undefined) {
                node.anchor.x = layoutNode.anchor.x;
                node.anchor.y = layoutNode.anchor.y;
            }
            if (layoutNode.textStyle !== undefined) {
                node.style = layoutNode.textStyle;
            }
            if (layoutNode.text !== undefined) {
                node.text = layoutNode.text;
            }
        } else if (node instanceof Sprite && layoutNode instanceof SpriteNode) {
            if (layoutNode.anchor !== undefined) {
                node.anchor.x = layoutNode.anchor.x;
                node.anchor.y = layoutNode.anchor.y;
            }
            if (layoutNode.texture !== undefined) {
                node.texture = layoutNode.texture;
            }
        }
    }

    public getLayoutItem(itemName: string) {
        const layoutItem = layoutController.layoutMap.get(itemName);
        if (layoutItem === undefined) {
            throw new Error(`Layout item with id ${itemName} is not registered`);
        }

        return layoutItem;
    }
}

export const layoutController = new LayoutController();
