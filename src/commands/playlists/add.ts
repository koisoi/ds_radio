import { addPlaylist } from "api";
import { errorIcon, noAccessIcon, successIcon } from "const";
import { Execute, stringToTimeRange } from "types";
import { logger } from "utils";

export const add: Execute = async (interaction) => {
    // TODO: писала это с болящей головой, возможно надо будет переписать
    const playlistName = interaction.options.getString("name", true);
    const scheduledTimeOption = interaction.options.getString("time");
    const scheduledTimeRange = scheduledTimeOption
        ? stringToTimeRange(scheduledTimeOption)
        : null;

    if (scheduledTimeOption && scheduledTimeRange === null) {
        return interaction.editReply(noAccessIcon + "Неверный формат времени!");
    }

    // TODO: дописать правильное добавление таймстемпов
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
