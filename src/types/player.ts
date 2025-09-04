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

type TimeRange = [Date, Date];

const isDate = (data: any): data is Date => {
    return Object.prototype.toString.call(data) === "[object Date]";
};

const isTimeRange = (data: any): data is TimeRange => {
    return (
        Array.isArray(data) &&
        data.length === 2 &&
        data.every((el) => isDate(el))
    );
};

export type ScheduledPlaylist = PlaylistBase & {
    scheduled: true;
    timeRange: [Date, Date];
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
