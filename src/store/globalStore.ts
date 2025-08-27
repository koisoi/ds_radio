import { PlayerQueue } from "utils";

class GlobalStore {
    private _broadcastMode: boolean = false;
    private _playerQueue: PlayerQueue = new PlayerQueue();

    constructor() {}

    public get broadcastMode() {
        return this._broadcastMode;
    }

    public set broadcastMode(mode: boolean) {
        this._broadcastMode = mode;
    }

    public get playerQueue() {
        return this._playerQueue;
    }
}

export const globalStore = new GlobalStore();
