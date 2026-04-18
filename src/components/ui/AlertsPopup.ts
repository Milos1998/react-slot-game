import { Text } from "pixi.js";
import { BaseComponent } from "../BaseComponent";
import { Button } from "../button/Button";

export class AlertsPopup extends BaseComponent {
    private okButton: Button;

    private message: Text;

    constructor(layoutId: string) {
        super(layoutId);

        this.okButton = new Button(`${this.name}.okButton`);
        this.message = this.container.getChildByName(`${this.name}.message`) as Text;
    }

    public async displayMessage(message: any) {
        if (message === null || message === undefined) {
            return;
        }
        this.message.text = message.toString();
        await this.fadeIn();
        await new Promise((res) => {
            this.okButton.setOnClick(res);
            this.okButton.enabled = true;
        });
        this.okButton.enabled = false;
        this.fadeOut();
    }
}
