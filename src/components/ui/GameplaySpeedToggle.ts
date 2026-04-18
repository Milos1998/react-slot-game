import { systemStore } from "../../stores/SystemStore";
import { Toggle } from "../button/Toggle";

export class GameplaySpeedToggle extends Toggle {
    constructor(layoutId: string) {
        super(
            layoutId,
            systemStore.props.gameplaySpeeds,
            systemStore.actions.incrementGameplaySpeed,
            systemStore.actions.decrementGameplaySpeed,
            systemStore.props.gameplaySpeedIdx,
        );
    }
}
