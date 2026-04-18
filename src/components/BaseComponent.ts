import { Container } from "pixi.js";
import gsap from "gsap";
import { layoutController } from "../controllers/LayoutController";

/**
 * Template for all game components
 */
export class BaseComponent {
    public container: Container;

    protected name: string;

    protected readonly fadeDurationSec: number = 0.6;

    constructor(layoutId: string) {
        this.container = layoutController.getLayoutItem(layoutId).container;
        this.name = layoutId;
    }

    public async fadeOut() {
        if (!this.container.visible || this.container.alpha === 0) {
            return;
        }

        const tween = gsap.to(this.container, {
            pixi: {
                alpha: 0,
            },
            duration: this.fadeDurationSec,
        });
        await new Promise((res) => tween.then(res));
        this.container.visible = false;
        this.container.alpha = 1;
    }

    public async fadeIn() {
        if (this.container.visible && this.container.alpha === 1) {
            return;
        }

        this.container.alpha = 0;
        this.container.visible = true;
        const tween = gsap.to(this.container, {
            pixi: {
                alpha: 1,
            },
            duration: this.fadeDurationSec,
        });
        await new Promise((res) => tween.then(res));
    }
}
