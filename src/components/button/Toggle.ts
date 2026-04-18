import { Text } from "pixi.js";
import { BaseComponent } from "../BaseComponent";
import { Button } from "./Button";

export class Toggle extends BaseComponent {
    protected plusButton: Button;

    protected minusButton: Button;

    protected valueLabel: Text;

    protected toggleValues: any[];

    protected selectedIdx: number;

    protected _enabled: boolean = false;

    constructor(layoutId: string, toggleValues: any[], onIncrement: () => any, onDecrement: () => any, initialStepIdx?: number) {
        super(layoutId);

        this.toggleValues = toggleValues;

        this.valueLabel = this.container.getChildByName(`${this.name}.value`) as Text;
        this.selectedIdx = initialStepIdx ?? Math.floor(this.toggleValues.length / 2);
        this.valueLabel.text = this.toggleValues[this.selectedIdx].toString();

        this.plusButton = new Button(`${this.name}.plus`);
        this.plusButton.setOnClick(() => {
            if (this.selectedIdx + 1 >= this.toggleValues.length) {
                return;
            }

            this.selectedIdx++;
            this.onToggle();
            onIncrement();
        });
        this.minusButton = new Button(`${this.name}.minus`);
        this.minusButton.setOnClick(() => {
            if (this.selectedIdx - 1 < 0) {
                return;
            }

            this.selectedIdx--;
            this.onToggle();
            onDecrement();
        });
        this.disableToggle();
    }

    private onToggle() {
        this.valueLabel.text = this.toggleValues[this.selectedIdx].toString();
        this.enableToggle();
    }

    private enableToggle() {
        this.plusButton.enabled = this.selectedIdx < this.toggleValues.length - 1;
        this.minusButton.enabled = this.selectedIdx > 0;
    }

    private disableToggle() {
        this.plusButton.enabled = false;
        this.minusButton.enabled = false;
    }

    set enabled(isEnabled: boolean) {
        this._enabled = isEnabled;
        if (isEnabled) {
            this.enableToggle();
        } else {
            this.disableToggle();
        }
    }

    get enabled() {
        return this._enabled;
    }
}
