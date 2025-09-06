import { deleteTrack } from "api";
import { errorIcon, noSuchPlaylistMessage, successIcon } from "const";
import { globalStore } from "store";
import { Execute } from "types";
import { logger } from "utils";

export const delete_track: Execute = async (interaction) => {
    const playlistName = interaction.options.getString("playlist_name", true);
    if (!globalStore.takenNames.includes(playlistName)) {
        return interaction.editReply(noSuchPlaylistMessage);
    }

    const trackNumber = interaction.options.getNumber("track_number", true);

    deleteTrack(trackNumber - 1, playlistName)
        .then((track) => {
            logger.log(
                `Track ${track?.name} (№${trackNumber}) was removed from ${playlistName} playlist by ${interaction.user.globalName}`
            );
            return interaction.editReply(
                successIcon +
                    `Трек **${
                        track?.name || "без названия"
                    }** был успешно удален из плейлиста **${playlistName}**!`
            );
        })
        .catch((error) => {
            logger.error(
                `Error deleting track: ${error}\nPlaylist name: ${playlistName}, track number: ${trackNumber}`
            );
            return interaction.editReply(
                errorIcon +
                    "Ошибка при удалении... Попробуйте ввести другой номер трека."
            );
        });
};
