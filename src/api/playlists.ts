import { getDatabase, push, ref, set } from "firebase/database";
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

// export const getPlaylist = (playlistName: string): Promise<any> => {
// //     const dbRef = ref(getDatabase());
// // get(child(dbRef, `users/${userId}`)).then((snapshot) => {
// //   if (snapshot.exists()) {
// //     console.log(snapshot.val());
// //   } else {
// //     console.log("No data available");
// //   }
// // }).catch((error) => {
// //   console.error(error);
// // });

// // const productsRef = ref(db, 'products');

// // const electronicsProductsQuery = query(productsRef, orderByChild('category'), equalTo('electronics'));

// const playlistsRef = ref(globalStore.database,`playlists/${globalStore.guildID}`);
// const scheduledPlaylistsRef = ref(globalStore.database, )
// }
