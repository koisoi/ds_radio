import { deletePlaylist } from "api";
import { errorIcon, noSuchPlaylistMessage, successIcon } from "const";
import { globalStore } from "store";
import { Execute } from "types";
import { logger } from "utils";

export const del: Execute = async (interaction) => {
    const playlistName = interaction.options.getString("name", true);
    if (!globalStore.takenNames.includes(playlistName)) {
        return interaction.editReply(noSuchPlaylistMessage);
    }

    deletePlaylist(playlistName)
        .then(() => {
            logger.log(
                `Playlist ${playlistName} was deleted by ${interaction.user.globalName}`
            );
            return interaction.editReply(
                successIcon + `Плейлист ${playlistName} был успешно удален!`
            );
        })
        .catch((error) => {
            logger.error(
                `Error deleting playlist: ${error}\nPlaylist name: ${playlistName}`
            );
            return interaction.editReply(
                errorIcon + `Ошибка при удалении плейлиста...`
            );
        });
};
