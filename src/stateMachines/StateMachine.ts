import { BaseFlows } from "../flows/Base.flows";
import { GameFlowName, gameStore } from "../stores/GameStore";
import { systemStore } from "../stores/SystemStore";

enum GameFlow {
    StartupFlow,
    IntroFlow,
    RequestFlow,
    ResponseFlow,
    ResetFlow,
    OutroFlow,
    ErrorFlow,
}

/**
 * Executes game flow
 */
class StateMachine {
    private flowsMap: Map<GameFlowName, BaseFlows> = new Map();

    private currentFlows!: BaseFlows;

    private currentState: GameFlow = GameFlow.IntroFlow;

    public registerFlow(name: GameFlowName, flows: BaseFlows) {
        this.flowsMap.set(name, flows);
    }

    private getNextFlow(prevFlowReturnVal?: any) {
        if (prevFlowReturnVal instanceof Error) {
            systemStore.setSystemError(prevFlowReturnVal);
            this.currentState = GameFlow.ErrorFlow;
            return this.currentFlows.errorFlow;
        }
        if (this.currentState === GameFlow.StartupFlow) {
            this.currentState = GameFlow.IntroFlow;
            return this.currentFlows.introFlow;
        }
        if (this.currentState === GameFlow.IntroFlow) {
            this.currentState = GameFlow.RequestFlow;
            return this.currentFlows.requestFlow;
        }
        if (this.currentState === GameFlow.RequestFlow) {
            this.currentState = GameFlow.ResponseFlow;
            return this.currentFlows.responseFlow;
        }
        if (this.currentState === GameFlow.ResponseFlow) {
            if (gameStore.props.nextFlows !== gameStore.props.currentFlows && gameStore.props.nextFlows !== GameFlowName.None) {
                this.currentState = GameFlow.OutroFlow;
                return this.currentFlows.outroFlow;
            }
            this.currentState = GameFlow.ResetFlow;
            return this.currentFlows.resetFlow;
        }
        if (this.currentState === GameFlow.OutroFlow) {
            this.currentFlows = this.getNextFlows();
            this.currentState = GameFlow.IntroFlow;
            return this.currentFlows.introFlow;
        }
        if (this.currentState === GameFlow.ResetFlow) {
            this.currentState = GameFlow.RequestFlow;
            return this.currentFlows.requestFlow;
        }
        if (this.currentState === GameFlow.ErrorFlow) {
            this.currentState = GameFlow.RequestFlow;
            return this.currentFlows.requestFlow;
        }

        throw new Error(`State machine error, current state: ${this.currentState}`);
    }

    private getNextFlows() {
        const nextFlows = gameStore.props.nextFlows;
        const gameFlow = this.flowsMap.get(nextFlows);
        if (gameFlow === undefined) {
            throw new Error(`Game flow "${nextFlows}" is not registered`);
        }

        gameStore.setCurrentFlows(gameStore.props.nextFlows);
        return gameFlow;
    }

    public async runStateMachine(initialFlowsName: GameFlowName) {
        const flows = this.flowsMap.get(initialFlowsName);
        if (flows === undefined) {
            throw new Error(`Game flow "${initialFlowsName}" is not registered`);
        }
        this.currentFlows = flows;

        this.currentState = GameFlow.StartupFlow;
        let flow: () => AsyncGenerator = this.currentFlows.startupFlow;
        while (true) {
            const retVal = await this.executeFlow(flow, this.currentFlows);
            flow = this.getNextFlow(retVal);
        }
    }

    private async executeFlow(flow: () => AsyncGenerator, context: BaseFlows) {
        const generator = flow.bind(context)();
        while (true) {
            try {
                const { done } = await generator.next();
                if (done === true) {
                    return;
                }
            } catch (error) {
                return error;
            }
        }
    }
}

export const stateMachine = new StateMachine();
