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
    isTrack,
} from "types";
import { getDatabase, Reference } from "firebase-admin/database";
import { noDataMessage, wrongFormatFromServerMessage } from "const";
import { logger } from "utils";

const getPlaylistRef = (name: string): Reference =>
    getDatabase().ref(`playlists/${globalStore.guildID}/${name}`);

const getTakenNamesRef = (): Reference =>
    getDatabase().ref(`takenNames/${globalStore.guildID}`);

const transformServerValue = (serverValue: any): any => {
    const transformedValue = serverValue;
    if (!("tracks" in transformedValue)) {
        transformedValue.tracks = [];
    } else {
        transformedValue.tracks = Object.values(transformedValue.tracks);
    }
    return transformedValue;
};

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

                const playlist = transformServerValue(snapshot.val());

                if (!isPlaylist(playlist)) {
                    logger.debug(playlist);
                    reject(wrongFormatFromServerMessage);
                } else {
                    resolve(playlist);
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
        const newTrackRef = tracksRef.push();
        newTrackRef.set(track).then(resolve).catch(reject);
    });
};

export const deleteTrack = (
    trackIndex: number,
    playlistName: string
): Promise<Track | null> => {
    return new Promise((resolve, reject) => {
        const tracksRef = getPlaylistRef(playlistName).child("tracks");
        tracksRef
            .get()
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    reject(noDataMessage);
                }

                const trackKeys = Object.keys(snapshot.val());
                if (trackKeys[trackIndex] === undefined) {
                    reject(noDataMessage);
                }

                const trackRef = tracksRef.child(trackKeys[trackIndex]);
                trackRef
                    .remove()
                    .then(() => {
                        const track = Object.values(snapshot.val())[trackIndex];
                        if (!isTrack(track)) {
                            resolve(null);
                        } else {
                            resolve(track);
                        }
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};

export const copyPlaylist = (
    copyFromName: string,
    copyToName: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const fromRef = getPlaylistRef(copyFromName);
        fromRef
            .get()
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    reject(noDataMessage);
                }

                const toRef = getPlaylistRef(copyToName);
                toRef.set(snapshot.val()).then(resolve).catch(reject);
            })
            .catch(reject);
    });
};

export const changePlaylistName = (
    oldPlaylistName: string,
    newPlaylistName: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const playlistRef = getPlaylistRef(oldPlaylistName);
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
                                            .child(oldPlaylistName)
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

                const playlists = Object.values(snapshot.val()).map((el) =>
                    transformServerValue(el)
                );

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
