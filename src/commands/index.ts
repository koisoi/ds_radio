import { Commands } from "types";
import * as broadcast from "./broadcast";
import * as showqueue from "./showQueue";
import * as play from "./play";
import * as skip from "./skip";

export const commands: Commands = { broadcast, showqueue, play, skip };
