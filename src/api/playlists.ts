import {
    DataSnapshot,
    equalTo,
    get,
    orderByChild,
    push,
    query,
    ref,
    remove,
    set,
} from "firebase/database";
import { globalStore } from "store";
import { Playlist } from "types";

export const addPlaylist = (playlist: Playlist): Promise<void> => {
    const playlistsRef = ref(
        globalStore.database,
        `playlists/${globalStore.guildID}`
    );
    const newPlaylistRef = push(playlistsRef);
    return set(newPlaylistRef, playlist);
};

export const getPlaylist = (playlistName: string): Promise<DataSnapshot> => {
    const playlistsRef = ref(
        globalStore.database,
        `playlists/${globalStore.guildID}`
    );
    const searchedPlaylistQuery = query(
        playlistsRef,
        orderByChild("name"),
        equalTo(playlistName)
    );
    return get(searchedPlaylistQuery);
};

export const updatePlaylist = (
    playlist: Playlist,
    id: string
): Promise<void> => {
    const playlistRef = ref(
        globalStore.database,
        `playlists/${globalStore.guildID}/${id}`
    );
    return set(playlistRef, playlist);
};

export const deletePlaylist = (id: string): Promise<void> => {
    const playlistRef = ref(
        globalStore.database,
        `playlists/${globalStore.guildID}/${id}`
    );
    return remove(playlistRef);
};

type GetPlaylistsOptions = {
    scheduled: boolean;
};

export const getAllPlaylists = (
    options?: GetPlaylistsOptions
): Promise<DataSnapshot> => {
    const playlistsRef = ref(
        globalStore.database,
        `playlists/${globalStore.guildID}`
    );
    const playlistsQuery = query(
        playlistsRef,
        orderByChild("scheduled"),
        equalTo(options?.scheduled || false)
    );
    return get(options ? playlistsQuery : playlistsRef);
};
