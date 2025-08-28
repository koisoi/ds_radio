import { Commands } from "types";
import * as broadcast from "./broadcast";
import * as queue from "./queue";
import * as play from "./play";
import * as skip from "./skip";
import * as pause from "./pause";
import * as unpause from "./unpause";
import * as stop from "./stop";
import * as clear from "./clear";
import * as remove from "./remove";
import * as volume from "./volume";

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
