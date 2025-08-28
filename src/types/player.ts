type YoutubeLink = `${"http://" | "https://" | ""}${"www." | ""}${
    | "youtube.com/watch?v="
    | "youtu.be/"}${string}`;

export const isYoutubeLink = (link: string): link is YoutubeLink => {
    return /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=([a-zA-Z0-9_]+)|youtu\.be\/([a-zA-Z\d_]+))(?:&.*)?$/gm.test(
        link
    );
};

type Track = { ytLink: YoutubeLink };

export type Playlist = {
    name: string;
    tracks: Track[];
};

export type ScheduledPlaylist = Playlist & { timeRange: [Date, Date] };

export type SuggestedTrack = Track & {
    authorID: string;
    playlistName: string;
};
