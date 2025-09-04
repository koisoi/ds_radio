import { addPlaylist } from "api";
import { errorIcon, successIcon } from "const";
import { Execute } from "types";
import { logger } from "utils";

export const add: Execute = async (interaction) => {
    const playlistName = interaction.options.getString("name", true);

    return addPlaylist({ name: playlistName, tracks: [], scheduled: false })
        .then(() => {
            logger.log(
                `Playlist ${playlistName} was created by ${interaction.user.globalName}`
            );
            return interaction.editReply(
                successIcon + `Плейлист ${playlistName} был успешно создан!`
            );
        })
        .catch((error) => {
            logger.error(
                `Error creating playlist: ${error}\nPlaylist name: ${playlistName}, scheduled time: ${undefined}`
            );
            return interaction.editReply(
                errorIcon + `Ошибка при создании плейлиста...`
            );
        });
};
