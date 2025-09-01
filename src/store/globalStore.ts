import { config } from "config";
import DisTube from "distube";
import { Database } from "firebase/database";

class GlobalStore {
    static #instance: GlobalStore;
    private _broadcastMode: boolean = false;
    private _database: Database | undefined;
    private _distubeClient: DisTube | undefined;
    private _guildID: string =
        process.env.NODE_ENV === "development"
            ? config.DISCORD_DEV_GUILD_ID
            : config.DISCORD_CATS_SHIP_GUILD_ID;
    private _radioChannelID: string =
        process.env.NODE_ENV === "development"
            ? config.DEV_RADIO_CHANNEL_ID
            : config.RADIO_CHANNEL_ID;
    private _permissiveRoleID: string =
        process.env.NODE_ENV === "development"
            ? config.DEV_PERMISSIVE_ROLE_ID
            : config.PERMISSIVE_ROLE_ID;

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

    public get database() {
        if (this._database === undefined) {
            throw new Error(
                "Tried to access Firebase database before initialization."
            );
        }
        return this._database;
    }

    public set database(db: Database) {
        this._database = db;
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

    public get guildID() {
        return this._guildID;
    }

    public get radioChannelID() {
        return this._radioChannelID;
    }

    public get permissiveRoleID() {
        return this._permissiveRoleID;
    }
}

export const globalStore = new GlobalStore();
