import { isTrack, Track } from "./player";

export type SuggestedTrack = Track & {
    authorName: string;
};

export const isSuggestedTrack = (data: any): data is SuggestedTrack => {
    return (
        isTrack(data) &&
        "authorName" in data &&
        typeof data["authorName"] === "string"
    );
};

export const isSuggestedTrackArray = (data: any): data is SuggestedTrack[] => {
    return Array.isArray(data) && data.every(isSuggestedTrack);
};
