import { Text } from "pixi.js";
import { BaseComponent } from "../BaseComponent";

export class WinMeter extends BaseComponent {
    private valueLabel: Text;

    constructor(layoutId: string) {
        super(layoutId);

        this.valueLabel = this.container.getChildByName(`${this.name}.value`) as Text;
        this.valueLabel.text = "";
    }

    set meterText(value: string) {
        this.valueLabel.text = value;
    }
}
