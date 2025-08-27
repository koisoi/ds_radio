class GlobalStore {
    #broadcastMode: boolean = false;

    constructor() {
        this.#broadcastMode = false;
    }

    public get broadcastMode() {
        return this.#broadcastMode;
    }

    public set broadcastMode(mode: boolean) {
        this.#broadcastMode = mode;
    }
}

export const globalStore = new GlobalStore();
