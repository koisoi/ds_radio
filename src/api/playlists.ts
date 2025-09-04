import { push, ref, set } from "firebase/database";
import { globalStore } from "store";
import { isScheduledPlaylist, Playlist, ScheduledPlaylist } from "types";

export const addPlaylist = (
    playlist: Playlist | ScheduledPlaylist
): Promise<void> => {
    const nodePath = isScheduledPlaylist(playlist)
        ? "scheduledPlaylists/"
        : "playlists/";
    const playlistsRef = ref(
        globalStore.database,
        `${nodePath}${globalStore.guildID}`
    );
    const newPlaylistRef = push(playlistsRef);
    return set(newPlaylistRef, playlist);
};

// export const getPlaylist
