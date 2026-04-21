import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import gsap from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
import { sceneController } from "./controllers/SceneController";
import { assetLoader } from "./loaders/AssetLoader";
import { layoutController } from "./controllers/LayoutController";
import { stateMachine } from "./stateMachines/StateMachine";
import { GameFlowName } from "./stores/GameStore";
import { FpsMeter } from "./components/ui/FpsMeter";
import { GameplaySpeedToggle } from "./components/ui/GameplaySpeedToggle";
import { BaseComponent } from "./components/BaseComponent";
import { BaseGameFlows } from "./flows/BaseGame.flows";
import { ReelSet } from "./components/reels/ReelSet";
import { symbolSet } from "./components/reels/symbols/SymbolSet";
import { GameUi } from "./components/gameUi/GameUi";
import { AlertsPopup } from "./components/ui/AlertsPopup";
import { WinController } from "./components/winController/WinController";
import { createRoot } from "react-dom/client";
import { UiRoot } from "./ui/UiRoot";

const canvas = document.getElementById("pixi-canvas") as HTMLCanvasElement;
const app = new Application({
    antialias: true,
    view: canvas,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});
sceneController.setupScene(app);

const reactUi = document.getElementById("react-ui") as HTMLElement;
const root = createRoot(reactUi);
root.render(<UiRoot />);

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export type GameComponents = {
    fpsMeter: FpsMeter;
    gameplaySpeedToggle: GameplaySpeedToggle;
    gameHeading: BaseComponent;
    reelSet: ReelSet;
    gameUi: GameUi;
    alertsPopup: AlertsPopup;
    winController: WinController;
};

function registerComponents(): GameComponents {
    return {
        fpsMeter: new FpsMeter("fpsMeter"),
        gameplaySpeedToggle: new GameplaySpeedToggle("gameplaySpeedToggle"),
        gameHeading: new BaseComponent("gameHeading"),
        reelSet: new ReelSet("reelSet"),
        gameUi: new GameUi("gameUi"),
        alertsPopup: new AlertsPopup("alerts"),
        winController: new WinController("winController"),
    };
}

function registerFlows(components: GameComponents) {
    stateMachine.registerFlow(GameFlowName.BaseGame, new BaseGameFlows(components));
}

(async () => {
    await assetLoader.load();

    layoutController.init();
    sceneController.scene.addChild(layoutController.getLayoutItem("game").container);
    sceneController.preOrientationChangeCallbacks.push(layoutController.orientationUpdate.bind(layoutController));

    symbolSet.init();
    const components = registerComponents();
    registerFlows(components);

    assetLoader.removeSplash();

    stateMachine.runStateMachine(GameFlowName.BaseGame);
})();
