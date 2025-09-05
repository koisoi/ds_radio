import { globalStore } from "store";
import {
    isPlaylist,
    NonScheduledPlaylist,
    Playlist,
    ScheduledPlaylist,
    Track,
    TimeRange,
    isPlaylistArray,
    isScheduledPlaylistArray,
    isNonScheduledPlaylistArray,
} from "types";
import { getDatabase, Reference } from "firebase-admin/database";
import {
    noDataMessage,
    uniqueNamesOnly,
    wrongFormatFromServerMessage,
} from "const";

const getPlaylistRef = (name: string): Reference =>
    getDatabase().ref(`playlists/${globalStore.guildID}/${name}`);

const getTakenNamesRef = (): Reference =>
    getDatabase().ref(`takenNames/${globalStore.guildID}`);

export const addPlaylist = (playlist: Playlist): Promise<void> => {
    return new Promise((resolve, reject) => {
        const newPlaylistRef = getPlaylistRef(playlist.name);
        return newPlaylistRef
            .set(playlist)
            .then(() => {
                const newNameRef = getDatabase().ref(
                    `takenNames/${globalStore.guildID}/${playlist.name}`
                );
                newNameRef.set(true).then(resolve).catch(reject);
            })
            .catch(reject);
    });
};

export const getPlaylist = (playlistName: string): Promise<Playlist> => {
    return new Promise((resolve, reject) => {
        const playlistRef = getPlaylistRef(playlistName);
        playlistRef
            .get()
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    reject(noDataMessage);
                }
                if (!isPlaylist(snapshot)) {
                    reject(wrongFormatFromServerMessage);
                } else {
                    resolve(snapshot);
                }
            })
            .catch(reject);
    });
};

export const deletePlaylist = (playlistName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const playlistRef = getPlaylistRef(playlistName);
        playlistRef
            .remove()
            .then(() => {
                getTakenNamesRef()
                    .child(playlistName)
                    .remove()
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
};

export const addTrack = (track: Track, playlistName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const tracksRef = getPlaylistRef(playlistName).child("tracks");
        tracksRef.transaction((tracksData) => {
            const tracks = Object.values(tracksData);
            const newTrackIndex = tracks.length;
            tracksRef
                .child(newTrackIndex.toString())
                .set(track)
                .then(resolve)
                .catch(reject);
        });
    });
};

export const changePlaylistName = (
    oldPlaylistname: string,
    newPlaylistName: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const playlistRef = getPlaylistRef(oldPlaylistname);
        playlistRef
            .get()
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    reject(noDataMessage);
                }
                const newPlaylistRef = getPlaylistRef(newPlaylistName);
                newPlaylistRef
                    .set(snapshot.val())
                    .then(() => {
                        getTakenNamesRef()
                            .child(newPlaylistName)
                            .set(true)
                            .then(() => {
                                playlistRef
                                    .remove()
                                    .then(() => {
                                        getTakenNamesRef()
                                            .child(oldPlaylistname)
                                            .remove()
                                            .then(resolve)
                                            .catch(reject);
                                    })
                                    .catch(reject);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};

export const schedulePlaylist = (
    playlistName: string,
    timeRange: TimeRange
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const playlistRef = getPlaylistRef(playlistName);
        Promise.all([
            playlistRef.child("scheduled").set(true),
            playlistRef.child("timeRange").set(timeRange),
        ])
            .then(() => resolve())
            .catch(reject);
    });
};

export const unschedulePlaylist = (playlistName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const playlistRef = getPlaylistRef(playlistName);
        Promise.all([
            playlistRef.child("scheduled").set(false),
            playlistRef.child("timeRange").remove(),
        ])
            .then(() => resolve())
            .catch(reject);
    });
};

type GetPlaylistsOptions = {
    scheduled: boolean;
};

export const getAllPlaylists = (
    options?: GetPlaylistsOptions
): Promise<
    typeof options extends GetPlaylistsOptions
        ? (typeof options)["scheduled"] extends true
            ? ScheduledPlaylist[]
            : NonScheduledPlaylist[]
        : Playlist[]
> => {
    return new Promise((resolve, reject) => {
        const playlistsRef = getDatabase().ref(
            `playlists/${globalStore.guildID}`
        );
        const playlistsQuery = playlistsRef
            .orderByChild("scheduled")
            .equalTo(options?.scheduled || false);
        (options ? playlistsQuery : playlistsRef)
            .get()
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    resolve([]);
                }

                const playlists = Object.values(snapshot.val());

                if (options !== undefined) {
                    if (options.scheduled) {
                        if (!isScheduledPlaylistArray(playlists)) {
                            reject(wrongFormatFromServerMessage);
                        } else {
                            resolve(playlists);
                        }
                    }

                    if (!options.scheduled) {
                        if (!isNonScheduledPlaylistArray(playlists)) {
                            reject(wrongFormatFromServerMessage);
                        } else {
                            resolve(playlists);
                        }
                    }
                }

                if (options === undefined) {
                    if (!isPlaylistArray(playlists)) {
                        reject(wrongFormatFromServerMessage);
                    } else {
                        resolve(playlists);
                    }
                }
            })
            .catch(reject);
    });
};

export const subscribeToTakenNames = (): void => {
    getTakenNamesRef().on("value", (snapshot) => {
        if (snapshot.exists()) {
            globalStore.takenNames = Object.keys(snapshot.val());
        }
    });
};
