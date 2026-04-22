import { Assets, extensions } from "pixi.js";
import { manifest } from "../config/Layout.config";
import { soundAsset } from "@pixi/sound";

extensions.add(soundAsset);

class AssetLoader {
    /**
     * NOTE: would split loading phase into several stages (no need to delay base game while assets free spins are loaded).
     * If project had unlimited time, we could even load low res assets first, and then load high res assets, just so we can display
     * the game to the player asap.
     */
    public async load() {
        await Assets.init({ manifest });
        const sprites = Assets.loadBundle("sprites");
        const sounds = Assets.loadBundle("sounds");
        const spritesheets = Assets.loadBundle("spritesheets");
        await Promise.all([sprites, sounds, spritesheets]);
    }

    public removeSplash() {
        const clickToStart = document.getElementById("click-to-start") as HTMLElement;
        clickToStart.style.display = "none";
        const canvas = document.getElementById("pixi-canvas") as HTMLCanvasElement;
        canvas.style.display = "block";
        const reactUi = document.getElementById("react-ui") as HTMLElement;
        reactUi.style.display = "flex";
    }
}

export const assetLoader = new AssetLoader();
