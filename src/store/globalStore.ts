import DisTube from "distube";

class GlobalStore {
    static #instance: GlobalStore;
    private _broadcastMode: boolean = false;
    private _distubeClient: DisTube | undefined;

    constructor() {
        if (GlobalStore.#instance) {
            return GlobalStore.#instance;
        }
        GlobalStore.#instance = this;
    }

    public get broadcastMode() {
        return this._broadcastMode;
    }

    public set broadcastMode(mode: boolean) {
        this._broadcastMode = mode;
    }

    public get distubeClient() {
        if (this._distubeClient === undefined) {
            throw new Error(
                "Tried to access DisTube client before initialization."
            );
        }
        return this._distubeClient;
    }

    public set distubeClient(distube: DisTube) {
        this._distubeClient = distube;
    }
}

export const globalStore = new GlobalStore();
