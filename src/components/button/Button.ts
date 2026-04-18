import { Sprite } from "pixi.js";
import { BaseComponent } from "../BaseComponent";

export class Button extends BaseComponent {
    protected spriteEnabled: Sprite | null;

    protected spriteOver: Sprite | null;

    protected spriteDisabled: Sprite | null;

    private stateSprites: (Sprite | null)[] = [];

    private _enabled: boolean = false;

    private onClick: any;

    constructor(layoutId: string) {
        super(layoutId);

        this.spriteEnabled = this.container.getChildByName(`${this.name}.enabled`) as Sprite;
        this.spriteOver = this.container.getChildByName(`${this.name}.over`) as Sprite;
        this.spriteDisabled = this.container.getChildByName(`${this.name}.disabled`) as Sprite;
        this.stateSprites = [this.spriteEnabled, this.spriteOver, this.spriteDisabled];
        this.enabled = false;

        this.container.on("mouseenter", this.onPointerenter, this);
        this.container.on("pointertap", this.onPointerTap, this);
        this.container.on("mouseleave", this.onPointerleave, this);
    }

    protected onPointerenter() {
        if (this._enabled) {
            this.setActiveSprite(this.spriteOver);
        }
    }

    protected onPointerleave() {
        if (this._enabled) {
            this.setActiveSprite(this.spriteEnabled);
        }
    }

    protected onPointerTap() {
        if (this._enabled) {
            this.onClick();
        }
    }

    public set enabled(enabled: boolean) {
        this._enabled = enabled;
        this.container.eventMode = enabled ? "static" : "none";
        this.container.cursor = enabled ? "pointer" : "normal";
        this.setActiveSprite(enabled ? this.spriteEnabled : this.spriteDisabled);
    }

    public get enabled() {
        return this._enabled;
    }

    private setActiveSprite(sprite: Sprite | null) {
        if (sprite === null) {
            return;
        }
        this.stateSprites.forEach((stateSprite) => {
            if (stateSprite === null) {
                return;
            }
            stateSprite.visible = stateSprite.name === sprite.name;
        });
    }

    public setOnClick(onClick: any) {
        this.onClick = onClick;
    }
}
