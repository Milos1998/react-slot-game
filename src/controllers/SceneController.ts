import { Application, Container, Ticker } from "pixi.js";
import { screenConfig, sceneConfig } from "../config/Scene.config";
import { Orientation, ScreenSize, systemStore } from "../stores/SystemStore";
import gsap from "gsap";
import { Timer } from "../utils/Timer";
import { sound } from "@pixi/sound";

/**
 * Resizes canvas, holds ticker
 */
class SceneController {
    public app!: Application;

    public ticker!: Ticker;

    public scene!: Container;

    public preOrientationChangeCallbacks: ((o: Orientation) => void)[] = [];

    private readonly fpsUpdateThresholdMs = 150;

    public setupScene(app: Application) {
        (globalThis as any).__PIXI_APP__ = app;
        this.app = app;

        this.scene = new Container();
        this.app.stage.addChild(this.scene);

        this.ticker = Ticker.shared;
        this.app.ticker.maxFPS = systemStore.props.tickerSettings.maxFps;
        this.app.ticker.minFPS = systemStore.props.tickerSettings.minFps;

        this.fit();
        window.addEventListener("resize", this.fit.bind(this));
        this.setupFpsUpdate();
        this.watchGameplaySpeed();
        this.watchUnlockAudio();
    }

    private fit() {
        const orientation = this.getOrientation(window.innerWidth, window.innerHeight);
        const config = screenConfig.find((screen) => screen.orientation === orientation)?.config;
        if (config === undefined) {
            throw new Error("Couldn't find layout config");
        }

        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        const aspectRatio = this.findAspectRatio(window.innerWidth, window.innerHeight, config);
        this.scene.scale.set(aspectRatio);
        const position = this.getNewStagePosition(config, aspectRatio);
        this.scene.position.set(position.x, position.y);

        if (orientation !== systemStore.props.orientation) {
            this.preOrientationChangeCallbacks.forEach((func) => func(orientation));
            systemStore.setOrientation(orientation);
        }
        systemStore.setCanvasAreaProps({ width: window.innerWidth, height: window.innerHeight });
    }

    private findAspectRatio(screenWidth: number, screenHeight: number, config: ScreenSize): number {
        let widthAR = 1;
        let heightAR = 1;

        if (screenWidth > config.maxWidth) {
            widthAR = screenWidth / config.maxWidth;
        }
        if (screenHeight > config.maxHeight) {
            heightAR = screenHeight / config.maxHeight;
        }
        if (widthAR > 1 && widthAR > heightAR) {
            return widthAR;
        }
        if (heightAR > 1) {
            return heightAR;
        }

        if (screenWidth < config.minWidth) {
            widthAR = screenWidth / config.minWidth;
        }
        if (screenHeight < config.minHeight) {
            heightAR = screenHeight / config.minHeight;
        }
        if (widthAR < heightAR) {
            return widthAR;
        }
        return heightAR;
    }

    private getNewStagePosition(config: ScreenSize, scale: number) {
        const x = -(config.maxWidth * scale - window.innerWidth) / 2;
        const y = -(config.maxHeight * scale - window.innerHeight) / 2;

        return { x, y };
    }

    private getOrientation(screenWidth: number, screenHeight: number) {
        if (screenWidth / screenHeight < sceneConfig.orientationRatio) {
            return Orientation.Portrait;
        }
        return Orientation.Landscape;
    }

    private setupFpsUpdate() {
        systemStore.setFps(Math.round(this.ticker.FPS));

        const timer = new Timer(this.fpsUpdateThresholdMs, -1, undefined, () => {
            systemStore.setFps(Math.round(this.ticker.FPS));
        });
        timer.start(false);
    }

    private watchGameplaySpeed() {
        systemStore.subscribe(
            (state) => state.getGameplaySpeed(),
            (gameplaySpeed) => {
                this.ticker.speed = gameplaySpeed;
                gsap.globalTimeline.timeScale(gameplaySpeed);
            },
        );
    }

    private watchUnlockAudio() {
        const unlockAudio = () => {
            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("pointerdown", unlockAudio);
            sound.resumeAll();
        };

        window.addEventListener("click", unlockAudio);
        window.addEventListener("pointerdown", unlockAudio);
    }
}

export const sceneController = new SceneController();
