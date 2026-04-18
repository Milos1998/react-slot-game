import { systemStore } from "../../stores/SystemStore";
import { Toggle } from "../button/Toggle";

export class GameplaySpeedToggle extends Toggle {
    constructor(layoutId: string) {
        super(
            layoutId,
            systemStore.props.gameplaySpeeds,
            systemStore.incrementGameplaySpeed,
            systemStore.decrementGameplaySpeed,
            systemStore.props.gameplaySpeedIdx,
        );
    }
}
