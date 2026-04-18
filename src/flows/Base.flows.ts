import { GameComponents } from "../app";

export abstract class BaseFlows {
    protected components: GameComponents;

    constructor(components: GameComponents) {
        this.components = components;
    }

    /**
     * Executes one time only, on initial game startup (here you play intro, tutorial etc.)
     */
    public async *startupFlow(): AsyncGenerator {}

    /**
     * Flow for setting up scene when switching game modes (e.g. comming back to Base Game from Free Spins round)
     */
    public async *introFlow(): AsyncGenerator {}

    /**
     * Here we wait for user to press spin button, start reel spin etc. Here we should get the response too
     */
    public async *requestFlow(): AsyncGenerator {}

    /**
     * If response was received successfully, we run this flow. Here we should stop the reels, display wins etc.
     */
    public async *responseFlow(): AsyncGenerator {}

    /**
     * Here we reset reels, win managers and other components for the next game round
     */
    public async *resetFlow(): AsyncGenerator {}

    /**
     * Clean up scene for next game mode - play outro transition animation when moving from Base Game to FreeSpins
     */
    public async *outroFlow(): AsyncGenerator {}

    /**
     * Runs when an error was encountered (most likely during requestFlow - user has bad internet connection). Here we
     * should reset all components to retry reel spin.
     */
    public async *errorFlow(): AsyncGenerator {}
}
