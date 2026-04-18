import { Text } from "pixi.js";
import { systemStore } from "../../stores/SystemStore";
import { BaseComponent } from "../BaseComponent";

export class FpsMeter extends BaseComponent {
    private fpsValueLabel: Text;

    constructor(layoutId: string) {
        super(layoutId);

        this.fpsValueLabel = this.container.getChildByName(`${this.name}.value`) as Text;

        systemStore.subscribe(
            (state) => state.fps,
            (fps) => {
                this.fpsValueLabel.text = fps;
            },
        );
    }
}
