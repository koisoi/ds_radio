import { Commands } from "types";
import * as broadcast from "./broadcast";
import * as queue from "./player/queue";
import * as play from "./player/play";
import * as skip from "./player/skip";
import * as pause from "./player/pause";
import * as unpause from "./player/unpause";
import * as stop from "./player/stop";
import * as clear from "./player/clear";
import * as remove from "./player/remove";
import * as volume from "./player/volume";

export const commands: Commands = {
    broadcast,
    queue,
    play,
    skip,
    pause,
    unpause,
    stop,
    clear,
    remove,
    volume,
};
