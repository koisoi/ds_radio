type YoutubeLink = `${"http://" | "https://" | ""}${"www." | ""}${
    | "youtube.com/watch?v="
    | "youtu.be/"}${string}`;

const isYoutubeLink = (data: any): data is YoutubeLink => {
    return (
        typeof data === "string" &&
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=([a-zA-Z0-9_]+)|youtu\.be\/([a-zA-Z\d_]+))(?:&.*)?$/gm.test(
            data
        )
    );
};

type Track = { ytLink: YoutubeLink };

export const isTrack = (data: any): data is Track => {
    return "ytLink" in data && isYoutubeLink(data.ytLink);
};

const isTrackArray = (data: any): data is Track[] => {
    return Array.isArray(data) && data.every((el) => isTrack(el));
};

export type SuggestedTrack = Track & {
    authorID: string;
    playlistName: string;
};

type PlaylistBase = {
    name: string;
    tracks: Track[];
    scheduled: boolean;
};

const isPlaylistBase = (data: any): data is PlaylistBase => {
    return (
        "name" in data &&
        typeof data.name === "string" &&
        "tracks" in data &&
        isTrackArray(data.tracks) &&
        "scheduled" in data
    );
};

export type NonScheduledPlaylist = PlaylistBase & {
    scheduled: false;
};

export const isNonScheduledPlaylist = (
    data: any
): data is NonScheduledPlaylist => {
    return isPlaylistBase(data) && data.scheduled === false;
};

type Enumerate<
    N extends number,
    Acc extends number[] = []
> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

type Range<F extends number, T extends number> = Exclude<
    Enumerate<T>,
    Enumerate<F>
>;

export type Time = {
    hours: Range<0, 24>;
    minutes: Range<0, 60>;
};

export const isTime = (data: any): data is Time => {
    return (
        "hours" in data &&
        typeof data.hours === "number" &&
        data.hours >= 0 &&
        data.hours <= 23 &&
        "minutes" in data &&
        typeof data.minutes === "number" &&
        data.minutes >= 0 &&
        data.minutes <= 59
    );
};

type TimeRange = { from: Time; to: Time };

const isTimeRange = (data: any): data is TimeRange => {
    return (
        "from" in data && isTime(data.from) && "to" in data && isTime(data.to)
    );
};

export type ScheduledPlaylist = PlaylistBase & {
    scheduled: true;
    timeRange: TimeRange;
};

export const isScheduledPlaylist = (data: any): data is ScheduledPlaylist => {
    return (
        isPlaylistBase(data) &&
        data.scheduled === true &&
        "timeRange" in data &&
        isTimeRange(data.timeRange)
    );
};

export type Playlist = NonScheduledPlaylist | ScheduledPlaylist;

export const isPlaylist = (data: any): data is Playlist => {
    return isNonScheduledPlaylist(data) || isScheduledPlaylist(data);
};
