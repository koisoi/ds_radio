import { isTrack, Track } from "./player";

export type SuggestedTrack = Track & {
    authorID: string;
};

export const isSuggestedTrack = (data: any): data is SuggestedTrack => {
    return (
        isTrack(data) &&
        "authorID" in data &&
        typeof data["authorID"] === "string"
    );
};

export const isSuggestedTrackArray = (data: any): data is SuggestedTrack[] => {
    return Array.isArray(data) && data.every(isSuggestedTrack);
};
