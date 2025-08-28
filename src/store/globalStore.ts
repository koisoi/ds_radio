import { YouTubePlugin } from "@distube/youtube";
import { Client } from "discord.js";
import DisTube from "distube";
import { PlayerQueue } from "utils";

export class GlobalStore {
    private _broadcastMode: boolean = false;
    private _playerQueue: PlayerQueue = new PlayerQueue();
    private _distubeClient: DisTube;

    constructor(client: Client<boolean>) {
        this._distubeClient = new DisTube(client, {
            plugins: [new YouTubePlugin()],
        });
    }

    public get broadcastMode() {
        return this._broadcastMode;
    }

    public set broadcastMode(mode: boolean) {
        this._broadcastMode = mode;
    }

    public get playerQueue() {
        return this._playerQueue;
    }

    public get distubeClient() {
        return this._distubeClient;
    }
}
