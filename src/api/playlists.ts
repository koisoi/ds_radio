import { globalStore } from "store";
import { Playlist } from "types";
import { DataSnapshot, getDatabase } from "firebase-admin/database";

export const addPlaylist = (playlist: Playlist): Promise<void> => {
    const playlistsRef = getDatabase().ref(`playlists/${globalStore.guildID}`);
    const newPlaylistRef = playlistsRef.push();
    return newPlaylistRef.set(playlist);
};

export const getPlaylist = (playlistName: string): Promise<DataSnapshot> => {
    const playlistsRef = getDatabase().ref(`playlists/${globalStore.guildID}`);
    const searchedPlaylistQuery = playlistsRef
        .orderByChild("name")
        .equalTo(playlistName);
    return searchedPlaylistQuery.get();
};

export const updatePlaylist = (
    playlist: Playlist,
    id: string
): Promise<void> => {
    const playlistRef = getDatabase().ref(
        `playlists/${globalStore.guildID}/${id}`
    );
    return playlistRef.set(playlist);
};

export const deletePlaylist = (id: string): Promise<void> => {
    const playlistRef = getDatabase().ref(
        `playlists/${globalStore.guildID}/${id}`
    );
    return playlistRef.remove();
};

type GetPlaylistsOptions = {
    scheduled: boolean;
};

export const getAllPlaylists = (
    options?: GetPlaylistsOptions
): Promise<DataSnapshot> => {
    const playlistsRef = getDatabase().ref(`playlists/${globalStore.guildID}`);
    const playlistsQuery = playlistsRef
        .orderByChild("scheduled")
        .equalTo(options?.scheduled || false);
    return (options ? playlistsQuery : playlistsRef).get();
};
