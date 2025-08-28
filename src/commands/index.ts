import { Commands } from "types";
import * as broadcast from "./broadcast";
import * as showqueue from "./showQueue";
import * as play from "./play";

export const commands: Commands = { broadcast, showqueue, play };
